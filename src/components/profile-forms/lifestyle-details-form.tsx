"use client";

import { updateLifestyleDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Music, Book, Youtube, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function LifestyleDetailsForm({
    onBack,
    onNext,
    initialData,
    isEditMode = false
}: {
    onBack?: () => void,
    onNext?: () => void,
    initialData?: any,
    isEditMode?: boolean
}) {
    const [state, action, isPending] = useActionState(updateLifestyleDetails, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            if (onNext) onNext();
            else if (!isEditMode) router.push("/profile");
        }
    }, [state, onNext, isEditMode, router]);

    const joinList = (list: string[] | undefined) => Array.isArray(list) ? list.join(", ") : (list || "");

    return (
        <form action={action} className="space-y-8">

            {/* Habits */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Coffee className="w-4 h-4 text-indigo-600" />
                    Habits & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Eating Habits</Label>
                        <select name="eatingHabits" defaultValue={initialData?.eatingHabits || ""} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200">
                            <option value="">Select</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Eggetarian">Eggetarian</option>
                            <option value="Vegan">Vegan</option>
                        </select>
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Drinking</Label>
                        <select name="drinking" defaultValue={initialData?.drinking || ""} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Smoking</Label>
                        <select name="smoking" defaultValue={initialData?.smoking || ""} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Interests */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Music className="w-4 h-4 text-indigo-600" />
                    Interests & Favorites
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Hobbies</Label>
                        <Input name="hobbies" defaultValue={joinList(initialData?.hobbies)} placeholder="e.g. Photography" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Music</Label>
                        <Input name="music" defaultValue={joinList(initialData?.music)} placeholder="e.g. Classical" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Books</Label>
                        <Input name="books" defaultValue={joinList(initialData?.books)} placeholder="e.g. Fiction" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Movies</Label>
                        <Input name="movies" defaultValue={joinList(initialData?.movies)} placeholder="e.g. Sci-Fi" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Sports</Label>
                        <Input name="sports" defaultValue={joinList(initialData?.sports)} placeholder="e.g. Cricket" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Favorite Cuisine</Label>
                        <Input name="favoriteCuisine" defaultValue={joinList(initialData?.favoriteCuisine)} placeholder="e.g. Italian" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Book className="w-4 h-4 text-indigo-600" />
                    More About You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Dress Style</Label>
                        <Input name="dressStyle" defaultValue={initialData?.dressStyle || ""} placeholder="e.g. Casual" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Cultural Background</Label>
                        <Input name="culturalBackground" defaultValue={initialData?.culturalBackground || ""} className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div className="flex items-center space-x-2 h-9 pb-1">
                        <input type="checkbox" name="drivingLicense" id="drivingLicense" defaultChecked={initialData?.drivingLicense} className="h-4 w-4 rounded border-green-300 text-indigo-600 focus:ring-green-200 bg-green-50" />
                        <Label htmlFor="drivingLicense" className="text-xs font-medium text-gray-700">Driving License</Label>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Facebook className="w-4 h-4 text-indigo-600" />
                    Social Profiles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-xs font-semibold"><Facebook className="w-3 h-3" /> Facebook</Label>
                        <Input name="facebook" defaultValue={initialData?.facebook || ""} placeholder="Profile URL" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-xs font-semibold"><Instagram className="w-3 h-3" /> Instagram</Label>
                        <Input name="instagram" defaultValue={initialData?.instagram || ""} placeholder="Profile URL" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-xs font-semibold"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
                        <Input name="linkedin" defaultValue={initialData?.linkedin || ""} placeholder="Profile URL" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                </div>
            </div>

            {state?.message && <p className={state.success ? "text-green-600 text-sm" : "text-red-500 text-sm"}>{state.message}</p>}

            <div className="flex justify-between pt-6 border-t border-gray-100">
                {onBack ? (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                        Back
                    </Button>
                ) : <div></div>}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-indigo-600 text-white"
                >
                    {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Finish & Save"}
                </Button>
            </div>
        </form>
    );
}
