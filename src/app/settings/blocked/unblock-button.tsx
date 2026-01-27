"use client";

import { Button } from "@/components/ui/button";
import { unblockUser } from "@/lib/block-actions";
import { Unlock } from "lucide-react";
import { useState } from "react";

export function UnblockButton({ userId, userName }: { userId: string, userName: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUnblock = async () => {
        if (!confirm(`Are you sure you want to unblock ${userName}?`)) return;

        setIsLoading(true);
        try {
            const result = await unblockUser(userId);
            if (result.success) {
                // Success feedback - page will refresh via revalidatePath
                alert("User unblocked successfully");
            } else {
                alert("Failed to unblock user");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleUnblock}
            disabled={isLoading}
            className="text-gray-600 hover:text-green-600 hover:bg-green-50"
        >
            <Unlock className="w-4 h-4 mr-2" />
            {isLoading ? "Unblocking..." : "Unblock"}
        </Button>
    );
}
