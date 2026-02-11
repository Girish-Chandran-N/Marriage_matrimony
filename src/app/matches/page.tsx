import { auth } from "@/auth";
import { getMatches } from "@/lib/match-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FilterSidebar from "@/components/filter-sidebar";
import { MatchCard } from "@/components/matches/match-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Can imply remove if unused later, but keeping for safety

export default async function MatchesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const params = await searchParams;
    const filters = {
        industry: params.industry,
        location: params.location,
        ageMin: params.ageMin ? parseInt(params.ageMin) : undefined,
        ageMax: params.ageMax ? parseInt(params.ageMax) : undefined,
        minHeight: params.minHeight ? parseInt(params.minHeight) : undefined,
        maxHeight: params.maxHeight ? parseInt(params.maxHeight) : undefined,
        religion: params.religion,
        caste: params.caste, // Added
        motherTongue: params.motherTongue,
        gender: params.gender, // Added for bride/groom search
        professions: params.professions ? params.professions.split(',').map(p => p.trim()) : undefined, // Parse comma-separated professions
    };

    const result = await getMatches(filters);

    if ('message' in (result as any)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">No Matches Yet</h1>
                    <p className="text-gray-600 mb-6">{(result as any).message}</p>
                    <Link href="/matches/preferences">
                        <Button>Set Compatibility Preferences</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const matches = result as { user: any, score: number }[];

    // Debugging: Log matches to server console to verify image data
    console.log("Matches Debug:", matches.map(m => ({ name: m.user.name, image: m.user.profileImage })));

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50 via-purple-50 to-transparent"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                {Object.keys(filters).some(k => filters[k as keyof typeof filters]) ? "Filtered Matches" : "Your Top Matches"}
                            </span>
                            <span className="text-3xl">✨</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Find someone who complements your soul.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="hover:bg-purple-50 text-gray-600">Dashboard</Button>
                        </Link>
                        <Link href="/matches/preferences">
                            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                Edit Preferences
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Left Sidebar */}
                    <div className="w-full md:w-80 flex-shrink-0 sticky top-8">
                        <FilterSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {matches.length === 0 ? (
                            <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg">
                                <div className="text-6xl mb-4">🧞‍♂️</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No matches found</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">It seems we couldn't find anyone matching your specific criteria. Try loosening your filters!</p>
                                <Link href="/matches">
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all hover:-translate-y-1">
                                        Clear All Filters
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {matches.map(({ user, score }, idx) => (
                                    <div
                                        key={user.id}
                                        className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <MatchCard user={user} score={score} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateAge(dob: Date | null) {
    if (!dob) return "N/A";
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
