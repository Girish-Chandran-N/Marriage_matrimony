"use client";

import { ChevronLeft, LogOut, UserMinus, ShieldQuestion, Bell, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { deleteMyAccount } from "@/lib/user-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Are you absolutely sure you want to delete your entire profile, matches, and chats? This action cannot be undone.");
        if (!confirmed) return;

        setIsDeleting(true);
        const res = await deleteMyAccount();
        if (res.success) {
            await signOut({ callbackUrl: "/" });
        } else {
            alert(res.error || "Something went wrong deleting the account.");
            setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-[#09090b] text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-[#121214]/80 backdrop-blur-md border-b border-[#222] px-4 py-3 flex items-center justify-between">
                <Link href="/profile" className="text-slate-400 hover:text-white">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold">Settings</h1>
                <div className="w-10" />
            </div>

            {/* List */}
            <div className="p-4 space-y-6">
                
                <section>
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4 mb-2">Account</h2>
                    <div className="bg-[#121214] border border-[#222] rounded-3xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-[#222] active:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-slate-400" />
                                <span className="font-semibold">Notifications</span>
                            </div>
                            <span className="text-sm text-slate-500">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between p-4 active:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-slate-400" />
                                <span className="font-semibold">Privacy & Security</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4 mb-2">Support</h2>
                    <div className="bg-[#121214] border border-[#222] rounded-3xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-[#222] active:bg-[#1a1a1a]">
                            <div className="flex items-center gap-3">
                                <ShieldQuestion className="w-5 h-5 text-slate-400" />
                                <span className="font-semibold">Help Center</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-4 mb-2">Danger Zone</h2>
                    <div className="bg-[#121214] border border-[#222] rounded-3xl overflow-hidden">
                        <button 
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center justify-between p-4 border-b border-[#222] active:bg-[#1a1a1a] text-rose-500"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5" />
                                <span className="font-semibold tracking-wide">Log Out</span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full flex items-center justify-between p-4 active:bg-[#1a1a1a] text-red-600 focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <UserMinus className="w-5 h-5" />
                                <span className="font-semibold tracking-wide">{isDeleting ? "Deleting..." : "Delete Account"}</span>
                            </div>
                        </button>
                    </div>
                    <p className="px-4 mt-3 text-xs text-slate-500 text-center">
                        Deleting your account permanently removes your profile, photos, messages, and matches.
                    </p>
                </section>
                
            </div>
            
            <div className="mt-12 text-center pb-8">
                <span className="text-slate-600 text-xs font-bold">Premly App Version 1.0.0</span>
            </div>
        </main>
    );
}
