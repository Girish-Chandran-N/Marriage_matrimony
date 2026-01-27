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

    // Start with all candidates (excluding self and blocked users)
    const candidates = await db.user.findMany({
        where: {
            id: { notIn: Array.from(excludedIds) },
            careerProfile: { isNot: null }
        },
        include: {
            careerProfile: true,
            personalDetails: true,
            familyDetails: true,
            educationDetails: true,
        },
        take: 100 // Limit for performance
    });

    // Filtering Logic (Strict) - If filters are provided, remove unmatched candidates
    let filteredCandidates = candidates;

    if (filters) {
        filteredCandidates = candidates.filter((c: any) => {
            const cp = c.careerProfile;
            const pd = c.personalDetails;
            if (!cp || !pd) return false;

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

    return scoredMatches;
}
