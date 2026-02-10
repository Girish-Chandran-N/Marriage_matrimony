import { getVerificationRequest, VerificationRequestDetail } from "@/lib/admin-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VerificationControls } from "./verification-controls";
import { VerificationAction } from "@prisma/client";

export default async function VerificationWorkstationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const request = await getVerificationRequest(id) as VerificationRequestDetail;

    if (!request) return notFound();

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Verification Workstation</h1>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                            {request.status}
                        </span>
                    </div>
                    <p className="text-gray-500">Request ID: {request.id}</p>
                </div>
                <Link href="/admin/verification">
                    <Button variant="ghost">Back to Queue</Button>
                </Link>
            </div>

            {/* Split Screen Workspace */}
            <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">

                {/* LEFT PANEL: User Profile Data (The "Truth") */}
                <Card className="flex flex-col overflow-auto h-full">
                    <CardHeader className="pb-3 border-b bg-gray-50/50">
                        <CardTitle className="text-lg">Claimed Profile Data</CardTitle>
                        <CardDescription>Verify this against the document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">

                        {/* User Identity */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Identity</h3>
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <div className="text-lg font-bold text-gray-900">{request.user.name}</div>
                                <div className="text-sm text-gray-500">{request.user.email}</div>
                            </div>
                        </div>

                        {/* Career Claims (Critical for this request) */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                                💼 Career Claims
                            </h3>
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-3">
                                <div>
                                    <div className="text-xs text-gray-500">Job Title</div>
                                    <div className="font-semibold text-gray-900">{request.careerProfile.jobTitle}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Company</div>
                                    <div className="font-semibold text-gray-900">{request.careerProfile.companyName}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Income Range</div>
                                    <div className="font-semibold text-gray-900">{request.careerProfile.incomeRange || "Not Specified"}</div>
                                </div>
                                <div className="pt-2 border-t border-blue-200/50 mt-2">
                                    <div className="text-xs text-gray-500">LinkedIn</div>
                                    <a href={request.careerProfile.linkedinUrl || "#"} target="_blank" className="text-blue-600 hover:underline truncate block">
                                        {request.careerProfile.linkedinUrl || "Not Provided"}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Previous Decision Logs */}
                        {request.logs.length > 0 && (
                            <div className="space-y-2 pt-4 border-t">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase">History</h3>
                                <ul className="space-y-2">
                                    {request.logs.map(log => (
                                        <li key={log.id} className="text-xs text-gray-500">
                                            <span className={`font-medium ${log.action === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                                                {log.action}
                                            </span>
                                            {" "}by {log.admin.name} - {new Date(log.createdAt).toLocaleDateString()}
                                            {log.notes && <div className="italic text-gray-400 pl-2">"{log.notes}"</div>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* RIGHT PANEL: Document Viewer (The "Evidence") */}
                <Card className="flex flex-col h-full overflow-hidden border-orange-200 shadow-sm leading-snug">
                    <CardHeader className="pb-3 border-b bg-orange-50/30 flex flex-row items-center justify-between shrink-0">
                        <div>
                            <CardTitle className="text-lg">Proof Documents</CardTitle>
                            <CardDescription>ID / Salary Slip / Certificate</CardDescription>
                        </div>
                        <VerificationControls requestId={request.id} />
                    </CardHeader>

                    <CardContent className="flex-1 bg-slate-900 p-4 overflow-auto flex items-center justify-center">
                        {request.documentUrls.length > 0 ? (
                            <div className="w-full space-y-8">
                                {request.documentUrls.map((url, index) => {
                                    const isPDF = url.toLowerCase().endsWith('.pdf');

                                    return (
                                        <div key={index} className="relative group">
                                            <div className="bg-white p-2 rounded shadow-lg mx-auto max-w-4xl">
                                                {isPDF ? (
                                                    // PDF Viewer
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                📄 Document {index + 1}
                                                            </span>
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                            >
                                                                Open in New Tab →
                                                            </a>
                                                        </div>
                                                        <iframe
                                                            src={url}
                                                            className="w-full h-[600px] border rounded"
                                                            title={`Document ${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    // Image Viewer
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                🖼️ Image {index + 1}
                                                            </span>
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                            >
                                                                Open Full Size →
                                                            </a>
                                                        </div>
                                                        <img
                                                            src={url}
                                                            alt={`Document ${index + 1}`}
                                                            className="w-full h-auto rounded border border-gray-200"
                                                        />
                                                    </div>
                                                )}
                                                <div className="mt-2 text-xs text-center text-gray-500 break-all px-2">
                                                    {url}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </div>
                    ) : (
                    <div className="text-white/50 italic">No documents attached</div>
                        )}
                </CardContent>
            </Card>

        </div>
        </div >
    );
}
