"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, MessageCircle, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-[#121212] border-t border-[#1e1e1e] pb-safe pt-2 z-50">
      <div className="flex justify-around items-center h-16 pb-4">
        
        {/* Discover Tab */}
        <Link href="/discover" className="flex flex-col items-center justify-center w-1/4 gap-1">
          <Flame 
            size={24} 
            className={pathname === "/discover" ? "text-rose-500 fill-rose-500" : "text-slate-400"} 
          />
          <span className={`text-[10px] font-medium ${pathname === "/discover" ? "text-rose-500" : "text-slate-400"}`}>
            Discover
          </span>
        </Link>

        {/* Matches Tab */}
        <Link href="/matches" className="flex flex-col items-center justify-center w-1/4 gap-1">
          <Heart 
            size={24} 
            className={pathname === "/matches" ? "text-rose-500 fill-rose-500" : "text-slate-400"} 
          />
          <span className={`text-[10px] font-medium ${pathname === "/matches" ? "text-rose-500" : "text-slate-400"}`}>
            Matches
          </span>
        </Link>

        {/* Messages Tab */}
        <Link href="/messages" className="flex flex-col items-center justify-center w-1/4 gap-1">
          <MessageCircle 
            size={24} 
            className={pathname === "/messages" || pathname.startsWith("/messages/") ? "text-rose-500 fill-rose-500" : "text-slate-400"} 
          />
          <span className={`text-[10px] font-medium ${pathname === "/messages" || pathname.startsWith("/messages/") ? "text-rose-500" : "text-slate-400"}`}>
            Messages
          </span>
        </Link>

        {/* Profile Tab */}
        <Link href="/profile" className="flex flex-col items-center justify-center w-1/4 gap-1">
          <User 
            size={24} 
            className={pathname === "/profile" || pathname === "/dashboard" ? "text-rose-500 fill-rose-500" : "text-slate-400"} 
          />
          <span className={`text-[10px] font-medium ${pathname === "/profile" || pathname === "/dashboard" ? "text-rose-500" : "text-slate-400"}`}>
            Profile
          </span>
        </Link>

      </div>
    </div>
  );
}
