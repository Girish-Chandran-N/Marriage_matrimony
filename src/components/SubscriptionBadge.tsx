import { getUserSubscription } from "@/lib/subscription-actions";
import { PLAN_LIMITS } from "@/lib/plans";
import { Crown, Clock } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
    FREE: "bg-slate-100 text-slate-600 border-slate-200",
    STARTER: "bg-slate-100 text-slate-600 border-slate-200",
    BASIC: "bg-blue-50 text-blue-700 border-blue-200",
    SILVER: "bg-slate-100 text-slate-700 border-slate-300",
    GOLD: "bg-amber-50 text-amber-700 border-amber-300",
    PLATINUM: "bg-violet-50 text-violet-700 border-violet-300",
    ELITE: "bg-rose-50 text-rose-700 border-rose-300",
};

interface SubscriptionBadgeProps {
    userId: string;
}

export default async function SubscriptionBadge({ userId }: SubscriptionBadgeProps) {
    const sub = await getUserSubscription(userId);
    const limits = PLAN_LIMITS[sub.tier];

    const daysLeft = sub.endDate
        ? Math.max(0, Math.ceil((sub.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null;

    const colorClass = TIER_COLORS[sub.tier] ?? TIER_COLORS.FREE;

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${colorClass}`}>
            <Crown className="w-3.5 h-3.5 shrink-0" />
            <span>{limits.label}</span>
            {sub.isActive && daysLeft !== null && (
                <span className="flex items-center gap-1 opacity-70 ml-1">
                    <Clock className="w-3 h-3" />
                    {daysLeft}d left
                </span>
            )}
            {!sub.isActive && sub.tier === "FREE" && (
                <a
                    href="/pricing"
                    className="ml-1 underline opacity-80 hover:opacity-100 font-bold"
                >
                    Upgrade
                </a>
            )}
        </div>
    );
}
