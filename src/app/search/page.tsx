import { auth } from "@/auth";
import { getMatches } from "@/lib/match-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Send, SlidersHorizontal, Briefcase, GraduationCap, MapPin, Building2, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MatchCard } from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";

export default async function SearchPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    // Fetch default matches
    const result = await getMatches({});
    let matches: { user: any, score: number }[] = [];
    
    if (result && Array.isArray(result) && !('message' in result)) {
        matches = result;
    }

    // Since we don't have actual stats, we mock partitioning of the returned matches
    // to populate the sections exactly per the design.
    const mostViewed = matches.slice(0, Math.ceil(matches.length / 2));
    const recommended = matches.slice(Math.ceil(matches.length / 2));

    return (
        <div className="block lg:hidden min-h-[100dvh] bg-[#09090b] text-white pb-32 overflow-x-hidden">
            
            {/* Header & Search Bar aligned with reference image */}
            <div className="px-4 pt-4 pb-6 bg-[#09090b] sticky top-0 z-20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-4 mt-2 px-2">
                    {/* Placeholder for left drawer icon if needed, otherwise spacing */}
                    <div className="w-6" /> 
                    <h1 className="text-xl font-bold text-white tracking-wide">Search</h1>
                    <Link href="/matches">
                        <Search className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <form action="/matches" className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                        <Input 
                            type="text" 
                            name="search"
                            placeholder="Type to Search..." 
                            className="w-full h-14 bg-[#121214] border border-[#222] focus:border-rose-500/50 rounded-2xl pl-12 pr-12 text-base placeholder:text-slate-500 shadow-inner"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Send className="w-5 h-5 text-rose-500 hover:text-pink-500 transition-colors focus:outline-none" />
                        </button>
                    </form>
                    
                    <Link href="/matches/preferences">
                        <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-[#121214] border-[#222] text-slate-400 hover:text-white hover:bg-[#1a1a1a] shrink-0 active:scale-95 transition-all">
                            <SlidersHorizontal className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="px-4 mt-2">
                {/* Search By Category Grid */}
                <div className="mb-10">
                    <h2 className="text-base font-bold text-white mb-4 px-2">Search By Category</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Profession */}
                        <Link href="/matches?professions=Engineer,Doctor,Software,Business" className="group">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[1.5rem] p-5 h-28 flex flex-col justify-center items-center gap-3 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                <Briefcase className="w-7 h-7 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                <span className="text-white text-xs font-bold tracking-wide">Filter By Profession</span>
                            </div>
                        </Link>

                        {/* Education */}
                        <Link href="/matches?educations=Bachelors,Masters,PhD" className="group">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.5rem] p-5 h-28 flex flex-col justify-center items-center gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                                <GraduationCap className="w-7 h-7 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                <span className="text-white text-xs font-bold tracking-wide">Filter By Education</span>
                            </div>
                        </Link>

                        {/* Location */}
                        <Link href="/matches?location=true" className="group">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] p-5 h-28 flex flex-col justify-center items-center gap-3 shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                                <MapPin className="w-7 h-7 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                <span className="text-white text-xs font-bold tracking-wide">Filter By Location</span>
                            </div>
                        </Link>

                        {/* Religion */}
                        <Link href="/matches?religion=Hindu,Muslim,Christian" className="group">
                            <div className="bg-gradient-to-br from-rose-500 to-red-500 rounded-[1.5rem] p-5 h-28 flex flex-col justify-center items-center gap-3 shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                                <Building2 className="w-7 h-7 text-white opacity-90 group-hover:scale-110 transition-transform" />
                                <span className="text-white text-xs font-bold tracking-wide">Filter By Religion</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Most Viewed Profiles (Horizontal Scroll) */}
                <div className="mb-10 w-full relative group">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-base font-bold text-white tracking-wide">Most Viewed Profiles</h2>
                    </div>
                    
                    {mostViewed.length > 0 ? (
                        <div 
                            className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory hide-scrollbar -mx-4 px-4"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />
                            {mostViewed.map((match) => (
                                <div key={match.user.id} className="min-w-[260px] max-w-[260px] snap-start shrink-0">
                                    <MatchCard user={match.user} score={match.score} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-40 bg-[#121214] border-2 border-dashed border-[#222] rounded-3xl flex items-center justify-center opacity-70">
                            <span className="text-sm font-medium text-slate-500">Not enough data.</span>
                        </div>
                    )}
                </div>

                {/* Recommended For You (Horizontal Scroll) */}
                <div className="mb-6 w-full relative group">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        <h2 className="text-base font-bold text-white tracking-wide">Recommended For You</h2>
                    </div>
                    
                    {recommended.length > 0 ? (
                        <div 
                            className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory hide-scrollbar -mx-4 px-4"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {recommended.map((match) => (
                                <div key={match.user.id} className="min-w-[260px] max-w-[260px] snap-start shrink-0">
                                    <MatchCard user={match.user} score={match.score} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-40 bg-[#121214] border-2 border-dashed border-[#222] rounded-3xl flex items-center justify-center opacity-70">
                            <span className="text-sm font-medium text-slate-500">Not enough recommendations.</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
