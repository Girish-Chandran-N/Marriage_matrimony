import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
];

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        console.log("Upload route received file:", file?.name, file?.size, file?.type);

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // 1. Validate Size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
        }

        // 2. Validate Type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only Images and PDFs are allowed." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary via Stream
        const result = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "matrimony_profiles", // Organizational folder in Cloudinary
                    resource_type: "auto",      // Auto-detect image vs pdf (raw)
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(buffer);
        });

        console.log("Cloudinary upload success:", result.secure_url);

        return NextResponse.json({ url: result.secure_url });

    } catch (error: any) {
        console.error("Upload failed details:", error);
        return NextResponse.json({ error: `Upload failed: ${error.message || "Unknown error"}` }, { status: 500 });
    }
}
