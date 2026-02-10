"use client";

import { updateMatchPreferences } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Briefcase, GraduationCap, Ruler, MessageSquare } from "lucide-react";

export default function MatchPreferencesForm({
    initialData,
    onBack,
    onNext
}: {
    initialData?: any,
    onBack?: () => void,
    onNext?: () => void
}) {
    const [state, action, isPending] = useActionState(updateMatchPreferences, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            if (onNext) onNext();
        }
    }, [state, onNext, router]);

    const joinList = (list: string[] | undefined) => Array.isArray(list) ? list.join(", ") : (list || "");

    return (
        <form action={action} className="space-y-8">

            {/* Basic Preferences */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    Basic Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Age Range</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" name="minAge" defaultValue={initialData?.minAge || 18} min="18" max="70" placeholder="Min" />
                            <span className="text-gray-400">to</span>
                            <Input type="number" name="maxAge" defaultValue={initialData?.maxAge || 35} min="18" max="70" placeholder="Max" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Height Range (cm)</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" name="minHeight" defaultValue={initialData?.minHeight || 150} min="120" max="220" placeholder="Min" />
                            <span className="text-gray-400">to</span>
                            <Input type="number" name="maxHeight" defaultValue={initialData?.maxHeight || 180} min="120" max="220" placeholder="Max" />
                        </div>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Marital Status</Label>
                        <Input name="maritalStatus" defaultValue={joinList(initialData?.maritalStatus)} placeholder="e.g. Never Married, Divorced, Widowed" />
                        <p className="text-xs text-gray-500">Comma separated</p>
                    </div>
                </div>
            </div>

            {/* Religious & Location */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Religion & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Preferred Religions</Label>
                        <Input name="preferredReligions" defaultValue={joinList(initialData?.preferredReligions)} placeholder="e.g. Hindu, Sikh" />
                    </div>
                    <div className="space-y-2 flex items-center pt-8">
                        <input type="checkbox" name="otherReligions" id="otherReligions" defaultChecked={initialData?.otherReligions} className="h-4 w-4 rounded border-gray-300 text-indigo-600 mr-2" />
                        <Label htmlFor="otherReligions" className="font-normal text-gray-700">Open to other religions?</Label>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Preferred Locations</Label>
                        <Input name="preferredLocations" defaultValue={joinList(initialData?.preferredLocations)} placeholder="e.g. Mumbai, Delhi, USA" />
                        <div className="flex items-center pt-2">
                            <input type="checkbox" name="readyToRelocate" id="readyToRelocate" defaultChecked={initialData?.readyToRelocate} className="h-4 w-4 rounded border-gray-300 text-indigo-600 mr-2" />
                            <Label htmlFor="readyToRelocate" className="font-normal text-gray-700">Open to relocation?</Label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Preferences */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Professional & Educational
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Education</Label>
                        <Input name="education" defaultValue={joinList(initialData?.education)} placeholder="e.g. Bachelors, Masters" />
                    </div>
                    <div className="space-y-2">
                        <Label>Job Status</Label>
                        <Input name="jobStatus" defaultValue={joinList(initialData?.jobStatus)} placeholder="e.g. Working, Business" />
                    </div>
                    <div className="space-y-2">
                        <Label>Income Range</Label>
                        <Input name="incomeRange" defaultValue={joinList(initialData?.incomeRange)} placeholder="e.g. 10-15 LPA" />
                    </div>
                </div>
            </div>

            {/* Expectations */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    More About Partner
                </h3>
                <div className="space-y-2">
                    <Label>Partner Expectations</Label>
                    <textarea
                        name="expectations"
                        defaultValue={initialData?.expectations || ""}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        placeholder="Describe what you are looking for in a partner..."
                    />
                </div>
            </div>

            {state?.message && <p className={state.success ? "text-green-600 text-sm" : "text-red-500 text-sm"}>{state.message}</p>}

            <div className="flex justify-between pt-6 border-t border-gray-100">
                {onBack && (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                        Back
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 text-white"
                >
                    {isPending ? "Saving..." : "Save Preferences"}
                </Button>
            </div>
        </form>
    );
}
