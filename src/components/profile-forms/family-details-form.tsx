"use client";

import { updateFamilyDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FamilyDetailsFormProps {
    onNext?: () => void;
    onBack?: () => void;
    initialData?: any;
}

export default function FamilyDetailsForm({ onNext, onBack, initialData }: FamilyDetailsFormProps) {
    const [state, action, isPending] = useActionState(updateFamilyDetails, undefined);
    const router = useRouter();

    const [familyType, setFamilyType] = useState<string>(initialData?.familyType || "");
    const [familyStatus, setFamilyStatus] = useState<string>(initialData?.familyStatus || "");
    const [fatherOccupation, setFatherOccupation] = useState<string>(initialData?.fatherOccupation || "");
    const [motherOccupation, setMotherOccupation] = useState<string>(initialData?.motherOccupation || "");
    const [brothers, setBrothers] = useState<string>(initialData?.brothers?.toString() || "0");
    const [sisters, setSisters] = useState<string>(initialData?.sisters?.toString() || "0");

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                setFamilyType(state.data.familyType || "");
                setFamilyStatus(state.data.familyStatus || "");
                setFatherOccupation(state.data.fatherOccupation || "");
                setMotherOccupation(state.data.motherOccupation || "");
                setBrothers(state.data.brothers?.toString() || "0");
                setSisters(state.data.sisters?.toString() || "0");
                router.refresh();
            }
            if (onNext) {
                onNext();
            }
        }
    }, [state, onNext]);

    return (
        <form action={action} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Family Type</label>
                    <select
                        name="familyType"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                        value={familyType}
                        onChange={(e) => setFamilyType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Nuclear">Nuclear</option>
                        <option value="Joint">Joint</option>
                        <option value="Extended">Extended</option>
                    </select>
                    {state?.errors?.familyType && <p className="text-red-500 text-xs">{state.errors.familyType}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Family Status</label>
                    <select
                        name="familyStatus"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                        value={familyStatus}
                        onChange={(e) => setFamilyStatus(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Middle Class">Middle Class</option>
                        <option value="Upper Middle Class">Upper Middle Class</option>
                        <option value="Rich">Rich</option>
                        <option value="Affluent">Affluent</option>
                    </select>
                    {state?.errors?.familyStatus && <p className="text-red-500 text-xs">{state.errors.familyStatus}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
                    <Input type="text" name="fatherOccupation" placeholder="Business, Retired..." value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mother's Occupation</label>
                    <Input type="text" name="motherOccupation" placeholder="Homemaker, Teacher..." value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">No. of Brothers</label>
                    <Input type="number" name="brothers" placeholder="0" min="0" value={brothers} onChange={(e) => setBrothers(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">No. of Sisters</label>
                    <Input type="number" name="sisters" placeholder="0" min="0" value={sisters} onChange={(e) => setSisters(e.target.value)} />
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
                    {isPending ? "Saving..." : onNext ? "Next: Lifestyle" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
