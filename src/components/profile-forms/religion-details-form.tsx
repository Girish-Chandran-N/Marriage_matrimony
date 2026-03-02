"use client";

import { updateReligionDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookMarked } from "lucide-react";

interface ReligionDetailsFormProps {
    onNext?: () => void;
    initialData?: any;
}

export default function ReligionDetailsForm({ onNext, initialData }: ReligionDetailsFormProps) {
    const [state, action, isPending] = useActionState(updateReligionDetails, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            if (onNext) {
                onNext();
            } else {
                router.push("/profile");
            }
        }
    }, [state, onNext, router]);

    return (
        <form action={action} className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <BookMarked className="w-4 h-4 text-indigo-600" />
                    Religion Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Religion (Required)</label>
                        <select
                            name="religion"
                            defaultValue={initialData?.religion || ""}
                            required
                            className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        >
                            <option value="">Select Religion</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Christian">Christian</option>
                            <option value="Sikh">Sikh</option>
                            <option value="Jain">Jain</option>
                            <option value="Parsi">Parsi</option>
                            <option value="Buddhist">Buddhist</option>
                            <option value="Jewish">Jewish</option>
                            <option value="Inter-Religion">Inter-Religion</option>
                            <option value="No Religious Belief">No Religious Belief</option>
                        </select>
                        {state?.errors?.religion && <p className="text-red-500 text-[10px] mt-1">{state.errors.religion}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Caste (Required)</label>
                        <Input
                            name="caste"
                            defaultValue={initialData?.caste || ""}
                            placeholder="e.g. Brahmin, Ezhava"
                            required
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                        />
                        {state?.errors?.caste && <p className="text-red-500 text-[10px] mt-1">{state.errors.caste}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Sub-caste (Optional)</label>
                        <Input
                            name="subCaste"
                            defaultValue={initialData?.subCaste || ""}
                            placeholder="e.g. Nambuthiri"
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                        />
                    </div>
                </div>
            </div>

            {state?.message && <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}

            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                </Button>
                {onNext && (
                    <Button type="button" variant="outline" onClick={onNext}>
                        Next
                    </Button>
                )}
            </div>
        </form>
    );
}
