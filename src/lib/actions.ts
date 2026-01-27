"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export async function register(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                message: "Email already in use.",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
            },
        });
    } catch (error) {
        return {
            message: "Database Error: Failed to Create User.",
        };
    }

    // Attempt to sign in the user immediately after registration
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "Invalid credentials." };
                default:
                    return { message: "Something went wrong." };
            }
        }
        throw error;
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Return success even if user not found to prevent enumeration
        return { message: "If an account exists, a reset link has been sent." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    try {
        await sendPasswordResetEmail(email, token);
    } catch (error) {
        console.error("Failed to send email:", error);
        return { message: "Failed to send reset email." };
    }

    return { message: "If an account exists, a reset link has been sent.", success: true };
}

export async function resetPassword(prevState: any, formData: FormData) {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { message: "Passwords do not match." };
    }

    if (password.length < 6) {
        return { message: "Password must be at least 6 characters." };
    }

    const existingToken = await db.passwordResetToken.findUnique({
        where: { token },
    });

    if (!existingToken) {
        return { message: "Invalid or expired token." };
    }

    if (new Date() > existingToken.expires) {
        await db.passwordResetToken.delete({ where: { token } });
        return { message: "Token has expired." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { email: existingToken.email },
        data: { passwordHash: hashedPassword },
    });

    await db.passwordResetToken.delete({ where: { token } });

    return { message: "Password reset successful. You can now login.", success: true };
}

export async function validateResetToken(token: string) {
    const existingToken = await db.passwordResetToken.findUnique({
        where: { token },
    });

    if (!existingToken) return null;

    if (new Date() > existingToken.expires) {
        // Optional: cleanup expired token
        return null;
    }

    return existingToken.email;
}
