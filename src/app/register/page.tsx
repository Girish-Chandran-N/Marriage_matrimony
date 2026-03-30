"use client";

import Link from "next/link";
import { HeartHandshake, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { RegistrationForm } from "@/components/auth/registration-form";

export default function RegisterPage() {
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Trusted by Millions</p>
                            <p className="text-white/80 text-sm">Verified profiles only</p>
                        </div>
                    </div>
                    <h2 className="text-4xl font-black mb-4 leading-tight">Begin Your Journey<br />To Forever.</h2>
                    <p className="text-lg text-white/90 font-medium max-w-xl">
                        Create your profile today and connect with compatible professionals who share your values and lifestyle.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center p-6 sm:p-8 lg:p-12 relative z-10 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 mx-auto mt-12 lg:mt-0">
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 lg:w-8 lg:h-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <HeartHandshake className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl lg:text-xl font-bold text-white lg:text-slate-900 tracking-tight">Career Matrimony</span>
                        </Link>
                        <h2 className="text-4xl lg:text-3xl font-black text-white lg:text-slate-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-slate-400 lg:text-slate-500 font-medium">
                            Start your journey to find your perfect match.
                        </p>
                    </div>

                    <RegistrationForm />

                    <div className="text-center pt-4 border-t border-[#222] lg:border-slate-100">
                        <p className="text-sm text-slate-400 lg:text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-pink-500 lg:text-pink-600 hover:text-pink-400 lg:hover:text-pink-500 hover:underline">
                                Sign in here
                            </Link>
                        </p>
                        <p className="text-xs text-[#666] lg:text-slate-400 mt-6 font-medium">
                            By registering you agree to our Terms & Privacy.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

