import { auth, signOut } from "@/auth";
import Link from "next/link";
import { db } from "@/lib/db";
import { getMatches } from "@/lib/match-actions";
import {
    User,
    Settings,
    ShieldCheck,
    Heart,
    MessageCircle,
    Search,
    LogOut,
    Eye,
    TrendingUp,
    Sparkles,
    Zap,
    Crown,
    Telescope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;

    // Fetch real stats
    const matchResult = await getMatches();
    const matchCount = Array.isArray(matchResult) ? matchResult.length : 0;

    const messageCount = await db.message.count({
        where: { receiverId: user?.id }
    });

    const stats = {
        profileViews: 124, // Mocked for now (no backend support yet)
        shortlistedBy: 18, // Mocked for now
        messages: messageCount,
        matches: matchCount
    };

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 via-indigo-50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 transition-all duration-500 ease-out">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
                            Dashboard
                            <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-100" />
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-bold">{user?.name || user?.email}</span>! 👋
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <Button variant="outline" className="rounded-full border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Profile Views"
                        value={stats.profileViews}
                        change="+12% from last month"
                        icon={Eye}
                        color="blue"
                        delay="0"
                    />
                    <StatCard
                        title="Shortlisted By"
                        value={stats.shortlistedBy}
                        change="People interested in you"
                        icon={Heart}
                        color="pink"
                        delay="100"
                    />
                    <div className="group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-200 animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: '200ms' }}>
                        <div className="bg-white/95 backdrop-blur-xl h-full w-full rounded-[20px] p-6 relative">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Matches</p>
                                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">Explore</h3>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-200">
                                    <Telescope className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-6 font-medium">Discover new profiles matching your vibe.</p>
                            <Link href="/matches">
                                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl group-hover:scale-[1.02] transition-transform">
                                    Find Matches <TrendingUp className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Quick Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Profile Card First */}
                                <ActionCard
                                    href="/profile"
                                    icon={User}
                                    title="My Profile"
                                    desc="View and manage your profile details."
                                    color="text-purple-600"
                                    bg="bg-purple-50"
                                    hoverBorder="hover:border-purple-200"
                                    delay="300"
                                />

                                <ActionCard
                                    href="/matches"
                                    icon={Search}
                                    title="Find Matches"
                                    desc="Browse profiles based on your preferences."
                                    color="text-pink-600"
                                    bg="bg-pink-50"
                                    hoverBorder="hover:border-pink-200"
                                    delay="400"
                                />

                                <ActionCard
                                    href="/messages"
                                    icon={MessageCircle}
                                    title="Messages"
                                    desc="Check your inbox for new conversations."
                                    color="text-blue-600"
                                    bg="bg-blue-50"
                                    hoverBorder="hover:border-blue-200"
                                    delay="500"
                                />

                                <ActionCard
                                    href="/verification"
                                    icon={ShieldCheck}
                                    title="Get Verified"
                                    desc="Boost your trust score with verification."
                                    color="text-green-600"
                                    bg="bg-green-50"
                                    hoverBorder="hover:border-green-200"
                                    delay="600"
                                    badge="Recommended"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile Status */}
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-700 delay-300">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Profile Status
                        </h2>
                        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-indigo-50 relative group">
                            {/* Decorative Header */}
                            <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            </div>

                            <div className="px-6 pb-8 relative">
                                <div className="relative -mt-12 mb-6">
                                    <div className="h-24 w-24 bg-white rounded-full p-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        <div className="h-full w-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-indigo-300 overflow-hidden border-4 border-indigo-50">
                                            {user?.image ? (
                                                <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                                            ) : (
                                                user?.name?.[0]?.toUpperCase() || "U"
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-xl text-slate-900">{user?.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
                                </div>

                                <div className="space-y-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="font-semibold text-slate-600 flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            Trust Score
                                        </span>
                                        <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md">85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-green-400 to-green-600 h-full w-[85%] rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium text-center">Complete verification to reach 100%</p>
                                </div>

                                <Button className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold shadow-lg shadow-orange-200 border-0 rounded-xl h-12" asChild>
                                    <Link href="/pricing" className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 fill-white/20" /> Upgrade to Premium
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon, color, delay }: any) {
    const colorStyles = {
        blue: "text-blue-600 bg-blue-50",
        pink: "text-pink-600 bg-pink-50",
        orange: "text-orange-600 bg-orange-50",
    }[color as string] || "text-gray-600 bg-gray-50";

    return (
        <Card className={`border-none shadow-lg shadow-slate-200/60 rounded-[20px] overflow-hidden hover:-translate-y-1 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both`} style={{ animationDelay: `${delay}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</CardTitle>
                <div className={`p-2 rounded-xl ${colorStyles}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-extrabold text-slate-800 mb-1">{value}</div>
                <p className="text-xs font-semibold text-slate-400">{change}</p>
            </CardContent>
        </Card>
    );
}

function ActionCard({ href, icon: Icon, title, desc, color, bg, hoverBorder, delay, badge }: any) {
    return (
        <Link href={href} className={`group block animate-in fade-in slide-in-from-bottom-4 fill-mode-both`} style={{ animationDelay: `${delay}ms` }}>
            <div className={`bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-${color.split('-')[1]}-100/50 ${hoverBorder} transition-all duration-300 cursor-pointer h-full relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity bg-${color.split('-')[1]}-500 rounded-bl-full pointer-events-none`}></div>

                <div className={`mb-4 h-14 w-14 ${bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                </div>

                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">{title}</h3>
                    {badge && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">{badge}</Badge>}
                </div>

                <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
            </div>
        </Link>
    );
}
