"use client";

import { createEducation, deleteEducation } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner or similar toast is used, or just alert

// Define a local interface matching the Prisma model to avoid direct dependency issues if generation is laggy
interface Education {
    id: string;
    qualification: string | null;
    institution: string | null;
    university: string | null;
    stream: string | null;
    passedYear: number | null;
    isHighest: boolean;
}

export default function EducationDetailsForm({
    onNext,
    onBack,
    initialData = []
}: {
    onNext?: () => void,
    onBack?: () => void,
    initialData?: Education[]
}) {
    const [isAdding, setIsAdding] = useState(initialData.length === 0);
    const router = useRouter();

    // Create Action State
    const [createState, createAction, isCreating] = useActionState(createEducation, undefined);

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this education entry?")) return;
        const result = await deleteEducation(id);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.message || "Failed to delete");
        }
    };

    // Effect for Creation Success
    useEffect(() => {
        if (createState?.success) {
            setIsAdding(false);
            router.refresh();
            // Reset form if needed, handled by unmounting Add form
        }
    }, [createState]);

    return (
        <div className="space-y-8">
            {/* List of Educations */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    Your Education
                </h3>



                <div className="grid gap-4">
                    {initialData.map((edu) => (
                        <div key={edu.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-indigo-100 transition-colors">
                            <div>
                                <h4 className="font-semibold text-gray-900">{edu.qualification} in {edu.stream}</h4>
                                <p className="text-sm text-gray-600">{edu.institution}, {edu.university}</p>
                                <p className="text-xs text-gray-400 mt-1">Passed Year: {edu.passedYear} {edu.isHighest && <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">Highest</span>}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(edu.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add New Form */}
            {isAdding ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4 fade-in">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Add New Education</h4>
                    <form action={createAction} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="qualification">Qualification</Label>
                                <select id="qualification" name="qualification" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="">Select Qualification</option>
                                    <option value="High School">High School</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Bachelors">Bachelors</option>
                                    <option value="Masters">Masters</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Other">Other</option>
                                </select>
                                {createState?.errors?.qualification && <p className="text-red-500 text-xs">{createState.errors.qualification}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stream">Stream / Major</Label>
                                <Input id="stream" name="stream" placeholder="e.g. Computer Science" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="institution">Institution Name</Label>
                                <Input id="institution" name="institution" placeholder="e.g. St. Xavier's College" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="university">University / Board</Label>
                                <Input id="university" name="university" placeholder="e.g. Mumbai University" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passedYear">Passed Year</Label>
                                <Input id="passedYear" name="passedYear" type="number" placeholder="YYYY" min="1950" max={new Date().getFullYear()} />
                                {createState?.errors?.passedYear && <p className="text-red-500 text-xs">{createState.errors.passedYear}</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input type="checkbox" id="isHighest" name="isHighest" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                            <Label htmlFor="isHighest" className="font-normal text-gray-700">This is my highest qualification</Label>
                        </div>

                        {createState?.message && <p className="text-red-500 text-sm mt-2">{createState.message}</p>}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} disabled={isCreating}>Cancel</Button>
                            <Button type="submit" disabled={isCreating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {isCreating ? "Adding..." : "Add Education"}
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                initialData.length > 0 && (
                    <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50">
                        <Plus className="w-4 h-4 mr-2" /> Add Another Education
                    </Button>
                )
            )}

            <div className="flex justify-between pt-6 border-t border-gray-100">
                {onBack ? (
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                ) : <div></div>}
                <Button
                    type="button"
                    onClick={onNext}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
                >
                    Next: Career & Finances
                </Button>
            </div>
        </div>
    );
}
