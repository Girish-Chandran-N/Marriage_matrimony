"use client";

import { updateCareerProfile, createJob, deleteJob, updateJob } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Building2, Calendar, MapPin, Plus, Trash2, Edit2 } from "lucide-react";
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

    // Job Edit State
    const [editJobState, editJobAction, isEditJobPending] = useActionState(updateJob, undefined);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

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

    useEffect(() => {
        if (editJobState?.success) {
            setEditingJobId(null);
            router.refresh();
        }
    }, [editJobState]);

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
            <form action={statusAction} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Career Overview
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="mb-1 block text-xs font-semibold">Current Status</Label>
                        <select
                            name="currentStatus"
                            className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
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

                    <div className="md:col-span-2">
                        <Label className="mb-1 block text-xs font-semibold">LinkedIn Profile</Label>
                        <Input name="linkedinUrl" defaultValue={careerProfile?.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>

                    {/* Internship Specific Fields */}
                    {currentStatus === "Internship" && (
                        <>
                            <div>
                                <Label className="mb-1 block text-xs font-semibold">Internship Role</Label>
                                <Input name="internshipRole" defaultValue={careerProfile?.internshipRole || ""} placeholder="e.g. Marketing Intern" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                            </div>
                            <div>
                                <Label className="mb-1 block text-xs font-semibold">Company</Label>
                                <Input name="internshipCompany" defaultValue={careerProfile?.internshipCompany || ""} placeholder="Company Name" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                            </div>
                            <div>
                                <Label className="mb-1 block text-xs font-semibold">Duration</Label>
                                <Input name="internshipDuration" defaultValue={careerProfile?.internshipDuration || ""} placeholder="e.g. 6 months" className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                            </div>
                        </>
                    )}

                    <div className="col-span-full">
                        <Label className="mb-1 block text-xs font-semibold">Career Goals / Summary</Label>
                        <Input name="careerGoal" defaultValue={careerProfile?.careerGoal || ""} placeholder="Briefly describe your career aspirations..." className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200" />
                    </div>
                </div>

                {statusState?.message && <p className={statusState.success ? "text-green-600 text-xs" : "text-red-500 text-xs"}>{statusState.message}</p>}

                <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={isStatusPending}>
                        {isStatusPending ? "Updating..." : "Update Status"}
                    </Button>
                </div>
            </form>

            {/* 2. Job History (Only if Working) */}
            {currentStatus === "Working" && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        Work Experience
                    </h3>

                    {jobs.length === 0 && !isAddingJob && (
                        <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <p className="text-gray-500 text-xs">No work experience added.</p>
                            <Button variant="link" size="sm" onClick={() => setIsAddingJob(true)} className="mt-1 text-indigo-600">
                                + Add Job Details
                            </Button>
                        </div>
                    )}

                    <div className="grid gap-3">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden group hover:border-indigo-100 transition-colors">
                                {editingJobId === job.id ? (
                                    <div className="p-4 bg-slate-50 border-b border-indigo-100 animate-in slide-in-from-top-2 fade-in">
                                        <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase flex items-center gap-2">
                                            <Edit2 className="w-3.5 h-3.5 text-indigo-600" /> Edit Job Details
                                        </h4>
                                        <form action={editJobAction} className="space-y-3">
                                            <input type="hidden" name="jobId" value={job.id} />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Job Title</Label>
                                                    <Input name="title" defaultValue={job.title} required placeholder="e.g. Senior Manager" className="h-9 bg-green-50/50 border-green-100" />
                                                </div>
                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Company Name</Label>
                                                    <Input name="company" defaultValue={job.company} required placeholder="e.g. Tech Solutions" className="h-9 bg-green-50/50 border-green-100" />
                                                </div>

                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Category</Label>
                                                    <select name="employmentCategory" defaultValue={job.employmentCategory || ""} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm">
                                                        <option value="">Select Category</option>
                                                        {EMPLOYMENT_CATEGORIES.map((cat) => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">City</Label>
                                                    <Input name="city" defaultValue={job.city || ""} placeholder="e.g. New York" className="h-9 bg-green-50/50 border-green-100" />
                                                </div>
                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Country</Label>
                                                    <Input name="country" defaultValue={job.country || ""} placeholder="e.g. USA" className="h-9 bg-green-50/50 border-green-100" />
                                                </div>
                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Annual Income</Label>
                                                    <select name="annualIncome" defaultValue={job.annualIncome || ""} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm">
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

                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">From (M/Y)</Label>
                                                    <div className="flex gap-2">
                                                        <Input name="fromMonth" defaultValue={job.fromMonth || ""} type="number" placeholder="MM" min="1" max="12" className="w-16 h-9 bg-green-50/50 border-green-100" />
                                                        <Input name="fromYear" defaultValue={job.fromYear || ""} type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} className="flex-1 h-9 bg-green-50/50 border-green-100" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">To (M/Y)</Label>
                                                    <div className="flex gap-2">
                                                        <Input name="toMonth" defaultValue={job.toMonth || ""} type="number" placeholder="MM" min="1" max="12" className="w-16 h-9 bg-green-50/50 border-green-100" />
                                                        <Input name="toYear" defaultValue={job.toYear || ""} type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} className="flex-1 h-9 bg-green-50/50 border-green-100" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label className="mb-1 block text-xs font-semibold">Work Type</Label>
                                                    <select name="workType" defaultValue={job.workType || "Full-time"} className="flex h-9 w-full rounded-md border border-green-100 bg-green-50/50 px-3 py-1.5 text-sm">
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Part-time">Part-time</option>
                                                        <option value="Contract">Contract</option>
                                                        <option value="Remote">Remote</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 pt-1">
                                                <input type="checkbox" id={`isCurrent-${job.id}`} name="isCurrent" defaultChecked={job.isCurrent} className="h-4 w-4 rounded border-gray-300 text-indigo-600 bg-green-50" />
                                                <Label htmlFor={`isCurrent-${job.id}`} className="text-xs font-medium text-gray-700">I currently work here</Label>
                                            </div>

                                            {editJobState?.message && <p className="text-red-500 text-xs">{editJobState.message}</p>}

                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setEditingJobId(null)}>Cancel</Button>
                                                <Button type="submit" size="sm" disabled={isEditJobPending} className="bg-indigo-600 text-white">
                                                    {isEditJobPending ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-3 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900">{job.title}</h4>
                                            <p className="text-xs font-medium text-indigo-600">{job.company}</p>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.city || job.country || "Location N/A"}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.isCurrent ? "Present" : `${job.fromMonth}/${job.fromYear} - ${job.toMonth}/${job.toYear}`}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 h-7 w-7"
                                                onClick={() => {
                                                    setEditingJobId(job.id);
                                                    setIsAddingJob(false);
                                                }}
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7"
                                                onClick={() => handleDeleteJob(job.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {isAddingJob ? (
                        <div className="p-4 bg-slate-50 rounded-xl border border-indigo-100 shadow-inner animate-in slide-in-from-top-4 fade-in">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase flex items-center gap-2">
                                <Plus className="w-4 h-4 text-indigo-600" /> Add Job Details
                            </h4>
                            <form action={jobAction} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Job Title</Label>
                                        <Input name="title" required placeholder="e.g. Senior Manager" className="h-9 bg-white border-slate-200" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Company Name</Label>
                                        <Input name="company" required placeholder="e.g. Tech Solutions" className="h-9 bg-white border-slate-200" />
                                    </div>

                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Category</Label>
                                        <select name="employmentCategory" className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm">
                                            <option value="">Select Category</option>
                                            {EMPLOYMENT_CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">City</Label>
                                        <Input name="city" placeholder="e.g. New York" className="h-9 bg-white border-slate-200" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Country</Label>
                                        <Input name="country" placeholder="e.g. USA" className="h-9 bg-white border-slate-200" />
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Annual Income</Label>
                                        <select name="annualIncome" className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm">
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

                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">From (M/Y)</Label>
                                        <div className="flex gap-2">
                                            <Input name="fromMonth" type="number" placeholder="MM" min="1" max="12" className="w-16 h-9 bg-white border-slate-200" />
                                            <Input name="fromYear" type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} className="flex-1 h-9 bg-white border-slate-200" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">To (M/Y)</Label>
                                        <div className="flex gap-2">
                                            <Input name="toMonth" type="number" placeholder="MM" min="1" max="12" className="w-16 h-9 bg-white border-slate-200" />
                                            <Input name="toYear" type="number" placeholder="YYYY" min="1970" max={new Date().getFullYear()} className="flex-1 h-9 bg-white border-slate-200" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="mb-1 block text-xs font-semibold">Work Type</Label>
                                        <select name="workType" className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-1">
                                    <input type="checkbox" id="isCurrent" name="isCurrent" className="h-4 w-4 rounded border-gray-300 text-indigo-600 bg-green-50" />
                                    <Label htmlFor="isCurrent" className="text-xs font-medium text-gray-700">I currently work here</Label>
                                </div>

                                {jobState?.message && <p className="text-red-500 text-xs">{jobState.message}</p>}

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingJob(false)}>Cancel</Button>
                                    <Button type="submit" size="sm" disabled={isJobPending} className="bg-indigo-600 text-white">
                                        {isJobPending ? "Saving..." : "Save Job"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        jobs.length > 0 && <Button variant="outline" onClick={() => { setIsAddingJob(true); setEditingJobId(null); }} className="w-full border-dashed"><Plus className="w-4 h-4 mr-2" /> Add Another Job</Button>
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
