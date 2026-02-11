"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How to Create a account?",
        answer: "Click on the 'Register' button at the top right corner. Fill in your basic details, verify your email/phone, and complete your profile to get started."
    },
    {
        question: "How to Search a profile?",
        answer: "Use our advanced search filters on the homepage or dashboard to find profiles based on profession, location, age, and other preferences."
    },
    {
        question: "Is my personal details and information are safe secure?",
        answer: "Yes, your privacy is our top priority. We use advanced encryption to protect your data and give you complete control over who sees your profile information."
    },
    {
        question: "How to upgrade my profile?",
        answer: "You can upgrade to a premium membership from your dashboard settings. We offer various plans to suit your needs with added benefits like unlimited messaging."
    },
    {
        question: "How to contact customer support?",
        answer: "Our support team is available 24/7. You can reach us via the 'Contact Us' page or email us directly at support@careermatrimony.com."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-rose-500 font-bold tracking-widest uppercase text-sm mb-4 block">Support</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Your Matrimony <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Queries</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Everything you need to know about finding your perfect match.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left group"
                            >
                                <span className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full bg-slate-50 group-hover:bg-rose-50 transition-colors duration-300 ${openIndex === i ? 'bg-rose-50' : ''}`}>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-rose-500' : ''}`} />
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
