"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Contact, Eye, EyeOff, Heart, Sparkles, Telescope, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsGridProps {
    stats: {
        interestSent: number;
        interestReceived: number;
        profileViews: number;
        profileVisited: number;
        shortlisted: number;
        contactsViewed: number;
        contactsVisited: number;
        newMatches: number;
        blockedUsers: number;
    };
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
    const STATS_ITEMS = [
        {
            title: "Interest Sent",
            value: stats.interestSent,
            className: "bg-[#1f1f23] border-[#333] hover:border-blue-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-blue-500",
            href: "/dashboard/interests/sent",
            icon: ArrowUpRight
        },
        {
            title: "Interest Received",
            value: stats.interestReceived,
            className: "bg-[#1f1f23] border-[#333] hover:border-pink-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-pink-400 to-pink-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-pink-500",
            href: "/dashboard/interests/received",
            icon: ArrowDownLeft
        },
        {
            title: "Profile Views",
            value: stats.profileViews,
            className: "bg-[#1f1f23] border-[#333] hover:border-purple-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-purple-500",
            href: "/dashboard/profile-views",
            icon: Eye
        },
        {
            title: "Profile Visited",
            value: stats.profileVisited,
            className: "bg-[#1f1f23] border-[#333] hover:border-indigo-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-indigo-500",
            href: "/dashboard/profile-visited",
            icon: Telescope
        },
        {
            title: "Shortlisted",
            value: stats.shortlisted,
            className: "bg-[#1f1f23] border-[#333] hover:border-rose-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-rose-400 to-rose-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-rose-500",
            href: "/dashboard/shortlisted",
            icon: Heart
        },
        {
            title: "Contacts Viewed",
            value: stats.contactsViewed,
            className: "bg-[#1f1f23] border-[#333] hover:border-teal-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-teal-400 to-teal-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-teal-500",
            href: "/dashboard/contacts-viewed",
            icon: Contact
        },
        {
            title: "Contacts Visited",
            value: stats.contactsVisited,
            className: "bg-[#1f1f23] border-[#333] hover:border-cyan-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-cyan-500",
            href: "/dashboard/contacts-visited",
            icon: Users
        },
        {
            title: "Ignored/Blocked",
            value: stats.blockedUsers,
            className: "bg-[#1f1f23] border-[#333] hover:border-slate-500 hover:bg-[#2a2a30]",
            iconBg: "bg-gradient-to-br from-slate-400 to-slate-600 shadow-none",
            iconColor: "text-white",
            text: "text-white",
            glowColor: "bg-slate-500",
            href: "/dashboard/blocked",
            icon: EyeOff
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#09090b]">
            {STATS_ITEMS.map((item, index) => (
                <Link href={item.href} key={index} className="group block">
                    <div className={`
                        relative rounded-2xl border p-5 pl-6
                        flex flex-row items-center gap-4
                        transition-all duration-300
                        ${item.className}
                    `}>
                        {/* Ambient Glow */}
                        <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl ${item.glowColor}`} />
                        <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl ${item.glowColor}`} />

                        {/* Icon Container */}
                        <div className={`
                            relative w-12 h-12 rounded-full flex items-center justify-center shrink-0
                            ${item.iconBg} ${item.iconColor}
                        `}>
                            <item.icon className="w-7 h-7" />
                        </div>

                        {/* Value */}
                        <div className="relative z-10 flex flex-col gap-1 w-full text-left">
                            <span className={`text-3xl font-black tracking-tight ${item.text}`}>
                                {item.value}
                            </span>
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
