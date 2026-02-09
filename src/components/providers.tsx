"use client";

import { SessionProvider } from "next-auth/react";
import { ActiveUsersProvider } from "@/contexts/active-users-context";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ActiveUsersProvider>
                {children}
            </ActiveUsersProvider>
        </SessionProvider>
    );
}
