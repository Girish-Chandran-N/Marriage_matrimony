"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, RefreshCw, MessageCircle, Settings, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
      <div className="bg-[#121214]/95 backdrop-blur-2xl border-t border-[#222] shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-4 py-2 pb-safe">
        <div className="flex justify-between items-center relative gap-2">
          
          {/* Home Tab */}
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-1/5 gap-1 group">
            <Home 
              size={24} 
              className={pathname === "/dashboard" ? "text-rose-500 fill-rose-500/20" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
            />
          </Link>

          {/* Discover Tab */}
          <Link href="/discover" className="flex flex-col items-center justify-center w-1/5 gap-1 group">
            <RefreshCw 
              size={24} 
              className={pathname === "/discover" ? "text-rose-500" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
            />
          </Link>

          {/* Search Tab */}
          <Link href="/search" className="flex flex-col items-center justify-center w-1/5 gap-1 group">
            <Search 
              size={24} 
              className={pathname === "/search" || pathname === "/matches" ? "text-rose-500" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
            />
          </Link>

          {/* Messages Tab */}
          <Link href="/messages" className="flex flex-col items-center justify-center w-1/5 gap-1 group">
            <div className="relative">
              <MessageCircle 
                size={24} 
                className={pathname.startsWith("/messages") ? "text-rose-500 fill-rose-500/20" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
              />
              {/* Fake unread dot to match app styles */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border-[2px] border-[#121214] rounded-full"></span>
            </div>
          </Link>

          {/* Profile Tab */}
          <Link href="/profile" className="flex flex-col items-center justify-center w-1/5 gap-1 group">
            <User 
              size={24} 
              className={pathname === "/profile" || pathname === "/settings" ? "text-rose-500 fill-rose-500/20" : "text-slate-400 group-hover:text-slate-300 transition-colors"} 
            />
          </Link>

        </div>
      </div>
    </div>
  );
}
