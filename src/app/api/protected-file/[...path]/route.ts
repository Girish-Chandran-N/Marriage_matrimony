import { auth } from "@/auth";
import { db } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Path structure: /api/protected-file/verification/[filename]
    // params.path = ["verification", "filename.jpg"]
    const resolvedParams = await params;

    if (!resolvedParams?.path || resolvedParams.path.length < 2) {
        return new NextResponse("Invalid Path", { status: 400 });
    }

    const [category, filename] = resolvedParams.path;

    if (category !== "verification" || !filename) {
        return new NextResponse("Invalid Path", { status: 400 });
    }

    // AUTHORIZATION CHECK
    // 1. Is Admin?
    const isAdmin = session.user.role === "ADMIN";

    // 2. Is Owner? (Need to check DB if this filename belongs to user)
    // This is tricky because the filename doesn't contain the user ID explicitly in a verifiable way unless we query the DB.
    // However, for verification requests, the filename is stored in `VerificationRequest.documentUrls`.

    let isOwner = false;
    if (!isAdmin) {
        const verificationReq = await db.verificationRequest.findFirst({
            where: {
                userId: session.user.id,
                documentUrls: {
                    has: `/api/protected-file/${category}/${filename}`
                }
            }
        });
        if (verificationReq) {
            isOwner = true;
        }
    }

    if (!isAdmin && !isOwner) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // SERVE FILE
    try {
        const filePath = path.join(process.cwd(), "private_uploads", category, filename);
        const fileBuffer = await readFile(filePath);

        // Determine content type (simple fallback)
        let contentType = "application/octet-stream";
        const lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) contentType = "image/jpeg";
        else if (lowerFilename.endsWith(".png")) contentType = "image/png";
        else if (lowerFilename.endsWith(".pdf")) contentType = "application/pdf";
        else if (lowerFilename.endsWith(".webp")) contentType = "image/webp";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "private, max-age=3600"
            }
        });
    } catch (error) {
        console.error("Error reading protected file:", error);
        return new NextResponse("File Not Found", { status: 404 });
    }
}
