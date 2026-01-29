"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function MessageLayoutShell({
    sidebar,
    children
}: {
    sidebar: ReactNode;
    children: ReactNode;
}) {
    const pathname = usePathname();
    const isRoot = pathname === "/messages";

    return (
        <div className="h-[calc(100vh-5rem)] bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-pink-50 via-purple-50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full h-full bg-white/80 backdrop-blur-xl shadow-none border-0 relative z-10 overflow-hidden flex">

                {/* Sidebar: Visible on Desktop OR on Mobile Root */}
                <div className={`
                    w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white/40 backdrop-blur-md border-r border-indigo-50/50 
                    ${isRoot ? 'block' : 'hidden md:block'}
                `}>
                    {sidebar}
                </div>

                {/* Main Content: Visible on Desktop OR on Mobile Child Routes */}
                <div className={`
                    flex-1 bg-slate-50/30 relative
                    ${!isRoot ? 'block' : 'hidden md:block'}
                `}>
                    {children}
                </div>
            </div>
        </div>
    );
}
