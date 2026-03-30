"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Validator for reusable consistent profile fetching
const profileDetailsValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        personalDetails: true,
        careerProfile: true,
        familyDetails: true,
        educations: true,
        jobs: true,
        siblings: true,
        lifestyleDetails: true,
        matchPreferences: true, // Useful for showing "Match %" later
        photos: {
            orderBy: { order: "asc" }
        },
        verificationRequests: {
            orderBy: { createdAt: "desc" },
            take: 1
        }
    }
});

export type ProfileDetails = Prisma.UserGetPayload<typeof profileDetailsValidator>;

export async function getProfileDetails(userId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            ...profileDetailsValidator
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch profile details:", error);
        throw new Error("Failed to fetch profile");
    }
}

export async function getMyProfile() {
    const session = await auth();
    if (!session?.user?.id) return null;
    return getProfileDetails(session.user.id);
}

export async function updateLastSeen() {
    const session = await auth();
    if (!session?.user?.id) return;

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                lastSeen: new Date(),
                isOnline: true // We can toggle this, but presence channel is source of truth
            }
        });
    } catch (error) {
        console.error("Failed to update last seen:", error);
    }
}

export async function getProfessionCounts() {
    try {
        // Fetch active users with their latest job
        const users = await db.user.findMany({
            where: {
                status: 'ACTIVE',
                jobs: {
                    some: { employmentCategory: { not: null } }
                }
            },
            select: {
                jobs: {
                    where: { employmentCategory: { not: null } },
                    orderBy: { toYear: 'desc' }, // Prioritize recent jobs
                    take: 1,
                    select: { employmentCategory: true }
                }
            }
        });

        // Aggregate counts
        const categoryCounts: Record<string, number> = {};

        users.forEach(user => {
            const category = user.jobs[0]?.employmentCategory;
            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });

        // Convert to array and sort
        return Object.entries(categoryCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);

    } catch (error) {
        console.error("Failed to fetch profession counts:", error);
        return [];
    }
}

export async function deleteMyAccount() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const userId = session.user.id;
        // Perform a safe cascading delete inside a transaction for entities missing onDelete: Cascade
        await db.$transaction([
            db.interest.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
            db.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
            db.profileView.deleteMany({ where: { OR: [{ viewerId: userId }, { profileId: userId }] } }),
            db.contactView.deleteMany({ where: { OR: [{ viewerId: userId }, { profileId: userId }] } }),
            db.shortlist.deleteMany({ where: { OR: [{ userId: userId }, { shortlistedUserId: userId }] } }),
            db.block.deleteMany({ where: { OR: [{ blockerId: userId }, { blockedId: userId }] } }),
            // Finally delete the user which will cascade delete jobs, education, personalDetails etc.
            db.user.delete({ where: { id: userId } })
        ]);
        
        return { success: true };
    } catch (error) {
        console.error("Failed to delete account:", error);
        return { success: false, error: "Failed to delete account data." };
    }
}
