"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DocumentUploadForm from "@/components/verification/document-upload-form";
import { submitVerificationRequest, getVerificationStatus, resetVerificationRequest } from "@/lib/verification-actions";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
    const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchStatus() {
            try {
                const data = await getVerificationStatus();
                setStatus(data);
            } catch (error) {
                console.error("Failed to fetch status");
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    const handleUploadComplete = (url: string) => {
        setUploadedDocs(prev => [...prev, url]);
    };

    const handleSubmit = async () => {
        if (uploadedDocs.length === 0) return;
        setSubmitting(true);
        try {
            const result = await submitVerificationRequest(uploadedDocs);
            if (result.error) {
                alert(result.error);
                return;
            }
            // Refresh status
            const data = await getVerificationStatus();
            setStatus(data);
        } catch (error) {
            console.error("Submission failed");
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading status...</div>;

    if (status) {
        return (
            <div className="max-w-2xl mx-auto p-8 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Verification Status</h1>
                <div className={`p-6 rounded-lg border ${status.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                    status.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                        'bg-yellow-50 border-yellow-200'
                    }`}>
                    <h2 className="text-xl font-semibold mb-2">
                        Current Status: <span className="uppercase">{status.status}</span>
                    </h2>
                    <p className="text-gray-600">
                        {status.status === 'PENDING' && "Your documents are under review. We will notify you once verified."}
                        {status.status === 'APPROVED' && "Your profile is verified! You now have a trust badge."}
                        {status.status === 'REJECTED' && "Your verification was rejected. Please contact support."}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                        Submitted on: {new Date(status.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
                    {status.status === 'PENDING' && (
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                await resetVerificationRequest();
                                setStatus(null);
                            }}
                        >
                            Cancel Request (Retest)
                        </Button>
                    )}
                </div>
            </div >
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-2">Get Verified</h1>
            <p className="text-gray-500 mb-6">Upload documents to boost your profile trust score.</p>

            <div className="space-y-6">
                <DocumentUploadForm
                    label="Identity Proof (Aadhaar / Passport / Voter ID)"
                    onUploadComplete={handleUploadComplete}
                />

                <DocumentUploadForm
                    label="Highest Education Certificate"
                    onUploadComplete={handleUploadComplete}
                />



                <div className="pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={uploadedDocs.length === 0 || submitting}
                        className="w-full"
                    >
                        {submitting ? "Submitting Request..." : "Submit Verification Request"}
                    </Button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                        At least one document is required to submit.
                    </p>
                </div>
            </div>
        </div>
    );
}
