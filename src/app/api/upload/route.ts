import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";
import { auth } from "@/auth";

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

        const buffer = Buffer.from(await file.arrayBuffer());

        // Sanitize filename
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(filename);
        const basename = path.basename(filename, extension);
        const uniqueFilename = `${basename}-${uniqueSuffix}${extension}`;

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), "public/uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            console.error("Directory creation failed:", e);
        }

        const filepath = path.join(uploadDir, uniqueFilename);

        await writeFile(filepath, buffer);

        // Return the public URL
        const publicUrl = `/uploads/${uniqueFilename}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload failed details:", error);
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }
}
