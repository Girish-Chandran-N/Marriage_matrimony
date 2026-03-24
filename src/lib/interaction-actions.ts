"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
    sendInterestReceivedEmail,
    sendInterestAcceptedEmail,
    sendProfileViewedEmail,
} from "@/lib/mail";
import { checkInterestLimit } from "@/lib/subscription-actions";

async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return { ...session.user, id: session.user.id };
}

// 1. Interest Actions
export async function sendInterest(targetUserId: string, isSuperLike: boolean = false) {
    const user = await getSessionUser();

    if (user.id === targetUserId) return { message: "Cannot send interest to yourself" };

    // ── Plan limit check ────────────────────────────────────────────────────────
    const limitCheck = await checkInterestLimit(user.id);
    if (!limitCheck.allowed) {
        return { error: limitCheck.error, message: limitCheck.message };
    }

    try {
        await db.interest.create({
            data: {
                senderId: user.id,
                receiverId: targetUserId,
                status: "PENDING",
                isSuperLike: isSuperLike
            }
        });
        revalidatePath("/matches");
        revalidatePath("/dashboard/interests/sent");

        // Fire-and-forget: notify the receiver by email
        db.user.findUnique({
            where: { id: targetUserId },
            select: { email: true, name: true }
        }).then((receiver) => {
            if (receiver?.email && receiver?.name) {
                sendInterestReceivedEmail(receiver.email, receiver.name, user.name || "Someone");
            }
        }).catch(() => {});

        return { success: true, message: "Interest sent successfully" };
    } catch (error) {
        return { message: "Interest already sent or failed" };
    }
}

export async function withdrawInterest(interestId: string) {
    const user = await getSessionUser();
    try {
        await db.interest.delete({
            where: {
                id: interestId,
                senderId: user.id // Ensure ownership
            }
        });
        revalidatePath("/dashboard/interests/sent");
        return { success: true, message: "Interest withdrawn" };
    } catch (error) {
        return { message: "Failed to withdraw interest" };
    }
}

export async function acceptInterest(interestId: string) {
    const user = await getSessionUser();
    try {
        const interest = await db.interest.update({
            where: {
                id: interestId,
                receiverId: user.id // Ensure is receiver
            },
            data: { status: "ACCEPTED" },
            include: { sender: { select: { email: true, name: true } } }
        });
        revalidatePath("/dashboard/interests/received");

        // Fire-and-forget: notify the original sender that their interest was accepted
        if (interest.sender?.email && interest.sender?.name) {
            sendInterestAcceptedEmail(
                interest.sender.email,
                interest.sender.name,
                user.name || "Someone"
            ).catch(() => {});
        }

        return { success: true, message: "Interest accepted" };
    } catch (error) {
        return { message: "Failed to accept interest" };
    }
}

export async function rejectInterest(interestId: string) {
    const user = await getSessionUser();
    try {
        await db.interest.update({
            where: {
                id: interestId,
                receiverId: user.id
            },
            data: { status: "REJECTED" }
        });
        revalidatePath("/dashboard/interests/received");
        return { success: true, message: "Interest rejected" };
    } catch (error) {
        return { message: "Failed to reject interest" };
    }
}

// 2. Shortlist Actions
export async function toggleShortlist(targetUserId: string) {
    const user = await getSessionUser();

    try {
        const existing = await db.shortlist.findFirst({
            where: {
                userId: user.id,
                shortlistedUserId: targetUserId
            }
        });

        if (existing) {
            await db.shortlist.delete({ where: { id: existing.id } });
            revalidatePath("/dashboard/shortlisted");
            return { success: true, message: "Removed from shortlist", isShortlisted: false };
        } else {
            await db.shortlist.create({
                data: {
                    userId: user.id,
                    shortlistedUserId: targetUserId
                }
            });
            revalidatePath("/dashboard/shortlisted");
            return { success: true, message: "Shortlisted successfully", isShortlisted: true };
        }
    } catch (error) {
        return { message: "Failed to update shortlist" };
    }
}

// 3. Profile Viewing (To be called when visiting a profile page)
export async function recordProfileView(profileId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id === profileId) return;

    try {
        const existing = await db.profileView.findFirst({
            where: { viewerId: session.user.id, profileId: profileId }
        });

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const shouldNotifyByEmail = !existing || existing.viewedAt < twentyFourHoursAgo;

        if (existing) {
            await db.profileView.update({
                where: { id: existing.id },
                data: { viewedAt: now }
            });
        } else {
            await db.profileView.create({
                data: { viewerId: session.user.id, profileId }
            });
        }

        // Fire-and-forget profile view email (rate-limited to once per 24h)
        if (shouldNotifyByEmail) {
            Promise.all([
                db.user.findUnique({ where: { id: profileId }, select: { email: true, name: true } }),
                db.user.findUnique({ where: { id: session.user.id }, select: { name: true } })
            ]).then(([profileOwner, viewer]) => {
                if (profileOwner?.email && profileOwner?.name && viewer?.name) {
                    sendProfileViewedEmail(profileOwner.email, profileOwner.name, viewer.name);
                }
            }).catch(() => {});
        }
    } catch (error) {
        console.error("Failed to record view", error);
    }
}

// 4. Contact Viewing (Unlock Logic)
export async function unlockContact(profileId: string) {
    const user = await getSessionUser();

    // In a real app, deduct credits here.

    try {
        await db.contactView.create({
            data: {
                viewerId: user.id,
                profileId: profileId
            }
        });
        revalidatePath("/dashboard/contacts-viewed");
        revalidatePath("/dashboard/contacts-visited");
        return { success: true, message: "Contact unlocked" };
    } catch (error) {
        return { message: "Failed to unlock contact" };
    }
}

// Helper to check status for UI
export async function getInteractionStatus(targetUserId: string) {
    const session = await auth();
    if (!session?.user?.id) return { isShortlisted: false, hasSentInterest: false, isContactUnlocked: false };

    const [shortlist, interest, contact] = await Promise.all([
        db.shortlist.findFirst({ where: { userId: session.user.id, shortlistedUserId: targetUserId } }),
        db.interest.findFirst({ where: { senderId: session.user.id, receiverId: targetUserId } }),
        db.contactView.findFirst({ where: { viewerId: session.user.id, profileId: targetUserId } })
    ]);

    return {
        isShortlisted: !!shortlist,
        hasSentInterest: !!interest,
        interestStatus: interest?.status,
        isContactUnlocked: !!contact
    };
}

// 5. Block / Ignore User
export async function blockUser(targetUserId: string) {
    const user = await getSessionUser();

    if (user.id === targetUserId) return { message: "Cannot block yourself" };

    try {
        await db.block.create({
            data: {
                blockerId: user.id,
                blockedId: targetUserId
            }
        });
        revalidatePath("/matches");
        return { success: true, message: "User blocked" };
    } catch (error) {
        return { message: "Failed to block user" };
    }
}

// Ignore is essentially a soft block or just hiding from matches
// For now, we can treat it as a block or a separate "Ignored" table if needed.
// User requested "Ignore Profile" and "Block Profile".
// Let's implement Ignore as a Block for now to remove them from feed.
export async function ignoreUser(targetUserId: string) {
    return blockUser(targetUserId);
}

// 6. Report User
export async function reportUser(targetUserId: string, reason: string) {
    const user = await getSessionUser();

    if (user.id === targetUserId) return { message: "Cannot report yourself" };

    try {
        await db.report.create({
            data: {
                reporterId: user.id,
                reportedId: targetUserId,
                reason: reason,
                status: "PENDING"
            }
        });
        return { success: true, message: "User reported successfully" };
    } catch (error) {
        return { message: "Failed to report user" };
    }
}

// 7. Unblock User
export async function unblockUser(targetUserId: string) {
    const user = await getSessionUser();
    try {
        await db.block.delete({
            where: {
                blockerId_blockedId: {
                    blockerId: user.id,
                    blockedId: targetUserId
                }
            }
        });
        revalidatePath("/matches");
        revalidatePath("/dashboard/blocked");
        return { success: true, message: "User unblocked" };
    } catch (error) {
        return { message: "Failed to unblock user" };
    }
}

