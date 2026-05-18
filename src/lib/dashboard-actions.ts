"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { calculateMatchScore } from "./matching";
import { getMatchPreferences } from "./match-actions";

// Helper to get current user session
async function getSessionUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user;
}

// Helper: Attach scores to a list of items containing a user profile
async function withScores(items: any[], userKey: string, currentUserPreferences: any) {
    if (!currentUserPreferences) {
        return items.map(item => {
            const targetUser = item[userKey];
            if (targetUser) {
                const { password, email, emailVerified, role, ...safeUser } = targetUser as any;
                item[userKey] = safeUser;
            }
            return { ...item, score: 0 };
        });
    }

    return items.map(item => {
        const targetUser = item[userKey];
        if (!targetUser) return { ...item, score: 0 };
        const score = calculateMatchScore(targetUser, currentUserPreferences);
        
        const { password, email, emailVerified, role, ...safeUser } = targetUser as any;
        item[userKey] = safeUser;

        return { ...item, score };
    }); // Default sort by score? Or keep time-based? 
    // Usually dashboard items are time-based (recent first). Let's keep existing order (time) but add score.
    // Actually, keeping original order (likely date desc) is better for "History" views. 
    // Let's NOT sort by score here, but just attach it.
}

// 1. Interest Sent
export async function getInterestSent() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.interest.findMany({
        where: { senderId: user.id },
        include: {
            receiver: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return withScores(data, 'receiver', prefs);
}

// 2. Interest Received
export async function getInterestReceived() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.interest.findMany({
        where: { receiverId: user.id },
        include: {
            sender: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return withScores(data, 'sender', prefs);
}

// 3. Profile Views (Who viewed my profile)
export async function getProfileViews() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.profileView.findMany({
        where: { profileId: user.id },
        include: {
            viewer: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { viewedAt: "desc" }
    });
    return withScores(data, 'viewer', prefs);
}

// 4. Profile Visited (Profiles I visited)
export async function getProfileVisited() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.profileView.findMany({
        where: { viewerId: user.id },
        include: {
            profile: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { viewedAt: "desc" }
    });
    return withScores(data, 'profile', prefs);
}

// 5. Shortlisted Profiles
export async function getShortlistedProfiles() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.shortlist.findMany({
        where: { userId: user.id },
        include: {
            shortlistedUser: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return withScores(data, 'shortlistedUser', prefs);
}

// 6. Contacts Viewed (Who viewed my contact)
export async function getContactsViewed() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.contactView.findMany({
        where: { profileId: user.id },
        include: {
            viewer: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { viewedAt: "desc" }
    });
    return withScores(data, 'viewer', prefs);
}

// 7. Contacts Visited (Whose contact I viewed)
export async function getContactsVisited() {
    const user = await getSessionUser();
    const prefs = await getMatchPreferences();
    const data = await db.contactView.findMany({
        where: { viewerId: user.id },
        include: {
            profile: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { viewedAt: "desc" }
    });
    return withScores(data, 'profile', prefs);
}

// 8. New Matches (Simplified logic: New users matching preferences)
export async function getNewMatches() {
    const user = await getSessionUser();
    const preferences = await getMatchPreferences();

    if (!preferences) return [];

    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const candidates = await db.user.findMany({
        where: {
            id: { not: user.id },
            createdAt: { gte: thirtyDaysAgo },
        },
        include: {
            careerProfile: true,
            personalDetails: true,
            familyDetails: true,
            educations: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20
    });

    const scoredMatches = candidates.map((candidate) => {
        const score = calculateMatchScore(candidate, preferences);
        const { password, email, emailVerified, role, ...safeUser } = candidate as any;
        return { user: safeUser, score };
    });

    // Return top 10 matches
    return scoredMatches.sort((a, b) => b.score - a.score).slice(0, 10);
}

// 9. Blocked Users
export async function getBlockedUsers() {
    const user = await getSessionUser();
    const data = await db.block.findMany({
        where: { blockerId: user.id },
        include: {
            blocked: {
                include: {
                    personalDetails: true,
                    careerProfile: true,
                    educations: true,
                    jobs: true,
                    familyDetails: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    // We might not need scores for blocked users, but keeping data structure consistent is helpful
    return data.map(item => {
        const targetUser = item.blocked;
        let safeUser = null;
        if (targetUser) {
            const { password, email, emailVerified, role, ...rest } = targetUser as any;
            safeUser = rest;
        }
        return { ...item, user: safeUser };
    });
}

// Aggregated Stats for Dashboard Cards
export async function getDashboardStats() {
    const user = await getSessionUser();

    const [
        interestSentCount,
        interestReceivedCount,
        profileViewsCount,
        profileVisitedCount,
        shortlistedCount,
        contactsViewedCount,
        contactsVisitedCount,
        newMatches,
        blockedCount
    ] = await Promise.all([
        db.interest.count({ where: { senderId: user.id } }),
        db.interest.count({ where: { receiverId: user.id } }),
        db.profileView.count({ where: { profileId: user.id } }),
        db.profileView.count({ where: { viewerId: user.id } }),
        db.shortlist.count({ where: { userId: user.id } }),
        db.contactView.count({ where: { profileId: user.id } }),
        db.contactView.count({ where: { viewerId: user.id } }),
        getNewMatches(),
        db.block.count({ where: { blockerId: user.id } })
    ]);

    return {
        interestSent: interestSentCount,
        interestReceived: interestReceivedCount,
        profileViews: profileViewsCount,
        profileVisited: profileVisitedCount,
        shortlisted: shortlistedCount,
        contactsViewed: contactsViewedCount,
        contactsVisited: contactsVisitedCount,
        newMatches: newMatches.length,
        blockedUsers: blockedCount
    };
}
