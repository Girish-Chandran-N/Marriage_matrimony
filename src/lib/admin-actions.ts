"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AccountStatus, Prisma, RequestStatus, Role, VerificationAction } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendVerificationStatusEmail } from "./mail";

export async function getPendingRequests() {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
        throw new Error("Unauthorized");
    }

    try {
        const requests = await db.verificationRequest.findMany({
            where: {
                status: RequestStatus.PENDING,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                careerProfile: {
                    select: {
                        jobTitle: true,
                        companyName: true,
                        industry: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });
        return requests;
    } catch (error) {
        console.error("Failed to fetch pending requests:", error);
        throw new Error("Failed to fetch requests");
    }
}

export type PendingRequest = Awaited<ReturnType<typeof getPendingRequests>>[number];


export async function updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    adminNotes?: string
) {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await db.$transaction(async (tx) => {
            // 1. Update the request status
            const request = await tx.verificationRequest.update({
                where: { id: requestId },
                data: {
                    status,
                    adminNotes,
                },
            });

            // 2. If APPROVED, mark the CareerProfile as verified
            if (status === RequestStatus.APPROVED) {
                await tx.careerProfile.update({
                    where: { id: request.careerProfileId },
                    data: {
                        isVerified: true,
                    },
                });
            }
        });

        revalidatePath("/admin");
        return { success: true, message: `Request ${status.toLowerCase()} successfully` };
    } catch (error) {
        console.error("Failed to update request:", error);
        return { success: false, message: "Failed to update request" };
    }
}

export async function getSystemStats() {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
        throw new Error("Unauthorized");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const [userCount, verifiedCount, newSignupsToday, pendingCount, latestRequests] = await Promise.all([
            db.user.count(),
            db.careerProfile.count({ where: { isVerified: true } }),
            db.user.count({
                where: {
                    createdAt: {
                        gte: today
                    }
                }
            }),
            db.verificationRequest.count({ where: { status: RequestStatus.PENDING } }),
            db.verificationRequest.findMany({
                where: { status: RequestStatus.PENDING },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        }
                    },
                    careerProfile: { // Fetch simplified career info for the preview
                        select: {
                            jobTitle: true,
                            companyName: true
                        }
                    }
                }
            })
        ]);

        return {
            totalUsers: userCount,
            verifiedProfiles: verifiedCount,
            newSignupsToday,
            pendingRequests: pendingCount,
            latestRequests
        };
    } catch (error) {
        console.error("Failed to fetch system stats:", error);
        throw new Error("Failed to fetch system stats");
    }
}

export async function getAllUsers() {
    const session = await auth();

    if (session?.user?.role !== Role.ADMIN) {
        throw new Error("Unauthorized");
    }

    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                careerProfile: {
                    select: {
                        isVerified: true
                    }
                }
            }
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw new Error("Failed to fetch users");
    }
}



const userDetailsValidator = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: {
        personalDetails: true,
        careerProfile: true,
        familyDetails: true,
        banLogs: {
            orderBy: { createdAt: 'desc' }
        },
        verificationRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1
        }
    }
});

export type UserDetails = Prisma.UserGetPayload<typeof userDetailsValidator>;

export async function getUserDetails(userId: string) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) throw new Error("Unauthorized");

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            ...userDetailsValidator
        });
        return user;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        throw new Error("Failed to fetch user details");
    }
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) return { success: false, message: "Unauthorized" };

    try {
        await db.user.delete({
            where: { id: userId }
        });

        revalidatePath("/admin/users");
        revalidatePath("/admin");
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, message: "Failed to delete user" };
    }
}



export async function updateUserStatus(userId: string, status: AccountStatus, reason: string) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) return { success: false, message: "Unauthorized" };

    try {
        await db.$transaction(async (tx) => {
            // 1. Update User Status
            await tx.user.update({
                where: { id: userId },
                data: { status }
            });

            // 2. Create Ban Log if status is not ACTIVE
            if (status !== AccountStatus.ACTIVE) {
                await tx.banLog.create({
                    data: {
                        userId,
                        adminId: session.user.id!,
                        status,
                        reason
                    }
                });
            }
        });

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/admin/users");
        return { success: true, message: `User status updated to ${status}` };
    } catch (error) {
        console.error("Failed to update user status:", error);
        return { success: false, message: "Failed to update status" };
    }
}

export async function updateUserRole(userId: string, role: Role) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) return { success: false, message: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: userId },
            data: { role }
        });

        revalidatePath(`/admin/users/${userId}`);
        revalidatePath("/admin/users");
        return { success: true, message: `User role updated to ${role}` };
    } catch (error) {
        console.error("Failed to update user role:", error);
        return { success: false, message: "Failed to update role" };
    }
}



const verificationRequestDetails = Prisma.validator<Prisma.VerificationRequestDefaultArgs>()({
    include: {
        user: {
            select: {
                name: true,
                email: true,
            }
        },
        careerProfile: true,
        logs: {
            orderBy: { createdAt: 'desc' },
            include: {
                admin: {
                    select: { name: true }
                }
            }
        }
    }
});

export type VerificationRequestDetail = Prisma.VerificationRequestGetPayload<typeof verificationRequestDetails>;

export async function getVerificationRequest(requestId: string) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) throw new Error("Unauthorized");

    try {
        const request = await db.verificationRequest.findUnique({
            where: { id: requestId },
            ...verificationRequestDetails
        });
        return request;
    } catch (error) {
        console.error("Failed to fetch verification request:", error);
        throw new Error("Failed to fetch request");
    }
}

export async function processVerification(
    requestId: string,
    action: VerificationAction,
    notes?: string
) {
    const session = await auth();
    if (session?.user?.role !== Role.ADMIN) return { success: false, message: "Unauthorized" };

    const status = action === VerificationAction.APPROVED ? RequestStatus.APPROVED : RequestStatus.REJECTED;

    try {
        await db.$transaction(async (tx) => {
            // 1. Update Request
            const request = await tx.verificationRequest.update({
                where: { id: requestId },
                data: {
                    status,
                    adminNotes: notes
                }
            });

            // 2. Update Career Profile if Approved
            if (action === VerificationAction.APPROVED) {
                await tx.careerProfile.update({
                    where: { id: request.careerProfileId },
                    data: { isVerified: true }
                });
            } else if (action === VerificationAction.REJECTED) {
                // Ensure it is marked not verified if previously verified (edge case)
                await tx.careerProfile.update({
                    where: { id: request.careerProfileId },
                    data: { isVerified: false }
                });
            }

            // 3. Create Verification Log
            await tx.verificationLog.create({
                data: {
                    requestId,
                    adminId: session.user.id!,
                    action,
                    notes
                }
            });
        });

        // 4. Send Email Notification (Async)
        const requestWithUser = await db.verificationRequest.findUnique({
            where: { id: requestId },
            select: { user: { select: { email: true } } }
        });

        if (requestWithUser?.user?.email) {
            const emailStatus = action === VerificationAction.APPROVED ? "APPROVED" : "REJECTED";
            // Fire and forget or await? Await to catch errors for now, but don't block return
            try {
                await sendVerificationStatusEmail(requestWithUser.user.email, emailStatus, notes);
            } catch (emailError) {
                console.error("Failed to send verification email:", emailError);
                // Don't fail the action if email fails
            }
        }

        revalidatePath(`/admin/verification/${requestId}`);
        revalidatePath("/admin/verification");
        revalidatePath("/admin");

        return { success: true, message: `Request processed: ${action}` };
    } catch (error) {
        console.error("Failed to process verification:", error);
        return { success: false, message: "Processing failed" };
    }
}



