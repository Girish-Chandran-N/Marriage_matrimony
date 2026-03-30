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
            setEmailError("Please use a common email provider (Gmail, etc.)");
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
        <form action={action} className="space-y-6">
            <div className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1 mt-2">
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
                        className="h-14 lg:h-11 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    />
                    {state?.errors?.name && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dob" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1">
                            Date of Birth
                        </label>
                        <Input
                            id="dob"
                            name="dob"
                            type="date"
                            required
                            value={dob}
                            onChange={validateDob}
                            className={`h-14 lg:h-11 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium block [&::-webkit-calendar-picker-indicator]:invert lg:[&::-webkit-calendar-picker-indicator]:invert-0 ${!dob && "text-slate-500"} `}
                        />
                        {dobError && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{dobError}</p>
                        )}
                        {state?.errors?.dob && (
                            <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.dob}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1">
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
                                <div className="h-14 lg:h-11 flex items-center justify-center rounded-2xl lg:rounded-xl border border-[#222] lg:border-slate-200 bg-[#121214] lg:bg-slate-50 text-slate-300 lg:text-slate-600 font-medium peer-checked:bg-pink-950/40 lg:peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-300 lg:peer-checked:text-pink-700 transition-all">
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
                                <div className="h-14 lg:h-11 flex items-center justify-center rounded-2xl lg:rounded-xl border border-[#222] lg:border-slate-200 bg-[#121214] lg:bg-slate-50 text-slate-300 lg:text-slate-600 font-medium peer-checked:bg-pink-950/40 lg:peer-checked:bg-pink-50 peer-checked:border-pink-500 peer-checked:text-pink-300 lg:peer-checked:text-pink-700 transition-all">
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
                    <label htmlFor="mobile" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1">
                        Mobile Number
                    </label>
                    <div className={`flex items-center w-full h-14 lg:h-11 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border border-[#222] lg:border-slate-200 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all ${mobileError ? "border-red-500 lg:border-red-300" : ""}`}>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="w-[72px] h-full bg-transparent border-0 focus:ring-0 focus:ring-offset-0 rounded-l-2xl lg:rounded-l-xl rounded-r-none font-medium text-sm px-2 shadow-none hover:bg-transparent text-white lg:text-slate-700">
                                <span className="truncate w-full text-center">{countryCode}</span>
                            </SelectTrigger>
                            <SelectContent className="bg-[#121214] lg:bg-white text-white lg:text-black border-[#333] lg:border-slate-200">
                                {COUNTRY_CODES.map((c) => (
                                    <SelectItem key={c.country} value={c.country} className="focus:bg-[#222] lg:focus:bg-slate-100 focus:text-white lg:focus:text-black hover:cursor-pointer">
                                        {c.country} ({c.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="w-[1px] h-6 bg-[#333] lg:bg-slate-200 my-auto"></div>
                        <Input
                            id="mobile"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="9876543210"
                            value={mobile}
                            onChange={handleMobileChange}
                            maxLength={15}
                            className="flex-1 h-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-2xl lg:rounded-r-xl rounded-l-none font-medium text-white lg:text-slate-700 placeholder:text-slate-500 lg:placeholder:text-slate-400 shadow-none text-base"
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
                    <label htmlFor="email" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1">
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
                        className={`h-14 lg:h-11 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium ${emailError ? "border-red-500 lg:border-red-300" : ""}`}
                    />
                    {emailError && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{emailError}</p>
                    )}
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.email}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-slate-300 lg:text-slate-700 mb-1 lg:pl-1">
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
                        className="h-14 lg:h-11 rounded-2xl lg:rounded-xl bg-[#121214] lg:bg-slate-50 border-[#222] lg:border-slate-200 text-white lg:text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium"
                    />
                    {passwordError && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{passwordError}</p>
                    )}

                    {/* Password Strength Checklist */}
                    {password && (
                        <div className="mt-3 space-y-1.5 p-4 lg:p-3 bg-[#121214] lg:bg-slate-50 rounded-2xl lg:rounded-xl border border-[#222] lg:border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 lg:text-slate-500 mb-2">Password Requirements:</p>
                            <div className="grid grid-cols-2 gap-3 lg:gap-2">
                                <MenuItem invalid={!passwordCriteria.length}>At least 8 chars</MenuItem>
                                <MenuItem invalid={!passwordCriteria.upper}>1 uppercase</MenuItem>
                                <MenuItem invalid={!passwordCriteria.lower}>1 lowercase</MenuItem>
                                <MenuItem invalid={!passwordCriteria.number}>1 number</MenuItem>
                                <MenuItem invalid={!passwordCriteria.special}>1 special char</MenuItem>
                            </div>
                        </div>
                    )}
                    {state?.errors?.password && (
                        <p className="text-sm text-red-500 mt-1 pl-1 font-medium">{state.errors.password}</p>
                    )}
                </div>
            </div>

            {state?.message && (
                <div className="p-4 lg:p-3 bg-red-950/50 lg:bg-red-50 border border-red-900/50 lg:border-red-100 rounded-2xl lg:rounded-xl text-sm font-medium text-red-400 lg:text-red-600 flex items-center gap-3 animate-in slide-in-from-top-2">
                    <span className="bg-red-900/50 lg:bg-red-100 p-1.5 lg:p-1 rounded-full text-base lg:text-sm">🚫</span> {state.message}
                </div>
            )}

            <Button type="submit" disabled={isPending || !!emailError || !!mobileError || !isPasswordValid || !!dobError || !dob} className="w-full h-14 lg:h-12 bg-white lg:bg-slate-900 text-black lg:text-white hover:bg-slate-200 lg:hover:bg-slate-800 rounded-2xl lg:rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4">
                {isPending ? "Creating Account..." : (
                    <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                )}
            </Button>
        </form>
    );
}

function MenuItem({ children, invalid }: { children: React.ReactNode; invalid: boolean }) {
    return (
        <div className={`flex items-center gap-2 lg:gap-1.5 text-xs ${invalid ? "text-slate-500 lg:text-slate-400" : "text-green-400 lg:text-green-600 font-medium"}`}>
            {invalid ? (
                <div className="w-4 h-4 rounded-full border border-[#444] lg:border-slate-300 flex items-center justify-center shrink-0" />
            ) : (
                <div className="w-4 h-4 rounded-full bg-green-500/20 lg:bg-green-100 border border-green-500/30 lg:border-green-200 flex items-center justify-center shrink-0 text-green-400 lg:text-green-600">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            )}
            {children}
        </div>
    );
}
