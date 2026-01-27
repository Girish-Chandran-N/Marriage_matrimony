"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { sendMessage, getMessages, markAsRead } from "@/lib/message-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function ChatWindow({
    initialMessages,
    receiverId,
    currentUserId,
    currentUserName,
    currentUserImage
}: {
    initialMessages: any[],
    receiverId: string,
    currentUserId: string,
    currentUserName: string,
    currentUserImage: string
}) {
    // ... existing hooks
    const OnlineIndicator = require("@/components/ui/online-indicator").default;

    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Mark as read on mount
    useEffect(() => {
        markAsRead(receiverId);
    }, [receiverId]);

    // Pusher Real-time Subscription
    useEffect(() => {
        // Dynamic import to avoid server-side module issues if any
        const { pusherClient } = require("@/lib/pusher-client");

        // Deterministic Channel ID for shared conversation
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

        console.log(`[ChatWindow] Subscribing to channel: ${channelName}`);

        const channel = pusherClient.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
            console.log(`[ChatWindow] Successfully subscribed to ${channelName}`);
        });

        channel.bind("pusher:subscription_error", (status: any) => {
            console.error(`[ChatWindow] Subscription error for ${channelName}:`, status);
        });

        const messageHandler = (data: any) => {
            console.log("[ChatWindow] Received new-message:", data);
            const msg = data.message;

            // Ensure it's for this conversation (redundant with shared channel but safe)
            const isRelevant =
                (msg.senderId === receiverId) ||
                (msg.senderId === currentUserId && msg.receiverId === receiverId);

            if (isRelevant) {
                setMessages((prev: any[]) => {
                    // Deduplicate
                    if (prev.find(m => m.id === msg.id)) return prev;
                    if (msg.senderId === currentUserId) return prev; // Ignore optimistic echo

                    setIsOtherUserTyping(false); // Stop typing indicator on message receive
                    return [...prev, msg];
                });

                if (msg.senderId === receiverId) markAsRead(receiverId);
            }
        };

        const typingHandler = (data: { userId: string }) => {
            // console.log("[ChatWindow] Received client-typing:", data);
            if (data.userId === receiverId) {
                setIsOtherUserTyping(true);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setIsOtherUserTyping(false), 3000);
            }
        };

        const readHandler = (data: { userId: string, partnerId: string }) => {
            console.log("[ChatWindow] Received message-read:", data);
            if (data.userId === receiverId) {
                setMessages(prev => prev.map(msg =>
                    (msg.senderId === currentUserId && !msg.isRead)
                        ? { ...msg, isRead: true }
                        : msg
                ));
            }
        };

        channel.bind("new-message", messageHandler);
        channel.bind("client-typing", typingHandler);
        channel.bind("message-read", readHandler);

        return () => {
            channel.unbind("new-message", messageHandler);
            channel.unbind("client-typing", typingHandler);
            channel.unbind("message-read", readHandler);
            pusherClient.unsubscribe(channelName);
        };
    }, [currentUserId, receiverId]);

    const handleTyping = () => {
        const { pusherClient } = require("@/lib/pusher-client");
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;
        const channel = pusherClient.subscribe(channelName);
        channel.trigger("client-typing", { userId: currentUserId });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const formData = new FormData();
        formData.append("receiverId", receiverId);
        formData.append("content", inputText);

        // Optimistically update UI
        const optimisticMsg = {
            id: "temp-" + Date.now(),
            content: inputText,
            senderId: currentUserId,
            sender: {
                id: currentUserId,
                name: currentUserName,
                profileImage: currentUserImage
            },
            createdAt: new Date(),
            isRead: false
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setInputText("");

        startTransition(async () => {
            const result = await sendMessage(formData);
            if (result.error) {
                console.error("Failed to send");
                // Ideally revert optimistic update here, skipping for simplicity
            } else {
                // Refresh to get real ID
                const fresh = await getMessages(receiverId);
                setMessages(fresh);
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm my-10">Start the conversation!</p>
                )}

                {messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    const profileLink = isMe ? "/profile" : `/profile/${msg.senderId}`;
                    const profileImage = msg.sender?.profileImage || "/placeholder-user.jpg";
                    const senderName = msg.sender?.name || "User";

                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar - Click to View Image */}
                            <div className="relative">
                                <Dialog>
                                    <DialogTrigger className="flex-shrink-0 self-end mb-1 focus:outline-none">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                                            <img
                                                src={profileImage}
                                                alt={senderName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
                                        <img
                                            src={profileImage}
                                            alt={senderName}
                                            className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                                        />
                                    </DialogContent>
                                </Dialog>
                                {!isMe && <OnlineIndicator userId={msg.senderId} size="sm" />}
                            </div>

                            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                {/* Name Label - Click to Visit Profile */}
                                {!isMe && (
                                    <a href={profileLink} className="text-xs text-gray-500 mb-1 hover:underline ml-1">
                                        {senderName}
                                    </a>
                                )}

                                <div className={`px-4 py-2 text-sm rounded-2xl shadow-sm ${isMe
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p>{msg.content}</p>
                                    <p suppressHydrationWarning className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && msg.isRead && " • Read"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Typing Indicator */}
            {isOtherUserTyping && (
                <div className="px-6 py-2 text-xs text-gray-400 italic animate-pulse">
                    {messages.find((m: any) => m.senderId === receiverId)?.sender?.name || "User"} is typing...
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                <Input
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isPending}
                />
                <Button type="submit" disabled={isPending || !inputText.trim()}>
                    Send
                </Button>
            </form>

        </div>
    );
}
