"use client";

import { resolveReport } from "@/lib/moderation-actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Check, Ban } from "lucide-react";

export function ReportActionButtons({ reportId }: { reportId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleResolve = (outcome: "DISMISS" | "BAN") => {
        if (confirm(`Are you sure you want to ${outcome} this report?`)) {
            startTransition(async () => {
                await resolveReport(reportId, outcome);
            });
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolve("DISMISS")}
                disabled={isPending}
                className="text-gray-600"
            >
                <Check className="w-4 h-4 mr-1" /> Dismiss
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleResolve("BAN")}
                disabled={isPending}
            >
                <Ban className="w-4 h-4 mr-1" /> Ban User
            </Button>
        </div>
    );
}
