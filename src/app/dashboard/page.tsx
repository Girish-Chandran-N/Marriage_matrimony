import { auth, signOut } from "@/auth";
import Link from "next/link";
import { getDashboardStats } from "@/lib/dashboard-actions";
import {
    User,
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
    Telescope,
    EyeOff,
    Users,
    Contact,
    ArrowUpRight,
    ArrowDownLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
    const session = await auth();
    const user = session?.user;

    // Fetch real stats
    const stats = await getDashboardStats();

    const DASHBOARD_ITEMS = [
        {
            title: "Interest Sent",
            value: stats.interestSent,
            icon: ArrowUpRight,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/dashboard/interests/sent",
            desc: "Interests you've expressed"
        },
        {
            title: "Interest Received",
            value: stats.interestReceived,
            icon: ArrowDownLeft,
            color: "text-pink-600",
            bg: "bg-pink-50",
            href: "/dashboard/interests/received",
            desc: "People interested in you"
        },
        {
            title: "Profile Views",
            value: stats.profileViews,
            icon: Eye,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/dashboard/profile-views",
            desc: "Who viewed your profile"
        },
        {
            title: "Profile Visited",
            value: stats.profileVisited,
            icon: Telescope, // Or History
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            href: "/dashboard/profile-visited",
            desc: "Profiles you've visited"
        },
        {
            title: "New Matches",
            value: stats.newMatches, // This is a count of candidates
            icon: Sparkles,
            color: "text-amber-600",
            bg: "bg-amber-50",
            href: "/dashboard/new-matches",
            desc: "Recently joined matches"
        },
        {
            title: "Shortlisted Profile",
            value: stats.shortlisted,
            icon: Heart,
            color: "text-red-600",
            bg: "bg-red-50",
            href: "/dashboard/shortlisted",
            desc: "Profiles you saved"
        },
        {
            title: "Contacts Viewed",
            value: stats.contactsViewed,
            icon: Contact,
            color: "text-teal-600",
            bg: "bg-teal-50",
            href: "/dashboard/contacts-viewed",
            desc: "People who viewed your contact"
        },
        {
            title: "Contacts Visited",
            value: stats.contactsVisited,
            icon: Users,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            href: "/dashboard/contacts-visited",
            desc: "Contacts you unlocked"
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 via-indigo-50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
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

                {/* Top Section: Quick Actions & Profile Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Left Column: Quick Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <ActionCard
                                    href="/profile"
                                    icon={User}
                                    title="My Profile"
                                    desc="View and manage your profile details."
                                    color="text-purple-600"
                                    bg="bg-purple-50"
                                    hoverBorder="hover:border-purple-200"
                                    delay="0"
                                />
                                <ActionCard
                                    href="/matches"
                                    icon={Search}
                                    title="Find Matches"
                                    desc="Browse profiles based on your preferences."
                                    color="text-pink-600"
                                    bg="bg-pink-50"
                                    hoverBorder="hover:border-pink-200"
                                    delay="100"
                                />
                                <ActionCard
                                    href="/messages"
                                    icon={MessageCircle}
                                    title="Messages"
                                    desc="Check your inbox for new conversations."
                                    color="text-blue-600"
                                    bg="bg-blue-50"
                                    hoverBorder="hover:border-blue-200"
                                    delay="200"
                                />
                                <ActionCard
                                    href="/verification"
                                    icon={ShieldCheck}
                                    title="Get Verified"
                                    desc="Boost your trust score with verification."
                                    color="text-green-600"
                                    bg="bg-green-50"
                                    hoverBorder="hover:border-green-200"
                                    delay="300"
                                    badge="Recommended"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Profile Status */}
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-500" />
                            Profile Status
                        </h2>
                        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-indigo-50 relative group">
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
                                <Button className="w-full mt-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold shadow-lg shadow-orange-200 border-0 rounded-xl h-12" asChild>
                                    <Link href="/pricing" className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 fill-white/20" /> Upgrade to Premium
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats Grid (Moved Below) */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        Activity Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {DASHBOARD_ITEMS.map((item, index) => (
                            <Link href={item.href} key={index} className="group">
                                <Card className="border-none shadow-lg shadow-slate-200/60 rounded-[24px] overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full relative">
                                    <div className={`absolute top-0 right-0 p-16 opacity-0 group-hover:opacity-5 transition-opacity ${item.bg.replace('bg-', 'bg-')}-500 rounded-bl-full pointer-events-none`}></div>

                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold text-lg px-3 py-1 rounded-full group-hover:bg-slate-200 transition-colors">
                                            {item.value}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-lg font-bold text-slate-800 mb-1 group-hover:text-slate-900">
                                            {item.title}
                                        </CardTitle>
                                        <p className="text-xs font-medium text-slate-500">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
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
