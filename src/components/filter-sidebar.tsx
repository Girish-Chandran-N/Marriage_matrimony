"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, X } from "lucide-react";

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // Local state for inputs
    const [filters, setFilters] = useState({
        industry: searchParams.get("industry") || "",
        location: searchParams.get("location") || "",
        ageMin: searchParams.get("ageMin") || "",
        ageMax: searchParams.get("ageMax") || "",
        minHeight: searchParams.get("minHeight") || "",
        maxHeight: searchParams.get("maxHeight") || "",
        religion: searchParams.get("religion") || "",
        caste: searchParams.get("caste") || "",
        motherTongue: searchParams.get("motherTongue") || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApply = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`/matches?${params.toString()}`);
        setIsOpen(false); // Close on mobile after apply
    };

    const handleReset = () => {
        setFilters({
            industry: "", location: "", ageMin: "", ageMax: "",
            minHeight: "", maxHeight: "", religion: "", caste: "", motherTongue: ""
        });
        router.push("/matches");
        setIsOpen(false);
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
                w-full md:w-80 h-fit space-y-8
                ${isOpen ? 'block' : 'hidden md:block'}
            `}>
                <div className="flex justify-between items-center pb-4 border-b border-purple-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-purple-600" />
                        Refine Matches
                    </h3>
                    <button onClick={handleReset} className="text-xs font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-2 py-1 rounded transition-colors">
                        Reset All
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Keyword Search */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Keywords</label>
                        <div className="space-y-3">
                            <Input
                                name="industry"
                                placeholder="Job, Company, or Industry"
                                value={filters.industry}
                                onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl"
                            />
                            <Input
                                name="location"
                                placeholder="Location (e.g. Mumbai)"
                                value={filters.location}
                                onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Age Range</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="number" name="ageMin" placeholder="18"
                                value={filters.ageMin} onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl text-center"
                            />
                            <span className="text-gray-300">-</span>
                            <Input
                                type="number" name="ageMax" placeholder="60"
                                value={filters.ageMax} onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl text-center"
                            />
                        </div>
                    </div>

                    {/* Height Range */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Height (cm)</label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="number" name="minHeight" placeholder="Min"
                                value={filters.minHeight} onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl text-center"
                            />
                            <span className="text-gray-300">-</span>
                            <Input
                                type="number" name="maxHeight" placeholder="Max"
                                value={filters.maxHeight} onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl text-center"
                            />
                        </div>
                    </div>

                    {/* Background */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Background</label>
                        <div className="space-y-3">
                            <Input
                                name="religion"
                                placeholder="Religion"
                                value={filters.religion}
                                onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl"
                            />
                            <Input
                                name="caste"
                                placeholder="Caste"
                                value={filters.caste}
                                onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl"
                            />
                            <Input
                                name="motherTongue"
                                placeholder="Mother Tongue"
                                value={filters.motherTongue}
                                onChange={handleChange}
                                className="h-10 text-sm bg-white/60 border-gray-200 focus:border-purple-300 focus:ring-purple-100 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    <Button onClick={handleApply} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-200 h-11 rounded-xl font-medium transition-all hover:scale-[1.02]">
                        Apply Filters
                    </Button>
                </div>
            </div>
        </>
    );
}
