import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Crown, Zap, Star, Shield, Gem, ChevronLeft } from "lucide-react";
import Link from "next/link";
import PurchaseButton from "@/components/PurchaseButton";
import type { MembershipTier } from "@prisma/client";

export default function PricingPage() {
    return (
        <>
            {/* === MOBILE NATIVE APP VIEW === */}
            <main className="block lg:hidden min-h-[100dvh] bg-[#09090b] text-white pb-24 relative overflow-x-hidden">
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
                        <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }` }} />

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Starter Access" price="Free" period="3 Days"
                                description="Experience the platform."
                                features={["Create Profile", "Browse Profiles", "Send 1 Interest/Day", "No Contact Info"]}
                                buttonText="Start Free Trial" buttonVariant="outline"
                                icon={<Star className="w-5 h-5" />} color="slate"
                            />
                        </div>

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Basic Plan" price="₹599" period="15 Days"
                                description="Short-term access for quick search."
                                features={["Everything in Starter", "View 5 Contacts", "Unlimited Interests", "Basic Chat"]}
                                buttonText="Get Basic" buttonVariant="outline" plan="BASIC"
                                icon={<Shield className="w-5 h-5" />} color="blue"
                            />
                        </div>

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Silver Plan" price="₹5999" period="6 Months"
                                description="Standard plan for serious seekers."
                                features={["Everything in Basic", "View 30 Contacts", "Messaging & Chat", "Priority Support"]}
                                buttonText="Get Silver" buttonVariant="primary" plan="SILVER"
                                icon={<Sparkles className="w-5 h-5" />} color="gray"
                            />
                        </div>

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Gold Plan" price="₹9999" period="12 Months"
                                description="Best value for long-term search." highlighted={true}
                                features={["Everything in Silver", "View 75 Contacts", "Profile Highlighter", "Relationship Manager"]}
                                buttonText="Go Gold" buttonVariant="primary" plan="GOLD"
                                icon={<Crown className="w-5 h-5" />} color="amber"
                            />
                        </div>

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Platinum Plan" price="₹12999" period="15 Months"
                                description="Premium features & visibility."
                                features={["Everything in Gold", "View 150 Contacts", "Profile Spotlight (2x)", "Verified Badge"]}
                                buttonText="Go Platinum" buttonVariant="outline" plan="PLATINUM"
                                icon={<Gem className="w-5 h-5" />} color="violet"
                            />
                        </div>

                        <div className="snap-center shrink-0 w-[85vw] sm:w-[320px]">
                            <MobilePricingCard
                                title="Elite Plan" price="₹15599" period="24 Months"
                                description="The ultimate VIP experience."
                                features={["All Features Unlocked", "Unlimited Contacts", "Dedicated Advisor", "Top Search Ranking"]}
                                buttonText="Join Elite" buttonVariant="outline" plan="ELITE"
                                icon={<Zap className="w-5 h-5" />} color="rose"
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

            {/* === DESKTOP WEB VIEW === */}
            <main className="hidden lg:block min-h-screen bg-slate-50 pb-20">
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
                        <DesktopPricingCard
                            title="Starter Access" price="Free" period="3 Days"
                            description="Experience the platform."
                            features={["Create Profile", "Browse Profiles", "Send 1 Interest/Day", "No Contact Info"]}
                            buttonText="Start Free Trial" buttonVariant="outline"
                            icon={<Star className="w-5 h-5" />} color="slate"
                        />
                        <DesktopPricingCard
                            title="Basic Plan" price="₹599" period="15 Days"
                            description="Short-term access for quick search."
                            features={["Everything in Starter", "View 5 Contacts", "Unlimited Interests", "Basic Chat"]}
                            buttonText="Get Basic" buttonVariant="outline" plan="BASIC"
                            icon={<Shield className="w-5 h-5" />} color="blue"
                        />
                        <DesktopPricingCard
                            title="Silver Plan" price="₹5999" period="6 Months"
                            description="Standard plan for serious seekers."
                            features={["Everything in Basic", "View 30 Contacts", "Messaging & Chat", "Priority Support"]}
                            buttonText="Get Silver" buttonVariant="primary" plan="SILVER"
                            icon={<Sparkles className="w-5 h-5" />} color="gray"
                        />
                        <DesktopPricingCard
                            title="Gold Plan" price="₹9999" period="12 Months"
                            description="Best value for long-term search." highlighted={true}
                            features={["Everything in Silver", "View 75 Contacts", "Profile Highlighter", "Relationship Manager"]}
                            buttonText="Go Gold" buttonVariant="primary" plan="GOLD"
                            icon={<Crown className="w-5 h-5" />} color="amber"
                        />
                        <DesktopPricingCard
                            title="Platinum Plan" price="₹12999" period="15 Months"
                            description="Premium features & visibility."
                            features={["Everything in Gold", "View 150 Contacts", "Profile Spotlight (2x)", "Verified Badge"]}
                            buttonText="Go Platinum" buttonVariant="outline" plan="PLATINUM"
                            icon={<Gem className="w-5 h-5" />} color="violet"
                        />
                        <DesktopPricingCard
                            title="Elite Plan" price="₹15599" period="24 Months"
                            description="The ultimate VIP experience."
                            features={["All Features Unlocked", "Unlimited Contacts", "Dedicated Advisor", "Top Search Ranking"]}
                            buttonText="Join Elite" buttonVariant="outline" plan="ELITE"
                            icon={<Zap className="w-5 h-5" />} color="rose"
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
        </>
    );
}

// === MOBILE UI COMPONENTS ===
function MobilePricingCard({ title, price, period, description, features, buttonText, buttonVariant, highlighted = false, icon, color, plan }: {
    title: string; price: string; period: string; description: string; features: string[]; buttonText: string; buttonVariant: "primary" | "outline"; highlighted?: boolean; icon: React.ReactNode; color: "slate" | "blue" | "gray" | "amber" | "violet" | "rose"; plan?: MembershipTier;
}) {
    const colorStyles = {
        slate: "bg-[#121214] border-[#222] text-white", blue: "bg-[#121214] border-blue-900/40 text-white", gray: "bg-[#121214] border-slate-700/50 text-white",
        amber: "bg-gradient-to-b from-[#1a1500] to-[#0a0800] border-amber-500/40 text-white ring-1 ring-amber-500/20", violet: "bg-gradient-to-b from-[#150020] to-[#0a0010] border-violet-500/40 text-white", rose: "bg-gradient-to-b from-[#20000a] to-[#100005] border-rose-500/40 text-white",
    };
    const iconBg = { slate: "bg-[#222] text-slate-400", blue: "bg-blue-500/20 text-blue-400", gray: "bg-slate-700/40 text-slate-300", amber: "bg-amber-500/20 text-amber-500", violet: "bg-violet-500/20 text-violet-400", rose: "bg-rose-500/20 text-rose-400" };
    const btnStyles = { slate: "bg-[#222] text-white hover:bg-[#333] border-none", blue: "bg-blue-600 text-white hover:bg-blue-700 border-none shadow-blue-500/20", gray: "bg-slate-700 text-white hover:bg-slate-600 border-none", amber: "bg-gradient-to-r from-amber-400 to-amber-600 text-[#000] hover:scale-105 border-none shadow-amber-500/20", violet: "bg-violet-600 text-white hover:bg-violet-700 border-none shadow-violet-500/20", rose: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:scale-105 border-none shadow-rose-500/20" };

    return (
        <div className={`relative p-7 rounded-[2rem] border flex flex-col h-[500px] w-full ${highlighted ? "shadow-2xl shadow-amber-500/10" : "shadow-lg"} ${colorStyles[color]}`}>
            {highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Best Value</span></div>}
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-2xl ${iconBg[color]}`}>{icon}</div>
                <h3 className="text-xl font-bold tracking-wide">{title}</h3>
            </div>
            <div className="mb-8">
                <div className="flex items-end gap-1 mb-1"><span className="text-4xl font-black tracking-tighter">{price}</span></div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#888]">{period}</span>
                <p className="mt-4 text-sm text-[#aaa] leading-relaxed">{description}</p>
            </div>
            <div className="space-y-4 mb-8 flex-1 overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-[#222] flex flex-shrink-0 items-center justify-center"><Check className="w-3 h-3 text-slate-300" strokeWidth={3} /></div>
                        <span className="text-slate-200 font-medium">{feature}</span>
                    </div>
                ))}
            </div>
            {plan ? (
                <PurchaseButton plan={plan} className={`mt-auto w-full rounded-2xl py-6 font-bold text-base transition-transform ${btnStyles[color]}`}>{buttonText}</PurchaseButton>
            ) : (
                <Link href="/register" className="mt-auto block"><Button className={`w-full rounded-2xl py-6 font-bold text-base transition-transform ${btnStyles[color]}`}>{buttonText}</Button></Link>
            )}
        </div>
    );
}

// === DESKTOP UI COMPONENTS ===
function DesktopPricingCard({ title, price, period, description, features, buttonText, buttonVariant, highlighted = false, icon, color, plan }: {
    title: string; price: string; period: string; description: string; features: string[]; buttonText: string; buttonVariant: "primary" | "outline"; highlighted?: boolean; icon: React.ReactNode; color: "slate" | "blue" | "gray" | "amber" | "violet" | "rose"; plan?: MembershipTier;
}) {
    const colorStyles = {
        slate: "bg-slate-50 border-slate-200 text-slate-900 shadow-slate-100", blue: "bg-white border-blue-100 text-slate-900 shadow-blue-100", gray: "bg-gradient-to-b from-slate-100 to-white border-slate-200 text-slate-900 shadow-slate-200",
        amber: "bg-gradient-to-b from-amber-50 to-white border-amber-200 text-slate-900 shadow-amber-200 ring-1 ring-amber-200", violet: "bg-gradient-to-b from-violet-50 to-white border-violet-200 text-slate-900 shadow-violet-200", rose: "bg-gradient-to-b from-rose-50 to-white border-rose-200 text-slate-900 shadow-rose-200",
    };
    const iconBg = { slate: "bg-slate-200 text-slate-600", blue: "bg-blue-100 text-blue-600", gray: "bg-slate-200 text-slate-600", amber: "bg-amber-100 text-amber-600", violet: "bg-violet-100 text-violet-600", rose: "bg-rose-100 text-rose-600" };
    const btnStyles = { slate: "bg-slate-900 text-white hover:bg-slate-800", blue: "bg-blue-600 text-white hover:bg-blue-700", gray: "bg-slate-600 text-white hover:bg-slate-700", amber: "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200", violet: "bg-violet-600 text-white hover:bg-violet-700", rose: "bg-rose-600 text-white hover:bg-rose-700" };

    return (
        <div className={`relative p-6 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 flex flex-col h-full ${highlighted ? "shadow-2xl scale-105 z-10" : "shadow-lg"} ${colorStyles[color]}`}>
            {highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Best Value</span></div>}
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${iconBg[color]}`}>{icon}</div>
                <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <div className="mb-6">
                <div className="flex items-baseline gap-1"><span className="text-3xl font-black">{price}</span></div>
                <span className="text-xs font-semibold uppercase tracking-wide opacity-60">{period}</span>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">{description}</p>
            </div>
            <div className="space-y-3 mb-8 flex-1">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 opacity-70`} />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
            {plan ? (
                <PurchaseButton plan={plan} className={`w-full rounded-full font-bold shadow-md transition-all ${btnStyles[color]}`}>{buttonText}</PurchaseButton>
            ) : (
                <Link href="/register" className="mt-auto block"><Button className={`w-full rounded-full font-bold shadow-md transition-all ${btnStyles[color]}`}>{buttonText}</Button></Link>
            )}
        </div>
    );
}

function ComparisonRow({ feature, starter, basic, silver, gold, platinum, elite }: any) {
    const renderValue = (val: any) => {
        if (typeof val === "boolean") return val ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />;
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
