"use client";

import { register } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { COUNTRY_CODES } from "@/lib/constants";

export function RegistrationForm() {
    const [state, action, isPending] = useActionState(register, undefined);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("India");
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState("");
    const [dobError, setDobError] = useState("");

    const countryCode = COUNTRY_CODES.find(c => c.country === selectedCountry)?.code || "+91";
    const [mobileError, setMobileError] = useState("");
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
    });

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

    useEffect(() => {
        if (mobile.length > 0) {
            const countryCode = COUNTRY_CODES.find(c => c.country === selectedCountry)?.code || "+91";
            const fullNumber = `${countryCode}${mobile}`;
            const phoneNumber = parsePhoneNumberFromString(fullNumber);

            if (phoneNumber && phoneNumber.isValid()) {
                setMobileError("");
            } else {
                setMobileError(`Invalid mobile number for ${selectedCountry}.`);
            }
        } else {
            setMobileError("");
        }
    }, [mobile, selectedCountry]);

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;
        setMobile(value);
    };

    const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);

        const criteria = {
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            lower: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[^A-Za-z0-9]/.test(val),
        };

        setPasswordCriteria(criteria);

        if (Object.values(criteria).every(Boolean)) {
            setPasswordError("");
        } else {
            if (val.length > 0) setPasswordError("Password does not meet all requirements.");
        }
    };


    const validateDob = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDob(value);
        if (!value) { setDobError(""); return; }

        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            setDobError("You must be at least 18 years old.");
        } else {
            setDobError("");
        }
    };

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

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
                        defaultValue={state?.payload?.name}
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    />
                    {state?.errors?.name && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dob" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                            Date of Birth
                        </label>
                        <Input
                            id="dob"
                            name="dob"
                            type="date"
                            required
                            value={dob}
                            onChange={validateDob}
                            className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                        />
                        {dobError && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{dobError}</p>
                        )}
                        {state?.errors?.dob && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.dob}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                            Gender
                        </label>
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    required
                                    className="peer sr-only"
                                    defaultChecked={state?.payload?.gender === "Male"}
                                />
                                <div className="h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-700 transition-all">
                                    Male
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    required
                                    className="peer sr-only"
                                    defaultChecked={state?.payload?.gender === "Female"}
                                />
                                <div className="h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-700 transition-all">
                                    Female
                                </div>
                            </label>
                        </div>
                        {state?.errors?.gender && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.gender}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="mobile" className="block text-sm font-bold text-slate-700 mb-1 pl-1">
                        Mobile Number
                    </label>
                    <div className={`flex items-center w-full h-11 rounded-xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all ${mobileError ? "border-red-300" : ""}`}>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="w-[72px] h-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0 rounded-l-xl rounded-r-none font-medium text-sm px-2 shadow-none hover:bg-transparent">
                                <span className="truncate w-full text-center text-slate-700">{countryCode}</span>
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRY_CODES.map((c) => (
                                    <SelectItem key={c.country} value={c.country}>
                                        {c.country} ({c.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="w-[1px] h-6 bg-slate-200 my-auto"></div>
                        <Input
                            id="mobile"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="9876543210"
                            value={mobile}
                            onChange={handleMobileChange}
                            maxLength={15}
                            className="flex-1 h-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-xl rounded-l-none font-medium text-slate-700 placeholder:text-slate-400 shadow-none"
                        />
                    </div>
                    {/* Hidden input to send full number to server action */}
                    <input type="hidden" name="phoneNumber" value={`${countryCode}${mobile}`} />
                    {mobileError && (
                        <p className="text-sm text-red-500 pl-1 font-medium">{mobileError}</p>
                    )}
                    {state?.errors?.phoneNumber && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.phoneNumber}</p>
                    )}
                </div>

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

                    {/* Password Strength Checklist */}
                    {password && (
                        <div className="mt-3 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 mb-2">Password Requirements:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <MenuItem invalid={!passwordCriteria.length}>At least 8 characters</MenuItem>
                                <MenuItem invalid={!passwordCriteria.upper}>One uppercase letter</MenuItem>
                                <MenuItem invalid={!passwordCriteria.lower}>One lowercase letter</MenuItem>
                                <MenuItem invalid={!passwordCriteria.number}>One number</MenuItem>
                                <MenuItem invalid={!passwordCriteria.special}>One special char</MenuItem>
                            </div>
                        </div>
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

            <Button type="submit" disabled={isPending || !!emailError || !!mobileError || !isPasswordValid || !!dobError || !dob} className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                {isPending ? "Creating Account..." : (
                    <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                )}
            </Button>
        </form>
    );
}

function MenuItem({ children, invalid }: { children: React.ReactNode; invalid: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 text-xs ${invalid ? "text-slate-400" : "text-green-600 font-medium"}`}>
            {invalid ? (
                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0" />
            ) : (
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 text-green-600">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
            {children}
        </div>
    );
}
