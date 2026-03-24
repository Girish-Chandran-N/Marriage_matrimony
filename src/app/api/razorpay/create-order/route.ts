import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createRazorpayOrder } from "@/lib/subscription-actions";
import { MembershipTier } from "@prisma/client";
import { PURCHASABLE_TIERS } from "@/lib/plans";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const plan = body?.plan as MembershipTier | undefined;

    if (!plan || !PURCHASABLE_TIERS.includes(plan)) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const result = await createRazorpayOrder(plan);

    if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
}
