"use client";

import { authenticate } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [errorMessage, action, isPending] = useActionState(authenticate, undefined);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setEmailError("");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        const allowedDomains = [
            "gmail.com",
            "outlook.com",
            "yahoo.com",
            "hotmail.com",
            "icloud.com",
            "protonmail.com",
        ];
        const domain = value.split("@")[1];

        if (domain && !allowedDomains.includes(domain)) {
            setEmailError("Please use a common email provider (Gmail, Outlook, Yahoo, etc.)");
        } else {
            setEmailError("");
        }
    };

    return (
        <main className="flex min-h-[100dvh] bg-[#09090b] lg:bg-white text-white lg:text-slate-900">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-2/3 relative">
                <div className="absolute inset-0 bg-slate-900/10 z-10"></div>
                <Image
                    src="/auth-hero.png"
                    alt="Happy Couple"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20"></div>
                <div className="absolute bottom-32 left-12 right-12 z-30 text-white">
                    <h2 className="text-4xl font-black mb-4 leading-tight">Match Your Career,<br />Find Your Life Partner.</h2>
                    <p className="text-lg text-white/90 font-medium max-w-xl">
                        Join the exclusive community where professionals meet their perfect match. Verified profiles, career-centric matchmaking, and premium features.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center p-6 sm:p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8 mx-auto mt-12 lg:mt-0">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 lg:mb-8">
                            <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl lg:text-xl font-bold text-white lg:text-slate-900 tracking-tight">Career Matrimony</span>
                        </Link>
                        <h1 className="text-4xl lg:text-3xl font-black text-white lg:text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-slate-400 lg:text-slate-500 font-medium">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-2 mt-4">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={validateEmail}
                                    className={`h-14 lg:h-12 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium ${emailError ? "border-red-500 lg:border-red-300" : ""}`}
                                />
                                {emailError && (
                                    <p className="text-sm text-red-500 mt-1 font-medium animate-in slide-in-from-top-1">{emailError}</p>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2 mt-2">
                                    <label htmlFor="password" className="block text-sm font-bold text-slate-300 lg:text-slate-700">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm font-semibold text-indigo-400 lg:text-indigo-600 hover:text-indigo-300 lg:hover:text-indigo-500 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="Enter your password"
                                    className="h-14 lg:h-12 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-4 lg:p-3 bg-red-950/50 lg:bg-red-50 border border-red-900/50 lg:border-red-100 rounded-2xl lg:rounded-xl text-sm font-medium text-red-400 lg:text-red-600 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <span className="bg-red-900/50 lg:bg-red-100 p-1.5 lg:p-1 rounded-full text-base lg:text-sm">🚫</span> {errorMessage}
                            </div>
                        )}

                        <Button type="submit" disabled={isPending || !!emailError} className="w-full h-14 lg:h-12 bg-white lg:bg-slate-900 text-black lg:text-white hover:bg-slate-200 lg:hover:bg-slate-800 rounded-2xl lg:rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4">
                            {isPending ? "Signing in..." : (
                                <span className="flex items-center gap-2">Sign in <ArrowRight className="w-5 h-5" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-sm text-slate-400 lg:text-slate-500 font-medium">
                            Don't have an account?{" "}
                            <Link href="/register" className="font-bold text-indigo-400 lg:text-indigo-600 hover:text-indigo-300 lg:hover:text-indigo-500 hover:underline">
                                Create a free account
                            </Link>
                        </p>
                    </div>

                    <div className="pt-8 mt-8 border-t border-slate-100">
                        <p className="text-xs text-center text-slate-400 font-medium">
                            &copy; 2024 Career Matrimony. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
