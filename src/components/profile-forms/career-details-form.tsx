"use client";

import { updateCareerProfile, createJob, deleteJob } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import { EMPLOYMENT_CATEGORIES } from "@/lib/constants";

export default function CareerDetailsForm({
    onNext,
    onBack,
    careerProfile,
    jobs = []
}: {
    onNext?: () => void,
    onBack?: () => void,
    careerProfile?: any,
    jobs?: any[]
}) {
    const router = useRouter();

    // Status Update State
    const [statusState, statusAction, isStatusPending] = useActionState(updateCareerProfile, undefined);

    // Job Creation State
    const [jobState, jobAction, isJobPending] = useActionState(createJob, undefined);
    const [isAddingJob, setIsAddingJob] = useState(false);

    // Form Local State
    const [currentStatus, setCurrentStatus] = useState<string>(careerProfile?.currentStatus || "");

    useEffect(() => {
        if (statusState?.success) {
            router.refresh();
            if (onNext) onNext();
        }
    }, [statusState, onNext]);

    useEffect(() => {
        if (jobState?.success) {
            setIsAddingJob(false);
            router.refresh();
        }
    }, [jobState]);

    const handleDeleteJob = async (jobId: string) => {
        if (confirm("Delete this job entry?")) {
            const res = await deleteJob(jobId);
            if (res.success) router.refresh();
            else alert("Failed to delete");
        }
    };

    return (
        <div className="space-y-8">

            {/* 1. Career Status Section */}
            <form action={statusAction} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Career Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="">
                        <Label className="mb-2 block">Current Status</Label>
                        <select
                            name="currentStatus"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value)}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Working">Working Professional</option>
                            <option value="Not Working">Not Working / Looking for Job</option>
                            <option value="Student">Student</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div className="">
                        <Label className="mb-2 block">LinkedIn Profile</Label>
                        <Input name="linkedinUrl" defaultValue={careerProfile?.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." />
                    </div>

                    {/* Internship Specific Fields */}
                    {currentStatus === "Internship" && (
                        <>
                            <div className="">
                                <Label className="mb-2 block">Internship Role</Label>
                                <Input name="internshipRole" defaultValue={careerProfile?.internshipRole || ""} placeholder="e.g. Marketing Intern" />
                            </div>
                            <div className="">
                                <Label className="mb-2 block">Company</Label>
                                <Input name="internshipCompany" defaultValue={careerProfile?.internshipCompany || ""} placeholder="Company Name" />
                            </div>
                            <div className="">
                                <Label className="mb-2 block">Duration</Label>
                                <Input name="internshipDuration" defaultValue={careerProfile?.internshipDuration || ""} placeholder="e.g. 6 months" />
                            </div>
                        </>
                    )}

                    <div className="col-span-full">
                        <Label className="mb-2 block">Career Goals / Summary</Label>
                        <Input name="careerGoal" defaultValue={careerProfile?.careerGoal || ""} placeholder="Briefly describe your career aspirations..." />
                    </div>
                </div>

                {statusState?.message && <p className={statusState.success ? "text-green-600 text-sm" : "text-red-500 text-sm"}>{statusState.message}</p>}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isStatusPending}>
                        {isStatusPending ? "Updating..." : "Update Status"}
                    </Button>
                </div>
            </form>

            {/* 2. Job History (Only if Working or Previously Working) */}
            {(currentStatus === "Working" || currentStatus === "Not Working") && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        Work Experience
                    </h3>

                    {jobs.length === 0 && !isAddingJob && (
                        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <p className="text-gray-500 text-sm">No work experience added.</p>
                            <Button variant="link" onClick={() => setIsAddingJob(true)} className="mt-2 text-indigo-600">
                                + Add Job Details
                            </Button>
                        </div>
                    )}

                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start justify-between group hover:border-indigo-100 transition-colors">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                                    <p className="text-sm font-medium text-indigo-600">{job.company}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.city || job.country || "Location N/A"}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.isCurrent ? "Present" : `${job.toMonth}/${job.toYear}`}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteJob(job.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {isAddingJob ? (
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top-4 fade-in">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Add Job</h4>
                            <form action={jobAction} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="">
                                        <Label className="mb-2 block">Job Title</Label>
                                        <Input name="title" required placeholder="e.g. Senior Manager" />
                                    </div>
                                    <div className="">
                                        <Label className="mb-2 block">Company Name</Label>
                                        <Input name="company" required placeholder="e.g. Tech Solutions Inc." />
                                    </div>

                                    <div className="col-span-full md:col-span-1">
                                        <Label className="mb-2 block">Employment Category</Label>
                                        <select name="employmentCategory" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                                            <option value="">Select Category</option>
                                            {EMPLOYMENT_CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="">
                                        <Label className="mb-2 block">City</Label>
                                        <Input name="city" placeholder="e.g. New York" />
                                    </div>
                                    <div className="">
                                        <Label className="mb-2 block">Country</Label>
                                        <Input name="country" placeholder="e.g. USA" />
                                    </div>

                                    <div className="">
                                        <Label className="mb-2 block">From (Month/Year)</Label>
                                        <div className="flex gap-2">
                                            <Input name="fromMonth" type="number" placeholder="MM" min="1" max="12" className="w-20" />
                                            <Input name="fromYear" type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} />
                                        </div>
                                    </div>
                                    <div className="">
                                        <Label className="mb-2 block">To (Month/Year)</Label>
                                        <div className="flex gap-2">
                                            <Input name="toMonth" type="number" placeholder="MM" min="1" max="12" className="w-20" />
                                            <Input name="toYear" type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} />
                                        </div>
                                    </div>

                                    <div className="">
                                        <Label className="mb-2 block">Annual Income</Label>
                                        <select name="annualIncome" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option value="">Select Income</option>
                                            <option value="0-3 LPA">0-3 LPA</option>
                                            <option value="3-5 LPA">3-5 LPA</option>
                                            <option value="5-10 LPA">5-10 LPA</option>
                                            <option value="10-15 LPA">10-15 LPA</option>
                                            <option value="15-25 LPA">15-25 LPA</option>
                                            <option value="25-50 LPA">25-50 LPA</option>
                                            <option value="50+ LPA">50+ LPA</option>
                                        </select>
                                    </div>

                                    <div className="">
                                        <Label className="mb-2 block">Work Type</Label>
                                        <select name="workType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input type="checkbox" id="isCurrent" name="isCurrent" className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                                    <Label htmlFor="isCurrent" className="font-normal text-gray-700">I currently work here</Label>
                                </div>

                                {jobState?.message && <p className="text-red-500 text-sm">{jobState.message}</p>}

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddingJob(false)}>Cancel</Button>
                                    <Button type="submit" disabled={isJobPending} className="bg-indigo-600 text-white">
                                        {isJobPending ? "Saving..." : "Save Job"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        jobs.length > 0 && <Button variant="outline" onClick={() => setIsAddingJob(true)} className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" /> Add Another Job</Button>
                    )}
                </div>
            )}

            <div className="flex justify-between pt-6 border-t border-gray-100">
                {onBack ? (
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                ) : <div></div>}
                <Button
                    type="button"
                    onClick={onNext} // Note: This Next doesn't submit status, it just navigates. To save status, user must click "Update Status"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                >
                    Next: Family Details
                </Button>
            </div>
        </div>
    );
}
