"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { processVerification } from "@/lib/admin-actions";
import { VerificationAction } from "@prisma/client"; // Will exist after generate
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function VerificationControls({ requestId }: { requestId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDecision = async (action: any) => { // Type as any temp if enum not ready
        if (!confirm(`Are you sure you want to ${action}?`)) return;

        setIsLoading(true);
        try {
            await processVerification(requestId, action, `Admin decision: ${action}`);
            // Success handled by revalidate, maybe toast here
        } catch (error) {
            console.error(error);
            alert("Failed to process");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDecision('REJECTED')}
                disabled={isLoading}
                className="gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Reject
            </Button>

            <Button
                variant="default"
                size="sm"
                onClick={() => handleDecision('APPROVED')}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve
            </Button>
        </div>
    );
}
