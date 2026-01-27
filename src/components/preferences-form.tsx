"use client";

import { useActionState, useEffect } from "react";
import { updateMatchPreferences } from "@/lib/match-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Helper for arrays in form
const arrayToString = (arr?: string[]) => arr?.join(", ") || "";

export default function PreferencesForm({ initialData }: { initialData?: any }) {
    const [state, action, isPending] = useActionState(updateMatchPreferences, undefined);

    return (
        <form action={action} className="space-y-8 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Match Preferences</h2>

            <div className="grid gap-6">

                {/* CAREER PREFERENCES */}
                <div className="bg-gray-50 p-4 rounded-md space-y-4">
                    <h3 className="font-semibold text-gray-700">Career & Location</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Industries</label>
                        <Input
                            name="preferredIndustries"
                            placeholder="IT, Finance, Medical (Comma separated)"
                            defaultValue={arrayToString(initialData?.preferredIndustries)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Experience (Years)</label>
                            <Input type="number" name="minExperience" placeholder="0" min="0" defaultValue={initialData?.minExperience} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Experience (Years)</label>
                            <Input type="number" name="maxExperience" placeholder="20" min="0" defaultValue={initialData?.maxExperience} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Income</label>
                            <Input name="minIncome" placeholder="5 LPA" defaultValue={initialData?.minIncome} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Income</label>
                            <Input name="maxIncome" placeholder="20 LPA" defaultValue={initialData?.maxIncome} />
                        </div>
                    </div>
                </div>

                {/* PERSONAL PREFERENCES */}
                <div className="bg-gray-50 p-4 rounded-md space-y-4">
                    <h3 className="font-semibold text-gray-700">Personal & Background</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                            <Input type="number" name="minAge" placeholder="21" min="18" defaultValue={initialData?.minAge} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                            <Input type="number" name="maxAge" placeholder="40" min="18" defaultValue={initialData?.maxAge} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Height (cm)</label>
                            <Input type="number" name="minHeight" placeholder="150" min="100" defaultValue={initialData?.minHeight} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Height (cm)</label>
                            <Input type="number" name="maxHeight" placeholder="200" min="100" defaultValue={initialData?.maxHeight} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations</label>
                        <Input
                            name="preferredLocations"
                            placeholder="Mumbai, Bangalore, Remote (Comma separated)"
                            defaultValue={arrayToString(initialData?.preferredLocations)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Religions</label>
                        <Input
                            name="preferredReligions"
                            placeholder="Hindu, Muslim, Christian (Comma separated)"
                            defaultValue={arrayToString(initialData?.preferredReligions)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Castes</label>
                        <Input
                            name="preferredCastes"
                            placeholder="Brahmin, Nair, Ezhava (Comma separated)"
                            defaultValue={arrayToString(initialData?.preferredCastes)}
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongues</label>
                        <Input
                            name="preferredMotherTongues"
                            placeholder="Hindi, Malayalam, Tamil (Comma separated)"
                            defaultValue={arrayToString(initialData?.preferredMotherTongues)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                        <Input
                            name="maritalStatus"
                            placeholder="Single, Divorced, Widowed"
                            defaultValue={arrayToString(initialData?.maritalStatus)}
                        />
                    </div>
                </div>
            </div>


            {
                state?.message && (
                    <div className={`p-3 rounded text-sm ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {state.message}
                    </div>
                )
            }

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Saving Preferences..." : "Save Preferences"}
            </Button>
        </form >
    );
}
