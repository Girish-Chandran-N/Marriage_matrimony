import { Resend } from "resend";
import {
    welcomeEmailTemplate,
    interestReceivedEmailTemplate,
    interestAcceptedEmailTemplate,
    newMessageEmailTemplate,
    profileViewedEmailTemplate,
    verificationApprovedEmailTemplate,
    verificationRejectedEmailTemplate,
} from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = "Matrimony <onboarding@resend.dev>";

/** Internal helper — never throws, always logs errors */
async function sendEmail(to: string, subject: string, html: string) {
    try {
        const { error } = await resend.emails.send({ from: FROM, to, subject, html });
        if (error) console.error("[mail] Resend error:", error);
    } catch (e) {
        console.error("[mail] Failed to send email:", e);
    }
}

/* ── Auth Emails ───────────────────────────── */

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`;
    console.log(`\n📧 [DEV] Password Reset Link: ${resetLink}\n`);
    await sendEmail(
        email,
        "Reset your Matrimony password",
        `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );
};

export const sendWelcomeEmail = async (email: string, name: string) => {
    await sendEmail(email, `Welcome to Matrimony, ${name.split(" ")[0]}! 🎉`, welcomeEmailTemplate(name));
};

/* ── Interest Emails ───────────────────────── */

export const sendInterestReceivedEmail = async (
    email: string,
    name: string,
    senderName: string
) => {
    await sendEmail(
        email,
        `${senderName} sent you an interest 💌`,
        interestReceivedEmailTemplate(name, senderName)
    );
};

export const sendInterestAcceptedEmail = async (
    email: string,
    name: string,
    acceptorName: string
) => {
    await sendEmail(
        email,
        `${acceptorName} accepted your interest! 🎊`,
        interestAcceptedEmailTemplate(name, acceptorName)
    );
};

/* ── Message Email ─────────────────────────── */

export const sendNewMessageEmail = async (
    email: string,
    name: string,
    senderName: string,
    messagePreview: string
) => {
    await sendEmail(
        email,
        `New message from ${senderName} 💬`,
        newMessageEmailTemplate(name, senderName, messagePreview)
    );
};

/* ── Profile View Email ────────────────────── */

export const sendProfileViewedEmail = async (
    email: string,
    name: string,
    viewerName: string
) => {
    await sendEmail(
        email,
        `${viewerName} viewed your profile 👀`,
        profileViewedEmailTemplate(name, viewerName)
    );
};

/* ── Verification Status Emails ────────────── */

export const sendVerificationStatusEmail = async (
    email: string,
    status: "APPROVED" | "REJECTED",
    notes?: string,
    name?: string
) => {
    if (status === "APPROVED") {
        await sendEmail(
            email,
            "Your Matrimony profile is now Verified! ✅",
            verificationApprovedEmailTemplate(name || "Member")
        );
    } else {
        await sendEmail(
            email,
            "Update on your Matrimony verification",
            verificationRejectedEmailTemplate(name || "Member", notes)
        );
    }
};
