"use client";

import { useRef } from "react";
import { MatchCard } from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, HeartCrack } from "lucide-react";

interface MutualMatchesProps {
    matches: any[];
}

export function MutualMatches({ matches }: MutualMatchesProps) {
    const scrollRefMobile = useRef<HTMLDivElement>(null);
    const scrollRefDesktop = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right", isMobile: boolean) => {
        const ref = isMobile ? scrollRefMobile : scrollRefDesktop;
        if (ref.current) {
            const { current } = ref;
            const scrollAmount = 300; // Approx card width
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!matches || matches.length === 0) {
        return (
            <>
                <div className="block lg:hidden h-40 flex flex-col items-center justify-center text-slate-500 text-sm border-2 border-dashed border-slate-800 rounded-3xl gap-2 mt-4">
                    <HeartCrack className="w-8 h-8 opacity-50" />
                    No new matches found yet.
                </div>
                <div className="hidden lg:flex h-full items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-[24px]">
                    No new matches found yet.
                </div>
            </>
        );
    }

    return (
        <>
            {/* === MOBILE APP VIEW === */}
            <div className="block lg:hidden relative group w-full max-w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                        Mutual Matches <span className="text-slate-400 font-medium ml-2 text-sm">({matches.length} profiles)</span>
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800" onClick={() => scroll("left", true)}>
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800" onClick={() => scroll("right", true)}>
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollRefMobile}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {matches.map((match) => (
                        <div key={match.user.id} className="min-w-[280px] max-w-[280px] snap-start">
                            <MatchCard user={match.user} score={match.score} />
                        </div>
                    ))}
                </div>
            </div>

            {/* === DESKTOP WEB VIEW === */}
            <div className="hidden lg:block relative group w-full max-w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">
                        Mutual Matches <span className="text-slate-400 font-medium ml-2 text-sm">({matches.length} profiles)</span>
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100" onClick={() => scroll("left", false)}>
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100" onClick={() => scroll("right", false)}>
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollRefDesktop}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {matches.map((match) => (
                        <div key={match.user.id} className="min-w-[280px] max-w-[280px] snap-start">
                            <MatchCard user={match.user} score={match.score} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
