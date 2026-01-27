"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm({ token, email }: { token: string; email: string | null }) {
    const [state, action, isPending] = useActionState(resetPassword, undefined);

    if (!email) {
        return (
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-red-500 mb-4">⚠️ Link Expired or Invalid</div>
                <p className="text-gray-600">The password reset link is invalid or has expired.</p>
                <Button asChild className="mt-4 w-full">
                    <Link href="/forgot-password">Request New Link</Link>
                </Button>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                <CardDescription>
                    for <span className="font-semibold text-blue-600">{email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {state?.success ? (
                    <div className="space-y-4 text-center">
                        <div className="text-4xl text-green-500">✅</div>
                        <h3 className="text-lg font-medium">Password Reset!</h3>
                        <p className="text-sm text-gray-500">
                            Your password has been successfully updated.
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <form action={action} className="space-y-4">
                        <input type="hidden" name="token" value={token} />
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">
                                New Password
                            </label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                                Confirm Password
                            </label>
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                autoComplete="new-password"
                                required
                                minLength={6}
                            />
                        </div>

                        {state?.message && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}

                        <Button className="w-full" type="submit" disabled={isPending}>
                            {isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
