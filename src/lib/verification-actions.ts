"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadDocument(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    // Ensure PRIVATE directory exists
    const uploadDir = join(process.cwd(), "private_uploads", "verification");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating upload directory:", e);
    }

    const filePath = join(uploadDir, filename);

    try {
        await writeFile(filePath, buffer);
        console.log(`Saved file to ${filePath}`);
        // Return PROTECTED API URL
        // We will create an API route: /api/protected-file/verification/[filename]
        return { success: true, url: `/api/protected-file/verification/${filename}` };
    } catch (error) {
        console.error("Error saving file:", error);
        return { error: "Failed to save file" };
    }
}

export async function submitVerificationRequest(documentUrls: string[]) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Find user's career profile to link (required by schema)
        const careerProfile = await db.careerProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!careerProfile) {
            return { error: "Please complete your career profile first." };
        }

        await db.verificationRequest.create({
            data: {
                userId: session.user.id,
                careerProfileId: careerProfile.id,
                documentUrls: documentUrls,
                status: "PENDING"
            }
        });

        revalidatePath("/verification");
        return { success: true, message: "Verification request submitted!" };
    } catch (error) {
        console.error("Error submitting verification request:", error);
        return { error: "Failed to submit request" };
    }
}

export async function getVerificationStatus() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const request = await db.verificationRequest.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    return request;
}

export async function resetVerificationRequest() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.verificationRequest.deleteMany({
            where: {
                userId: session.user.id,
                status: "PENDING"
            }
        });
        revalidatePath("/verification");
        return { success: true, message: "Verification request reset" };
    } catch (error) {
        console.error("Error resetting verification:", error);
        return { error: "Failed to reset request" };
    }
}
