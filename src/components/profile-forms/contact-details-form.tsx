"use client";

import { updateContactDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneCall } from "lucide-react";

interface ContactDetailsFormProps {
    onNext?: () => void;
    onBack?: () => void;
    initialData?: any;
}

export default function ContactDetailsForm({ onNext, onBack, initialData }: ContactDetailsFormProps) {
    const [state, action, isPending] = useActionState(updateContactDetails, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.refresh();
            if (onNext) {
                onNext();
            }
        }
    }, [state, onNext, router]);

    return (
        <form action={action} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <PhoneCall className="w-4 h-4 text-indigo-600" />
                    Contact & Guardian Information
                </h3>
                <p className="text-xs text-slate-500 mb-4">Please provide details of your guardian or a primary contact person.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Relationship</Label>
                        <select
                            name="custodianRelation"
                            defaultValue={initialData?.custodianRelation || ""}
                            className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        >
                            <option value="">Select Relationship</option>
                            <option value="Father">Father</option>
                            <option value="Mother">Mother</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                            <option value="Guardian">Guardian</option>
                            <option value="Relative">Relative</option>
                            <option value="Self">Self</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</Label>
                        <Input
                            name="custodianName"
                            defaultValue={initialData?.custodianName || ""}
                            placeholder="Full Name of Contact Person"
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                        />
                    </div>

                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Contact Number</Label>
                        <Input
                            name="primaryContact"
                            defaultValue={initialData?.primaryContact || ""}
                            placeholder="+91 9876543210"
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                        />
                    </div>

                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Time to Call</Label>
                        <Input
                            name="preferredTime"
                            defaultValue={initialData?.preferredTime || ""}
                            placeholder="e.g. 6 PM - 9 PM"
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input type="checkbox" id="whatsapp" name="whatsapp" defaultChecked={initialData?.whatsapp} className="h-4 w-4 rounded border-gray-300 text-indigo-600 bg-green-50" />
                    <Label htmlFor="whatsapp" className="text-xs font-medium text-gray-700">Available on WhatsApp</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Communication Address</Label>
                        <textarea
                            name="communicationAddress"
                            defaultValue={initialData?.communicationAddress || ""}
                            rows={3}
                            placeholder="Current Address for Communication"
                            className="block w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-2 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200 resize-none"
                        />
                    </div>
                    <div>
                        <Label className="block text-xs font-semibold text-gray-700 mb-1">Permanent Address</Label>
                        <textarea
                            name="permanentAddress"
                            defaultValue={initialData?.permanentAddress || ""}
                            rows={3}
                            placeholder="Permanent Address"
                            className="block w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-2 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200 resize-none"
                        />
                    </div>
                </div>
            </div>

            {state?.message && <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}

            <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={onBack} disabled={isPending}>
                    Back
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : onNext ? "Next: Lifestyle" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
