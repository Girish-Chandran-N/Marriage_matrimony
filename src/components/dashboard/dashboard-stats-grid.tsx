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
            // Gradient Blue
            className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl hover:shadow-blue-200/50",
            iconBg: "bg-blue-500",
            iconColor: "text-white",
            text: "text-blue-900",
            href: "/dashboard/interests/sent",
            icon: ArrowUpRight
        },
        {
            title: "Interest Received",
            value: stats.interestReceived,
            // Gradient Pink
            className: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-xl hover:shadow-pink-200/50",
            iconBg: "bg-pink-500",
            iconColor: "text-white",
            text: "text-pink-900",
            href: "/dashboard/interests/received",
            icon: ArrowDownLeft
        },
        {
            title: "Profile Views",
            value: stats.profileViews,
            // Gradient Purple
            className: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-xl hover:shadow-purple-200/50",
            iconBg: "bg-purple-500",
            iconColor: "text-white",
            text: "text-purple-900",
            href: "/dashboard/profile-views",
            icon: Eye
        },
        {
            title: "Profile Visited",
            value: stats.profileVisited,
            // Gradient Indigo
            className: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-xl hover:shadow-indigo-200/50",
            iconBg: "bg-indigo-500",
            iconColor: "text-white",
            text: "text-indigo-900",
            href: "/dashboard/profile-visited",
            icon: Telescope
        },
        {
            title: "Shortlisted",
            value: stats.shortlisted,
            // Gradient Red/Rose
            className: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:shadow-xl hover:shadow-rose-200/50",
            iconBg: "bg-rose-500",
            iconColor: "text-white",
            text: "text-rose-900",
            href: "/dashboard/shortlisted",
            icon: Heart
        },
        {
            title: "Contacts Viewed",
            value: stats.contactsViewed,
            // Gradient Teal
            className: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-xl hover:shadow-teal-200/50",
            iconBg: "bg-teal-500",
            iconColor: "text-white",
            text: "text-teal-900",
            href: "/dashboard/contacts-viewed",
            icon: Contact
        },
        {
            title: "Contacts Visited",
            value: stats.contactsVisited,
            // Gradient Cyan
            className: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/50",
            iconBg: "bg-cyan-500",
            iconColor: "text-white",
            text: "text-cyan-900",
            href: "/dashboard/contacts-visited",
            icon: Users
        },
        {
            title: "Ignored/Blocked",
            value: stats.blockedUsers,
            // Gradient Slate
            className: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-xl hover:shadow-slate-200/50",
            iconBg: "bg-slate-500",
            iconColor: "text-white",
            text: "text-slate-900",
            href: "/dashboard/blocked",
            icon: EyeOff
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 h-full">
            {STATS_ITEMS.map((item, index) => (
                <Link href={item.href} key={index} className="group block h-full">
                    <div className={`
                        relative h-full rounded-[24px] border border-white/50 p-6 
                        flex flex-col items-center justify-center text-center gap-4
                        transition-all duration-300 hover:-translate-y-1 overflow-hidden
                        ${item.className}
                    `}>
                        {/* Ambient Glow */}
                        <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-20 blur-2xl ${item.iconBg}`} />
                        <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-20 blur-2xl ${item.iconBg}`} />

                        {/* Icon Container */}
                        <div className={`
                            relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                            ${item.iconBg} ${item.iconColor}
                            group-hover:scale-110 transition-transform duration-300
                        `}>
                            <item.icon className="w-6 h-6" />
                        </div>

                        {/* Value */}
                        <div className="relative z-10">
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 opacity-70 ${item.text}`}>
                                {item.title}
                            </h3>
                            <span className={`text-3xl font-black tracking-tight ${item.text}`}>
                                {item.value}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
