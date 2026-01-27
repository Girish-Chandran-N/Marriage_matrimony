import { auth } from "@/auth";
import { getConversations } from "@/lib/message-actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MessagesPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const conversations = await getConversations();

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-50 via-indigo-50 to-transparent"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-5xl mx-auto p-6 md:p-8 relative z-10 h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            Messages
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                            </span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Your conversations</p>
                    </div>
                </div>

                <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden flex flex-col">
                    {conversations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-bounce">
                                <MessageCircle className="w-10 h-10 text-purple-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">No messages yet</h2>
                            <p className="text-slate-500 max-w-sm mb-8">Connect with matches to start a conversation! The best stories start with a "Hi".</p>
                            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200">
                                <Link href="/matches">Find Matches</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {/* Search Bar Placeholder */}
                            <div className="relative mb-6 px-2">
                                <Search className="absolute left-6 top-3.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full bg-slate-100/50 border-0 rounded-2xl h-11 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-500/20 transition-all font-medium placeholder:text-slate-400"
                                />
                            </div>

                            {conversations.map((conv: any, i: number) => (
                                <Link
                                    key={conv.partner.id}
                                    href={`/messages/${conv.partner.id}`}
                                    className="group block p-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 border border-transparent hover:border-slate-100 animate-in slide-in-from-bottom-2 fill-mode-both"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="w-14 h-14 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                                    <AvatarImage src={conv.partner.profileImage || "/placeholder-user.jpg"} className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 font-bold text-lg">
                                                        {conv.partner.name?.[0] || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Online Status Indicator (Fake for now) */}
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">{conv.partner.name || "Unknown User"}</h3>
                                                <p className={`text-sm mt-0.5 line-clamp-1 max-w-[200px] md:max-w-xs ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                    {conv.unreadCount > 0 && <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>}
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                                {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-blue-200">
                                                    {conv.unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
