"use server";

import { cache } from "react";
import { db } from "@/lib/db";

export const getHighlightedProfiles = cache(async (limit: number = 10) => {
    try {
        // Fetch profiles with complete information
        const profiles = await db.user.findMany({
            where: {
                personalDetails: {
                    isNot: null
                },
                careerProfile: {
                    isNot: null
                }
            },
            select: {
                id: true,
                name: true,
                profileImage: true,
                personalDetails: {
                    select: {
                        dateOfBirth: true,
                        residingCity: true,
                        residingState: true,
                        residingCountry: true,
                        height: true,
                        gender: true
                    }
                },
                careerProfile: {
                    select: {
                        jobTitle: true,
                        companyName: true
                    }
                },
                educations: {
                    take: 1,
                    orderBy: {
                        passedYear: 'desc'
                    },
                    select: {
                        qualification: true,
                        institution: true
                    }
                }
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return profiles;
    } catch (error) {
        console.error("Error fetching highlighted profiles:", error);
        return [];
    }
});
