"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-[400px] text-center shadow-lg border-red-100">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <span className="text-6xl">🤕</span>
                    </div>
                    <CardTitle className="text-2xl text-red-600">Something went wrong!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-500 text-sm">
                        Don't worry, we're already looking into it. Please try again or contact support if the problem persists.
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => window.location.href = "/"}>
                            Go Home
                        </Button>
                        <Button onClick={() => reset()}>Try again</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
