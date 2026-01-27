import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Sparkles, Menu } from "lucide-react";

export async function Navbar() {
    const session = await auth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-2xl transition-all supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-20 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
                {/* Brand Logo - Premium Look */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-1.5 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-black tracking-tight text-slate-900">
                        Career<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Matrimony</span>
                    </div>
                </Link>

                {/* Desktop Navigation - Centered & Modern */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    {session?.user ? (
                        <>
                            <NavLink href="/dashboard">Dashboard</NavLink>
                            <NavLink href="/matches">Find Matches</NavLink>
                            <NavLink href="/messages">Messages</NavLink>
                            {session.user.role === "ADMIN" && (
                                <NavLink href="/admin" className="text-red-500 hover:text-red-600">Admin</NavLink>
                            )}
                        </>
                    ) : (
                        <>
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/about">Process</NavLink>
                            <NavLink href="/stories">Success Stories</NavLink>
                        </>
                    )}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {session?.user ? (
                        <>
                            <UserNav user={session.user} />
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 font-semibold rounded-full">Sign In</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 rounded-full px-6 font-bold transition-all hover:-translate-y-0.5">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                    <MobileNav user={session?.user} />
                </div>
            </div>
        </header>
    );
}

// Helper for consistent links
function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link
            href={href}
            className={`hover:text-indigo-600 transition-colors relative group py-2 ${className || ""}`}
        >
            {children}
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full duration-300" />
        </Link>
    );
}
