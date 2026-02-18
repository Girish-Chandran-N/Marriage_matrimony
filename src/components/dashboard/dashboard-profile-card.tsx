"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Camera, CheckCircle2, ChevronRight, Crown, Edit2, ShieldCheck, Sparkles } from "lucide-react";

interface DashboardProfileCardProps {
    user: any;
    dbUser: any;
}

export function DashboardProfileCard({ user, dbUser }: DashboardProfileCardProps) {
    // Mock completeness - in real app, calculate this
    const completeness = 90;

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-indigo-100/50 border border-white/60 h-full flex flex-col relative overflow-hidden group">
            {/* Top Pattern / Gradient */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-indigo-50 via-purple-50 to-transparent opacity-80 pointer-events-none" />

            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl" />
            <div className="absolute top-10 -left-10 w-24 h-24 bg-purple-100/50 rounded-full blur-2xl" />

            {/* Header - Moved here */}
            <div className="relative z-10 mb-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 mb-1">
                    Dashboard
                    <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-100" />
                </h1>
                <p className="text-sm text-slate-500 font-medium truncate">
                    Welcome back, <span className="text-indigo-600 font-bold">{user?.name?.split(' ')[0]}</span>! 👋
                </p>
            </div>

            {/* Profile Image Container */}
            <div className="relative mx-auto mb-6 mt-2">
                <div className="w-44 h-52 rounded-[28px] overflow-hidden border-[6px] border-white shadow-2xl shadow-indigo-200/50 relative z-10 group-hover:scale-[1.02] transition-transform duration-500">
                    {dbUser?.profileImage || user?.image ? (
                        <img
                            src={dbUser?.profileImage || user?.image}
                            alt={user?.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    )}

                    {/* Hover Overlay for Edit */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-white/90 text-slate-900 hover:bg-white shadow-lg transform scale-90 group-hover:scale-100 transition-all" asChild>
                            <Link href="/profile">
                                <Edit2 className="w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Verification Badge - Floating */}
                <div className="absolute -bottom-4 -right-4 z-20 animate-in zoom-in duration-500 delay-300" style={{ animationFillMode: 'both' }}>
                    <div className="bg-white p-2 rounded-full shadow-lg shadow-blue-100">
                        <CheckCircle2 className="w-8 h-8 text-blue-500 fill-blue-50" />
                    </div>
                </div>
            </div>

            {/* Name & ID */}
            <div className="text-center mb-6 relative z-10">
                <h2 className="text-2xl font-black text-slate-900 mb-1 flex items-center justify-center gap-2">
                    {user?.name}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID: {user?.id?.slice(0, 8).toUpperCase()}</span>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide shadow-sm shadow-emerald-100/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Membership: {dbUser?.subscription?.plan || "FREE"}
                    </div>
                </div>
            </div>

            {/* Member since/expiry */}
            <div className="grid grid-cols-2 gap-2 text-center mb-auto bg-slate-50/50 rounded-2xl p-3 border border-slate-100 items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Joined</span>
                    <span className="text-xs font-bold text-slate-700">
                        {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString('en-GB') : "N/A"}
                    </span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-2 h-full justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Expires</span>
                    {dbUser?.subscription?.plan && dbUser.subscription.plan !== "FREE" ? (
                        <span className="text-xs font-bold text-slate-700">
                            {new Date(dbUser.subscription.endDate).toLocaleDateString('en-GB')}
                        </span>
                    ) : (
                        <Button variant="link" className="h-auto p-0 text-[10px] font-extrabold text-indigo-600 hover:text-indigo-700 uppercase tracking-tight" asChild>
                            <Link href="/pricing">Upgrade Plan</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Bottom Banner - Premium Gradient */}
            <Link href="/matches/preferences" className="mt-6 group/banner relative overflow-hidden rounded-2xl shadow-lg shadow-rose-200/50 hover:shadow-xl hover:shadow-rose-300/50 transition-all duration-300 hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transition-transform duration-500 group-hover/banner:scale-110" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <div className="relative p-4 flex items-center gap-4">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                        <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                    <div className="flex-1 text-white">
                        <p className="text-[10px] font-bold uppercase opacity-90 mb-0.5 tracking-wide">Update Preferences</p>
                        <p className="text-xs font-bold leading-tight text-white drop-shadow-sm">
                            Influence your matches
                        </p>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm group-hover/banner:translate-x-1 transition-transform border border-white/10">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
