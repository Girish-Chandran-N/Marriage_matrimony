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
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-indigo-600" />
                    Habits & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Eating Habits</Label>
                        <select name="eatingHabits" defaultValue={initialData?.eatingHabits || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Eggetarian">Eggetarian</option>
                            <option value="Vegan">Vegan</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Drinking</Label>
                        <select name="drinking" defaultValue={initialData?.drinking || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Smoking</Label>
                        <select name="smoking" defaultValue={initialData?.smoking || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Interests */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Music className="w-5 h-5 text-indigo-600" />
                    Interests & Favorites
                </h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Hobbies</Label>
                        <Input name="hobbies" defaultValue={joinList(initialData?.hobbies)} placeholder="e.g. Photography, Gardening, Coding" />
                        <p className="text-xs text-gray-500">Separate multiple with commas</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Music</Label>
                        <Input name="music" defaultValue={joinList(initialData?.music)} placeholder="e.g. Classical, Jazz, Pop" />
                    </div>
                    <div className="space-y-2">
                        <Label>Books</Label>
                        <Input name="books" defaultValue={joinList(initialData?.books)} placeholder="e.g. Fiction, Biographies" />
                    </div>
                    <div className="space-y-2">
                        <Label>Movies</Label>
                        <Input name="movies" defaultValue={joinList(initialData?.movies)} placeholder="e.g. Sci-Fi, Comedy" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sports</Label>
                        <Input name="sports" defaultValue={joinList(initialData?.sports)} placeholder="e.g. Cricket, Football, Chess" />
                    </div>
                    <div className="space-y-2">
                        <Label>Favorite Cuisine</Label>
                        <Input name="favoriteCuisine" defaultValue={joinList(initialData?.favoriteCuisine)} placeholder="e.g. Italian, Indian, Chinese" />
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Book className="w-5 h-5 text-indigo-600" />
                    More About You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Dress Style</Label>
                        <Input name="dressStyle" defaultValue={initialData?.dressStyle || ""} placeholder="e.g. Casual, Formal, Traditional" />
                    </div>
                    <div className="space-y-2">
                        <Label>Cultural Background</Label>
                        <Input name="culturalBackground" defaultValue={initialData?.culturalBackground || ""} />
                    </div>
                    {/* Add more fields as needed based on schema */}
                    <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" name="drivingLicense" id="drivingLicense" defaultChecked={initialData?.drivingLicense} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                        <Label htmlFor="drivingLicense" className="font-normal text-gray-700">Driving License</Label>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-indigo-600" />
                    Social Profiles (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Facebook className="w-3 h-3" /> Facebook</Label>
                        <Input name="facebook" defaultValue={initialData?.facebook || ""} placeholder="Profile URL" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram</Label>
                        <Input name="instagram" defaultValue={initialData?.instagram || ""} placeholder="Profile URL" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
                        <Input name="linkedin" defaultValue={initialData?.linkedin || ""} placeholder="Profile URL" />
                    </div>
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
                    {isPending ? "Saving..." : isEditMode ? "Save Changes" : "Finish & Save"}
                </Button>
            </div>
        </form>
    );
}
