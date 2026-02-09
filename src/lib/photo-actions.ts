"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PhotoSchema = z.object({
    url: z.string().min(1, "Please provide a valid image path"),
});

export async function updateProfileImage(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const url = formData.get("url") as string;

    // Allow empty string to remove image
    if (!url) {
        try {
            await db.user.update({
                where: { id: session.user.id },
                data: { profileImage: null },
            });
            revalidatePath("/profile");
            revalidatePath("/profile/edit");
            return { success: true, message: "Profile photo removed." };
        } catch (error) {
            return { message: "Failed to remove photo." };
        }
    }

    const validation = PhotoSchema.safeParse({ url });
    if (!validation.success) {
        return { message: "Invalid URL" };
    }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { profileImage: validation.data.url },
        });
        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Profile photo updated!" };
    } catch (error) {
        console.error("Error updating profile image:", error);
        return { message: "Failed to update photo." };
    }
}


export async function addGalleryImage(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const url = formData.get("url") as string;
    const validation = PhotoSchema.safeParse({ url });

    if (!validation.success) {
        return { message: "Invalid URL" };
    }

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { galleryImages: true }
        });

        const currentImages = user?.galleryImages || [];
        const newImages = [...currentImages, validation.data.url];

        await db.user.update({
            where: { id: session.user.id },
            data: { galleryImages: newImages },
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Image added to gallery!" };
    } catch (error) {
        return { message: "Failed to add image." };
    }
}

export async function addGalleryImages(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const urls = formData.getAll("urls") as string[];
    console.log("addGalleryImages received URLs:", urls);
    if (!urls || urls.length === 0) return { message: "No images provided" };

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { galleryImages: true }
        });

        const currentImages = user?.galleryImages || [];
        const newImages = [...currentImages, ...urls];

        await db.user.update({
            where: { id: session.user.id },
            data: { galleryImages: newImages },
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: `${urls.length} images added to gallery!` };
    } catch (error) {
        console.error("Batch upload error:", error);
        return { message: "Failed to add images." };
    }
}

export async function removeGalleryImage(imageUrl: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        const user = await db.user.findUnique({
            where: { id: session.user.id },
            select: { galleryImages: true }
        });

        const currentImages = user?.galleryImages || [];
        const newImages = currentImages.filter(img => img !== imageUrl);

        await db.user.update({
            where: { id: session.user.id },
            data: { galleryImages: newImages },
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Image removed from gallery!" };
    } catch (error) {
        return { message: "Failed to remove image." };
    }
}

export async function reorderGalleryImages(newOrder: string[]) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { galleryImages: newOrder },
        });
        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Gallery order updated!" };
    } catch (error) {
        return { message: "Failed to reorder images." };
    }
}

export async function addFamilyImages(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const urls = formData.getAll("urls") as string[];
    if (!urls || urls.length === 0) return { message: "No images provided" };

    try {
        const familyDetails = await db.familyDetails.findUnique({
            where: { userId: session.user.id },
            select: { familyImages: true }
        });

        const currentImages = familyDetails?.familyImages || [];
        const newImages = [...currentImages, ...urls];

        // Ensure FamilyDetails exists
        await db.familyDetails.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                familyImages: newImages
            },
            update: {
                familyImages: newImages
            }
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: `${urls.length} family photos added!` };
    } catch (error) {
        console.error("Family upload error:", error);
        return { message: "Failed to add family images." };
    }
}

export async function removeFamilyImage(imageUrl: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        const familyDetails = await db.familyDetails.findUnique({
            where: { userId: session.user.id },
            select: { familyImages: true }
        });

        const currentImages = familyDetails?.familyImages || [];
        const newImages = currentImages.filter(img => img !== imageUrl);

        await db.familyDetails.update({
            where: { userId: session.user.id },
            data: { familyImages: newImages },
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Family photo removed!" };
    } catch (error) {
        return { message: "Failed to remove family photo." };
    }
}

export async function setProfileImageFromGallery(imageUrl: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { profileImage: imageUrl },
        });
        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Profile photo updated from gallery!" };
    } catch (error) {
        return { message: "Failed to update profile photo." };
    }
}
