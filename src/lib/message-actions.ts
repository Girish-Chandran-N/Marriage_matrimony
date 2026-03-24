"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendNewMessageEmail } from "@/lib/mail";
import { checkCanChat } from "@/lib/subscription-actions";

const SendMessageSchema = z.object({
    receiverId: z.string().min(1),
    content: z.string().min(1, "Message cannot be empty"),
});

export async function sendMessage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validation = SendMessageSchema.safeParse({
        receiverId: formData.get("receiverId"),
        content: formData.get("content"),
    });

    if (!validation.success) {
        return { error: "Invalid message data" };
    }

    const { receiverId, content } = validation.data;
    const senderId = session.user.id;

    // Verify both users exist before transaction
    const [senderExists, receiverExists] = await Promise.all([
        db.user.findUnique({ where: { id: senderId }, select: { id: true } }),
        db.user.findUnique({ where: { id: receiverId }, select: { id: true } })
    ]);

    if (!senderExists) return { error: "Sender account not found" };
    if (!receiverExists) return { error: `Receiver account (ID: ${receiverId}) not found` };

    // ── Plan limit check: chat requires a paid plan ────────────────────────────
    const chatCheck = await checkCanChat(senderId);
    if (!chatCheck.allowed) {
        return { error: chatCheck.error, message: chatCheck.message };
    }

    try {
        // Use a transaction to ensure Conversation existence and Message creation happen atomically
        let isNewConversation = false;
        const message = await db.$transaction(async (tx) => {
            // 1. Find existing conversation OR create new one
            let conversation = await tx.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { id: senderId } } },
                        { participants: { some: { id: receiverId } } }
                    ]
                }
            });

            if (!conversation) {
                isNewConversation = true;
                conversation = await tx.conversation.create({
                    data: {
                        participants: {
                            connect: [{ id: senderId }, { id: receiverId }]
                        }
                    }
                });
            }

            // 2. Create the message linked to the conversation
            const newMessage = await tx.message.create({
                data: {
                    senderId,
                    receiverId,
                    content,
                    conversationId: conversation.id
                }
            });

            // 3. Update Conversation lastMessage
            await tx.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessageId: newMessage.id,
                    updatedAt: new Date()
                }
            });

            return newMessage;
        });

        revalidatePath(`/messages/${receiverId}`);
        revalidatePath("/messages");

        // Fire-and-forget: email the receiver only on the first message (new conversation)
        if (isNewConversation) {
            Promise.all([
                db.user.findUnique({ where: { id: receiverId }, select: { email: true, name: true } }),
                db.user.findUnique({ where: { id: senderId }, select: { name: true } })
            ]).then(([receiver, sender]) => {
                if (receiver?.email && receiver?.name && sender?.name) {
                    sendNewMessageEmail(receiver.email, receiver.name, sender.name, content);
                }
            }).catch(() => {});
        }

        // Trigger Real-time Event
        try {
            const { pusherServer } = await import("@/lib/pusher");

            // Deterministic Channel ID
            const sortedIds = [senderId, receiverId].sort();
            const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

            await pusherServer.trigger(channelName, "new-message", {
                message: {
                    ...message,
                    sender: {
                        id: session.user.id,
                        name: session.user.name,
                        profileImage: session.user.image,
                    }
                }
            });
        } catch (error) {
            console.error("Pusher Trigger Error:", error);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to send message:", error);
        return { error: "Failed to send message: " + (error instanceof Error ? error.message : String(error)) };
    }
}

export async function getConversations() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userId = session.user.id;

    try {
        const conversations = await db.conversation.findMany({
            where: {
                participants: { some: { id: userId } }
            },
            include: {
                participants: {
                    where: { id: { not: userId } },
                    select: { id: true, name: true, email: true, profileImage: true }
                },
                lastMessage: true,
                _count: {
                    select: {
                        messages: {
                            where: {
                                isRead: false,
                                senderId: { not: userId }
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return conversations.map(conv => {
            const partner = conv.participants[0] || {
                id: "unknown",
                name: "Unknown User",
                email: "",
                profileImage: null
            };

            return {
                partner,
                lastMessage: conv.lastMessage,
                unreadCount: conv._count.messages
            };
        });
    } catch (error) {
        console.error("Failed to get conversations:", error);
        return [];
    }
}

export async function getMessages(otherUserId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await db.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: session.user.id }
            ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: { select: { id: true, name: true, profileImage: true } }
        }
    });
}

export async function markAsRead(senderId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db.message.updateMany({
        where: {
            senderId: senderId,
            receiverId: session.user.id,
            isRead: false
        },
        data: { isRead: true }
    });

    // Trigger Real-time Event: message-read
    try {
        const { pusherServer } = await import("@/lib/pusher");
        const sortedIds = [session.user.id, senderId].sort();
        const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

        await pusherServer.trigger(channelName, "message-read", {
            userId: session.user.id, // Who read the messages
            partnerId: senderId
        });
    } catch (error) {
        console.error("Pusher Read Trigger Error:", error);
    }

    revalidatePath("/messages");
}
