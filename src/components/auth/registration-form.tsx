"use client";

import { register } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function RegistrationForm() {
    const [state, action, isPending] = useActionState(register, undefined);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [mobile, setMobile] = useState("");
    const [mobileError, setMobileError] = useState("");

    const validateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (!value) { setEmailError(""); return; }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError("Invalid email format.");
            return;
        }

        const allowedDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com", "protonmail.com"];
        const domain = value.split("@")[1];
        if (domain && !allowedDomains.includes(domain)) {
            setEmailError("Please use a common email provider (Gmail, Outlook, Yahoo, etc.)");
        } else {
            setEmailError("");
        }
    };

    const validateMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setMobile(value);
        if (value.length > 0 && value.length !== 10) {
            setMobileError("Mobile number must be exactly 10 digits.");
        } else {
            setMobileError("");
        }
    };

    const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        if (val.length > 0 && val.length < 6) {
            setPasswordError("Password must be at least 6 chars.");
        } else {
            setPasswordError("");
        }
    };

    return (
        <form action={action} className="space-y-5">
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                        Full Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="e.g. Aditi Sharma"
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    />
                    {state?.errors?.name && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                            Gender
                        </label>
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                                <input type="radio" name="gender" value="Male" required className="peer sr-only" />
                                <div className="h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-700 transition-all">
                                    Male
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input type="radio" name="gender" value="Female" required className="peer sr-only" />
                                <div className="h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-700 transition-all">
                                    Female
                                </div>
                            </label>
                        </div>
                        {state?.errors?.gender && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.gender}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                            Mobile Number
                        </label>
                        <Input
                            id="mobile"
                            name="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="9876543210"
                            value={mobile}
                            onChange={validateMobile}
                            maxLength={10}
                            className={`h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium ${mobileError ? "border-red-300" : ""}`}
                        />
                    </div>
                </div>
                {mobileError && (
                    <p className="text-sm text-red-500 pl-1 font-medium">{mobileError}</p>
                )}
                {state?.errors?.phoneNumber && (
                    <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.phoneNumber}</p>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
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
                        className={`h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium ${emailError ? "border-red-300" : ""}`}
                    />
                    {emailError && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{emailError}</p>
                    )}
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.email}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                        Password
                    </label>
                    <PasswordInput
                        id="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        placeholder="Create a password"
                        value={password}
                        onChange={validatePassword}
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    />
                    {passwordError && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{passwordError}</p>
                    )}
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

            <Button type="submit" disabled={isPending || !!emailError || !!mobileError || !!passwordError} className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                {isPending ? "Creating Account..." : (
                    <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                )}
            </Button>
        </form>
    );
}
