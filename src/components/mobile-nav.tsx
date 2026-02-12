"use client";

import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Since we determined Sheet doesn't exist, I will implement a simple custom overlay 
// OR use DropdownMenu which DOES exist.
// Let's use a simple distinct Overlay approach for a better "mobile feel" than a small dropdown.
// Actually, using the existing Dialog is a good alternative to Sheet if styled right, 
// but even simpler is a conditional render div.

export function MobileNav({ user }: { user?: any }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const toggle = () => setOpen(!open);

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggle}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>

            {open && (
                <div className="absolute top-20 left-0 right-0 bg-white border-b shadow-lg p-4 flex flex-col gap-4 z-50 animate-in slide-in-from-top-2 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className={`text-sm font-medium transition-colors hover:text-purple-600 ${pathname === "/dashboard" ? "text-purple-600" : ""}`}
                                onClick={toggle}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/matches"
                                className={`text-sm font-medium transition-colors hover:text-purple-600 ${pathname === "/matches" ? "text-purple-600" : ""}`}
                                onClick={toggle}
                            >
                                Matches
                            </Link>
                            <Link
                                href="/search/profession"
                                className={`text-sm font-medium transition-colors hover:text-purple-600 ${pathname?.startsWith("/search/profession") ? "text-purple-600" : ""}`}
                                onClick={toggle}
                            >
                                Search by Professions
                            </Link>
                            <Link
                                href="/messages"
                                className={`text-sm font-medium transition-colors hover:text-purple-600 ${pathname === "/messages" ? "text-purple-600" : ""}`}
                                onClick={toggle}
                            >
                                Messages
                            </Link>
                            {user.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                    onClick={toggle}
                                >
                                    Admin Panel
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                href="/search/profession"
                                className="text-sm font-medium transition-colors hover:text-purple-600"
                                onClick={toggle}
                            >
                                Search by Professions
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-sm font-medium transition-colors hover:text-purple-600"
                                onClick={toggle}
                            >
                                Pricing
                            </Link>
                            <Link href="/login" onClick={toggle}>
                                <Button variant="ghost" className="w-full justify-start">Login</Button>
                            </Link>
                            <Link href="/register" onClick={toggle}>
                                <Button className="w-full bg-purple-600">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
