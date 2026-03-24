"use client";

import { useState } from "react";
import { MembershipTier } from "@prisma/client";
import { PLAN_PRICES } from "@/lib/plans";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

interface PurchaseButtonProps {
    plan: MembershipTier;
    className?: string;
    children?: React.ReactNode;
}

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function PurchaseButton({ plan, className, children }: PurchaseButtonProps) {
    const [loading, setLoading] = useState(false);
    const planPrice = PLAN_PRICES[plan];

    const handlePurchase = async () => {
        setLoading(true);
        try {
            // 1. Load Razorpay SDK
            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) {
                toast.error("Failed to load payment gateway. Please try again.");
                return;
            }

            // 2. Create order on server
            const res = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan }),
            });
            const order = await res.json();
            if (!res.ok || order.error) {
                toast.error(order.error ?? "Failed to create order");
                return;
            }

            // 3. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Marriage Junction",
                description: order.planLabel,
                order_id: order.orderId,
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    // 4. Verify payment on server
                    const verifyRes = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan,
                        }),
                    });
                    const result = await verifyRes.json();
                    if (result.success) {
                        toast.success(result.message ?? "Subscription activated!");
                        // Reload to reflect the new plan
                        window.location.reload();
                    } else {
                        toast.error(result.error ?? "Payment verification failed");
                    }
                },
                prefill: {},
                theme: { color: "#c0392b" },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        toast.info("Payment cancelled");
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!planPrice) return null;

    return (
        <button
            onClick={handlePurchase}
            disabled={loading}
            className={className}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                </span>
            ) : (
                children ?? `Buy ${planPrice.label}`
            )}
        </button>
    );
}
