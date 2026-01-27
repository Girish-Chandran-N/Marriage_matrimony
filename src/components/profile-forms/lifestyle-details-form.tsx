"use client";

import { updateLifestyleDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LifestyleDetailsFormProps {
    onBack?: () => void;
    onNext?: () => void; // Optional next step if we add more
    initialData?: any;
    isEditMode?: boolean;
}

export default function LifestyleDetailsForm({ onBack, onNext, initialData, isEditMode = false }: LifestyleDetailsFormProps) {
    const [state, action, isPending] = useActionState(updateLifestyleDetails, undefined);
    const router = useRouter();

    const [diet, setDiet] = useState<string>(initialData?.diet || "");
    const [drinking, setDrinking] = useState<string>(initialData?.drinking || "");
    const [smoking, setSmoking] = useState<string>(initialData?.smoking || "");
    const [hobbies, setHobbies] = useState<string>(Array.isArray(initialData?.hobbies) ? initialData?.hobbies.join(", ") : (initialData?.hobbies || ""));

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                setDiet(state.data.diet || "");
                setDrinking(state.data.drinking || "");
                setSmoking(state.data.smoking || "");

                const hobs = state.data.hobbies;
                if (Array.isArray(hobs)) {
                    setHobbies(hobs.join(", "));
                } else {
                    setHobbies(hobs || "");
                }
                router.refresh();
            }
            if (isEditMode) {
                // In edit mode, maybe just show success or call onNext if provided?
                // For now, let's just assume we stay or refresh. 
                // Actually, let's use onNext if provided, or do nothing (the form might show a success toast in a real app, here we have Inline message)
                if (onNext) onNext();
            } else {
                router.push("/dashboard");
            }
        }
    }, [state, router, isEditMode, onNext]);

    return (
        <form action={action} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Diet</label>
                    <select
                        name="diet"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Eggetarian">Eggetarian</option>
                        <option value="Vegan">Vegan</option>
                    </select>
                    {state?.errors?.diet && <p className="text-red-500 text-xs">{state.errors.diet}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Drinking</label>
                    <select
                        name="drinking"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={drinking}
                        onChange={(e) => setDrinking(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="No">No</option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Yes">Yes</option>
                    </select>
                    {state?.errors?.drinking && <p className="text-red-500 text-xs">{state.errors.drinking}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Smoking</label>
                    <select
                        name="smoking"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={smoking}
                        onChange={(e) => setSmoking(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="No">No</option>
                        <option value="Occasionally">Occasionally</option>
                        <option value="Yes">Yes</option>
                    </select>
                    {state?.errors?.smoking && <p className="text-red-500 text-xs">{state.errors.smoking}</p>}
                </div>
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Hobbies</label>
                    <Input
                        type="text"
                        name="hobbies"
                        placeholder="Traveling, Reading, Coding..."
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Separate multiple hobbies with commas</p>
                    {state?.errors?.hobbies && <p className="text-red-500 text-xs">{state.errors.hobbies}</p>}
                </div>
            </div>

            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

            <div className="flex justify-between">
                {onBack && (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                        Back
                    </Button>
                )}
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Finish Profile"}
                </Button>
            </div>
        </form>
    );
}
