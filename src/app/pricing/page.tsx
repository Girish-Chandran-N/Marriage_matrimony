import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap, Star, Shield, Gem, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PurchaseButton from "@/components/PurchaseButton";
import type { MembershipTier } from "@prisma/client";

export default function PricingPage() {
    return (
        <main className="min-h-[100dvh] bg-[#09090b] text-white pb-24 relative overflow-x-hidden">
            {/* Native Mobile Header */}
            <div className="sticky top-0 z-40 bg-[#121214]/80 backdrop-blur-md border-b border-[#222] px-4 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="text-slate-400 hover:text-white">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                    Premly Premium
                </h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Hero Section */}
            <section className="relative pt-12 pb-8 px-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-3">
                        Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">soulmate</span> faster.
                    </h2>
                    <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed">
                        Upgrade your intent. See exactly who likes you, unlock unlimited messages, and get priority matchmaking.
                    </p>
                </div>
            </section>

            {/* iOS Snapping Horizontal Scroll for Plans */}
            <section className="px-4 pb-12">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style dangerouslySetInnerHTML={{__html: `
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                    `}} />
                    
                    {/* Starter (Access) */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Starter Access"
                            price="Free"
                            period="3 Days"
                            description="Experience the platform."
                            features={[
                                "Create Profile",
                                "Browse Profiles",
                                "Send 1 Interest/Day",
                                "No Contact Info"
                            ]}
                            buttonText="Start Free Trial"
                            buttonVariant="outline"
                            icon={<Star className="w-5 h-5" />}
                            color="slate"
                        />
                    </div>

                    {/* Basic Plan */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Basic Plan"
                            price="₹599"
                            period="15 Days"
                            description="Short-term access for quick search."
                            features={[
                                "Everything in Starter",
                                "View 5 Contacts",
                                "Unlimited Interests",
                                "Basic Chat"
                            ]}
                            buttonText="Get Basic"
                            buttonVariant="outline"
                            plan="BASIC"
                            icon={<Shield className="w-5 h-5" />}
                            color="blue"
                        />
                    </div>

                    {/* Silver Plan */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Silver Plan"
                            price="₹5999"
                            period="6 Months"
                            description="Standard plan for serious seekers."
                            features={[
                                "Everything in Basic",
                                "View 30 Contacts",
                                "Messaging & Chat",
                                "Priority Support"
                            ]}
                            buttonText="Get Silver"
                            buttonVariant="primary"
                            plan="SILVER"
                            icon={<Sparkles className="w-5 h-5" />}
                            color="gray"
                        />
                    </div>

                    {/* Gold Plan */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Gold Plan"
                            price="₹9999"
                            period="12 Months"
                            description="Best value for long-term search."
                            highlighted={true}
                            features={[
                                "Everything in Silver",
                                "View 75 Contacts",
                                "Profile Highlighter",
                                "Relationship Manager"
                            ]}
                            buttonText="Go Gold"
                            buttonVariant="primary"
                            plan="GOLD"
                            icon={<Crown className="w-5 h-5" />}
                            color="amber"
                        />
                    </div>

                    {/* Platinum Plan */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Platinum Plan"
                            price="₹12999"
                            period="15 Months"
                            description="Premium features & visibility."
                            features={[
                                "Everything in Gold",
                                "View 150 Contacts",
                                "Profile Spotlight (2x)",
                                "Verified Badge"
                            ]}
                            buttonText="Go Platinum"
                            buttonVariant="outline"
                            plan="PLATINUM"
                            icon={<Gem className="w-5 h-5" />}
                            color="violet"
                        />
                    </div>

                    {/* Elite Plan */}
                    <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                        <PricingCard
                            title="Elite Plan"
                            price="₹15599"
                            period="24 Months"
                            description="The ultimate VIP experience."
                            features={[
                                "All Features Unlocked",
                                "Unlimited Contacts",
                                "Dedicated Advisor",
                                "Top Search Ranking"
                            ]}
                            buttonText="Join Elite"
                            buttonVariant="outline"
                            plan="ELITE"
                            icon={<Zap className="w-5 h-5" />}
                            color="rose"
                        />
                    </div>
                </div>
                
                <div className="mt-8 text-center px-6">
                    <p className="text-xs text-slate-500 mb-4">
                        Recurring billing, cancel anytime. By tapping 'Get', you agree to our Terms of Service and Privacy Policy.
                    </p>
                    <div className="flex justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function PricingCard({ title, price, period, description, features, buttonText, buttonVariant, highlighted = false, icon, color, plan }: {
    title: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "primary" | "outline";
    highlighted?: boolean;
    icon: React.ReactNode;
    color: "slate" | "blue" | "gray" | "amber" | "violet" | "rose";
    plan?: MembershipTier;
}) {
    // Mobile Dark Theme Styles
    const colorStyles = {
        slate: "bg-[#121214] border-[#222] text-white",
        blue: "bg-[#121214] border-blue-900/40 text-white",
        gray: "bg-[#121214] border-slate-700/50 text-white",
        amber: "bg-gradient-to-b from-[#1a1500] to-[#0a0800] border-amber-500/40 text-white ring-1 ring-amber-500/20",
        violet: "bg-gradient-to-b from-[#150020] to-[#0a0010] border-violet-500/40 text-white",
        rose: "bg-gradient-to-b from-[#20000a] to-[#100005] border-rose-500/40 text-white",
    };

    const iconBg = {
        slate: "bg-[#222] text-slate-400",
        blue: "bg-blue-500/20 text-blue-400",
        gray: "bg-slate-700/40 text-slate-300",
        amber: "bg-amber-500/20 text-amber-500",
        violet: "bg-violet-500/20 text-violet-400",
        rose: "bg-rose-500/20 text-rose-400",
    };

    const btnStyles = {
        slate: "bg-[#222] text-white hover:bg-[#333] border-none",
        blue: "bg-blue-600 text-white hover:bg-blue-700 border-none shadow-blue-500/20",
        gray: "bg-slate-700 text-white hover:bg-slate-600 border-none",
        amber: "bg-gradient-to-r from-amber-400 to-amber-600 text-[#000] hover:scale-105 border-none shadow-amber-500/20",
        violet: "bg-violet-600 text-white hover:bg-violet-700 border-none shadow-violet-500/20",
        rose: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-105 border-none shadow-rose-500/20",
    };

    return (
        <div className={`relative p-7 rounded-[2rem] border flex flex-col h-[500px] w-full ${highlighted ? "shadow-2xl shadow-amber-500/10" : "shadow-lg"} ${colorStyles[color]}`}>
            {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        Best Value
                    </span>
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-2xl ${iconBg[color]}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold tracking-wide">{title}</h3>
            </div>

            <div className="mb-8">
                <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black tracking-tighter">{price}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#888]">{period}</span>
                <p className="mt-4 text-sm text-[#aaa] leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="space-y-4 mb-8 flex-1 overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#222] flex flex-shrink-0 items-center justify-center">
                            <Check className="w-3 h-3 text-slate-300" strokeWidth={3} />
                        </div>
                        <span className="text-slate-200 font-medium">{feature}</span>
                    </div>
                ))}
            </div>

            {plan ? (
                <PurchaseButton
                    plan={plan}
                    className={`mt-auto w-full rounded-2xl py-6 font-bold text-base transition-transform ${btnStyles[color]}`}
                >
                    {buttonText}
                </PurchaseButton>
            ) : (
                <Link href="/register" className="mt-auto block">
                    <Button
                        className={`w-full rounded-2xl py-6 font-bold text-base transition-transform ${btnStyles[color]}`}
                    >
                        {buttonText}
                    </Button>
                </Link>
            )}
        </div>
    );
}
