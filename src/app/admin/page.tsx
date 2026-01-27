import { getSystemStats } from "@/lib/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
    const stats = await getSystemStats();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered on platform</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified Profiles</CardTitle>
                        <span className="text-2xl">✅</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.verifiedProfiles}</div>
                        <p className="text-xs text-muted-foreground">Trust Verified Career</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Signups (Today)</CardTitle>
                        <span className="text-2xl">👤</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.newSignupsToday}</div>
                        <p className="text-xs text-muted-foreground">Growing community</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <span className="text-2xl">⏳</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{stats.pendingRequests}</div>
                        <p className="text-xs text-muted-foreground">Action required</p>
                    </CardContent>
                </Card>
            </div>

            {/* Verification Queue Preview - Quick Action Widget */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Verification Requests</CardTitle>
                            <CardDescription>
                                Users waiting for your approval.
                            </CardDescription>
                        </div>
                        <Link href="/admin/verification">
                            <Button size="sm" variant="outline">View All &rarr;</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.latestRequests.length === 0 ? (
                                <div className="text-sm text-center text-muted-foreground py-4">
                                    No pending requests. All caught up!
                                </div>
                            ) : (
                                stats.latestRequests.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                        <div className="flex items-center space-x-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{req.user.name}</p>
                                                <p className="text-sm text-muted-foreground">{req.careerProfile.jobTitle} at {req.careerProfile.companyName}</p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/verification/${req.id}`}>
                                            <Button size="sm">Review</Button>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
