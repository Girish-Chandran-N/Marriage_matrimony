import { auth } from "@/auth";
import { Fragment } from "react";
import { getMatches } from "@/lib/match-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FilterSidebar from "@/components/filter-sidebar";
import { MatchCard } from "@/components/matches/match-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdPlacement from "@/components/ad-placement";
import { Heart } from "lucide-react";

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

        // Location
        workingCountry: params.workingCountry,
        workingState: params.workingState,
        workingDistrict: params.workingDistrict,
        nativeCountry: params.nativeCountry,
        nativeState: params.nativeState,
        nativeDistrict: params.nativeDistrict,
        readyToRelocate: params.readyToRelocate === 'true',

        // Advanced
        physicalStatus: params.physicalStatus,
        familyStatus: params.familyStatus,
        complexion: params.complexion,
        bodyType: params.bodyType,
        employmentCategory: params.employmentCategory,
        incomeRange: params.incomeRange ? params.incomeRange.split(',') : undefined,

        // Lifestyle
        eatingHabits: params.eatingHabits,
        drinkingHabits: params.drinkingHabits,
        smokingHabits: params.smokingHabits,

        // Criteria
        isOnline: params.isOnline === 'true',
        hasPhoto: params.hasPhoto === 'true',
        isPremium: params.isPremium === 'true',
    };

    const result = await getMatches(filters);

    if ('message' in (result as any)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] bg-[#09090b] text-center px-4">
                <Heart size={64} className="text-slate-500 mb-6" strokeWidth={1.5} />
                <h2 className="text-2xl font-bold text-white mb-2">No matches yet</h2>
                <p className="text-slate-400 mb-8 max-w-xs">{ (result as any).message }</p>
                <Link href="/matches/preferences">
                    <Button variant="outline" className="text-slate-300 border-slate-700 bg-transparent hover:bg-slate-800">Set Preferences</Button>
                </Link>
            </div>
        );
    }

    const matches = result as { user: any, score: number }[];

    // Debugging: Log matches to server console to verify image data
    console.log("Matches Debug:", matches.map(m => ({ name: m.user.name, image: m.user.profileImage })));

    return (
        <>
        {/* MOBILE VIEW (<lg) */}
        <div className="block lg:hidden min-h-screen bg-[#09090b] text-white pb-24 relative overflow-x-hidden">
            {/* Native Mobile Header */}
            <div className="sticky top-0 z-40 bg-[#121214]/80 backdrop-blur-md border-b border-[#222] px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-black text-white px-2">
                    {Object.keys(filters).some(k => filters[k as keyof typeof filters]) ? "Filtered Matches" : "Top Matches"}
                </h1>
                <Link href="/matches/preferences">
                    <Button variant="ghost" className="rounded-full bg-[#1a1a1a] border border-[#333] text-sm text-slate-300 hover:text-white hover:bg-[#222]">
                        Preferences
                    </Button>
                </Link>
            </div>

            <div className="p-4 mx-auto max-w-7xl pt-6">
                <div className="flex flex-col items-start gap-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 w-full">
                        {matches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-[#121214] rounded-3xl text-center px-4 h-full border border-[#222]">
                                <Heart size={64} className="text-slate-500 mb-6" strokeWidth={1.5} />
                                <h2 className="text-2xl font-bold text-white mb-2">No matches yet</h2>
                                <p className="text-slate-400 mb-8">Start swiping to find your match!</p>
                                <Link href="/discover">
                                    <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 border-0 shadow-lg text-white font-bold rounded-full px-8 hover:scale-105 transition-transform">
                                        Discover Matches
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {matches.map(({ user, score }, idx) => (
                                    <Fragment key={user.id}>
                                        <div
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <MatchCard user={user} score={score} />
                                        </div>
                                        {/* In-Feed Ad: Spans full width to act as a breaker between rows */}
                                        {idx === 3 && (
                                            <div key="ad-feed" className="col-span-1 md:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-700 my-4">
                                                <div className="bg-[#121214] rounded-xl border border-[#222] p-1">
                                                    <AdPlacement placement="FEED" className="h-32 md:h-40 w-full" />
                                                </div>
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* DESKTOP VIEW (>=lg) */}
        <div className="hidden lg:block min-h-screen bg-slate-50/50 relative overflow-hidden">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50 via-purple-50 to-transparent"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
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
                    <div className="flex-1 min-w-0">
                        {matches.length === 0 ? (
                            <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg">
                                <div className="text-6xl mb-4">🧞‍♂️</div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">No matches yet.</h2>
                                <p className="text-gray-600 mb-8">Update your preferences or complete your profile to get matches.</p>
                                <Link href="/matches/preferences">
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 border-0 shadow-lg text-white font-bold rounded-full px-8 hover:scale-105 transition-transform">
                                        Update Preferences
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {matches.map(({ user, score }, idx) => (
                                    <Fragment key={user.id}>
                                        <div
                                            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <MatchCard user={user} score={score} />
                                        </div>
                                        {/* In-Feed Ad: Spans full width to act as a breaker between rows */}
                                        {idx === 3 && (
                                            <div key="ad-feed" className="col-span-1 md:col-span-2 xl:col-span-3 2xl:col-span-4 animate-in fade-in slide-in-from-bottom-4 duration-700 my-4">
                                                <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-1">
                                                    <AdPlacement placement="FEED" className="h-32 md:h-40 w-full" />
                                                </div>
                                            </div>
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar (Ads) */}
                    <div className="hidden xl:block w-72 flex-shrink-0 sticky top-8 space-y-6">
                        <AdPlacement placement="RIGHT_SIDEBAR" className="h-[600px]" />
                        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Sponsored</h3>
                            <AdPlacement placement="SIDEBAR" className="h-64" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

function calculateAge(dob: Date | null) {
    if (!dob) return "N/A";
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
