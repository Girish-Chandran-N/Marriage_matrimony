"use server";

import crypto from "crypto";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MembershipTier } from "@prisma/client";
import { PLAN_LIMITS, PLAN_PRICES } from "@/lib/plans";
import { revalidatePath } from "next/cache";
import Razorpay from "razorpay";

// ─── Helper: session user ────────────────────────────────────────────────────
async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user as { id: string; name?: string | null; email?: string | null };
}

// ─── Razorpay SDK (server-only) ──────────────────────────────────────────────
function getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        throw new Error("Razorpay keys not configured in .env");
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC HELPERS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Returns the active subscription tier for a user.
 * Falls back to FREE if no valid/active subscription exists.
 */
export async function getUserSubscription(userId: string) {
    const now = new Date();
    const sub = await db.subscription.findFirst({
        where: {
            userId,
            status: "active",
            endDate: { gte: now },
        },
        orderBy: { endDate: "desc" },
    });

    const tier: MembershipTier = (sub?.plan as MembershipTier) ?? "FREE";
    const limits = PLAN_LIMITS[tier];

    return {
        tier,
        limits,
        endDate: sub?.endDate ?? null,
        isActive: !!sub,
    };
}

/**
 * Checks whether the current user has used their daily interest allowance.
 * Returns { allowed: true } or { allowed: false, error: "UPGRADE_REQUIRED" }
 */
export async function checkInterestLimit(userId: string) {
    const { tier, limits } = await getUserSubscription(userId);

    if (limits.interestsPerDay >= 99) return { allowed: true };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sentToday = await db.interest.count({
        where: {
            senderId: userId,
            createdAt: { gte: startOfDay },
        },
    });

    if (sentToday >= limits.interestsPerDay) {
        return {
            allowed: false,
            error: "UPGRADE_REQUIRED" as const,
            message: `You've used your ${limits.interestsPerDay} interest${limits.interestsPerDay === 1 ? "" : "s"} for today. Upgrade your plan to send more!`,
            currentTier: tier,
        };
    }

    return { allowed: true };
}

/**
 * Checks whether the current user can reveal more contact numbers.
 */
export async function checkContactViewLimit(userId: string) {
    const { tier, limits } = await getUserSubscription(userId);

    if (limits.contactViews >= 9999) return { allowed: true };

    if (limits.contactViews === 0) {
        return {
            allowed: false,
            error: "UPGRADE_REQUIRED" as const,
            message: "Upgrade your plan to view contact information.",
            currentTier: tier,
        };
    }

    const viewedCount = await db.contactView.count({
        where: { viewerId: userId },
    });

    if (viewedCount >= limits.contactViews) {
        return {
            allowed: false,
            error: "UPGRADE_REQUIRED" as const,
            message: `You've viewed ${viewedCount} of ${limits.contactViews} contacts allowed in your plan. Upgrade to view more!`,
            currentTier: tier,
        };
    }

    return { allowed: true };
}

/**
 * Checks whether the current user's plan allows messaging.
 */
export async function checkCanChat(userId: string) {
    const { tier, limits } = await getUserSubscription(userId);

    if (!limits.canChat) {
        return {
            allowed: false,
            error: "UPGRADE_REQUIRED" as const,
            message: "Upgrade your plan to start chatting with matches.",
            currentTier: tier,
        };
    }

    return { allowed: true };
}

// ────────────────────────────────────────────────────────────────────────────
// RAZORPAY ACTIONS
// ────────────────────────────────────────────────────────────────────────────

/**
 * Server Action: Creates a Razorpay order for a given plan tier.
 * Called from the API route — NOT directly from the client.
 */
export async function createRazorpayOrder(tier: MembershipTier) {
    const user = await getSessionUser();

    const planPrice = PLAN_PRICES[tier];
    if (!planPrice) {
        return { error: "Invalid plan selected" };
    }

    try {
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: planPrice.amount, // in paise
            currency: "INR",
            receipt: `sub_${user.id}_${Date.now()}`,
            notes: {
                userId: user.id,
                plan: tier,
            },
        });

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            planLabel: planPrice.label,
        };
    } catch (err) {
        console.error("Razorpay order creation failed:", err);
        return { error: "Payment gateway error. Please try again." };
    }
}

/**
 * Server Action: Verifies Razorpay payment signature and activates subscription.
 */
export async function verifyAndActivateSubscription(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    tier: MembershipTier
) {
    const user = await getSessionUser();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) return { error: "Server configuration error" };

    // ── 1. Verify HMAC-SHA256 signature ──────────────────────────────────────
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpaySignature) {
        console.error("Razorpay signature mismatch — possible tampering");
        return { error: "Payment verification failed. Contact support." };
    }

    // ── 2. Determine subscription dates ──────────────────────────────────────
    const planLimits = PLAN_LIMITS[tier];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planLimits.durationDays);

    // ── 3. Upsert subscription record ─────────────────────────────────────────
    try {
        await db.subscription.upsert({
            where: { userId: user.id },
            update: {
                plan: tier,
                status: "active",
                startDate,
                endDate,
                razorpayOrderId,
                razorpayPaymentId,
            },
            create: {
                userId: user.id,
                plan: tier,
                status: "active",
                startDate,
                endDate,
                razorpayOrderId,
                razorpayPaymentId,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/pricing");

        return {
            success: true,
            tier,
            endDate: endDate.toISOString(),
            message: `🎉 You're now on the ${planLimits.label}! Enjoy your new features.`,
        };
    } catch (err) {
        console.error("Subscription activation failed:", err);
        return { error: "Failed to activate subscription. Contact support with payment ID: " + razorpayPaymentId };
    }
}

// ────────────────────────────────────────────────────────────────────────────
// CONTACT VIEW ACTION
// ────────────────────────────────────────────────────────────────────────────

/**
 * Server Action: Records a contact view and returns the contact info.
 * Gated behind the plan's contactViews limit.
 */
export async function viewContact(targetUserId: string) {
    const user = await getSessionUser();

    if (user.id === targetUserId) {
        return { error: "Cannot view your own contact" };
    }

    // ── Check if already viewed ───────────────────────────────────────────────
    const alreadyViewed = await db.contactView.findFirst({
        where: { viewerId: user.id, profileId: targetUserId },
    });

    if (alreadyViewed) {
        // Already counted — just return the info
        const target = await db.user.findUnique({
            where: { id: targetUserId },
            select: { phoneNumber: true, email: true, name: true },
        });
        return { success: true, contact: target };
    }

    // ── Check limit ──────────────────────────────────────────────────────────
    const limitCheck = await checkContactViewLimit(user.id);
    if (!limitCheck.allowed) {
        return limitCheck; // passes { error: "UPGRADE_REQUIRED", message }
    }

    // ── Record view & return info ─────────────────────────────────────────────
    try {
        await db.contactView.create({
            data: { viewerId: user.id, profileId: targetUserId },
        });
        const target = await db.user.findUnique({
            where: { id: targetUserId },
            select: { phoneNumber: true, email: true, name: true },
        });

        revalidatePath(`/profile/${targetUserId}`);
        return { success: true, contact: target };
    } catch (err) {
        console.error("viewContact error:", err);
        return { error: "Failed to retrieve contact info" };
    }
}
