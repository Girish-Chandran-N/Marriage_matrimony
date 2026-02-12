"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { getMatchPreferences } from "@/lib/match-actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import AdPlacement from "@/components/ad-placement";

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loadingPrefs, setLoadingPrefs] = useState(false);

    // Initial state from URL
    const [filters, setFilters] = useState({
        // Basic
        industry: searchParams.get("industry") || "",
        location: searchParams.get("location") || "",
        ageMin: searchParams.get("ageMin") || "",
        ageMax: searchParams.get("ageMax") || "",
        minHeight: searchParams.get("minHeight") || "",
        maxHeight: searchParams.get("maxHeight") || "",
        religion: searchParams.get("religion") || "",
        caste: searchParams.get("caste") || "",
        motherTongue: searchParams.get("motherTongue") || "",
        gender: searchParams.get("gender") || "",

        // Location
        maritalStatus: searchParams.get("maritalStatus") || "",
        education: searchParams.get("education") || "",

        workingCountry: searchParams.get("workingCountry") || "",
        workingState: searchParams.get("workingState") || "",
        workingDistrict: searchParams.get("workingDistrict") || "",
        nativeCountry: searchParams.get("nativeCountry") || "",
        nativeState: searchParams.get("nativeState") || "",
        nativeDistrict: searchParams.get("nativeDistrict") || "",
        readyToRelocate: searchParams.get("readyToRelocate") === "true",

        // Advanced
        physicalStatus: searchParams.get("physicalStatus") || "",
        familyStatus: searchParams.get("familyStatus") || "",
        complexion: searchParams.get("complexion") || "",
        bodyType: searchParams.get("bodyType") || "",
        employmentCategory: searchParams.get("employmentCategory") || "",
        incomeRange: searchParams.get("incomeRange")?.split(",") || [] as string[],

        // Lifestyle
        eatingHabits: searchParams.get("eatingHabits") || "",
        drinkingHabits: searchParams.get("drinkingHabits") || "",
        smokingHabits: searchParams.get("smokingHabits") || "",

        // Criteria
        isOnline: searchParams.get("isOnline") === "true",
        hasPhoto: searchParams.get("hasPhoto") === "true",
        isPremium: searchParams.get("isPremium") === "true",
    });

    // Toggle Sections
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [showLifestyle, setShowLifestyle] = useState(false);
    const [showCriteria, setShowCriteria] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFilters({ ...filters, [name]: checked });
    };

    const handleApply = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(","));
            } else if (typeof value === 'boolean') {
                if (value) params.set(key, "true");
            } else if (value) {
                params.set(key, value as string);
            }
        });
        router.push(`/matches?${params.toString()}`);
        setIsOpen(false);
    };

    const handleReset = () => {
        setFilters({
            industry: "", location: "", ageMin: "", ageMax: "",
            minHeight: "", maxHeight: "", religion: "", caste: "", motherTongue: "", gender: "",
            workingCountry: "", workingState: "", workingDistrict: "",
            nativeCountry: "", nativeState: "", nativeDistrict: "", readyToRelocate: false,
            physicalStatus: "", familyStatus: "", complexion: "", bodyType: "",
            employmentCategory: "", incomeRange: [], maritalStatus: "", education: "",
            eatingHabits: "", drinkingHabits: "", smokingHabits: "",
            isOnline: false, hasPhoto: false, isPremium: false
        });
        router.push("/matches");
        setIsOpen(false);
    };

    const handleLoadPreferences = async () => {
        setLoadingPrefs(true);
        try {
            const prefs = await getMatchPreferences();
            if (!prefs) {
                toast.error("No partner preferences found. Please set them in your profile.");
                return;
            }

            // Map preferences to filters
            setFilters(prev => ({
                ...prev,
                ageMin: prefs.minAge?.toString() || "",
                ageMax: prefs.maxAge?.toString() || "",
                minHeight: prefs.minHeight?.toString() || "",
                maxHeight: prefs.maxHeight?.toString() || "",
                religion: prefs.preferredReligions?.[0] || "", // Use first for now if single input
                caste: prefs.preferredCastes?.[0] || "",
                motherTongue: prefs.preferredMotherTongues?.[0] || "",
                maritalStatus: prefs.maritalStatus?.[0] || "", // Added mapping

                // Advanced
                education: prefs.education?.[0] || "", // Added mapping
                physicalStatus: prefs.physicalStatus || "",
                familyStatus: prefs.familyStatus?.[0] || "",
                complexion: prefs.complexion?.[0] || "",
                bodyType: prefs.bodyType?.[0] || "",
                employmentCategory: prefs.employmentCategory?.[0] || "",
                incomeRange: prefs.incomeRange || [], // Array
                nativeCountry: prefs.preferredLocations?.[0] || "", // Approximate mapping

                // Lifestyle
                eatingHabits: prefs.eatingHabits?.[0] || "",
                drinkingHabits: prefs.drinkingHabits?.[0] || "",
                smokingHabits: prefs.smokingHabits?.[0] || "",

                // Show sections
            }));
            setShowAdvanced(true);
            setShowLocation(true);
            setShowLifestyle(true);
            toast.success("Preferences loaded!");
        } catch (error) {
            toast.error("Failed to load preferences");
        } finally {
            setLoadingPrefs(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-between bg-white/80 backdrop-blur-sm border-purple-100 text-purple-700 shadow-sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center gap-2"><Filter size={16} /> Filters</span>
                    {isOpen ? <X size={16} /> : null}
                </Button>
            </div>

            {/* Sidebar Content */}
            <div className={`
                bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-purple-500/5 border border-white/50
                w-full md:w-80 h-fit space-y-6 overflow-y-auto max-h-[85vh] scrollbar-thin scrollbar-thumb-purple-100
                ${isOpen ? 'block fixed inset-0 z-50 m-4' : 'hidden md:block'}
            `}>
                <div className="flex justify-between items-center pb-4 border-b border-purple-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-purple-600" />
                        Find Match
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={handleReset} className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors">
                            Reset
                        </button>
                        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400">
                            <X size={18} />
                        </button>
                    </div>

                </div>

                {/* Load Preferences Button */}
                <Button
                    onClick={handleLoadPreferences}
                    disabled={loadingPrefs}
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-white"
                >
                    {loadingPrefs ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 fill-purple-100" />}
                    Load Partner Preference
                </Button>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Basic Criteria</label>

                        {/* Age */}
                        <div className="grid grid-cols-2 gap-2">
                            <Input type="number" name="ageMin" placeholder="Min Age" value={filters.ageMin} onChange={handleChange} className="bg-white/60 h-9" />
                            <Input type="number" name="ageMax" placeholder="Max Age" value={filters.ageMax} onChange={handleChange} className="bg-white/60 h-9" />
                        </div>

                        {/* Height */}
                        <div className="grid grid-cols-2 gap-2">
                            <Input type="number" name="minHeight" placeholder="Min cm" value={filters.minHeight} onChange={handleChange} className="bg-white/60 h-9" />
                            <Input type="number" name="maxHeight" placeholder="Max cm" value={filters.maxHeight} onChange={handleChange} className="bg-white/60 h-9" />
                        </div>

                        {/* Religion/Caste/MotherTongue */}
                        <div className="space-y-2">
                            <Input name="religion" placeholder="Religion" value={filters.religion} onChange={handleChange} className="bg-white/60 h-9" />
                            <Input name="caste" placeholder="Caste" value={filters.caste} onChange={handleChange} className="bg-white/60 h-9" />
                            <Input name="motherTongue" placeholder="Mother Tongue" value={filters.motherTongue} onChange={handleChange} className="bg-white/60 h-9" />
                            <Input name="maritalStatus" placeholder="Marital Status" value={filters.maritalStatus} onChange={handleChange} className="bg-white/60 h-9" />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="border-t border-purple-50 pt-4">
                        <button onClick={() => setShowLocation(!showLocation)} className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 mb-2 hover:text-purple-600">
                            Location
                            {showLocation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showLocation && (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                                <Label className="text-xs text-slate-500">Working Location</Label>
                                <Input name="workingCountry" placeholder="Working Country" value={filters.workingCountry} onChange={handleChange} className="bg-white/60 h-9" />
                                {filters.workingCountry.toLowerCase() === 'india' && (
                                    <>
                                        <Input name="workingState" placeholder="Working State" value={filters.workingState} onChange={handleChange} className="bg-white/60 h-9" />
                                        <Input name="workingDistrict" placeholder="Working District" value={filters.workingDistrict} onChange={handleChange} className="bg-white/60 h-9" />
                                    </>
                                )}

                                <div className="mt-2"></div>
                                <Label className="text-xs text-slate-500">Native Location</Label>
                                <Input name="nativeCountry" placeholder="Native Country" value={filters.nativeCountry} onChange={handleChange} className="bg-white/60 h-9" />
                                {filters.nativeCountry.toLowerCase() === 'india' && (
                                    <>
                                        <Input name="nativeState" placeholder="Native State" value={filters.nativeState} onChange={handleChange} className="bg-white/60 h-9" />
                                        <Input name="nativeDistrict" placeholder="Native District" value={filters.nativeDistrict} onChange={handleChange} className="bg-white/60 h-9" />
                                    </>
                                )}

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="readyToRelocate"
                                        checked={filters.readyToRelocate}
                                        onCheckedChange={(c) => handleCheckboxChange("readyToRelocate", c as boolean)}
                                    />
                                    <Label htmlFor="readyToRelocate" className="text-sm cursor-pointer">Ready to Relocate</Label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Advanced */}
                    <div className="border-t border-purple-50 pt-4">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 mb-2 hover:text-purple-600">
                            Advanced Search
                            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showAdvanced && (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                                <Input name="physicalStatus" placeholder="Physical Status (e.g. Normal)" value={filters.physicalStatus} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="familyStatus" placeholder="Family Status" value={filters.familyStatus} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="complexion" placeholder="Complexion" value={filters.complexion} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="bodyType" placeholder="Body Type" value={filters.bodyType} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="employmentCategory" placeholder="Employment Category" value={filters.employmentCategory} onChange={handleChange} className="bg-white/60 h-9" />
                                {/* Income is simpler text for now */}
                                <Input name="industry" placeholder="Industry / Job Title" value={filters.industry} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="education" placeholder="Education" value={filters.education} onChange={handleChange} className="bg-white/60 h-9" />
                            </div>
                        )}
                    </div>


                    {/* Lifestyle */}
                    <div className="border-t border-purple-50 pt-4">
                        <button onClick={() => setShowLifestyle(!showLifestyle)} className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 mb-2 hover:text-purple-600">
                            Lifestyle
                            {showLifestyle ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showLifestyle && (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                                <Input name="eatingHabits" placeholder="Eating Habits" value={filters.eatingHabits} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="drinkingHabits" placeholder="Drinking Habits" value={filters.drinkingHabits} onChange={handleChange} className="bg-white/60 h-9" />
                                <Input name="smokingHabits" placeholder="Smoking Habits" value={filters.smokingHabits} onChange={handleChange} className="bg-white/60 h-9" />
                            </div>
                        )}
                    </div>

                    {/* More Criteria */}
                    <div className="border-t border-purple-50 pt-4">
                        <button onClick={() => setShowCriteria(!showCriteria)} className="w-full flex justify-between items-center text-sm font-semibold text-gray-700 mb-2 hover:text-purple-600">
                            More Criteria
                            {showCriteria ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        {showCriteria && (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isOnline"
                                        checked={filters.isOnline}
                                        onCheckedChange={(c) => handleCheckboxChange("isOnline", c as boolean)}
                                    />
                                    <Label htmlFor="isOnline" className="text-sm cursor-pointer flex items-center gap-2">
                                        Currently Online <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="hasPhoto"
                                        checked={filters.hasPhoto}
                                        onCheckedChange={(c) => handleCheckboxChange("hasPhoto", c as boolean)}
                                    />
                                    <Label htmlFor="hasPhoto" className="text-sm cursor-pointer">With Photo Only</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isPremium"
                                        checked={filters.isPremium}
                                        onCheckedChange={(c) => handleCheckboxChange("isPremium", c as boolean)}
                                    />
                                    <Label htmlFor="isPremium" className="text-sm cursor-pointer text-amber-600 font-medium">Premium Member</Label>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button onClick={handleApply} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-200 h-11 rounded-xl font-medium transition-all hover:scale-[1.02]">
                        Apply Filters
                    </Button>

                    {/* Advertisement Slot */}
                    <div className="pt-4">
                        <AdPlacement placement="SIDEBAR" />
                    </div>
                </div>
            </div>
        </>
    );
}
