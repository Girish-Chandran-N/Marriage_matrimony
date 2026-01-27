"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(requestPasswordReset, undefined);

    return (
        <div className="flex bg-gray-100 min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state?.success ? (
                        <div className="space-y-4 text-center">
                            <div className="text-4xl">📧</div>
                            <h3 className="text-lg font-medium">Check your email</h3>
                            <p className="text-sm text-gray-500">
                                {state.message}
                            </p>
                            <div className="text-sm">
                                <Link href="/login" className="text-blue-600 hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form action={action} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            {state?.message && (
                                <p className="text-sm text-red-500">{state.message}</p>
                            )}

                            <Button className="w-full" type="submit" disabled={isPending}>
                                {isPending ? "Sending link..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center text-sm text-gray-500">
                                Remember your password?{" "}
                                <Link href="/login" className="text-blue-600 hover:underline">
                                    Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
