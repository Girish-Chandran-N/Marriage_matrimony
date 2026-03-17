"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/mail";
import crypto from "crypto";

const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .refine((email) => {
            const allowedDomains = [
                "gmail.com",
                "outlook.com",
                "yahoo.com",
                "hotmail.com",
                "icloud.com",
                "protonmail.com",
            ];
            const domain = email.split("@")[1];
            return allowedDomains.includes(domain);
        }, { message: "Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    phoneNumber: z.string().regex(/^\+?\d{10,15}$/, { message: "Invalid mobile number format." }),
    gender: z.enum(["Male", "Female", "Other"], { message: "Please select a gender." }),
    dob: z.string().refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    }, { message: "You must be at least 18 years old." }),
});

export async function register(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phoneNumber: formData.get("phoneNumber"),
        gender: formData.get("gender"),
        dob: formData.get("dob"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Register.",
            payload: {
                name: formData.get("name")?.toString(),
                email: formData.get("email")?.toString(),
                phoneNumber: formData.get("phoneNumber")?.toString(),
                gender: formData.get("gender")?.toString(),
                dob: formData.get("dob")?.toString(),
            }
        };
    }

    const { name, email, password, phoneNumber, gender, dob } = validatedFields.data;

    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                message: "Email already in use.",
                payload: { name, email, phoneNumber, gender, dob }
            };
        }

        const existingPhone = await db.user.findUnique({
            where: { phoneNumber },
        });

        if (existingPhone) {
            return {
                message: "Mobile number already in use.",
                payload: { name, email, phoneNumber, gender, dob }
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                phoneNumber,
                personalDetails: {
                    create: {
                        gender,
                        dateOfBirth: new Date(dob),
                    },
                },
                careerProfile: {
                    create: {
                        jobTitle: "",
                        companyName: "",
                    }
                },
                lifestyleDetails: { create: {} },
                familyDetails: { create: {} },
            },
        });

        // Fire-and-forget welcome email
        sendWelcomeEmail(email, name).catch(() => {});
    } catch (error) {
        console.error("Registration error:", error);
        return {
            message: "Database Error: " + (error instanceof Error ? error.message : String(error)),
            payload: { name, email, phoneNumber, gender }
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
