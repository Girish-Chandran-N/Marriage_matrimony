"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { calculateMatchScore, calculateAge } from "./matching";

const emptyToUndefined = (val: unknown) => {
    if (val === "" || val === null || val === undefined) return undefined;
    return val;
};

const MatchPreferencesSchema = z.object({
    preferredIndustries: z.string().optional(),
    minExperience: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
    maxExperience: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
    preferredLocations: z.string().optional(),
    minAge: z.preprocess(emptyToUndefined, z.coerce.number().min(18).optional()),
    maxAge: z.preprocess(emptyToUndefined, z.coerce.number().min(18).optional()),
    minIncome: z.string().optional(),
    maxIncome: z.string().optional(),
    maritalStatus: z.string().optional(),

    // New Fields
    minHeight: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
    maxHeight: z.preprocess(emptyToUndefined, z.coerce.number().optional()),
    preferredReligions: z.string().optional(),
    preferredCastes: z.string().optional(), // Added
    preferredMotherTongues: z.string().optional(),
});

export async function updateMatchPreferences(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData = {
        preferredIndustries: formData.get("preferredIndustries"),
        minExperience: formData.get("minExperience"),
        maxExperience: formData.get("maxExperience"),
        preferredLocations: formData.get("preferredLocations"),
        minAge: formData.get("minAge"),
        maxAge: formData.get("maxAge"),
        minIncome: formData.get("minIncome"),
        maxIncome: formData.get("maxIncome"),
        maritalStatus: formData.get("maritalStatus"),
        minHeight: formData.get("minHeight"),
        maxHeight: formData.get("maxHeight"),
        preferredReligions: formData.get("preferredReligions"),
        preferredCastes: formData.get("preferredCastes"), // Added
        preferredMotherTongues: formData.get("preferredMotherTongues"),
    };

    const validation = MatchPreferencesSchema.safeParse(rawData);

    if (!validation.success) {
        const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
        return {
            errors: validation.error.flatten().fieldErrors,
            message: firstError || "Invalid Data"
        };
    }

    const {
        preferredIndustries,
        preferredLocations,
        maritalStatus,
        preferredReligions,
        preferredCastes, // Added
        preferredMotherTongues,
        ...numericFields
    } = validation.data;

    const toArray = (str?: string) => str ? str.split(",").map(s => s.trim()).filter(Boolean) : [];

    try {
        await db.matchPreferences.upsert({
            where: { userId: session.user.id },
            update: {
                ...numericFields,
                preferredIndustries: toArray(preferredIndustries),
                preferredLocations: toArray(preferredLocations),
                maritalStatus: toArray(maritalStatus),
                preferredReligions: toArray(preferredReligions),
                preferredCastes: toArray(preferredCastes), // Added
                preferredMotherTongues: toArray(preferredMotherTongues),
            },
            create: {
                userId: session.user.id,
                ...numericFields,
                preferredIndustries: toArray(preferredIndustries),
                preferredLocations: toArray(preferredLocations),
                maritalStatus: toArray(maritalStatus),
                preferredReligions: toArray(preferredReligions),
                preferredCastes: toArray(preferredCastes), // Added
                preferredMotherTongues: toArray(preferredMotherTongues),
            }
        });

        revalidatePath("/matches/preferences");
        return { success: true, message: "Preferences saved successfully!" };
    } catch (error: any) {
        console.error("Error saving preferences:", error);
        return { message: "Failed to save preferences: " + (error.message || "Unknown error") };
    }
}

export async function getMatchPreferences() {
    const session = await auth();
    if (!session?.user?.id) return null;

    return await db.matchPreferences.findUnique({
        where: { userId: session.user.id }
    });
}

export interface MatchFilters {
    industry?: string;
    location?: string;
    ageMin?: number;
    ageMax?: number;
    incomeMin?: number; // Simplified logic for demo
    minHeight?: number;
    maxHeight?: number;
    religion?: string;
    caste?: string; // Added
    motherTongue?: string;
    gender?: string;
    professions?: string[];

    // Location
    workingCountry?: string;
    workingState?: string;
    workingDistrict?: string;
    nativeCountry?: string;
    nativeState?: string;
    nativeDistrict?: string;
    readyToRelocate?: boolean;

    // Advanced - Physical & Family
    physicalStatus?: string;
    familyStatus?: string;
    complexion?: string;
    bodyType?: string;
    employmentCategory?: string;
    incomeRange?: string[]; // Checkbox array as per request

    // Advanced - Lifestyle
    eatingHabits?: string;
    drinkingHabits?: string;
    smokingHabits?: string;

    // Criteria / More
    isOnline?: boolean;
    hasPhoto?: boolean;
    isPremium?: boolean;
}


export async function getMatches(filters?: MatchFilters) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const preferences = await db.matchPreferences.findUnique({
        where: { userId: session.user.id }
    });

    if (!preferences && !filters) return { message: "Please set your preferences first or use filters." };

    // Exclude blocked users
    const blockedRecords = await db.block.findMany({
        where: {
            OR: [
                { blockerId: session.user.id },
                { blockedId: session.user.id },
            ]
        },
        select: {
            blockerId: true,
            blockedId: true
        }
    });

    const excludedIds = new Set<string>();
    excludedIds.add(session.user.id); // Exclude self

    blockedRecords.forEach((record: { blockerId: string, blockedId: string }) => {
        excludedIds.add(record.blockerId);
        excludedIds.add(record.blockedId);
    });

    // Get current user's subscription to check limits
    const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        include: { subscription: true }
    });

    const isPro = currentUser?.subscription?.status === 'active';

    // Start with all candidates (excluding self and blocked users)
    const candidates = await db.user.findMany({
        where: {
            id: { notIn: Array.from(excludedIds) },
            // Removed strict careerProfile requirement
        },
        include: {
            careerProfile: true,
            personalDetails: true,
            familyDetails: true,
            lifestyleDetails: true,
            jobs: { take: 1, orderBy: { createdAt: 'desc' } }, // Fetch latest job for location/income
            subscription: true, // For Premium filter
            photos: true, // Include gallery photos
        },
        take: 100 // Limit for performance
    });

    // Filtering Logic (Strict) - If filters are provided, remove unmatched candidates
    let filteredCandidates = candidates;

    if (filters) {
        filteredCandidates = candidates.filter((c: any) => {
            const cp = c.careerProfile || {}; // Default to empty object if null
            const pd = c.personalDetails || {};

            // Only return false if CRITICAL personal details are missing for Age/Height filtering
            // But we'll allow partial data generally

            // Gender Filter (for bride/groom search)
            if (filters.gender && pd.gender !== filters.gender) return false;

            // Profession Filter (search by job title)
            if (filters.professions && filters.professions.length > 0) {
                const jobTitle = cp.jobTitle?.toLowerCase() || '';
                const matchesProfession = filters.professions.some(profession =>
                    jobTitle.includes(profession.toLowerCase())
                );
                if (!matchesProfession) return false;
            }

            if (filters.industry) {
                const term = filters.industry.toLowerCase();
                const matchesKeyword =
                    cp.industry?.toLowerCase().includes(term) ||
                    cp.jobTitle?.toLowerCase().includes(term) ||
                    cp.companyName?.toLowerCase().includes(term);

                if (!matchesKeyword) return false;
            }
            if (filters.location && !cp.workLocation?.toLowerCase().includes(filters.location.toLowerCase())) return false;

            // Age Filter
            if (pd.dateOfBirth) {
                const age = calculateAge(pd.dateOfBirth);
                if (filters.ageMin && age < filters.ageMin) return false;
                if (filters.ageMax && age > filters.ageMax) return false;
            }

            // Height Filter
            if (pd.height) {
                if (filters.minHeight && pd.height < filters.minHeight) return false;
                if (filters.maxHeight && pd.height > filters.maxHeight) return false;
            }

            if (filters.religion && pd.religion !== filters.religion) return false;
            if (filters.caste && pd.caste?.toLowerCase() !== filters.caste.toLowerCase()) return false;
            if (filters.motherTongue && pd.motherTongue !== filters.motherTongue) return false;

            // --- Location Filters ---
            if (filters.workingCountry && cp.workLocation && !cp.workLocation.includes(filters.workingCountry)) return false;
            // Note: workLocation is a string, might need parsing or distinct fields in future. Assuming 'City, State, Country' format or similar.
            // Better: If schema had structured location. Currently Job has country/state.
            // Let's try to match against Job table if available, but getMatches fetches User with include careerProfile.
            // Schema: Job has country, state, district. User has jobs[].
            // But main search usually targets 'current' location. PersonalDetails has residingCountry/State.
            // Request said "Working Country". CareerProfile has "workLocation". 
            // Let's match against PersonalDetails.residingCountry for "Working Country" (assuming residency = work place usually) OR Job.country?
            // User schema has: residingCountry in PersonalDetails.
            if (filters.workingCountry && pd.residingCountry !== filters.workingCountry) return false;
            // If State/District are present, check them too
            if (filters.workingState && pd.residingState !== filters.workingState) return false;
            if (filters.workingDistrict && pd.residingDistrict !== filters.workingDistrict) return false;

            // Native Location
            if (filters.nativeCountry && pd.nativeCountry !== filters.nativeCountry) return false;
            if (filters.nativeState && pd.nativeState !== filters.nativeState) return false;
            if (filters.nativeDistrict && pd.nativeDistrict !== filters.nativeDistrict) return false;

            // Relocate? (Stored in MatchPreferences usually, but here filtering Candidates who match MY preference? Or Candidates who are willing to relocate?)
            // Usually "Ready to Relocate" filter means "Show candidates who said YES to relocate".
            // MatchPreferences has `readyToRelocate`. But we need to check Candidate's willingness.
            // Candidate data might not have `readyToRelocate` explicitly in PersonalDetails?
            // Schema check: MatchPreferences has `readyToRelocate`. User model? 
            // User does NOT have readyToRelocate in Personal/Career. 
            // It might be in MatchPreferences (what they look for) OR implied.
            // Let's skip Relocate filter for now or match against their MatchPreferences if treating it as "My profile says I relocate".

            // --- Advanced Filters ---
            if (filters.physicalStatus && pd.physicalStatus !== filters.physicalStatus) return false;
            if (filters.familyStatus && c.familyDetails?.familyStatus !== filters.familyStatus) return false;
            if (filters.complexion && pd.complexion !== filters.complexion) return false;
            if (filters.bodyType && pd.bodyType !== filters.bodyType) return false;
            if (filters.employmentCategory && c.jobs?.[0]?.employmentCategory !== filters.employmentCategory) {
                // Fallback to CareerProfile or Job
                // We need to include Jobs in the query to be accurate, currently filteredCandidates comes from `candidates` which has `include: { careerProfile, personalDetails, familyDetails }`.
                // We need to add `jobs: true` to include.
            }

            // Income (Range matching)
            // filters.incomeRange is string[]. Check if candidate's income is in the list.
            if (filters.incomeRange && filters.incomeRange.length > 0) {
                const income = cp.incomeRange || c.jobs?.[0]?.annualIncome;
                if (!income || !filters.incomeRange.includes(income)) return false;
            }

            // --- Lifestyle Filters ---
            const ld = c.lifestyleDetails || {};
            // Need to include LifestyleDetails in query
            if (filters.eatingHabits && ld.eatingHabits !== filters.eatingHabits) return false;
            if (filters.drinkingHabits && ld.drinking !== filters.drinkingHabits) return false;
            if (filters.smokingHabits && ld.smoking !== filters.smokingHabits) return false;

            // --- More Criteria ---
            if (filters.isOnline && !c.isOnline) return false; // Simple check, or check lastSeen window
            if (filters.hasPhoto && (!c.profileImage && (!c.galleryImages || c.galleryImages.length === 0))) return false;
            if (filters.isPremium) {
                // We need subscription data. `candidates` query needs `include: { subscription: true }`.
                const sub = c.subscription;
                if (!sub || sub.status !== 'active' || sub.plan === 'FREE') return false;
            }

            return true;

        });
    }

    // Scoring Logic (Weighted) - Based on Stored Preferences
    // Imported from centralized matching service
    const scoredMatches = filteredCandidates.map((candidate: any) => {
        const score = calculateMatchScore(candidate, preferences);
        return { user: candidate, score };
    });

    // Sort by score
    scoredMatches.sort((a: any, b: any) => b.score - a.score);

    // Apply subscription-based limiting
    // Free users: max 10 results, Pro users: unlimited
    const resultLimit = isPro ? scoredMatches.length : 10;
    const limitedResults = scoredMatches.slice(0, resultLimit);

    return limitedResults;
}
