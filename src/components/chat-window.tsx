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
import { ArrowLeft, Lock, Phone, Video, Mic, ShieldCheck } from "lucide-react";
import { useActiveUsers } from "@/contexts/active-users-context";

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
    const { members } = useActiveUsers();

    // Derived state from global context
    const isReceiverOnline = members.includes(receiverId);

    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState("");
    const [isPending, startTransition] = useTransition();
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const [lastError, setLastError] = useState<any>(null);
    const scrollRefMobile = useRef<HTMLDivElement>(null);
    const scrollRefDesktop = useRef<HTMLDivElement>(null);
    const inputRefMobile = useRef<HTMLInputElement>(null);
    const inputRefDesktop = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const [chatBlocked, setChatBlocked] = useState<string | null>(null);
    const [intentAccepted, setIntentAccepted] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRefMobile.current) scrollRefMobile.current.scrollTop = scrollRefMobile.current.scrollHeight;
        if (scrollRefDesktop.current) scrollRefDesktop.current.scrollTop = scrollRefDesktop.current.scrollHeight;
    }, [messages]);

    // Mark as read on mount
    useEffect(() => {
        markAsRead(receiverId);
    }, [receiverId]);

    // Pusher Real-time Subscription
    useEffect(() => {
        const sortedIds = [currentUserId, receiverId].sort();
        const channelName = `presence-chat-${sortedIds[0]}-${sortedIds[1]}`;

        pusherClient.connection.bind("state_change", (states: any) => {
            setConnectionStatus(states.current);
        });

        pusherClient.connection.bind("error", (err: any) => {
            setLastError({
                message: err?.error?.data?.message || err?.message || "Unknown Connection Error",
                type: err?.type,
                data: err?.error?.data || err?.data
            });
        });

        if (pusherClient.connection.state === 'disconnected') {
            pusherClient.connect();
        }

        const channel = pusherClient.subscribe(channelName);

        const messageHandler = (data: any) => {
            const msg = data.message;
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
        inputRefMobile.current?.focus();
        inputRefDesktop.current?.focus();

        if (!inputText.trim()) return;

        const content = inputText;
        const formData = new FormData();
        formData.append("receiverId", receiverId);
        formData.append("content", content);

        const tempId = "temp-" + Date.now();
        const optimisticMsg = {
            id: tempId,
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
            if (result?.error === "UPGRADE_REQUIRED") {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                setInputText(content);
                setChatBlocked(result.message || "Upgrade your plan to send messages.");
            } else if (result?.error) {
                console.error("Failed to send:", result.error);
                setMessages(prev => prev.filter(m => m.id !== tempId));
                setInputText(content);
            } else {
                const fresh = await getMessages(receiverId);
                setMessages(fresh);
            }
        });
    };

    return (
        <>
            {/* === MOBILE NATIVE APP VIEW === */}
            <div className="flex lg:hidden flex-col h-full bg-[#09090b]">
                {/* Header */}
                <div className="p-3 md:p-4 border-b border-[#222] flex items-center gap-3 bg-[#121214]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                    <Link href="/messages" className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -ml-2 text-slate-400 hover:bg-[#222] hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <Dialog>
                            <DialogTrigger className="focus:outline-none group relative shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                                    <img src={receiverImage} alt={receiverName} className="w-full h-full object-cover" />
                                </div>
                                {isReceiverOnline && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none outline-none">
                                <img src={receiverImage} alt={receiverName} className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl" />
                            </DialogContent>
                        </Dialog>

                        <Link href={`/users/${receiverId}`} className="hover:opacity-80 transition-opacity flex-1 min-w-0">
                            <h1 className="text-base md:text-lg font-bold text-white truncate">{receiverName}</h1>
                            {isReceiverOnline && (
                                <p className="text-[10px] md:text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                                </p>
                            )}
                        </Link>
                    </div>

                    <div className="flex gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-rose-500 hover:bg-[#222]" onClick={() => alert("Premium feature: Voice calls coming soon!")}>
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-400 hover:text-rose-500 hover:bg-[#222]" onClick={() => alert("Premium feature: Video calls coming soon!")}>
                            <Video className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRefMobile} className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
                            {!intentAccepted ? (
                                <div className="bg-[#121214] p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-[#222] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-[#1f1f23] text-rose-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Chat Intent Gate</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-2">
                                        Premly is built for serious, intention-driven relationships. Please confirm you are looking for a meaningful connection before chatting.
                                    </p>
                                    <Button onClick={() => setIntentAccepted(true)} className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-bold shadow-md shadow-rose-500/20">
                                        Yes, I'm serious
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="w-16 h-16 bg-[#1f1f23] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                                        <span className="text-3xl">👋</span>
                                    </div>
                                    <p className="text-white font-semibold mb-6">Start with an Icebreaker!</p>
                                    <div className="flex flex-col gap-3">
                                        <Button variant="outline" className="rounded-full text-slate-300 border-[#333] bg-[#121214] hover:bg-[#1f1f23] hover:text-white transition-colors h-auto py-2.5 px-4 whitespace-normal text-left justify-start shadow-sm" onClick={() => setInputText("Hi there! What does marriage mean to you?")}>What does marriage mean to you?</Button>
                                        <Button variant="outline" className="rounded-full text-slate-300 border-[#333] bg-[#121214] hover:bg-[#1f1f23] hover:text-white transition-colors h-auto py-2.5 px-4 whitespace-normal text-left justify-start shadow-sm" onClick={() => setInputText("Hey! How involved is your family in this process?")}>How involved is your family in this process?</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {messages.map((msg: any) => {
                        const isMe = msg.senderId === currentUserId;
                        const profileImage = msg.sender?.profileImage || "/placeholder-user.jpg";
                        const senderName = msg.sender?.name || "User";

                        return (
                            <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isMe && (
                                    <div className="flex-shrink-0 self-end mb-1">
                                        <Dialog>
                                            <DialogTrigger className="focus:outline-none transition-transform hover:scale-105">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#333] shadow-sm">
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
                                    {!isMe && <span className="text-[10px] font-semibold text-slate-400 mb-1 ml-1">{senderName}</span>}
                                    <div className={`px-5 py-3 text-[15px] shadow-sm relative leading-relaxed ${isMe ? 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white rounded-[20px] rounded-tr-sm' : 'bg-[#1f1f23] text-white rounded-[20px] rounded-tl-sm'}`}>
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${isMe ? 'text-pink-100/80 justify-end' : 'text-slate-400 justify-start'}`}>
                                            <span suppressHydrationWarning>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {isMe && <span className={msg.isRead ? "text-blue-200" : "opacity-70"}>{msg.isRead ? "✓✓" : "✓"}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isOtherUserTyping && (
                        <div className="flex gap-3 items-end animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-full bg-[#1f1f23] flex-shrink-0" />
                            <div className="bg-[#1f1f23] px-4 py-3 rounded-[20px] rounded-tl-sm shadow-sm flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#121214]/80 backdrop-blur-md border-t border-[#222] z-20">
                    {chatBlocked && (
                        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 text-sm mb-3">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-amber-200 flex-1 text-xs">{chatBlocked}</span>
                            <a href="/pricing" className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Upgrade</a>
                        </div>
                    )}
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                        <Input
                            ref={inputRefMobile}
                            value={inputText}
                            onChange={(e) => { setInputText(e.target.value); handleTyping(); }}
                            placeholder="Type a message..."
                            disabled={!!chatBlocked || (messages.length === 0 && !intentAccepted)}
                            className="flex-1 bg-[#1a1a1a] border-[#333] focus:bg-[#222] focus:border-rose-500 text-white transition-all rounded-full h-12 pl-6 pr-[80px] shadow-inner text-base disabled:opacity-60 placeholder:text-slate-500"
                        />
                        <div className="absolute right-14 top-1/2 -translate-y-1/2">
                            <Button type="button" variant="ghost" size="icon" disabled={!!chatBlocked || (messages.length === 0 && !intentAccepted)} className="rounded-full w-10 h-10 text-slate-500 hover:text-rose-500 hover:bg-[#222] disabled:opacity-50" onClick={() => alert("Premium Feature: Voice notes coming soon!")}>
                                <Mic className="w-5 h-5" />
                            </Button>
                        </div>
                        <Button type="submit" disabled={!inputText.trim() || !!chatBlocked} className="rounded-full w-12 h-12 p-0 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none bg-gradient-to-tr from-rose-500 to-pink-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
                        </Button>
                    </form>
                </div>
            </div>

            {/* === DESKTOP WEB VIEW === */}
            <div className="hidden lg:flex flex-col h-full bg-slate-50/50">
                <div className="p-3 md:p-4 border-b border-indigo-50/50 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <Dialog>
                            <DialogTrigger className="focus:outline-none group relative shrink-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                                    <img src={receiverImage} alt={receiverName} className="w-full h-full object-cover" />
                                </div>
                                {isReceiverOnline && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none outline-none">
                                <img src={receiverImage} alt={receiverName} className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl" />
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

                <div ref={scrollRefDesktop} className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto space-y-6">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                            <div className="w-16 h-16 bg-indigo-100/50 rounded-full flex items-center justify-center mb-4"><span className="text-2xl">👋</span></div>
                            <p className="text-slate-500 font-medium">Say hello to start the conversation!</p>
                        </div>
                    )}

                    {messages.map((msg: any) => {
                        const isMe = msg.senderId === currentUserId;
                        const profileImage = msg.sender?.profileImage || "/placeholder-user.jpg";
                        const senderName = msg.sender?.name || "User";
                        return (
                            <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
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
                                    {!isMe && <span className="text-[10px] font-semibold text-slate-400 mb-1 ml-1">{senderName}</span>}
                                    <div className={`px-5 py-3 text-[15px] shadow-sm relative leading-relaxed ${isMe ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-[20px] rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-[20px] rounded-tl-sm'}`}>
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${isMe ? 'text-purple-100/80 justify-end' : 'text-slate-400 justify-start'}`}>
                                            <span suppressHydrationWarning>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {isMe && <span className={msg.isRead ? "text-blue-200" : "opacity-70"}>{msg.isRead ? "✓✓" : "✓"}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

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
                    <div className="h-4" />
                </div>

                <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-20">
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                        <Input
                            ref={inputRefDesktop}
                            value={inputText}
                            onChange={(e) => { setInputText(e.target.value); handleTyping(); }}
                            placeholder="Type a message..."
                            className="flex-1 bg-slate-50 border-slate-200 focus:bg-white focus:border-purple-300 transition-all rounded-full h-12 pl-6 pr-12 shadow-inner text-base"
                        />
                        <Button type="submit" disabled={!inputText.trim()} className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-purple-600 to-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
