"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, Star } from "lucide-react";

export interface SwipeProfile {
  id: string;
  name: string;
  image: string;
  age: number;
  profession: string;
  datingIntent?: string;
  familyInvolvement?: string;
  compatibilityScore?: number;
}

interface SwipeableCardProps {
  profile: SwipeProfile;
  onSwipe: (id: string, direction: "left" | "right" | "up") => void;
  active: boolean; // Is it the top card?
  externalSwipe?: "left" | "right" | "up" | null;
}

export function SwipeableCard({ profile, onSwipe, active, externalSwipe }: SwipeableCardProps) {
  const [exitX, setExitX] = useState<number>(0);
  const [exitY, setExitY] = useState<number>(0);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on X
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  // Opacities for the overlays
  const opacityRight = useTransform(x, [0, 150], [0, 1]);
  const opacityLeft = useTransform(x, [0, -150], [0, 1]);
  const opacityUp = useTransform(y, [0, -150], [0, 1]);

  useEffect(() => {
    if (externalSwipe) {
      if (externalSwipe === "right") {
        setExitX(1000);
      } else if (externalSwipe === "left") {
        setExitX(-1000);
      } else if (externalSwipe === "up") {
        setExitY(-1000);
      }
      
      const timer = setTimeout(() => {
        onSwipe(profile.id, externalSwipe);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [externalSwipe, onSwipe, profile.id]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.y < -swipeThreshold && Math.abs(info.offset.x) < swipeThreshold) {
      setExitY(-1000);
      onSwipe(profile.id, "up");
    } else if (info.offset.x > swipeThreshold) {
      setExitX(1000);
      onSwipe(profile.id, "right");
    } else if (info.offset.x < -swipeThreshold) {
      setExitX(-1000);
      onSwipe(profile.id, "left");
    }
  };

  return (
    <motion.div
      className="absolute w-full h-[calc(100vh-220px)] sm:h-[600px] bg-[#1a1a1a] rounded-[32px] overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl"
      drag={active ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate }}
      animate={{ x: exitX, y: exitY, opacity: exitX !== 0 || exitY !== 0 ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div 
        className="w-full h-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${profile.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/20" />
        
        {/* Light Gradient Sweeps */}
        <motion.div 
          style={{ opacity: opacityRight }} 
          className="absolute inset-0 pointer-events-none bg-gradient-to-l from-emerald-500/50 via-emerald-500/10 to-transparent"
        />
        
        <motion.div 
          style={{ opacity: opacityLeft }} 
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-rose-600/50 via-rose-600/10 to-transparent"
        />

        <motion.div 
          style={{ opacity: opacityUp }} 
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/50 via-blue-500/10 to-transparent"
        />

        {/* Info Overlay at Bottom of Image */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white pb-8">
          <h2 className="text-3xl md:text-4xl font-black flex gap-2 items-center drop-shadow-md tracking-tight">
            {profile.name}, {profile.age}
          </h2>
          <div className="text-base text-slate-200 mt-1 drop-shadow-sm font-medium opacity-90">
            {profile.profession}
          </div>
          
          {/* Tags row */}
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.compatibilityScore && (
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full text-xs font-bold shadow-sm">
                💎 {profile.compatibilityScore}% Match
              </span>
            )}
            {profile.datingIntent && (
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full text-xs font-bold shadow-sm">
                🎯 {profile.datingIntent}
              </span>
            )}
            {profile.familyInvolvement && (
              <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full text-xs font-bold shadow-sm">
                👨‍👩‍👧‍👦 {profile.familyInvolvement}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
