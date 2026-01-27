import { getUserDetails, type UserDetails } from "@/lib/admin-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserActions } from "./user-actions";
import { AccountStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getUserDetails(id) as UserDetails;
    const latestVerification = user?.verificationRequests?.[0];

    if (!user) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="ghost">Back to List</Button>
                    </Link>
                    <UserActions userId={user.id} currentStatus={user.status as AccountStatus} currentRole={user.role as import("@prisma/client").Role} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Identity & Career */}
                <Card>
                    <CardHeader>
                        <CardTitle>Career Profile</CardTitle>
                        <CardDescription>
                            Verification Status: {user.careerProfile?.isVerified ? "✅ Verified" : "❌ Unverified"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium text-gray-500">Job Title:</span>
                            <span>{user.careerProfile?.jobTitle || "N/A"}</span>

                            <span className="font-medium text-gray-500">Company:</span>
                            <span>{user.careerProfile?.companyName || "N/A"}</span>

                            <span className="font-medium text-gray-500">Income:</span>
                            <span>{user.careerProfile?.incomeRange || "N/A"}</span>

                            <span className="font-medium text-gray-500">Location:</span>
                            <span>{user.careerProfile?.workLocation || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium text-gray-500">Age:</span>
                            <span>
                                {user.personalDetails?.dateOfBirth
                                    ? `${new Date().getFullYear() - new Date(user.personalDetails.dateOfBirth).getFullYear()} years`
                                    : "N/A"}
                            </span>

                            <span className="font-medium text-gray-500">Height:</span>
                            <span>{user.personalDetails?.height ? `${user.personalDetails.height} cm` : "N/A"}</span>

                            <span className="font-medium text-gray-500">Religion/Caste:</span>
                            <span>{user.personalDetails?.religion} / {user.personalDetails?.caste}</span>

                            <span className="font-medium text-gray-500">Mother Tongue:</span>
                            <span>{user.personalDetails?.motherTongue || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Family */}
                <Card>
                    <CardHeader>
                        <CardTitle>Family Background</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="font-medium text-gray-500">Family Type:</span>
                            <span>{user.familyDetails?.familyType || "N/A"}</span>

                            <span className="font-medium text-gray-500">Status:</span>
                            <span>{user.familyDetails?.familyStatus || "N/A"}</span>

                            <span className="font-medium text-gray-500">Father's Job:</span>
                            <span>{user.familyDetails?.fatherOccupation || "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Account History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-sm">
                                <span className="font-medium text-gray-500">Joined:</span>
                                <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Ban/Suspension Log</h4>
                                {user.banLogs && user.banLogs.length > 0 ? (
                                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                                        {user.banLogs.map((log) => (
                                            <li key={log.id} className="text-xs border-l-2 border-red-200 pl-2">
                                                <div className="font-medium">{log.status}</div>
                                                <div className="text-gray-500">{log.reason}</div>
                                                <div className="text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400">No disciplinary history.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Verification Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Verification Documents</CardTitle>
                        <CardDescription>
                            Documents submitted for career verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {latestVerification && latestVerification.documentUrls.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {latestVerification.documentUrls.map((url: string, index: number) => (
                                    <div key={index} className="relative group">
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                                            <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border hover:border-blue-500 transition-colors">
                                                <span className="text-xs text-gray-500">Document {index + 1}</span>
                                            </div>
                                        </a>
                                        <div className="mt-1 text-xs text-center text-gray-500 truncate px-2">
                                            {url.split('/').pop()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed">
                                No verification documents found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
