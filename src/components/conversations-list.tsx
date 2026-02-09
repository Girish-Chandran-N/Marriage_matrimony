"use client";

import { useActiveUsers } from "@/contexts/active-users-context";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";

export function ConversationsList({ initialConversations }: { initialConversations: any[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const { members } = useActiveUsers();

    const filteredConversations = initialConversations.filter((conv: any) =>
        conv.partner.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white/40 backdrop-blur-md border-r border-slate-100">
            {/* Header / Search */}
            <div className="p-4 pt-6 border-b border-slate-100/50">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 px-1 tracking-tight">Messages</h2>
                <div className="relative group">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/60 border border-slate-200 rounded-2xl h-11 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500/10 focus:border-purple-300 transition-all font-medium placeholder:text-slate-400 outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredConversations.length === 0 ? (
                    <div className="text-center p-8 mt-10 opacity-50">
                        <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">No results found</p>
                    </div>
                ) : (
                    filteredConversations.map((conv: any) => {
                        const isActive = pathname === `/messages/${conv.partner.id}`;
                        const isOnline = members.includes(conv.partner.id);

                        return (
                            <Link
                                key={conv.partner.id}
                                href={`/messages/${conv.partner.id}`}
                                className={`group relative block p-3.5 rounded-2xl transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20 translate-x-1"
                                    : "hover:bg-white hover:shadow-md hover:translate-x-1"
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="relative">
                                        <Avatar className={`h-12 w-12 border-[2.5px] ${isActive ? 'border-white/30' : 'border-white'} shadow-sm`}>
                                            <AvatarImage src={conv.partner.profileImage || "/placeholder-user.jpg"} className="object-cover" />
                                            <AvatarFallback className={isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600 font-bold"}>
                                                {conv.partner.name?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Online Dot */}
                                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 rounded-full transition-colors duration-300 ${isActive
                                            ? isOnline ? 'border-purple-600 bg-green-400' : 'border-purple-600 bg-slate-400/50'
                                            : isOnline ? 'border-white bg-green-500' : 'border-white bg-slate-300'
                                            }`}></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold text-[15px] truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                                {conv.partner.name || "Unknown"}
                                            </h3>
                                            <span
                                                suppressHydrationWarning
                                                className={`text-[11px] font-medium ${isActive ? 'text-purple-200' : 'text-slate-400'}`}
                                            >
                                                {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm truncate max-w-[150px] ${isActive ? 'text-purple-100/90' :
                                                conv.unreadCount > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'
                                                }`}>
                                                {conv.lastMessage.content}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${isActive
                                                    ? "bg-white text-purple-600"
                                                    : "bg-purple-600 text-white shadow-purple-200"
                                                    }`}>
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
