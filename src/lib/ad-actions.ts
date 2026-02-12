"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdPlacementSlot, AdType, Advertisement } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AdSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["MANUAL", "GOOGLE_ADS"]),
    placement: z.enum(["SIDEBAR", "DASHBOARD", "FEED", "RIGHT_SIDEBAR"]),
    imageUrl: z.string().optional(),
    targetUrl: z.string().optional(),
    adCode: z.string().optional(),
    isActive: z.boolean().optional(),
    startDate: z.string().optional(), // Date string from form
    endDate: z.string().optional(),
});

// --- Public / Consumer Actions ---

export async function getAdsByPlacement(placement: AdPlacementSlot) {
    // randomized or specific logic? For now, fetch all active for the slot
    try {
        const ads = await db.advertisement.findMany({
            where: {
                placement,
                isActive: true,
                // Check dates
                OR: [
                    {
                        startDate: null,
                        endDate: null
                    },
                    {
                        startDate: { lte: new Date() },
                        endDate: { gte: new Date() }
                    },
                    {
                        startDate: { lte: new Date() },
                        endDate: null
                    },
                    {
                        startDate: null,
                        endDate: { gte: new Date() }
                    }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        return ads;
    } catch (error) {
        console.error("Error fetching ads:", error);
        return [];
    }
}

export async function trackAdView(adId: string) {
    try {
        await db.advertisement.update({
            where: { id: adId },
            data: { viewCount: { increment: 1 } }
        });
    } catch (err) {
        // Ignore tracking errors
    }
}

export async function trackAdClick(adId: string) {
    try {
        await db.advertisement.update({
            where: { id: adId },
            data: { clickCount: { increment: 1 } }
        });
    } catch (err) {
        // Ignore tracking errors
    }
}

// --- Admin Actions ---

export async function getAllAds() {
    const session = await auth();
    // In a real app, check session.user.role === 'ADMIN'
    if (!session?.user) return { error: "Unauthorized" };

    try {
        return await db.advertisement.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return { error: "Failed to fetch ads" };
    }
}

export async function createAd(formData: FormData) {
    const session = await auth();
    if (!session?.user) return { message: "Unauthorized" };

    const rawData = {
        title: formData.get("title"),
        type: formData.get("type"),
        placement: formData.get("placement"),
        imageUrl: formData.get("imageUrl") || undefined,
        targetUrl: formData.get("targetUrl") || undefined,
        adCode: formData.get("adCode") || undefined,
        isActive: formData.get("isActive") === "on",
        startDate: formData.get("startDate") || undefined,
        endDate: formData.get("endDate") || undefined,
    };

    const validated = AdSchema.safeParse({
        ...rawData,
        // Convert to enum or undefined
        type: rawData.type as AdType,
        placement: rawData.placement as AdPlacementSlot,
        imageUrl: rawData.imageUrl || undefined,
        targetUrl: rawData.targetUrl || undefined,
        adCode: rawData.adCode || undefined,
        startDate: rawData.startDate || undefined,
        endDate: rawData.endDate || undefined,
    });
    if (!validated.success) {
        return { message: "Invalid data", errors: validated.error.flatten().fieldErrors };
    }

    const { startDate, endDate, ...data } = validated.data;

    try {
        await db.advertisement.create({
            data: {
                title: data.title,
                type: data.type,
                placement: data.placement,
                imageUrl: data.imageUrl,
                targetUrl: data.targetUrl,
                adCode: data.adCode,
                isActive: data.isActive,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            }
        });
        revalidatePath("/admin/ads");
        return { success: true, message: "Ad created successfully" };
    } catch (error) {
        console.error("Create ad error:", error);
        return { message: "Failed to create ad" };
    }
}

export async function deleteAd(adId: string) {
    const session = await auth();
    if (!session?.user) return { message: "Unauthorized" };

    try {
        await db.advertisement.delete({ where: { id: adId } });
        revalidatePath("/admin/ads");
        return { success: true, message: "Ad deleted" };
    } catch (error) {
        return { message: "Failed to delete ad" };
    }
}

export async function toggleAdStatus(adId: string, isActive: boolean) {
    const session = await auth();
    if (!session?.user) return { message: "Unauthorized" };

    try {
        await db.advertisement.update({
            where: { id: adId },
            data: { isActive }
        });
        revalidatePath("/admin/ads");
        return { success: true, message: "Status updated" };
    } catch (error) {
        return { message: "Failed to update status" };
    }
}
