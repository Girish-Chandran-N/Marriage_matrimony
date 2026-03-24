import { auth } from "@/auth";
import { getDashboardStats } from "@/lib/dashboard-actions";
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

    return (
        <div className="min-h-[calc(100vh-70px)] bg-[#09090b] px-4 py-8 pb-20">
            {/* Native Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Activity</h1>
                    <p className="text-sm text-slate-400 font-medium">Your matrimony hub</p>
                </div>
                {/* Optional mini avatar */}
                <div className="w-10 h-10 rounded-full border border-slate-800 bg-[#1a1a1a] overflow-hidden">
                    {user?.image ? (
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-8 w-full max-w-lg mx-auto">
                {/* Stats Grid */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Insights</h2>
                    <DashboardStatsGrid stats={stats} />
                </div>

                {/* Mutual Matches Carousel */}
                <div className="shrink-0 mb-8">
                    <MutualMatches matches={matches} />
                </div>
            </div>
        </div>
    );
}
