"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

// --- Mock Data ---
const STORIES = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    couple: [
        ["Rahul", "Priya"], ["Aditya", "Sneha"], ["Vikram", "Anjali"], ["Rohan", "Meera"], ["Karan", "Nisha"],
        ["Arjun", "Kavya"], ["Siddharth", "Riya"], ["Varun", "Pooja"], ["Kabir", "Zara"], ["Aryan", "Ishita"],
        ["Dev", "Sana"], ["Rishabh", "Neha"], ["Vivaan", "Aanya"], ["Rehan", "Myra"], ["Vihaan", "Diya"],
        ["Arav", "Ananya"], ["Reyansh", "Shanaya"], ["Dhruv", "Zoya"], ["Krishna", "Kiara"], ["Atharva", "Siya"],
        ["Ishaan", "Avni"], ["Shaurya", "Aditi"], ["Ayaan", "Fatima"], ["Veer", "Gauri"], ["Omkar", "Lakshmi"]
    ][i % 25],
    location: ["Bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Hyderabad"][i % 6],
    date: `202${3 + Math.floor(i / 10)}`,
    story: [
        "We met through Career Matrimony and instantly clicked over our shared passion for technology. Six months later, we're happily married!",
        "Finding someone who understands your career ambitions is rare. Thanks to this platform, I found my perfect match.",
        "It started with a simple connection request, but turned into a lifetime of happiness. We encourage everyone to not lose hope!",
        "Our families were skeptical at first, but after seeing how compatible we were, they arranged a beautiful wedding.",
        "A truly wonderful experience. The verified profiles gave us confidence to connect.",
    ][i % 5],
    image: [
        "https://images.unsplash.com/photo-1722952908667-f4883b8e6df6?w=800&q=80",
        "https://images.unsplash.com/photo-1722953544597-57a8ba8eed44?w=800&q=80",
        "https://images.unsplash.com/photo-1665960211002-0ecf92bed0ac?w=800&q=80",
        "https://images.unsplash.com/photo-1600685890506-593fdf55949b?w=800&q=80",
        "https://images.unsplash.com/photo-1599462616558-2b75fd26a283?w=800&q=80",
        "https://images.unsplash.com/photo-1640429858108-5914312d9cc8?w=800&q=80",
        "https://images.unsplash.com/photo-1610173826608-bd1f53a52db1?w=800&q=80",
        "https://images.unsplash.com/photo-1733759414886-6b3a5423ceb3?w=800&q=80",
        "https://images.unsplash.com/photo-1697347815893-2cfa02e6cca8?w=800&q=80",
        "https://images.unsplash.com/photo-1727430334033-d2ffe559bdce?w=800&q=80",
        "https://images.unsplash.com/photo-1610173827002-62c0f1f05d04?w=800&q=80",
        "https://images.unsplash.com/photo-1697684309307-d0b956749700?w=800&q=80",
        "https://images.unsplash.com/photo-1697684459917-e91efb33a337?w=800&q=80",
        "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?w=800&q=80",
        "https://images.unsplash.com/photo-1665960213508-48f07086d49c?w=800&q=80",
        "https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?w=800&q=80",
        "https://images.unsplash.com/photo-1611106211090-8f3c79eb8552?w=800&q=80",
        "https://images.unsplash.com/photo-1722952934531-8e6b39c6f928?w=800&q=80",
        "https://images.unsplash.com/photo-1583878545126-2f1ca0142714?w=800&q=80",
        "https://images.unsplash.com/photo-1665960213530-3fb10da1f25e?w=800&q=80",
        "https://images.unsplash.com/photo-1722952908681-944d47e45853?w=800&q=80",
        "https://images.unsplash.com/photo-1735052712489-f45220126a0c?w=800&q=80",
        "https://images.unsplash.com/photo-17229535444956-192125062800?w=800&q=80",
        "https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?w=800&q=80",
        "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=800&q=80"
    ][i % 25]
}));

export default function StoriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-50 via-indigo-50 to-transparent"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Celebrating
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mt-2">
                                Love Stories
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed"
                    >
                        Real people. Real connections. See how thousands of professionals found their perfect life partners right here on Career Matrimony.
                    </motion.p>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {STORIES.map((story, idx) => (
                        <StoryCard key={story.id} story={story} index={idx} />
                    ))}
                </div>

                {/* Footer Message */}
                <div className="mt-32 text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Ready to write your own story?</h3>
                    <a href="/register" className="inline-block bg-slate-900 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        Get Started Today
                    </a>
                </div>
            </main>
        </div>
    );
}

function StoryCard({ story, index }: { story: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative h-[420px] rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
        >
            {/* Image Layer */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <Image
                    src={story.image}
                    alt={`${story.couple[0]} & ${story.couple[1]}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />
            </div>

            {/* Content Content */}
            <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end text-white">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3 opacity-90">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {story.location}
                        </span>
                        <span className="text-xs font-medium text-slate-200/80">
                            Updates {story.date}
                        </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 font-serif leading-tight">
                        {story.couple[0]} <span className="text-purple-300">&</span> {story.couple[1]}
                    </h3>

                    <div className="relative">
                        <Quote className="absolute -top-3 -left-2 w-6 h-6 text-purple-400/30 rotate-180" />
                        <p className="text-sm md:text-base text-slate-100/90 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300 pl-4 border-l-2 border-purple-500/50">
                            {story.story}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
