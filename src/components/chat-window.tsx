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

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ChatWindow({
    initialMessages,
    receiverId,
    receiverName,
    receiverImage,
    currentUserId,
    currentUserName,
    currentUserImage
}: {
    initialMessages: any[],
    receiverId: string,
    receiverName: string,
    receiverImage: string,
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
    const [isReceiverOnline, setIsReceiverOnline] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [lastError, setLastError] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
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
        // Deterministic Channel ID for shared conversation (Presence Channel)
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `presence-chat-${sortedIds[0]}-${sortedIds[1]}`;

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

        channel.bind("pusher:subscription_succeeded", (members: any) => {
            console.log(`[ChatWindow] Successfully subscribed to ${channelName}`);
            setLastError(null);
            // Check if receiver is online
            // members object has a 'members' property which is a map of IDs
            // The library might expose it differently depending on version, checking members.get(id)
            try {
                // @ts-ignore - Pusher JS types are sometimes tricky with members
                const isOnline = members.get(receiverId) ? true : false;
                setIsReceiverOnline(isOnline);
                console.log("[ChatWindow] Receiver online status:", isOnline);
            } catch (e) {
                console.error("Error checking members:", e);
            }
        });

        channel.bind("pusher:member_added", (member: any) => {
            if (member.id === receiverId) {
                setIsReceiverOnline(true);
                console.log("[ChatWindow] Receiver came online");
            }
        });

        channel.bind("pusher:member_removed", (member: any) => {
            if (member.id === receiverId) {
                setIsReceiverOnline(false);
                console.log("[ChatWindow] Receiver went offline");
            }
        });

        channel.bind("pusher:subscription_error", (status: any) => {
            console.error(`[ChatWindow] Subscription error for ${channelName}:`, status);
            setLastError({ type: "subscription_error", ...status });
        });

        const messageHandler = (data: any) => {
            console.log("[ChatWindow] Received new-message:", data);
            const msg = data.message;
            // ... (rest of message handling logic same as before)
            const isRelevant =
                (msg.senderId === receiverId) ||
                (msg.senderId === currentUserId && msg.receiverId === receiverId);

            if (isRelevant) {
                setMessages((prev: any[]) => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    if (msg.senderId === currentUserId) return prev;

                    setIsOtherUserTyping(false);
                    return [...prev, msg];
                });

                // Play sound if message is from receiver
                if (msg.senderId === receiverId) {
                    try {
                        const audio = new Audio("/sounds/notification.mp3");
                        audio.play().catch(e => console.error("Audio play failed:", e));
                    } catch (e) {
                        console.error("Audio creation failed:", e);
                    }
                    markAsRead(receiverId);
                }
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
            if (data.userId === receiverId) {
                setMessages(prev => prev.map(msg =>
                    (msg.senderId === currentUserId && !msg.isRead) ? { ...msg, isRead: true } : msg
                ));
            }
        };

        channel.bind("new-message", messageHandler);
        channel.bind("client-typing", typingHandler);
        channel.bind("message-read", readHandler);

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(channelName);
        };
    }, [currentUserId, receiverId]);

    const handleTyping = () => {
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `presence-chat-${sortedIds[0]}-${sortedIds[1]}`;
        const channel = pusherClient.subscribe(channelName);
        channel.trigger("client-typing", { userId: currentUserId });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        // Keep focus
        inputRef.current?.focus();

        if (!inputText.trim()) return;

        const content = inputText;
        const formData = new FormData();
        formData.append("receiverId", receiverId);
        formData.append("content", content);

        // Optimistically update UI
        const optimisticMsg = {
            id: "temp-" + Date.now(),
            content: content,
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
                // Ideally revert...
            } else {
                // Refresh
                const fresh = await getMessages(receiverId);
                setMessages(fresh);
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-indigo-50/50 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                {/* Back Button - Mobile Only */}
                <Link href="/messages" className="md:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -ml-2 text-slate-500">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                {/* Profile Info */}
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <Dialog>
                        <DialogTrigger className="focus:outline-none group relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                                <img
                                    src={receiverImage}
                                    alt={receiverName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {isReceiverOnline && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none outline-none">
                            <img
                                src={receiverImage}
                                alt={receiverName}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            />
                        </DialogContent>
                    </Dialog>

                    <Link href={`/users/${receiverId}`} className="hover:opacity-80 transition-opacity flex-1 min-w-0">
                        <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">{receiverName}</h1>
                        {isReceiverOnline && (
                            <p className="text-[10px] md:text-xs font-medium text-emerald-600 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                            </p>
                        )}
                    </Link>
                </div>
            </div>

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
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-300 transition-all rounded-full h-12 pl-6 pr-12 shadow-inner text-base"
                    />
                    <Button
                        type="submit"
                        disabled={!inputText.trim()}
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
