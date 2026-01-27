import { auth } from "@/auth";
import { getBlockedUsers, unblockUser } from "@/lib/block-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Ban, Unlock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UnblockButton } from "./unblock-button";

export default async function BlockedUsersPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const blockedUsers = await getBlockedUsers();

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ban className="w-5 h-5 text-red-500" />
                        Blocked Users
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {blockedUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No blocked users</p>
                            <p className="text-sm">You simply haven't blocked anyone yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {blockedUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                                            <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{user.name}</h3>
                                            {user.careerProfile && (
                                                <p className="text-sm text-gray-500">
                                                    {user.careerProfile.jobTitle}
                                                    {user.careerProfile.companyName && ` at ${user.careerProfile.companyName}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <UnblockButton userId={user.id} userName={user.name || "this user"} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <Link href="/matches">
                            <Button variant="outline">Back to Matches</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
