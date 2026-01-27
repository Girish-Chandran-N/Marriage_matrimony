"use client";

import { useState } from "react";
import PersonalDetailsForm from "@/components/profile-forms/personal-details-form";
import EducationDetailsForm from "@/components/profile-forms/education-details-form";
import CareerDetailsForm from "@/components/profile-forms/career-details-form";
import FamilyDetailsForm from "@/components/profile-forms/family-details-form";
import LifestyleDetailsForm from "@/components/profile-forms/lifestyle-details-form";
import { User, GraduationCap, Briefcase, Users, Coffee, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SECTIONS = [
    { id: "personal", label: "Personal Details", icon: User, desc: "Basic info about you" },
    { id: "education", label: "Education", icon: GraduationCap, desc: "Your qualifications" },
    { id: "career", label: "Career & Finances", icon: Briefcase, desc: "Work and income" },
    { id: "family", label: "Family Background", icon: Users, desc: "Family details" },
    { id: "lifestyle", label: "Lifestyle & Interests", icon: Coffee, desc: "Habits and hobbies" },
];

export default function ProfileSetupPage() {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    const renderSection = () => {
        switch (activeSection) {
            case "personal":
                return <PersonalDetailsForm onNext={() => setActiveSection("education")} />;
            case "education":
                return <EducationDetailsForm onNext={() => setActiveSection("career")} />;
            case "career":
                return <CareerDetailsForm onNext={() => setActiveSection("family")} />;
            case "family":
                return <FamilyDetailsForm onNext={() => setActiveSection("lifestyle")} />;
            case "lifestyle":
                return <LifestyleDetailsForm onNext={() => window.location.href = "/profile"} />; // Final step redirect
            default:
                return null;
        }
    };

    const activeSectionData = SECTIONS.find(s => s.id === activeSection);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-50 via-purple-50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            {/* Glassmorphic Header */}
            <div className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Profile Setup</h1>
                            <p className="text-xs text-slate-500 font-medium">Complete your profile to get better matches</p>
                        </div>
                    </div>
                    <Button variant="ghost" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">
                        <Link href="/profile">Save & Exit</Link>
                    </Button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <nav className="w-full lg:w-72 shrink-0 space-y-2">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl shadow-slate-200/40 p-4">
                            {SECTIONS.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden group mb-1 last:mb-0",
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-500"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <span className="block font-bold">{section.label}</span>
                                            <span className={cn("text-xs", isActive ? "text-indigo-100" : "text-slate-400 group-hover:text-slate-500")}>
                                                {section.desc}
                                            </span>
                                        </div>
                                        {isActive && <ChevronRight className="h-4 w-4 text-white/70" />}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white/80 overflow-hidden relative">
                            {/* Section Header */}
                            <div className="px-8 py-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                        "bg-white text-indigo-600 ring-1 ring-slate-100"
                                    )}>
                                        {activeSectionData && <activeSectionData.icon className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                            {activeSectionData?.label}
                                        </h2>
                                        <p className="text-slate-500 font-medium mt-1">
                                            Please provide accurate details to find the best matches.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-8">
                                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {renderSection()}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
