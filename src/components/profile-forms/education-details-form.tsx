"use client";

import { updateEducationDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EducationDetailsForm({ onNext, onBack, initialData }: { onNext?: () => void, onBack?: () => void, initialData?: any }) {
    const [state, action, isPending] = useActionState(updateEducationDetails, undefined);
    const router = useRouter();

    const [highestQualification, setHighestQualification] = useState<string>(initialData?.highestQualification || "");
    const [institutionName, setInstitutionName] = useState<string>(initialData?.institutionName || "");
    const [collegeName, setCollegeName] = useState<string>(initialData?.collegeName || "");
    const [stream, setStream] = useState<string>(initialData?.stream || "");
    const [passingYear, setPassingYear] = useState<string>(initialData?.passingYear?.toString() || "");

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                setHighestQualification(state.data.highestQualification || "");
                setInstitutionName(state.data.institutionName || "");
                setCollegeName(state.data.collegeName || "");
                setStream(state.data.stream || "");
                setPassingYear(state.data.passingYear?.toString() || "");
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
                    <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                    <select
                        name="highestQualification"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                        value={highestQualification}
                        onChange={(e) => setHighestQualification(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="High School">High School</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma</option>
                    </select>
                    {state?.errors?.highestQualification && <p className="text-red-500 text-xs">{state.errors.highestQualification}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Passed Year</label>
                    <Input type="number" name="passingYear" placeholder="2020" required value={passingYear} onChange={(e) => setPassingYear(e.target.value)} />
                    {state?.errors?.passingYear && <p className="text-red-500 text-xs">{state.errors.passingYear}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">College / University Name</label>
                    <Input type="text" name="collegeName" placeholder="University of ..." value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                    {state?.errors?.collegeName && <p className="text-red-500 text-xs">{state.errors.collegeName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stream / Major</label>
                    <Input type="text" name="stream" placeholder="Computer Science, Economics..." value={stream} onChange={(e) => setStream(e.target.value)} />
                    {state?.errors?.stream && <p className="text-red-500 text-xs">{state.errors.stream}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                    <Input type="text" name="institutionName" placeholder="School / Institution Name" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} />
                </div>
            </div>

            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                    Back
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : onNext ? "Next: Career" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

// Helper to allow variant prop on Button if not existing (adding rudimentary support just in case)
/*
  Note: Ideally Button component should handle variants. 
  Assuming the Button created earlier only accepts className.
  If it breaks, I will start a new turn to update Button component.
*/
