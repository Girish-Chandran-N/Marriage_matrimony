"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProfessionSearchFiltersProps {
    counts: { category: string; count: number }[];
    currentCategory: string;
    currentAgeMin: string;
    currentAgeMax: string;
}

export default function ProfessionSearchFilters({
    counts,
    currentCategory,
    currentAgeMin,
    currentAgeMax
}: ProfessionSearchFiltersProps) {
    const router = useRouter();


    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);

        if (value && value !== 'all' && value !== 'any') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Handle Age Range manually mapping (e.g., "20-25" -> min=20, max=25)
        if (key === 'ageRange') {
            if (value && value !== 'any') {
                const [min, max] = value.split('-');
                params.set('ageMin', min);
                if (max !== '+') params.set('ageMax', max);
                else params.delete('ageMax'); // 35+ case
            } else {
                params.delete('ageMin');
                params.delete('ageMax');
            }
        }

        // Reset page if needed, or just push
        router.push(`/search/profession?${params.toString()}`);
    };

    // Determine current age range value for select
    let currentAgeRange = 'any';
    if (currentAgeMin === '18' && currentAgeMax === '25') currentAgeRange = '18-25';
    else if (currentAgeMin === '26' && currentAgeMax === '30') currentAgeRange = '26-30';
    else if (currentAgeMin === '31' && currentAgeMax === '35') currentAgeRange = '31-35';
    else if (currentAgeMin === '36') currentAgeRange = '36+';


    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">

            {/* Profession Dropdown */}
            <div className="w-full sm:w-[280px]">
                <Select
                    value={currentCategory}
                    onValueChange={(val) => updateFilters('category', val)}
                >
                    <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Select Profession" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Professions</SelectItem>
                        {counts.map((c) => (
                            <SelectItem key={c.category} value={c.category}>
                                {c.category} <span className="text-slate-400 text-xs ml-2">({c.count})</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Age Dropdown */}
            <div className="w-full sm:w-[180px]">
                <Select
                    value={currentAgeRange}
                    onValueChange={(val) => updateFilters('ageRange', val)}
                >
                    <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Age" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Age</SelectItem>
                        <SelectItem value="18-25">18 - 25 Yrs</SelectItem>
                        <SelectItem value="26-30">26 - 30 Yrs</SelectItem>
                        <SelectItem value="31-35">31 - 35 Yrs</SelectItem>
                        <SelectItem value="36+">36+ Yrs</SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
    );
}
