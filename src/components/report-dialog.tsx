"use client";

import { useState, useTransition } from "react";
import { submitReport } from "@/lib/moderation-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function ReportDialog({ userId, userName }: { userId: string, userName: string }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const formData = new FormData();
            formData.append("reportedId", userId);
            formData.append("reason", reason);

            const result = await submitReport(formData);
            if (result.success) {
                alert("Report submitted. Thank you for helping keep our community safe.");
                setOpen(false);
                setReason("");
            } else {
                alert("Failed to submit report. Please try again.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Flag className="w-4 h-4 mr-2" /> Report User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report {userName}</DialogTitle>
                    <DialogDescription>
                        Please describe why you are reporting this user. This will be reviewed by our moderation team.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="e.g. Inappropriate behavior, fake profile, spam..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
