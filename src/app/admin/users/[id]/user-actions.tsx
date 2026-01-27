"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserStatus } from "@/lib/admin-actions";
import { AccountStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface UserActionsProps {
    userId: string;
    currentStatus: AccountStatus;
}

export function UserActions({ userId, currentStatus }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (status: AccountStatus) => {
        setIsLoading(true);
        try {
            // For now, using a generic reason. Future: Add dialog to input reason.
            await updateUserStatus(userId, status, `Admin action: Changed to ${status}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus === AccountStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                    currentStatus === AccountStatus.SUSPENDED ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                }`}>
                {currentStatus}
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Change Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.ACTIVE)}>
                        Activate User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.SUSPENDED)} className="text-orange-600">
                        Suspend (Temporary)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.BANNED)} className="text-red-600">
                        Ban (Permanent)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
