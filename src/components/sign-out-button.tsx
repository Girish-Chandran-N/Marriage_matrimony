"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export function SignOutButton() {
    return (
        <DropdownMenuItem
            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            Log out
        </DropdownMenuItem>
    );
}
