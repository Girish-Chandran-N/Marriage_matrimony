"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";

const PROFESSIONS = [
    "Software Engineer",
    "Doctor",
    "Teacher",
    "Business Owner",
    "Lawyer",
    "Accountant",
    "Nurse",
    "Marketing Professional",
    "Government Employee",
    "Other"
];

export function SearchForm() {
    const router = useRouter();
    const [lookingFor, setLookingFor] = useState<"bride" | "groom">("bride");
    const [ageMin, setAgeMin] = useState("");
    const [ageMax, setAgeMax] = useState("");
    const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
    const [showProfessions, setShowProfessions] = useState(false);

    const handleProfessionToggle = (profession: string) => {
        setSelectedProfessions(prev =>
            prev.includes(profession)
                ? prev.filter(p => p !== profession)
                : [...prev, profession]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build query params
        const params = new URLSearchParams();
        params.set("gender", lookingFor === "bride" ? "Female" : "Male");
        if (ageMin) params.set("ageMin", ageMin);
        if (ageMax) params.set("ageMax", ageMax);
        if (selectedProfessions.length > 0) {
            params.set("professions", selectedProfessions.join(","));
        }

        router.push(`/matches?${params.toString()}`);
    };

    return (
        <div className="bg-white/95 backdrop-blur-md lg:bg-white p-6 lg:p-10 rounded-[30px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full blur-3xl -z-10 opacity-60"></div>

            <div className="mb-6 lg:mb-8 space-y-2">
                <div className="inline-flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Heart className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Career Matrimony</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Your Perfect Match is waiting…</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Looking For */}
                <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">I am looking for a</Label>
                    <RadioGroup
                        value={lookingFor}
                        onValueChange={(value) => setLookingFor(value as "bride" | "groom")}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-3 flex-1 cursor-pointer hover:bg-rose-50 transition-colors border-2 border-transparent has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50">
                            <RadioGroupItem value="bride" id="bride" />
                            <Label htmlFor="bride" className="cursor-pointer font-semibold text-slate-800 flex-1">Bride</Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-3 flex-1 cursor-pointer hover:bg-blue-50 transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                            <RadioGroupItem value="groom" id="groom" />
                            <Label htmlFor="groom" className="cursor-pointer font-semibold text-slate-800 flex-1">Groom</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Age Range */}
                <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Age Group</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={ageMin}
                            onChange={(e) => setAgeMin(e.target.value)}
                            className="flex-1 h-12 rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                            min="18"
                            max="100"
                        />
                        <span className="text-slate-400 font-bold">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={ageMax}
                            onChange={(e) => setAgeMax(e.target.value)}
                            className="flex-1 h-12 rounded-xl border-slate-200 focus:border-rose-500 focus:ring-rose-500"
                            min="18"
                            max="100"
                        />
                    </div>
                </div>

                {/* Profession */}
                <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700">Search by Profession</Label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowProfessions(!showProfessions)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white hover:border-rose-500 transition-colors flex items-center justify-between font-medium text-slate-700"
                        >
                            <span className="text-sm">
                                {selectedProfessions.length === 0
                                    ? "Select professions..."
                                    : `${selectedProfessions.length} selected`}
                            </span>
                            <svg className={`w-5 h-5 transition-transform ${showProfessions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showProfessions && (
                            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                                <div className="p-3 space-y-2">
                                    {PROFESSIONS.map((profession) => (
                                        <label
                                            key={profession}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                                        >
                                            <Checkbox
                                                checked={selectedProfessions.includes(profession)}
                                                onCheckedChange={() => handleProfessionToggle(profession)}
                                            />
                                            <span className="text-sm font-medium text-slate-700">{profession}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg shadow-rose-500/30 transition-all hover:shadow-xl hover:shadow-rose-500/40"
                >
                    FIND YOUR {lookingFor.toUpperCase()}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 font-medium">
                    New here?{" "}
                    <a href="/register" className="font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all">
                        Create your profile
                    </a>
                </p>
            </div>
        </div>
    );
}
