"use client";

import { updateCareerDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CareerDetailsFormProps {
    onNext?: () => void;
    onBack?: () => void;
    initialData?: any;
}

export default function CareerDetailsForm({ onNext, onBack, initialData }: CareerDetailsFormProps) {
    const [state, action, isPending] = useActionState(updateCareerDetails, undefined);
    const router = useRouter();

    const [jobTitle, setJobTitle] = useState<string>(initialData?.jobTitle || "");
    const [companyName, setCompanyName] = useState<string>(initialData?.companyName || "");
    const [employmentType, setEmploymentType] = useState<string>(initialData?.employmentType || "");
    const [incomeRange, setIncomeRange] = useState<string>(initialData?.incomeRange || "");
    const [workLocation, setWorkLocation] = useState<string>(initialData?.workLocation || "");
    const [industry, setIndustry] = useState<string>(initialData?.industry || "");
    const [yearsExperience, setYearsExperience] = useState<string>(initialData?.yearsExperience?.toString() || "");
    const [linkedinUrl, setLinkedinUrl] = useState<string>(initialData?.linkedinUrl || "");

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                setJobTitle(state.data.jobTitle || "");
                setCompanyName(state.data.companyName || "");
                setEmploymentType(state.data.employmentType || "");
                setIncomeRange(state.data.incomeRange || "");
                setWorkLocation(state.data.workLocation || "");
                setIndustry(state.data.industry || "");
                setYearsExperience(state.data.yearsExperience?.toString() || "");
                setLinkedinUrl(state.data.linkedinUrl || "");
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
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Current Job Title</label>
                    <Input type="text" name="jobTitle" placeholder="Software Engineer" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                    {state?.errors?.jobTitle && <p className="text-red-500 text-xs">{state.errors.jobTitle}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <Input type="text" name="companyName" placeholder="Acme Corp" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    {state?.errors?.companyName && <p className="text-red-500 text-xs">{state.errors.companyName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                    <select
                        name="employmentType"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        required
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Private Sector">Private Sector</option>
                        <option value="Government / PSU">Government / PSU</option>
                        <option value="Civil Services">Civil Services</option>
                        <option value="Business">Business</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Not Working">Not Working</option>
                    </select>
                    {state?.errors?.employmentType && <p className="text-red-500 text-xs">{state.errors.employmentType}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                    <select
                        name="incomeRange"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={incomeRange}
                        onChange={(e) => setIncomeRange(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="0-3 LPA">0-3 LPA</option>
                        <option value="3-5 LPA">3-5 LPA</option>
                        <option value="5-10 LPA">5-10 LPA</option>
                        <option value="10-15 LPA">10-15 LPA</option>
                        <option value="15-25 LPA">15-25 LPA</option>
                        <option value="25-50 LPA">25-50 LPA</option>
                        <option value="50+ LPA">50+ LPA</option>
                    </select>
                    {state?.errors?.incomeRange && <p className="text-red-500 text-xs">{state.errors.incomeRange}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Work Location</label>
                    <Input type="text" name="workLocation" placeholder="Bangalore, India" required value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} />
                    {state?.errors?.workLocation && <p className="text-red-500 text-xs">{state.errors.workLocation}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <Input type="text" name="industry" placeholder="IT, Healthcare, Finance..." required value={industry} onChange={(e) => setIndustry(e.target.value)} />
                    {state?.errors?.industry && <p className="text-red-500 text-xs">{state.errors.industry}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <Input type="number" name="yearsExperience" placeholder="5" min="0" required value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
                    {state?.errors?.yearsExperience && <p className="text-red-500 text-xs">{state.errors.yearsExperience}</p>}
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL (Optional)</label>
                    <Input type="url" name="linkedinUrl" placeholder="https://linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                    {state?.errors?.linkedinUrl && <p className="text-red-500 text-xs">{state.errors.linkedinUrl}</p>}
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
                    {isPending ? "Saving..." : onNext ? "Next: Family" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
