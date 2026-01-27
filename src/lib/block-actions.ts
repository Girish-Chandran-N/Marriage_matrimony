"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function blockUser(userIdToBlock: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const blockerId = session.user.id;

    if (blockerId === userIdToBlock) throw new Error("You cannot block yourself");

    try {
        await db.block.create({
            data: {
                blockerId,
                blockedId: userIdToBlock,
            },
        });

        revalidatePath("/matches");
        revalidatePath(`/users/${userIdToBlock}`);
        return { success: true };
    } catch (error) {
        console.error("Error blocking user:", error);
        return { success: false, error: "Failed to block user" };
    }
}

export async function unblockUser(userIdToUnblock: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const blockerId = session.user.id;

    try {
        await db.block.delete({
            where: {
                blockerId_blockedId: {
                    blockerId,
                    blockedId: userIdToUnblock
                }
            }
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Error unblocking user:", error);
        return { success: false, error: "Failed to unblock user" };
    }
}

export async function getBlockedUsers() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const blocks = await db.block.findMany({
        where: { blockerId: session.user.id },
        include: {
            blocked: {
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    careerProfile: {
                        select: { jobTitle: true, companyName: true }
                    }
                }
            }
        }
    });

    return blocks.map((block) => block.blocked);
}
