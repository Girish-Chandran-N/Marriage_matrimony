import { auth, signOut } from "@/auth";
import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard-actions";
import {
    LogOut,
    Sparkles,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardProfileCard } from "@/components/dashboard/dashboard-profile-card";
import { DashboardStatsGrid } from "@/components/dashboard/dashboard-stats-grid";
import { MutualMatches } from "@/components/dashboard/mutual-matches";

export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;

    // Fetch real stats
    const stats = await getDashboardStats();

    // Fetch matches for the carousel
    const { getNewMatches } = await import("@/lib/dashboard-actions");
    const matches = await getNewMatches();

    const { db } = await import("@/lib/db");
    const dbUser = user?.id ? await db.user.findUnique({
        where: { id: user.id },
        select: {
            profileImage: true,
            createdAt: true,
            subscription: {
                select: {
                    plan: true,
                    endDate: true,
                    status: true
                }
            },
            verificationRequests: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: { status: true }
            }
        }
    }) : null;

    const verificationStatus = dbUser?.verificationRequests?.[0]?.status;

    return (
        <div className="h-[calc(100vh-80px)] bg-slate-50/50 px-6 py-2 overflow-hidden relative">
            {/* Ambient Background with Noise */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/80"></div>
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-100/50 via-purple-50/50 to-transparent"></div>

                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-[1600px] mx-auto h-full grid grid-cols-12 gap-8 relative z-10 text-slate-900">

                {/* Left Sidebar (3 cols) - Profile Card */}
                <div className="col-span-12 lg:col-span-3 h-full">
                    <DashboardProfileCard user={user} dbUser={dbUser} />
                </div>

                {/* Right Content (9 cols) */}
                <div className="col-span-12 lg:col-span-9 h-full flex flex-col gap-8">

                    {/* Top Header & Actions Row */}
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white/90 backdrop-blur-md p-5 rounded-[32px] shadow-sm border border-slate-100/60">
                        <div className="flex flex-wrap gap-3 items-center w-full">
                            {verificationStatus === "APPROVED" ? (
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-bold text-xs h-9 shadow-sm">
                                    <ShieldCheck className="w-4 h-4 text-green-600 fill-green-100" />
                                    Verified Profile
                                </div>
                            ) : verificationStatus === "PENDING" ? (
                                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs h-9 shadow-sm">
                                    <Sparkles className="w-4 h-4 text-amber-600" />
                                    Verification Pending
                                </div>
                            ) : (
                                <Button variant="outline" className="rounded-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 font-bold text-xs h-9" asChild>
                                    <Link href="/verification">
                                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Get Verified
                                    </Link>
                                </Button>
                            )}

                            <Button variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs h-9 hidden sm:flex" asChild>
                                <Link href="/profile/edit">
                                    90% Ensure Profile Completeness
                                </Link>
                            </Button>

                            <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 font-bold text-xs h-9" asChild>
                                <Link href="/profile/edit">Edit Profile</Link>
                            </Button>

                            <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 font-bold text-xs h-9" asChild>
                                <Link href="/profile">View My Profile</Link>
                            </Button>

                            <form
                                action={async () => {
                                    "use server";
                                    await signOut();
                                }}
                            >
                                <Button variant="ghost" size="sm" className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold h-9 px-3">
                                    <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="flex-1 min-h-0">
                        <DashboardStatsGrid stats={stats} />
                    </div>

                    {/* Mutual Matches Carousel */}
                    <div className="h-[340px] shrink-0">
                        <MutualMatches matches={matches} />
                    </div>
                </div>
            </div>
        </div>
    );
}
