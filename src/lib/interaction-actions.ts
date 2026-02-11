"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return { ...session.user, id: session.user.id };
}

// 1. Interest Actions
export async function sendInterest(targetUserId: string) {
    const user = await getSessionUser();

    if (user.id === targetUserId) return { message: "Cannot send interest to yourself" };

    try {
        await db.interest.create({
            data: {
                senderId: user.id,
                receiverId: targetUserId,
                status: "PENDING"
            }
        });
        revalidatePath("/matches");
        revalidatePath("/dashboard/interests/sent");
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
        await db.interest.update({
            where: {
                id: interestId,
                receiverId: user.id // Ensure is receiver
            },
            data: { status: "ACCEPTED" }
        });
        revalidatePath("/dashboard/interests/received");
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
        // Check if viewed recently (e.g., last 24h) to avoid spamming DB? 
        // For now, let's toggle: if exists, update time. If not, create.
        // Actually, dashboard requirements usually want "who viewed me". 
        // A simple create-or-update logic is fine.

        // Upsert is tricky without unique constraint on [viewer, profile].
        // Schema probably doesn't have unique constraint.
        // Let's just add a new record for now, or check first.
        // Ideally we only want one record per day or just one unique record updated.
        // Let's assume unique interaction for simplicity or check existence.

        const existing = await db.profileView.findFirst({
            where: { viewerId: session.user.id, profileId: profileId }
        });

        if (existing) {
            await db.profileView.update({
                where: { id: existing.id },
                data: { viewedAt: new Date() }
            });
        } else {
            await db.profileView.create({
                data: { viewerId: session.user.id, profileId }
            });
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
