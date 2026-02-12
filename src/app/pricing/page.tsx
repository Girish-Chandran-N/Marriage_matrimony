import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Crown, Zap, Star, Shield, Gem } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80')] bg-cover bg-center opacity-5 blur-3xl scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-slate-50" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>Simple, Transparent Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
                        Choose Your Path to <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Forever</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Flexible plans designed for every stage of your journey.
                    </p>
                </div>
            </section>

            {/* Pricing Cards Grid */}
            <section className="px-4 max-w-7xl mx-auto -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Starter (Access) */}
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

                    {/* Basic Plan */}
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
                        icon={<Shield className="w-5 h-5" />}
                        color="blue"
                    />

                    {/* Silver Plan */}
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
                        icon={<Sparkles className="w-5 h-5" />}
                        color="gray" // Silver-ish
                    />

                    {/* Gold Plan */}
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
                        icon={<Crown className="w-5 h-5" />}
                        color="amber" // Gold
                    />

                    {/* Platinum Plan */}
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
                        icon={<Gem className="w-5 h-5" />}
                        color="violet" // Platinum/Purple
                    />

                    {/* Elite Plan */}
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
                        icon={<Zap className="w-5 h-5" />}
                        color="rose" // Elite/Rose Gold
                    />

                </div>
            </section>

            {/* Comparison Table */}
            <section className="px-4 max-w-6xl mx-auto mt-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">Compare Benefits</h2>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="text-left p-4 font-semibold text-slate-900">Features</th>
                                <th className="p-4 font-bold text-slate-500">Starter</th>
                                <th className="p-4 font-bold text-blue-600">Basic</th>
                                <th className="p-4 font-bold text-slate-600">Silver</th>
                                <th className="p-4 font-bold text-amber-500">Gold</th>
                                <th className="p-4 font-bold text-violet-600">Platinum</th>
                                <th className="p-4 font-bold text-rose-600">Elite</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            <ComparisonRow feature="Validity" starter="3 Days" basic="15 Days" silver="6 Months" gold="12 Months" platinum="15 Months" elite="24 Months" />
                            <ComparisonRow feature="Contact Views" starter="0" basic="5" silver="30" gold="75" platinum="150" elite="Unlimited" />
                            <ComparisonRow feature="Send Interests" starter="1/Day" basic="Unlimited" silver="Unlimited" gold="Unlimited" platinum="Unlimited" elite="Unlimited" />
                            <ComparisonRow feature="Chat/Messaging" starter={false} basic="Basic" silver={true} gold={true} platinum={true} elite={true} />
                            <ComparisonRow feature="Profile Spotlight" starter={false} basic={false} silver={false} gold="Standard" platinum="2x Reach" elite="Max Reach" />
                            <ComparisonRow feature="Dedicated Manager" starter={false} basic={false} silver={false} gold={true} platinum={true} elite={true} />
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

function PricingCard({ title, price, period, description, features, buttonText, buttonVariant, highlighted = false, icon, color }: {
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
}) {
    const colorStyles = {
        slate: "bg-slate-50 border-slate-200 text-slate-900 shadow-slate-100",
        blue: "bg-white border-blue-100 text-slate-900 shadow-blue-100",
        gray: "bg-gradient-to-b from-slate-100 to-white border-slate-200 text-slate-900 shadow-slate-200",
        amber: "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-amber-200 ring-1 ring-amber-200", // Gold
        violet: "bg-gradient-to-b from-violet-50 to-white border-violet-200 text-slate-900 shadow-violet-200",
        rose: "bg-gradient-to-b from-rose-50 to-white border-rose-200 text-slate-900 shadow-rose-200",
    };

    const iconBg = {
        slate: "bg-slate-200 text-slate-600",
        blue: "bg-blue-100 text-blue-600",
        gray: "bg-slate-200 text-slate-600",
        amber: "bg-amber-100 text-amber-600",
        violet: "bg-violet-100 text-violet-600",
        rose: "bg-rose-100 text-rose-600",
    };

    const btnStyles = {
        slate: "bg-slate-900 text-white hover:bg-slate-800",
        blue: "bg-blue-600 text-white hover:bg-blue-700",
        gray: "bg-slate-600 text-white hover:bg-slate-700",
        amber: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200",
        violet: "bg-violet-600 text-white hover:bg-violet-700",
        rose: "bg-rose-600 text-white hover:bg-rose-700",
    };

    return (
        <div className={`relative p-6 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${highlighted ? "shadow-2xl scale-105 z-10" : "shadow-lg"} ${colorStyles[color]}`}>
            {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Best Value
                    </span>
                </div>
            )}

            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${iconBg[color]}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black">{price}</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-60">{period}</span>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 opacity-70`} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <Link href="/register" className="mt-auto">
                <Button
                    className={`w-full rounded-full font-bold shadow-md transition-all ${btnStyles[color]}`}
                >
                    {buttonText}
                </Button>
            </Link>
        </div>
    );
}

function ComparisonRow({ feature, starter, basic, silver, gold, platinum, elite }: any) {
    const renderValue = (val: any) => {
        if (typeof val === "boolean") {
            return val ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />;
        }
        return <div className="text-center font-medium opacity-80">{val}</div>;
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 font-medium text-slate-900">{feature}</td>
            <td className="p-4">{renderValue(starter)}</td>
            <td className="p-4">{renderValue(basic)}</td>
            <td className="p-4">{renderValue(silver)}</td>
            <td className="p-4 bg-amber-50/30">{renderValue(gold)}</td>
            <td className="p-4">{renderValue(platinum)}</td>
            <td className="p-4">{renderValue(elite)}</td>
        </tr>
    );
}
