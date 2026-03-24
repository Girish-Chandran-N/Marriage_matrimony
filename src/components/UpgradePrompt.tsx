"use client";

import { MembershipTier } from "@prisma/client";
import { PLAN_PRICES, PURCHASABLE_TIERS } from "@/lib/plans";
import PurchaseButton from "@/components/PurchaseButton";
import { Lock, ArrowRight } from "lucide-react";

interface UpgradePromptProps {
    message?: string;
    /** If provided, shows a quick-buy button for this specific plan only */
    recommendedPlan?: MembershipTier;
    compact?: boolean;
}

export default function UpgradePrompt({
    message = "Upgrade your plan to unlock this feature.",
    recommendedPlan,
    compact = false,
}: UpgradePromptProps) {
    if (compact) {
        return (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-800 flex-1">{message}</span>
                {recommendedPlan && PLAN_PRICES[recommendedPlan] ? (
                    <PurchaseButton
                        plan={recommendedPlan}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Upgrade {PLAN_PRICES[recommendedPlan]?.label}
                    </PurchaseButton>
                ) : (
                    <a
                        href="/pricing"
                        className="text-amber-700 font-semibold hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                        View Plans <ArrowRight className="w-3 h-3" />
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="text-center py-10 px-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Premium Feature</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">{message}</p>

            {recommendedPlan && PLAN_PRICES[recommendedPlan] ? (
                <div className="space-y-3">
                    <PurchaseButton
                        plan={recommendedPlan}
                        className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-red-200 transition-all"
                    >
                        Upgrade to {PLAN_PRICES[recommendedPlan]?.label}
                    </PurchaseButton>
                    <div>
                        <a href="/pricing" className="text-sm text-slate-400 hover:text-slate-600 underline">
                            Compare all plans
                        </a>
                    </div>
                </div>
            ) : (
                <a
                    href="/pricing"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-red-200 transition-all"
                >
                    View Plans <ArrowRight className="w-4 h-4" />
                </a>
            )}
        </div>
    );
}
