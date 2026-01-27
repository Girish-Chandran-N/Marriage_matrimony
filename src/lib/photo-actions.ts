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
