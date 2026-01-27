"use client";

import { register } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(register, undefined);

    return (
        <main className="flex min-h-screen items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
                <div className="absolute top-40 -right-40 w-[600px] h-[600px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob opacity-70"></div>
                <div className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 opacity-70"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="w-full max-w-lg p-4 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[32px] p-8 md:p-12">
                    <div className="text-center space-y-2 mb-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-4 shadow-lg shadow-pink-200">
                            <HeartHandshake className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Join Us Today
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Start your journey to find your perfect match.
                        </p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 pl-1">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="John Doe"
                                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                                />
                                {state?.errors?.name && (
                                    <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 pl-1">
                                    Email address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="name@example.com"
                                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                                />
                                {state?.errors?.email && (
                                    <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 pl-1">
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="Create a password"
                                    className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                                />
                                {state?.errors?.password && (
                                    <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.password}</p>
                                )}
                            </div>
                        </div>

                        {state?.message && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-medium text-red-600 flex items-center gap-2 animate-in slide-in-from-top-2">
                                <span className="bg-red-100 p-1 rounded-full">🚫</span> {state.message}
                            </div>
                        )}

                        <Button type="submit" disabled={isPending} className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            {isPending ? "Creating Account..." : (
                                <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-pink-600 hover:text-pink-500 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-8 font-medium">
                    By registering you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </main>
    );
}
