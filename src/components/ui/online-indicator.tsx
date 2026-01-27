"use client";

import { useActiveUsers } from "@/hooks/use-active-users";

export default function OnlineIndicator({ userId, size = "md" }: { userId: string, size?: "sm" | "md" | "lg" }) {
    const { activeUsers } = useActiveUsers();

    // Check if user is in the active list (Presence Channel)
    const isOnline = activeUsers.includes(userId);

    if (!isOnline) return null;

    const sizeClasses = {
        sm: "w-2 h-2",
        md: "w-3 h-3 border-2",
        lg: "w-4 h-4 border-2"
    };

    return (
        <span
            className={`absolute bottom-0 right-0 rounded-full bg-green-500 border-white ${sizeClasses[size]}`}
            title="Online"
        />
    );
}
