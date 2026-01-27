import { validateResetToken } from "@/lib/actions";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    // Next.js 15+ / 16: searchParams is a Promise.
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="flex bg-gray-100 min-h-screen items-center justify-center p-4">
                <div className="text-center text-red-500">
                    Invalid or missing reset token. Please request a new link.
                </div>
            </div>
        );
    }

    // Server-side validation
    const email = await validateResetToken(token);

    return (
        <div className="flex bg-gray-100 min-h-screen items-center justify-center p-4">
            <ResetPasswordForm token={token} email={email} />
        </div>
    );
}
