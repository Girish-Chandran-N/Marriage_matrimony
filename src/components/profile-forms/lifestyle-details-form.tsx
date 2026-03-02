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

    const isChecked = (list: string[] | string | undefined, value: string) => {
        if (!list) return false;
        if (Array.isArray(list)) return list.includes(value);
        return list.split(',').map(s => s.trim()).includes(value);
    };

    // Category Options
    const movies = ["Action", "Anime", "Biography Movies", "Comedy", "Documentary Movies", "Drama", "Hollywood", "Epics", "Family Stories", "Fantasy", "Bollywood", "Horror", "K-drama", "Mollywood", "Other Language Movies", "Romance", "Sci-Fi Movies", "Short Films", "Kollywood", "Thriller Movies", "War Movies", "World Cinema"];

    const sports = ["Aerobics", "Archery", "Athletics", "Badminton", "Baseball", "Basketball", "Board Games", "Bowling", "Boxing", "Cricket", "Cycling", "Diving", "Football", "Golf", "Gym/Bodybuilding", "Handball", "Hockey", "Horse Riding", "Jogging/Walking/Running", "Kabbadi", "Kho-Kho", "Pilates", "Rugby", "Skating/Skiing", "Soccer", "Swimming/Water Sports", "Table Tennis", "Tennis", "Volleyball"];

    const music = ["Film Music", "Devotional", "Albums", "Western Music", "Hindi Songs", "Tamil Songs", "K-pop", "EDM (Electronic Dance Music)", "Bluegrass", "Disco", "Ghazals", "Folk Music", "Country Music", "Classical Music", "Fusion", "Heavy Metal", "Jazz", "Indipop", "Melodies"];

    const reading = ["Read Anything", "Biographies", "Classics", "Comedy", "Comics/Graphic Novels", "Devotional Books/Scriptures", "Fantasy", "Fiction", "History", "Literature", "Magazine", "Management Books", "Motivational Books", "Newspapers", "Philosophy", "Poetry", "Romance", "Science Fiction", "Self Help Books", "Short Stories", "Thrillers/Suspense", "Trade Journals", "Travelogues/Blogs"];

    const foods = ["Anything", "Arabic", "Chinese", "Continental", "Fast Food", "Italian", "Kerala", "North Indian", "South Indian", "Thai"];

    const dress = ["Indian", "Indo Western", "Casual", "Western", "Traditional", "No Preference"];

    const adventure = ["Camping", "Go Karting", "Hiking", "Hunting", "Motorbiking", "Off-roading", "Sailing/Boating/Rowing", "Trekking", "Canoeing", "Mountain Climbing", "Kayaking", "Skydiving", "Surfing"];

    // Reusable Checkbox Group Component
    const CheckboxGroup = ({ title, name, options, selectedData }: { title: string, name: string, options: string[], selectedData: any }) => (
        <div className="mb-6">
            <div className="bg-gray-100 px-4 py-2 font-medium text-sm text-gray-700 mb-4">{title}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 pl-2">
                {options.map((opt) => (
                    <div key={opt} className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id={`${name}-${opt}`}
                            name={name}
                            value={opt}
                            defaultChecked={isChecked(selectedData, opt)}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-200 mt-0.5"
                        />
                        <Label htmlFor={`${name}-${opt}`} className="text-xs text-gray-700 leading-tight block">{opt}</Label>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <form action={action} className="space-y-8">

            {/* Habits */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 text-left">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Coffee className="w-4 h-4 text-indigo-600" />
                    Habits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold text-gray-700">Eating Habits</Label>
                        <select name="eatingHabits" defaultValue={initialData?.eatingHabits || ""} className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-purple-300 focus:outline-none focus:ring-purple-200">
                            <option value="">Select</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Eggetarian">Eggetarian</option>
                            <option value="Vegan">Vegan</option>
                        </select>
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold text-gray-700">Drinking</Label>
                        <select name="drinking" defaultValue={initialData?.drinking || ""} className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-purple-300 focus:outline-none focus:ring-purple-200">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    <div>
                        <Label className="mb-1 block text-xs font-semibold text-gray-700">Smoking</Label>
                        <select name="smoking" defaultValue={initialData?.smoking || ""} className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-purple-300 focus:outline-none focus:ring-purple-200">
                            <option value="">Select</option>
                            <option value="No">No</option>
                            <option value="Occasionally">Occasionally</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Advanced Multi-Select Categories */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 text-left">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide mb-6">
                    <Music className="w-4 h-4 text-indigo-600" />
                    Interests & Lifestyle
                </h3>

                <CheckboxGroup title="Movies" name="movies" options={movies} selectedData={initialData?.movies} />
                <CheckboxGroup title="Sports" name="sports" options={sports} selectedData={initialData?.sports} />
                <CheckboxGroup title="Music" name="music" options={music} selectedData={initialData?.music} />
                <CheckboxGroup title="Reading" name="books" options={reading} selectedData={initialData?.books} />
                <CheckboxGroup title="Foods" name="favoriteCuisine" options={foods} selectedData={initialData?.favoriteCuisine} />
                <CheckboxGroup title="Dress" name="dressStyle" options={dress} selectedData={initialData?.dressStyle} />
                <CheckboxGroup title="Adventure" name="hobbies" options={adventure} selectedData={initialData?.hobbies} />
            </div>

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 text-left">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Book className="w-4 h-4 text-indigo-600" />
                    More About You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold text-gray-700">Cultural Background</Label>
                        <Input name="culturalBackground" defaultValue={initialData?.culturalBackground || ""} className="h-9 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200" />
                    </div>
                    <div className="flex items-center space-x-2 h-9 pb-1 pl-2">
                        <input type="checkbox" name="drivingLicense" id="drivingLicense" defaultChecked={initialData?.drivingLicense} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-200 mt-0.5" />
                        <Label htmlFor="drivingLicense" className="text-sm font-medium text-gray-700">Driving License</Label>
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 text-left">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Facebook className="w-4 h-4 text-indigo-600" />
                    Social Profiles (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-sm font-semibold text-gray-900"><Facebook className="w-4 h-4" /> Facebook</Label>
                        <Input name="facebook" defaultValue={initialData?.facebook || ""} placeholder="Profile URL" className="h-10 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200" />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-sm font-semibold text-gray-900"><Instagram className="w-4 h-4" /> Instagram</Label>
                        <Input name="instagram" defaultValue={initialData?.instagram || ""} placeholder="Profile URL" className="h-10 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200" />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2 mb-1 block text-sm font-semibold text-gray-900"><Linkedin className="w-4 h-4" /> LinkedIn</Label>
                        <Input name="linkedin" defaultValue={initialData?.linkedin || ""} placeholder="Profile URL" className="h-10 bg-white border-gray-200 focus:border-purple-300 focus:ring-purple-200" />
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
                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-indigo-600 text-white"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </Button>
                    {onNext && (
                        <Button type="button" variant="outline" onClick={onNext}>
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
