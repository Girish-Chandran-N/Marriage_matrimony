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
import { pusherClient } from "@/lib/pusher-client";

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
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [lastError, setLastError] = useState<any>(null);
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
        // Use the exported client instance
        // Use the exported client instance directly
        // const { pusherClient } = require("@/lib/pusher-client");

        // Deterministic Channel ID for shared conversation
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `private-chat-${sortedIds[0]}-${sortedIds[1]}`;

        console.log(`[ChatWindow] Initializing subscription to: ${channelName}`);

        // Sync initial state immediately
        setConnectionStatus(pusherClient.connection.state);

        // Log connection state changes
        pusherClient.connection.bind("state_change", (states: any) => {
            console.log("[ChatWindow] Pusher connection state:", states.current);
            setConnectionStatus(states.current);
        });

        pusherClient.connection.bind("error", (err: any) => {
            console.error("[ChatWindow] Pusher connection error:", JSON.stringify(err, null, 2));
            console.error("[ChatWindow] Error details:", err?.error?.data || err?.message || "No details");
            // Capture all possible error info
            setLastError({
                message: err?.error?.data?.message || err?.message || "Unknown Connection Error",
                type: err?.type,
                data: err?.error?.data || err?.data
            });
        });

        // Explicitly connect if disconnected
        if (pusherClient.connection.state === 'disconnected') {
            pusherClient.connect();
        }

        const channel = pusherClient.subscribe(channelName);

        channel.bind("pusher:subscription_succeeded", () => {
            console.log(`[ChatWindow] Successfully subscribed to ${channelName}`);
            setLastError(null);
        });

        channel.bind("pusher:subscription_error", (status: any) => {
            console.error(`[ChatWindow] Subscription error for ${channelName}:`, status);
            setLastError({ type: "subscription_error", ...status });
            // Check if it's a 403 or 500
            if (status?.status === 403) {
                console.error("Auth failed. Check if user is logged in and authorized.");
            }
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
            // Do not disconnect globally as other components might use it
        };
    }, [currentUserId, receiverId]);

    const handleTyping = () => {
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
                console.error("Failed to send:", result.error);
                // Ideally revert optimistic update here, skipping for simplicity
            } else {
                // Refresh to get real ID
                const fresh = await getMessages(receiverId);
                setMessages(fresh);
            }
        });
    };

    return (

        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <div className="w-16 h-16 bg-indigo-100/50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">👋</span>
                        </div>
                        <p className="text-slate-500 font-medium">Say hello to start the conversation!</p>
                    </div>
                )}

                {messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    const profileImage = msg.sender?.profileImage || "/placeholder-user.jpg";
                    const senderName = msg.sender?.name || "User";

                    return (
                        <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            {!isMe && (
                                <div className="flex-shrink-0 self-end mb-1">
                                    <Dialog>
                                        <DialogTrigger className="focus:outline-none transition-transform hover:scale-105">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={profileImage} alt={senderName} className="w-full h-full object-cover" />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="p-0 bg-transparent border-0 shadow-none">
                                            <img src={profileImage} alt={senderName} className="w-full h-auto rounded-xl" />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                                {/* Name Label */}
                                {!isMe && (
                                    <span className="text-[10px] font-semibold text-slate-400 mb-1 ml-1">
                                        {senderName}
                                    </span>
                                )}

                                {/* Message Bubble */}
                                <div className={`px-5 py-3 text-[15px] shadow-sm relative leading-relaxed ${isMe
                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-[20px] rounded-tr-sm'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-[20px] rounded-tl-sm'
                                    }`}>
                                    <p>{msg.content}</p>

                                    {/* Timestamp & Status */}
                                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${isMe ? 'text-purple-100/80 justify-end' : 'text-slate-400 justify-start'
                                        }`}>
                                        <span suppressHydrationWarning>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            <span className={msg.isRead ? "text-blue-200" : "opacity-70"}>
                                                {msg.isRead ? "✓✓" : "✓"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {isOtherUserTyping && (
                    <div className="flex gap-3 items-end animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-slate-200/50 flex-shrink-0" />
                        <div className="bg-white border border-slate-100 px-4 py-3 rounded-[20px] rounded-tl-sm shadow-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}

                <div className="h-4" /> {/* Spacer */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <Input
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-300 transition-all rounded-full h-12 pl-6 pr-12 shadow-inner text-base"
                        disabled={isPending}
                    />
                    <Button
                        type="submit"
                        disabled={isPending || !inputText.trim()}
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </Button>
                </form>
            </div>
        </div>
    );
}
