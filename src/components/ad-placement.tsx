"use client";

import { useEffect, useState } from "react";
import { getAdsByPlacement, trackAdClick, trackAdView } from "@/lib/ad-actions";
import { AdPlacementSlot, AdType } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AdPlacementProps {
    placement: AdPlacementSlot; // "SIDEBAR" | "DASHBOARD" | "FEED"
    className?: string;
}

export default function AdPlacement({ placement, className }: AdPlacementProps) {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                // In a real app, you might want to fetch random or specific ranking
                // For now, we fetch all active ones and maybe pick one random?
                const fetchedAds = await getAdsByPlacement(placement);
                setAds(fetchedAds);
            } catch (error) {
                console.error("Failed to load ads", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, [placement]);

    // Simple Rotation or Random Selection Logic
    // For now, let's just show the first one or map them if multiple allowed?
    // Usually a slot shows one ad. Let's pick random.
    const [currentAd, setCurrentAd] = useState<any>(null);

    useEffect(() => {
        if (ads.length > 0) {
            const random = ads[Math.floor(Math.random() * ads.length)];
            setCurrentAd(random);
            // Track View
            trackAdView(random.id);
        }
    }, [ads]);

    if (loading) return <div className={cn("w-full h-full min-h-[100px] bg-slate-100 animate-pulse rounded-lg", className)} />;

    if (!currentAd) {
        return (
            <div className={cn("w-full min-h-[100px] rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center relative overlow-hidden", className)}>
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-400">Advertisement Space</p>
                    <p className="text-xs text-slate-300">({placement})</p>
                </div>
            </div>
        );
    }

    const handleClick = () => {
        trackAdClick(currentAd.id);
    };

    return (
        <div className={cn("w-full overflow-hidden rounded-lg shadow-sm border bg-white relative", className)}>
            {/* Label for transparency */}
            <div className="absolute top-0 right-0 bg-slate-100 text-[9px] text-slate-400 px-1 rounded-bl">Ad</div>

            {currentAd.type === "GOOGLE_ADS" ? (
                <div
                    className="w-full h-full min-h-[100px] flex items-center justify-center bg-slate-50"
                    dangerouslySetInnerHTML={{ __html: currentAd.adCode }}
                />
            ) : (
                <a
                    href={currentAd.targetUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className="block w-full h-full relative group"
                >
                    {currentAd.imageUrl ? (
                        <img
                            src={currentAd.imageUrl}
                            alt={currentAd.title}
                            className="w-full h-auto object-cover transition-opacity group-hover:opacity-90"
                        />
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            {currentAd.title}
                        </div>
                    )}
                </a>
            )}
        </div>
    );
}
