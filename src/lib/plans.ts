import { MembershipTier } from "@prisma/client";

// ─── Plan Feature Limits ──────────────────────────────────────────────────────
export const PLAN_LIMITS: Record<
    MembershipTier,
    {
        interestsPerDay: number; // 99 = effectively unlimited
        contactViews: number; // lifetime contact reveals allowed
        canChat: boolean;
        durationDays: number;
        label: string;
    }
> = {
    FREE: {
        interestsPerDay: 1,
        contactViews: 0,
        canChat: false,
        durationDays: 3,
        label: "Free",
    },
    STARTER: {
        interestsPerDay: 1,
        contactViews: 0,
        canChat: false,
        durationDays: 3,
        label: "Starter Access",
    },
    BASIC: {
        interestsPerDay: 99,
        contactViews: 5,
        canChat: true,
        durationDays: 15,
        label: "Basic Plan",
    },
    SILVER: {
        interestsPerDay: 99,
        contactViews: 30,
        canChat: true,
        durationDays: 180,
        label: "Silver Plan",
    },
    GOLD: {
        interestsPerDay: 99,
        contactViews: 75,
        canChat: true,
        durationDays: 365,
        label: "Gold Plan",
    },
    PLATINUM: {
        interestsPerDay: 99,
        contactViews: 150,
        canChat: true,
        durationDays: 455,
        label: "Platinum Plan",
    },
    ELITE: {
        interestsPerDay: 99,
        contactViews: 9999,
        canChat: true,
        durationDays: 730,
        label: "Elite Plan",
    },
};

// ─── Paid Plan Prices (amount in paise for Razorpay) ─────────────────────────
export const PLAN_PRICES: Partial<
    Record<
        MembershipTier,
        { amount: number; label: string; period: string }
    >
> = {
    BASIC: { amount: 59900, label: "₹599", period: "15 Days" },
    SILVER: { amount: 599900, label: "₹5,999", period: "6 Months" },
    GOLD: { amount: 999900, label: "₹9,999", period: "12 Months" },
    PLATINUM: { amount: 1299900, label: "₹12,999", period: "15 Months" },
    ELITE: { amount: 1559900, label: "₹15,599", period: "24 Months" },
};

// Tiers that can be purchased (exclude FREE / STARTER)
export const PURCHASABLE_TIERS = Object.keys(PLAN_PRICES) as MembershipTier[];

// ─── Tier ordering (higher index = better) ───────────────────────────────────
export const TIER_ORDER: MembershipTier[] = [
    "FREE",
    "STARTER",
    "BASIC",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "ELITE",
];

export function tierRank(tier: MembershipTier): number {
    return TIER_ORDER.indexOf(tier);
}
