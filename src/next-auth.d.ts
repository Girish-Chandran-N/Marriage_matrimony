import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: Role;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }

    interface User {
        role: Role;
        profileImage?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role;
    }
}
