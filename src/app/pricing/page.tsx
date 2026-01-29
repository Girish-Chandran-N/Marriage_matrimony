import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Crown, Zap } from "lucide-react";
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
                        Select a Plan That <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Powers Your Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                        Unlock premium features to find your perfect match faster.
                        No hidden fees, cancel anytime.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-4 max-w-7xl mx-auto -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Silver Plan */}
                    <PricingCard
                        title="Silver"
                        price="Free"
                        period="forever"
                        description="Perfect for getting started and exploring profiles."
                        features={[
                            "Create standard profile",
                            "Browse profiles (Names Hidden)",
                            "Send 1 interest per day",
                            "Basic search filters",
                            "Upload 1 photo"
                        ]}
                        buttonText="Get Started"
                        buttonVariant="outline"
                        icon={<Sparkles className="w-6 h-6 text-slate-500" />}
                    />

                    {/* Gold Plan */}
                    <PricingCard
                        title="Gold"
                        price="$29"
                        period="/month"
                        description="Best for serious seekers ready to connect."
                        highlighted={true}
                        features={[
                            "Everything in Silver",
                            "Unlock User Names & Photos",
                            "Unlimited Chat & Messaging",
                            "View unlocked contact numbers (10/mo)",
                            "See who viewed your profile",
                            "Upload up to 10 photos"
                        ]}
                        buttonText="Upgrade to Gold"
                        buttonVariant="primary"
                        icon={<Zap className="w-6 h-6 text-white" />}
                    />

                    {/* Platinum Plan */}
                    <PricingCard
                        title="Platinum"
                        price="$59"
                        period="/month"
                        description="The ultimate experience with exclusive benefits."
                        features={[
                            "Everything in Gold",
                            "View unlimited contact numbers",
                            "Dedicated Relationship Manager",
                            "Profile Spotlight (2x visibility)",
                            "Verified Premium Badge",
                            "Ad-free experience"
                        ]}
                        buttonText="Go Platinum"
                        buttonVariant="outline"
                        icon={<Crown className="w-6 h-6 text-purple-600" />}
                    />
                </div>
            </section>

            {/* Comparison Table */}
            <section className="px-4 max-w-5xl mx-auto mt-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900">See Features Included</h2>
                    <p className="text-slate-600 mt-2">Compare plans to find the right fit for you.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-left p-6 font-semibold text-slate-900 w-1/4">Features</th>
                                    <th className="p-6 font-bold text-slate-700 w-1/4">Silver</th>
                                    <th className="p-6 font-bold text-indigo-600 w-1/4">Gold</th>
                                    <th className="p-6 font-bold text-purple-600 w-1/4">Platinum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <ComparisonRow feature="Profile Creation" silver={true} gold={true} platinum={true} />
                                <ComparisonRow feature="View Full Names" silver={false} gold={true} platinum={true} />
                                <ComparisonRow feature="Search Filters" silver="Basic" gold="Advanced" platinum="Premium" />
                                <ComparisonRow feature="Send Interests" silver="1/day" gold="Unlimited" platinum="Unlimited" />
                                <ComparisonRow feature="Messaging" silver={false} gold={true} platinum={true} />
                                <ComparisonRow feature="View Contacts" silver={false} gold="10/month" platinum="Unlimited" />
                                <ComparisonRow feature="Who Viewed Me" silver={false} gold={true} platinum={true} />
                                <ComparisonRow feature="Profile Spotlight" silver={false} gold={false} platinum={true} />
                                <ComparisonRow feature="Relationship Manager" silver={false} gold={false} platinum={true} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}

function PricingCard({ title, price, period, description, features, buttonText, buttonVariant, highlighted = false, icon }: {
    title: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "primary" | "outline";
    highlighted?: boolean;
    icon: React.ReactNode;
}) {
    return (
        <div className={`relative p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 flex flex-col h-full ${highlighted
            ? "bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10"
            : "bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100"
            }`}>
            {highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${highlighted ? "bg-white/10" : "bg-indigo-50"}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{price}</span>
                    <span className={`text-sm font-medium ${highlighted ? "text-indigo-100" : "text-slate-500"}`}>{period}</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${highlighted ? "text-indigo-100" : "text-slate-500"}`}>
                    {description}
                </p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`w-5 h-5 shrink-0 ${highlighted ? "text-indigo-300" : "text-indigo-600"}`} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <Link href="/register" className="mt-auto">
                <Button
                    className={`w-full h-12 rounded-full font-bold btn-hover-effect ${highlighted
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                >
                    {buttonText}
                </Button>
            </Link>
        </div>
    );
}

function ComparisonRow({ feature, silver, gold, platinum }: { feature: string, silver: boolean | string, gold: boolean | string, platinum: boolean | string }) {
    const renderValue = (val: boolean | string) => {
        if (typeof val === "boolean") {
            return val ? (
                <div className="flex justify-center"><div className="bg-indigo-100 p-1 rounded-full"><Check className="w-4 h-4 text-indigo-600" /></div></div>
            ) : (
                <div className="flex justify-center"><X className="w-4 h-4 text-slate-300" /></div>
            );
        }
        return <div className="text-center text-sm font-medium text-slate-600">{val}</div>;
    };

    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            <td className="p-6 text-sm font-medium text-slate-700">{feature}</td>
            <td className="p-6">{renderValue(silver)}</td>
            <td className="p-6 bg-indigo-50/10 border-x border-indigo-50">{renderValue(gold)}</td>
            <td className="p-6">{renderValue(platinum)}</td>
        </tr>
    );
}
