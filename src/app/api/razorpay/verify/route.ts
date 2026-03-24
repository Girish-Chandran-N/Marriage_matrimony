import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndActivateSubscription } from "@/lib/subscription-actions";
import { MembershipTier } from "@prisma/client";
import { PURCHASABLE_TIERS } from "@/lib/plans";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan,
    } = body ?? {};

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !plan ||
        !PURCHASABLE_TIERS.includes(plan as MembershipTier)
    ) {
        return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const result = await verifyAndActivateSubscription(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan as MembershipTier
    );

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
}
