import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}/reset-password?token=${token}`;

    console.log(`\n📧 [DEV MODE] Password Reset Link: ${resetLink}\n`);

    try {
        const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        if (error) {
            console.error("Resend Error (Password Reset):", error);
            // Don't throw, just rely on the console log above for dev
        }
    } catch (e) {
        console.error("Email sending failed, but link is logged above.");
    }
};

export const sendVerificationStatusEmail = async (
    email: string,
    status: "APPROVED" | "REJECTED",
    notes?: string
) => {
    const subject = status === "APPROVED"
        ? "Your Profile is Verified! 🎉"
        : "Profile Verification Update";

    const html = status === "APPROVED"
        ? `
            <h1>Congratulations!</h1>
            <p>Your profile has been verified.</p>
            <p>You can now enjoy verified badges and prioritized matching.</p>
        `
        : `
            <h1>Verification Update</h1>
            <p>Your profile verification request was not approved.</p>
            <p><strong>Reason:</strong> ${notes || "Documentation incomplete or invalid."}</p>
            <p>Please update your profile and try again.</p>
        `;

    const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject,
        html
    });

    if (error) {
        console.error("Resend Error (Verification):", error);
        throw new Error("Failed to send email");
    }
};
