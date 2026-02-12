"use client";

import { updateFamilyDetails, createSibling, deleteSibling } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure this component was created
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Trash2, HeartHandshake } from "lucide-react";

export default function FamilyDetailsForm({
    onNext,
    onBack,
    initialData,
    siblings = []
}: {
    onNext?: () => void,
    onBack?: () => void,
    initialData?: any,
    siblings?: any[]
}) {
    const router = useRouter();

    // Main Family Details Action
    const [state, action, isPending] = useActionState(updateFamilyDetails, undefined);

    // Sibling Action
    const [siblingState, siblingAction, isSiblingPending] = useActionState(createSibling, undefined);
    const [isAddingSibling, setIsAddingSibling] = useState(false);

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            if (onNext) onNext();
        }
    }, [state, onNext]);

    useEffect(() => {
        if (siblingState?.success) {
            setIsAddingSibling(false);
            router.refresh();
        }
    }, [siblingState]);

    const handleDeleteSibling = async (id: string) => {
        if (confirm("Remove this sibling?")) {
            const res = await deleteSibling(id);
            if (res.success) router.refresh();
            else alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-8">

            <form action={action} className="space-y-6">

                {/* Family Background */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Family Background
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block">Family Status</Label>
                            <select name="familyStatus" defaultValue={initialData?.familyStatus || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select</option>
                                <option value="Middle Class">Middle Class</option>
                                <option value="Upper Middle Class">Upper Middle Class</option>
                                <option value="Rich">Rich / Affluent</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block">Family Type</Label>
                            <select name="familyType" defaultValue={initialData?.familyType || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select</option>
                                <option value="Nuclear">Nuclear Family</option>
                                <option value="Joint">Joint Family</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block">Family Values</Label>
                            <select name="familyValue" defaultValue={initialData?.familyValue || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">Select</option>
                                <option value="Orthodox">Orthodox</option>
                                <option value="Traditional">Traditional</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Liberal">Liberal</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block">Family Name / House Name</Label>
                            <Input name="familyName" defaultValue={initialData?.familyName || ""} placeholder="e.g. The Gupta Family" />
                        </div>
                    </div>
                </div>

                {/* Parents Details */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <HeartHandshake className="w-5 h-5 text-indigo-600" />
                        Parents Details
                    </h3>

                    {/* Father */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Father</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="mb-2 block">Father's Name</Label>
                                <Input name="fatherName" defaultValue={initialData?.fatherName || ""} required />
                                {state?.errors?.fatherName && <p className="text-red-500 text-xs">{state.errors.fatherName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block">Occupation</Label>
                                <Input name="fatherOccupation" defaultValue={initialData?.fatherOccupation || ""} placeholder="e.g. Businessman" />
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block">Native Place</Label>
                                <Input name="fatherNativePlace" defaultValue={initialData?.fatherNativePlace || ""} />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Mother</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="mb-2 block">Mother's Name</Label>
                                <Input name="motherName" defaultValue={initialData?.motherName || ""} required />
                                {state?.errors?.motherName && <p className="text-red-500 text-xs">{state.errors.motherName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block">Occupation</Label>
                                <Input name="motherOccupation" defaultValue={initialData?.motherOccupation || ""} placeholder="e.g. Homemaker" />
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block">Native Place</Label>
                                <Input name="motherNativePlace" defaultValue={initialData?.motherNativePlace || ""} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sibling Counts (Manual) */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sibling Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block">No. of Brothers</Label>
                            <Input type="number" name="brothers" defaultValue={initialData?.brothers || 0} min="0" />
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block">No. of Sisters</Label>
                            <Input type="number" name="sisters" defaultValue={initialData?.sisters || 0} min="0" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <Label className="mb-2 block">About Family</Label>
                    <textarea
                        name="familyIntro"
                        defaultValue={initialData?.familyIntro || ""}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                        placeholder="Write a brief introduction about your family..."
                    />
                </div>

                {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Family Details"}
                    </Button>
                </div>
            </form>

            {/* SIbling Details List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Sibling Details
                </h3>

                <div className="grid gap-3">
                    {siblings.map((sib) => (
                        <div key={sib.id} className="p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                            <div>
                                <span className="font-medium text-gray-900">{sib.name || "Unnamed"}</span>
                                <span className="ml-2 text-sm text-gray-500">({sib.gender})</span>
                                <p className="text-xs text-gray-500">{sib.maritalStatus} {sib.spouseName && ` - Spouse: ${sib.spouseName}`}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteSibling(sib.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                {isAddingSibling ? (
                    <form action={siblingAction} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4 animate-in fade-in">
                        <h4 className="text-sm font-medium">Add Sibling</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="mb-2 block">Gender</Label>
                                <select name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="Brother">Brother</option>
                                    <option value="Sister">Sister</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block">Name</Label>
                                <Input name="name" placeholder="Name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Marital Status</Label>
                                <select name="maritalStatus" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Spouse Name (if married)</Label>
                                <Input name="spouseName" placeholder="Spouse Name" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddingSibling(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSiblingPending}>Add</Button>
                        </div>
                    </form>
                ) : (
                    <Button variant="outline" onClick={() => setIsAddingSibling(true)} className="w-full border-dashed">
                        <UserPlus className="w-4 h-4 mr-2" /> Add Sibling Details
                    </Button>
                )}
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100">
                {onBack ? (
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                ) : <div></div>}
                <Button
                    type="button"
                    onClick={onNext}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                >
                    Next: Lifestyle & Interests
                </Button>
            </div>
        </div>
    );
}
