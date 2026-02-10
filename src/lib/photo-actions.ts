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
            // Also unset any isProfile photo
            await db.userPhoto.updateMany({
                where: { userId: session.user.id, isProfile: true },
                data: { isProfile: false }
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

        // Check if this photo exists in UserPhoto, if so set isProfile=true
        // If not, maybe create it? For now, just update user.profileImage as per old logic,
        // but ideally we should sync.
        await db.userPhoto.updateMany({
            where: { userId: session.user.id },
            data: { isProfile: false }
        });

        // Try to find if this URL exists in photos
        const existingPhoto = await db.userPhoto.findFirst({
            where: { userId: session.user.id, url: validation.data.url }
        });

        if (existingPhoto) {
            await db.userPhoto.update({
                where: { id: existingPhoto.id },
                data: { isProfile: true }
            });
        } else {
            // Create new marked as profile
            await db.userPhoto.create({
                data: {
                    userId: session.user.id,
                    url: validation.data.url,
                    isProfile: true,
                    order: -1 // Top?
                }
            });
        }

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Profile photo updated!" };
    } catch (error) {
        console.error("Error updating profile image:", error);
        return { message: "Failed to update photo." };
    }
}

// Add single image to UserPhoto
export async function addGalleryImage(prevState: any, formData: FormData) {
    return addGalleryImages(prevState, formData);
}

export async function addGalleryImages(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const urls = formData.getAll("urls") as string[];
    // also support single 'url'
    const singleUrl = formData.get("url") as string;
    if (singleUrl) urls.push(singleUrl);

    if (!urls || urls.length === 0) return { message: "No images provided" };

    try {
        // Get current max order
        const lastPhoto = await db.userPhoto.findFirst({
            where: { userId: session.user.id },
            orderBy: { order: 'desc' }
        });
        let nextOrder = (lastPhoto?.order || 0) + 1;

        const userId = session.user.id;

        const dataToCreate = urls.map((url, index) => ({
            userId: userId,
            url: url,
            isProfile: false,
            order: nextOrder + index
        }));

        await db.userPhoto.createMany({
            data: dataToCreate
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: `${urls.length} images added to gallery!` };
    } catch (error) {
        console.error("Batch upload error:", error);
        return { message: "Failed to add images." };
    }
}

// Remove by ID or URL (support both for backward compat)
export async function removeGalleryImage(identifier: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        // Try deleting by ID first
        try {
            await db.userPhoto.delete({
                where: { id: identifier, userId: session.user.id }
            });
        } catch (e) {
            // If ID lookup fails, try deleting by URL
            await db.userPhoto.deleteMany({
                where: { url: identifier, userId: session.user.id }
            });
        }

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Image removed from gallery!" };
    } catch (error) {
        return { message: "Failed to remove image." };
    }
}

// Reorder by IDs
export async function reorderGalleryImages(newOrderIds: string[]) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.$transaction(
            newOrderIds.map((id, index) =>
                db.userPhoto.update({
                    where: { id, userId: session.user.id },
                    data: { order: index }
                })
            )
        );
        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Gallery order updated!" };
    } catch (error) {
        return { message: "Failed to reorder images." };
    }
}

// Set Profile from Gallery (by ID or URL)
export async function setProfileImageFromGallery(identifier: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        let photo = await db.userPhoto.findFirst({
            where: { id: identifier, userId: session.user.id }
        });

        if (!photo) {
            photo = await db.userPhoto.findFirst({
                where: { url: identifier, userId: session.user.id }
            });
        }

        if (!photo) return { message: "Photo not found" };

        // Unset previous
        await db.userPhoto.updateMany({
            where: { userId: session.user.id },
            data: { isProfile: false }
        });

        // Set new
        await db.userPhoto.update({
            where: { id: photo.id },
            data: { isProfile: true }
        });

        // Sync User.profileImage
        await db.user.update({
            where: { id: session.user.id },
            data: { profileImage: photo.url }
        });

        revalidatePath("/profile");
        revalidatePath("/profile/edit");
        return { success: true, message: "Profile photo updated!" };
    } catch (error) {
        return { message: "Failed to update profile photo." };
    }
}

// Family Photos - Still using String[] for now as per schema
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
