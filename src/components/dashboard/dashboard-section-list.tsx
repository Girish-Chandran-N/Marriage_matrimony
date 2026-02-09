"use client";

import { MatchCard } from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DashboardSectionListProps {
    title: string;
    items: any[];
    userKey: string; // The key to find the User object in the item (e.g., 'sender', 'receiver', 'user')
    emptyMessage: string;
}

export function DashboardSectionList({ title, items, userKey, emptyMessage }: DashboardSectionListProps) {

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 via-indigo-50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                        <p className="text-slate-500 font-medium">{items.length} profiles found</p>
                    </div>
                </div>

                {/* Grid */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-slate-700">{emptyMessage}</h3>
                        <p className="text-slate-400">Activity will appear here once you start interacting.</p>
                        <Link href="/matches">
                            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                                Explore Matches
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {items.map((item, idx) => {
                            const user = item[userKey];
                            const score = item.score || 0;
                            // Sometimes item IS the user (New Matches), sometimes it contains the user
                            const actualUser = user || item;

                            return (
                                <div key={actualUser.id || idx} style={{ animationDelay: `${idx * 50}ms` }} className="fill-mode-both">
                                    <MatchCard user={actualUser} score={score} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
