"use client";

import { useRef } from "react";
import { MatchCard } from "@/components/matches/match-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MutualMatchesProps {
    matches: any[];
}

export function MutualMatches({ matches }: MutualMatchesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; // Approx card width
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!matches || matches.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-[24px]">
                No new matches found yet.
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                    Mutual Matches <span className="text-slate-400 font-medium ml-2 text-sm">({matches.length} profiles)</span>
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-slate-200 hover:bg-slate-100"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
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
    );
}
