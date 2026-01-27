import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-[400px] text-center shadow-lg">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <span className="text-6xl">🤔</span>
                    </div>
                    <CardTitle className="text-2xl">Page Not Found</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-500">
                        Oops! The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link href="/dashboard">
                        <Button className="w-full">Return Home</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
