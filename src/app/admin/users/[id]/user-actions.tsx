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
import { updateUserStatus, updateUserRole } from "@/lib/admin-actions";
import { AccountStatus, Role } from "@prisma/client";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserActionsProps {
    userId: string;
    currentStatus: AccountStatus;
    currentRole: Role;
}

export function UserActions({ userId, currentStatus, currentRole }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (status: AccountStatus) => {
        setIsLoading(true);
        try {
            await updateUserStatus(userId, status, `Admin action: Changed to ${status}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (role: Role) => {
        if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
        setIsLoading(true);
        try {
            await updateUserRole(userId, role);
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Failed to update role");
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentRole === Role.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {currentRole}
            </span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Manage User
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.ACTIVE)}>
                        Activate User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.SUSPENDED)} className="text-orange-600">
                        Suspend (Temporary)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(AccountStatus.BANNED)} className="text-red-600">
                        Ban (Permanent)
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Role & Permissions</DropdownMenuLabel>
                    {currentRole !== Role.ADMIN && (
                        <DropdownMenuItem onClick={() => handleRoleChange(Role.ADMIN)} className="text-purple-600">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Promote to Admin
                        </DropdownMenuItem>
                    )}
                    {currentRole === Role.ADMIN && (
                        <DropdownMenuItem onClick={() => handleRoleChange(Role.USER)} className="text-gray-600">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Demote to User
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
