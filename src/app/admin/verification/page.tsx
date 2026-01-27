import { getPendingRequests } from "@/lib/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function VerificationQueuePage() {
    const requests = await getPendingRequests();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Verification Queue</h1>
                    <p className="text-muted-foreground">Review and process identity verification requests.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>
                        {requests.length} requests waiting for review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                <tr className="border-b">
                                    <th className="p-4">User</th>
                                    <th className="p-4">Career Profile</th>
                                    <th className="p-4">Submitted</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                            No pending requests. Good job! 🎉
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                <div>
                                                    <div className="text-base text-gray-900">{req.user.name}</div>
                                                    <div className="text-xs text-gray-500">{req.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="font-medium text-gray-800">{req.careerProfile.jobTitle}</div>
                                                <div className="text-xs text-gray-500">
                                                    {req.careerProfile.companyName} • {req.careerProfile.industry}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Link href={`/admin/verification/${req.id}`}>
                                                    <Button size="sm">Review</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
