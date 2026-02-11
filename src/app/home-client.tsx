"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Shield, Heart, Briefcase, ArrowRight, Star, Sparkles, Users, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/home/search-form";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

export function HomeClient() {
    const { scrollYProgress } = useScroll();
    const yStats = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

    return (
        <main className="flex min-h-screen flex-col bg-slate-50 overflow-hidden">

            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12 lg:py-8">
                {/* Animated Background Patterns */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-rose-200/30 rounded-full blur-[100px] mix-blend-multiply"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [0, -90, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[100px] mix-blend-multiply"
                    />
                </div>

                <div className="relative z-10 w-full lg:max-w-[95%] mx-auto grid lg:grid-cols-12 gap-8 items-center">

                    {/* Left Column: Hero Image (Mobile: Background, Desktop: Left Col) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-0 h-full w-full lg:static lg:col-span-8 lg:h-[85vh] lg:w-full lg:rounded-[30px] overflow-hidden shadow-2xl shadow-rose-900/10 group"
                    >
                        <div className="absolute inset-0 bg-slate-900/20 z-10 hidden lg:block"></div>
                        <Image
                            src="/auth-hero.png"
                            alt="Happy Couple"
                            fill
                            className="object-cover blur-[2px] brightness-[0.4] lg:filter-none"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 hidden lg:block"></div>

                        {/* Text Overlay - Hidden on Mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute bottom-0 left-0 right-0 p-16 z-30 text-white hidden lg:block"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20"
                                >
                                    <CheckCircle2 className="w-7 h-7 text-white" />
                                </motion.div>
                                <div>
                                    <p className="font-bold text-xl tracking-tight">Trusted by Millions</p>
                                    <p className="text-white/80 text-base font-medium">Verified profiles only</p>
                                </div>
                            </div>

                            <h1 className="text-7xl font-black tracking-tight leading-[1.05] mb-6 drop-shadow-lg">
                                Find Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 animate-gradient-x">Equal Partner.</span>
                            </h1>
                            <p className="text-2xl text-white/90 font-medium max-w-lg leading-relaxed mb-10 drop-shadow-md">
                                Meet compatible partner who share your values, lifestyle and ambition.
                            </p>

                            <div className="flex flex-wrap gap-5">
                                <Button asChild className="!bg-white !text-slate-900 hover:!bg-slate-100 rounded-full font-bold px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                    <Link href="/matches">Explore Matches <ChevronRight className="ml-1 w-5 h-5" /></Link>
                                </Button>
                                <Button asChild variant="ghost" className="border !border-white/40 !text-white hover:!bg-white/20 hover:!text-white rounded-full font-bold px-10 h-14 text-lg !bg-transparent backdrop-blur-sm transition-all hover:-translate-y-1">
                                    <Link href="/stories">Success Stories</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative z-10 w-full lg:col-span-4 max-w-md lg:max-w-xl mx-auto px-4 lg:px-0 lg:pl-8 flex flex-col justify-center min-h-[calc(100vh-80px)] lg:min-h-0 py-8 lg:py-0"
                    >
                        <SearchForm />

                        {/* Trusted By Ticker - Hidden on Mobile mostly, or White text? */}
                        {/* Let's keep it but ensure visibility. On mobile bg is dark image. Text is slate-400. Might be invisible. */}
                        {/* Switch text color on mobile? Or add transparent bg? */}
                        <div className="mt-8 overflow-hidden relative">
                            <p className="text-xs font-bold text-white/80 lg:text-slate-400 uppercase tracking-widest text-center mb-4 shadow-black/50 lg:shadow-none drop-shadow-md lg:drop-shadow-none">Trusted By Professionals From</p>
                            <div className="flex relative w-full overflow-hidden mask-linear-fade">
                                <motion.div
                                    animate={{ x: "-50%" }}
                                    transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                                    className="flex gap-12 whitespace-nowrap"
                                >
                                    {/* Duplicate list for seamless loop */}
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex gap-12 items-center">
                                            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla', 'Adobe'].map(company => (
                                                <span key={company} className="text-sm font-bold text-white/90 lg:text-slate-400 hover:text-rose-500 transition-colors cursor-default drop-shadow-md lg:drop-shadow-none">{company}</span>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Stats Bar */}
            <motion.section
                style={{ y: yStats }}
                className="bg-white border-y border-slate-100 py-16 relative z-10"
            >
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100"
                    >
                        {[
                            { label: "Active Profiles", value: "10k+", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Success Stories", value: "500+", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
                            { label: "Verified Careers", value: "100%", icon: Shield, color: "text-green-600", bg: "bg-green-50" },
                            { label: "Cities Covered", value: "50+", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="flex flex-col items-center text-center group cursor-default p-4"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-colors`}
                                >
                                    <stat.icon className="w-6 h-6" />
                                </motion.div>
                                <p className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">{stat.value}</p>
                                <span className="text-slate-500 font-bold text-sm lg:text-base uppercase tracking-wider">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20 max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Ambition</span>.</h2>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            We understand that your career is a huge part of who you are. Our platform matches you based on professional compatibility, lifestyle standards, and future goals.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                title: "Elite Verification",
                                desc: "Every profile undergoes a strict manual verification process to ensure authenticity.",
                                icon: Shield,
                                gradient: "from-blue-500 to-indigo-600"
                            },
                            {
                                title: "Smart Compatibility",
                                desc: "Our AI-driven matching connects you with partners who share your drive and vision.",
                                icon: Briefcase,
                                gradient: "from-purple-500 to-pink-600"
                            },
                            {
                                title: "Privacy Controls",
                                desc: "You have complete control over who sees your photos, career details, and contact info.",
                                icon: Lock,
                                gradient: "from-rose-500 to-orange-600"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-rose-100/50 transition-all duration-300 group border border-slate-100 cursor-default"
                            >
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                    {feature.desc}
                                </p>
                                <div className="w-12 h-1 bg-slate-100 rounded-full group-hover:w-full group-hover:bg-slate-900 transition-all duration-500"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Success Stories Masonry */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
                    >
                        <div className="max-w-2xl">
                            <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-4 block">Proven Success</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">Matched for <span className="italic font-serif text-rose-500">Life</span>.</h2>
                        </div>
                        <Button asChild variant="outline" className="rounded-full px-8 h-12 border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all group">
                            <Link href="/stories">View All Stories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                names: "Anjali & Vikram",
                                jobs: "Investment Banker & Corporate Lawyer",
                                quote: "We were both so busy with our careers, we thought we'd never find 'the one'. This platform changed everything.",
                                image: "https://images.unsplash.com/photo-1623190731213-9097e1781229?w=800&q=80",
                                height: "h-[400px]"
                            },
                            {
                                names: "Dr. Rohan & Dr. Meera",
                                jobs: "Cardiologist & Neurologist",
                                quote: "Finding someone who understands the medical field's demands was crucial. We matched instantly.",
                                image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
                                height: "h-[500px]"
                            },
                            {
                                names: "Karthik & Sneha",
                                jobs: "Tech Lead & Product Manager",
                                quote: "Our shared passion for technology and travel brought us together. The matching algorithm is spot on!",
                                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
                                height: "h-[400px]"
                            }
                        ].map((story, i) => (
                            <motion.div
                                key={i}
                                variants={scaleIn}
                                whileHover={{ y: -5 }}
                                className={`group relative rounded-[32px] overflow-hidden ${story.height} ${i === 1 ? 'md:-mt-12 shadow-2xl' : 'shadow-xl'}`}
                            >
                                <Image src={story.image} alt={story.names} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex gap-1 mb-3 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <p className="text-lg italic mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">"{story.quote}"</p>
                                    <h3 className="text-2xl font-bold">{story.names}</h3>
                                    <p className="text-white/80 font-medium text-sm">{story.jobs}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    <Image src="https://images.unsplash.com/photo-1563823023249-14a05f15949e?w=1600&q=80" alt="Background" fill className="object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-4 space-y-10 text-center relative z-10"
                >
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                        Your <span className="text-rose-500">Equal</span> is waiting.
                    </h2>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        Don't leave your life partner to chance. Join the community of India's most eligible and ambitious singles today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-12 py-8 h-auto rounded-full font-bold shadow-2xl shadow-rose-600/30 transition-all hover:scale-105">
                            <Link href="/register">Start Your Journey</Link>
                        </Button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
