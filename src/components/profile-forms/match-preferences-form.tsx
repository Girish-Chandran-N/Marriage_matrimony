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

    const inputClasses = "w-full bg-[#f2ffe5] border-transparent rounded-full h-11 px-5 py-2 text-sm focus:border-indigo-500 focus:bg-[#e8fccb] focus:ring-2 focus:ring-indigo-200 transition-colors shadow-none text-gray-800 font-medium placeholder:font-normal placeholder:text-gray-400";
    const labelClasses = "block text-sm font-semibold text-gray-900 mb-2 pl-1";

    return (
        <form action={action} className="w-full max-w-6xl mx-auto pb-12">

            <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-3">Partner Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

                    {/* Column 1 */}
                    <div className="space-y-6">
                        <div>
                            <Label className={labelClasses}>Age Range</Label>
                            <div className="flex items-center gap-3">
                                <Input type="number" name="minAge" defaultValue={initialData?.minAge || 18} min="18" max="70" placeholder="Min" className={inputClasses} />
                                <Input type="number" name="maxAge" defaultValue={initialData?.maxAge || 35} min="18" max="70" placeholder="Max" className={inputClasses} />
                            </div>
                        </div>

                        <div>
                            <Label className={labelClasses}>Religion</Label>
                            <Input name="preferredReligions" defaultValue={joinList(initialData?.preferredReligions)} placeholder="e.g. Hindu" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Body Type</Label>
                            <Input name="bodyType" defaultValue={joinList(initialData?.bodyType)} placeholder="e.g. Athletic, Average" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Native Location (Country)</Label>
                            <Input name="nativeCountry" defaultValue={joinList(initialData?.nativeCountry)} placeholder="e.g. India" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Education Qualification</Label>
                            <Input name="education" defaultValue={joinList(initialData?.education)} placeholder="e.g. Masters" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Profession</Label>
                            <Input name="preferredProfessions" defaultValue={joinList(initialData?.preferredProfessions)} placeholder="e.g. Engineer, Doctor" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Work Location (Country)</Label>
                            <Input name="workingCountry" defaultValue={joinList(initialData?.workingCountry)} placeholder="e.g. India, USA" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Family Status</Label>
                            <Input name="familyStatus" defaultValue={joinList(initialData?.familyStatus)} placeholder="e.g. Middle Class" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Diet Preference</Label>
                            <Input name="eatingHabits" defaultValue={joinList(initialData?.eatingHabits)} placeholder="e.g. Vegetarian" className={inputClasses} />
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <div>
                            <Label className={labelClasses}>Height Range (cm)</Label>
                            <div className="flex items-center gap-3">
                                <Input type="number" name="minHeight" defaultValue={initialData?.minHeight || 150} min="120" max="220" placeholder="Min" className={inputClasses} />
                                <Input type="number" name="maxHeight" defaultValue={initialData?.maxHeight || 180} min="120" max="220" placeholder="Max" className={inputClasses} />
                            </div>
                        </div>

                        <div>
                            <Label className={labelClasses}>Caste / Community</Label>
                            <Input name="preferredCastes" defaultValue={joinList(initialData?.preferredCastes)} placeholder="Optional" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Complexion</Label>
                            <Input name="complexion" defaultValue={joinList(initialData?.complexion)} placeholder="e.g. Fair" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Native Location (State)</Label>
                            <Input name="nativeState" defaultValue={joinList(initialData?.nativeState)} placeholder="e.g. Kerala" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Current Career Status</Label>
                            <Input name="jobStatus" defaultValue={joinList(initialData?.jobStatus)} placeholder="e.g. Working, Business" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Salary</Label>
                            <Input name="incomeRange" defaultValue={joinList(initialData?.incomeRange)} placeholder="e.g. 10L - 20L" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Work Location (State)</Label>
                            <Input name="workingState" defaultValue={joinList(initialData?.workingState)} placeholder="e.g. Karnataka" className={inputClasses} />
                        </div>

                        {/* Empty placeholder for alignment with Family Status row in Column 1 */}
                        <div>
                            <div className="h-[20px] mb-2 hidden lg:block"></div>
                            <div className={"w-full h-11 hidden lg:block"}></div>
                        </div>

                        <div>
                            <Label className={labelClasses}>Smoking Habit</Label>
                            <Input name="smokingHabits" defaultValue={joinList(initialData?.smokingHabits)} placeholder="e.g. No" className={inputClasses} />
                        </div>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-6">
                        <div>
                            <Label className={labelClasses}>Marital Status</Label>
                            <Input name="maritalStatus" defaultValue={joinList(initialData?.maritalStatus)} placeholder="e.g. Never Married" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Open to other Religion</Label>
                            <select name="otherReligions" defaultValue={initialData?.otherReligions ? "true" : "false"} className={inputClasses}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        <div>
                            <Label className={labelClasses}>Physical Status</Label>
                            <Input name="physicalStatus" defaultValue={initialData?.physicalStatus || ""} placeholder="e.g. Normal" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Native Location (District)</Label>
                            <Input name="nativeDistrict" defaultValue={joinList(initialData?.nativeDistrict)} placeholder="e.g. Ernakulam" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Employment Sector</Label>
                            <Input name="employmentCategory" defaultValue={joinList(initialData?.employmentCategory)} placeholder="e.g. IT, Govt" className={inputClasses} />
                        </div>

                        <div>
                            <Label className={labelClasses}>Open to Relocate</Label>
                            <select name="readyToRelocate" defaultValue={initialData?.readyToRelocate ? "true" : "false"} className={inputClasses}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>

                        <div>
                            <Label className={labelClasses}>Work Location (District)</Label>
                            <Input name="workingDistrict" defaultValue={joinList(initialData?.workingDistrict)} placeholder="e.g. Bangalore" className={inputClasses} />
                        </div>

                        {/* Empty placeholder to align with empty spot in col 2 */}
                        <div>
                            <div className="h-[20px] mb-2 hidden lg:block"></div>
                            <div className={"w-full h-11 hidden lg:block"}></div>
                        </div>

                        <div>
                            <Label className={labelClasses}>Drinking Habit</Label>
                            <Input name="drinkingHabits" defaultValue={joinList(initialData?.drinkingHabits)} placeholder="e.g. No" className={inputClasses} />
                        </div>
                    </div>
                </div>

                {/* More About Partner - Bottom Box */}
                <div className="mt-8 col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm max-w-[800px]">
                        <h3 className="text-md font-semibold text-indigo-900 flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                            More About Partner
                        </h3>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-800">Partner Expectations</Label>
                            <textarea
                                name="expectations"
                                defaultValue={initialData?.expectations || ""}
                                className="flex min-h-[140px] w-full rounded-lg border border-gray-100 bg-[#fbfbfe] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 placeholder:text-gray-400 resize-y"
                                placeholder="Describe what you are looking for in a partner..."
                            />
                        </div>
                    </div>
                </div>

            </div>

            {state?.message && <p className={state.success ? "text-green-600 text-sm mb-4" : "text-red-500 text-sm mb-4"}>{state.message}</p>}

            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-8">
                {onBack ? (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                        Back Options
                    </Button>
                ) : <div />}
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-8 h-11"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                    {onNext && (
                        <Button type="button" variant="outline" onClick={onNext} className="rounded-md px-8 h-11">
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
