"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/logging-actions";
// banUser import removed

export async function submitReport(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const reportedId = formData.get("reportedId") as string;
    const reason = formData.get("reason") as string;

    if (!reportedId || !reason) {
        return { success: false, message: "Missing required fields" };
    }

    try {
        await db.report.create({
            data: {
                reporterId: session.user.id,
                reportedId,
                reason,
            },
        });

        await logActivity(session.user.id, "REPORT_USER", { reportedId, reason });

        return { success: true, message: "Report submitted successfully" };
    } catch (error) {
        console.error("Failed to submit report:", error);
        return { success: false, message: "Failed to submit report" };
    }
}

export async function getReports(status: "PENDING" | "RESOLVED" | "DISMISSED" = "PENDING") {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await db.report.findMany({
        where: { status },
        include: {
            reporter: { select: { id: true, name: true, email: true } },
            reported: { select: { id: true, name: true, email: true, profileImage: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function resolveReport(reportId: string, outcome: "DISMISS" | "BAN") {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" || !session?.user?.id) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const report = await db.report.findUnique({ where: { id: reportId } });
        if (!report) return { success: false, message: "Report not found" };

        if (outcome === "BAN") {
            // Ban the user using existing action logic (but we call it directly here or import it)
            // We need to import `banUser` from admin-actions but `banUser` takes formData usually?
            // Let's manually ban here to refer to the report.

            await db.user.update({
                where: { id: report.reportedId },
                data: { status: "BANNED" }
            });

            await db.banLog.create({
                data: {
                    userId: report.reportedId,
                    adminId: session.user.id,
                    reason: "Report Resolved: " + report.reason,
                    status: "BANNED"
                }
            });

            await db.report.update({
                where: { id: reportId },
                data: { status: "RESOLVED", adminNotes: "User Banned" }
            });

            await logActivity(session.user.id, "RESOLVE_REPORT_BAN", { reportId, reportedId: report.reportedId });

        } else {
            await db.report.update({
                where: { id: reportId },
                data: { status: "DISMISSED", adminNotes: "Dismissed by admin" }
            });
            await logActivity(session.user.id, "RESOLVE_REPORT_DISMISS", { reportId });
        }

        revalidatePath("/admin/reports");
        return { success: true, message: "Report resolved" };

    } catch (error) {
        console.error("Failed to resolve report:", error);
        return { success: false, message: "Failed to resolve report" };
    }
}
