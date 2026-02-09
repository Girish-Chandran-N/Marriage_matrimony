"use client";

import { SessionProvider } from "next-auth/react";
import { ActiveUsersProvider } from "@/contexts/active-users-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ActiveUsersProvider>
                {children}
                <Toaster position="top-center" richColors />
            </ActiveUsersProvider>
        </SessionProvider>
    );
}
