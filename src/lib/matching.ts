import { Prisma, MatchPreferences, CareerProfile, PersonalDetails, User } from "@prisma/client";

// Define the shape of User with necessary details for matching
type Candidate = User & {
    careerProfile: CareerProfile | null;
    personalDetails: PersonalDetails | null;
};

type Preferences = MatchPreferences;

export function calculateAge(dob: Date | string | null | undefined): number {
    if (!dob) return 0;

    const dateObj = typeof dob === 'string' ? new Date(dob) : dob;

    // Validate date
    if (isNaN(dateObj.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
        age--;
    }
    return age;
}


export interface MatchBreakdown {
    industry: number;
    trust: number;
    location: number;
    age: number;
    height: number;
    religion: number;
    caste: number;
    language: number;
    maritalStatus: number;
    total: number;
    maxPossible: number;
}

export function calculateMatchBreakdown(candidate: Candidate, preferences: Preferences | null): MatchBreakdown {
    const breakdown: MatchBreakdown = {
        industry: 0,
        trust: 0,
        location: 0,
        age: 0,
        height: 0,
        religion: 0,
        caste: 0,
        language: 0,
        maritalStatus: 0,
        total: 0,
        maxPossible: 165 // Sum of max points
    };

    if (!candidate.careerProfile || !candidate.personalDetails || !preferences) return breakdown;

    const cp = candidate.careerProfile;
    const pd = candidate.personalDetails;

    // 1. Industry (50pts)
    if (preferences.preferredIndustries && preferences.preferredIndustries.length > 0) {
        if (cp.industry) {
            const match = preferences.preferredIndustries.some((ind: string) =>
                cp.industry!.toLowerCase().includes(ind.toLowerCase())
            );
            if (match) breakdown.industry = 50;
        }
    }

    // 2. Trust (20pts)
    if (cp.isVerified) breakdown.trust = 20;

    // 3. Location (20pts)
    if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
        if (cp.workLocation) {
            const match = preferences.preferredLocations.some((loc: string) =>
                cp.workLocation!.toLowerCase().includes(loc.toLowerCase())
            );
            if (match) breakdown.location = 20;
        }
    }

    // 4. Age (10pts)
    if (pd.dateOfBirth && (preferences.minAge || preferences.maxAge)) {
        const age = calculateAge(pd.dateOfBirth);
        const minAge = preferences.minAge ?? 18;
        const maxAge = preferences.maxAge ?? 100;
        if (age >= minAge && age <= maxAge) breakdown.age = 10;
    }

    // 5. Height (10pts)
    if (pd.height && (preferences.minHeight || preferences.maxHeight)) {
        const min = preferences.minHeight ?? 0;
        const max = preferences.maxHeight ?? 300;
        if (pd.height >= min && pd.height <= max) breakdown.height = 10;
    }

    // 6. Religion, Caste & Mother Tongue (30pts total)
    if (preferences.preferredReligions?.length > 0 && pd.religion) {
        if (preferences.preferredReligions.includes(pd.religion)) breakdown.religion = 15;
    }
    if (preferences.preferredCastes?.length > 0 && pd.caste) {
        if (preferences.preferredCastes.includes(pd.caste)) breakdown.caste = 10;
    }
    if (preferences.preferredMotherTongues?.length > 0 && pd.motherTongue) {
        if (preferences.preferredMotherTongues.includes(pd.motherTongue)) breakdown.language = 10;
    }

    // 7. Marital Status (20pts)
    if (preferences.maritalStatus && preferences.maritalStatus.length > 0 && pd.maritalStatus) {
        if (preferences.maritalStatus.map((s: string) => s.toLowerCase()).includes(pd.maritalStatus.toLowerCase())) breakdown.maritalStatus = 20;
    }

    breakdown.total =
        breakdown.industry +
        breakdown.trust +
        breakdown.location +
        breakdown.age +
        breakdown.height +
        breakdown.religion +
        breakdown.caste +
        breakdown.language +
        breakdown.maritalStatus;

    return breakdown;
}

export function calculateMatchScore(candidate: Candidate, preferences: Preferences | null): number {
    return calculateMatchBreakdown(candidate, preferences).total;
}

