"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function logActivity(userId: string, action: string, details?: any) {
    try {
        await db.activityLog.create({
            data: {
                userId,
                action,
                details: details ? JSON.stringify(details) : undefined,
            },
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}

export async function getLogs(limit = 50) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await db.activityLog.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { name: true, email: true, role: true },
            },
        },
    });
}
