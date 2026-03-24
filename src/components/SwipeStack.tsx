"use client";

import { useState } from "react";
import { SwipeableCard, SwipeProfile } from "./SwipeableCard";
import { sendInterest } from "@/lib/interaction-actions";
import { Heart, X, Star, HeartCrack } from "lucide-react";

export function SwipeStack({ initialProfiles }: { initialProfiles: SwipeProfile[] }) {
  const [profiles, setProfiles] = useState<SwipeProfile[]>(initialProfiles);
  const [swipeAction, setSwipeAction] = useState<{ id: string, direction: "left" | "right" | "up" } | null>(null);

  const handleSwipe = async (id: string, direction: "left" | "right" | "up") => {
    // Remove the card from the stack
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    
    if (direction === "right") {
      await sendInterest(id, false);
    } else if (direction === "up") {
      await sendInterest(id, true);
    }
    // "left" is a pass, we might just ignore or create an ignored record.
    
    // Clear the active swipe action
    setSwipeAction(null);
  };

  const handleManualSwipe = (direction: "left" | "right" | "up") => {
    if (profiles.length === 0 || swipeAction) return; // Prevent multiple clicks
    setSwipeAction({ id: profiles[0].id, direction });
  };

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-slate-400 gap-4">
        <HeartCrack size={48} className="text-[#333]" />
        <h2 className="text-2xl font-bold text-white">You're all caught up!</h2>
        <p>Check back later for more matches.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm flex-1 flex flex-col mx-auto perspective-1000">
      
      {/* Stack Container */}
      <div className="relative w-full h-[calc(100vh-220px)] sm:h-[600px] mt-2 mb-6 pointer-events-none">
        {profiles.map((profile, index) => {
          // Render from bottom to top so the first profile in array is on top
          const isTop = index === 0;
          
          return (
            <div 
              key={profile.id} 
              className="absolute inset-0 pointer-events-auto" 
              style={{ 
                zIndex: profiles.length - index,
                transform: `scale(${1 - index * 0.05}) translateY(${index * 20}px)`,
                opacity: index < 3 ? 1 : 0,
                pointerEvents: isTop ? "auto" : "none",
                transition: "transform 0.3s ease, opacity 0.3s ease"
              }}
            >
              <SwipeableCard
                profile={profile}
                active={isTop}
                onSwipe={handleSwipe}
                externalSwipe={isTop && swipeAction?.id === profile.id ? swipeAction.direction : null}
              />
            </div>
          );
        })}
      </div>

      {/* Floating Action Buttons */}
      <div className="flex justify-center items-center gap-6 mt-auto pb-6">
        <button 
          onClick={() => handleManualSwipe("left")}
          className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <X size={28} strokeWidth={3} />
        </button>

        <button 
          onClick={() => handleManualSwipe("up")}
          className="w-14 h-14 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition-colors"
        >
          <Star size={24} strokeWidth={3} className="fill-blue-500" />
        </button>

        <button 
          onClick={() => handleManualSwipe("right")}
          className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center text-green-400 hover:bg-green-400/10 transition-colors"
        >
          <Heart size={28} strokeWidth={3} className="fill-green-400" />
        </button>
      </div>

    </div>
  );
}
