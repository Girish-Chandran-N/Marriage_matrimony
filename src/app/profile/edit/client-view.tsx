"use client";

import { useState } from "react";
import PersonalDetailsForm from "@/components/profile-forms/personal-details-form";
import EducationDetailsForm from "@/components/profile-forms/education-details-form";
import CareerDetailsForm from "@/components/profile-forms/career-details-form";
import FamilyDetailsForm from "@/components/profile-forms/family-details-form";
import LifestyleDetailsForm from "@/components/profile-forms/lifestyle-details-form";
import MatchPreferencesForm from "@/components/profile-forms/match-preferences-form";
import PhotoManager from "@/components/profile-forms/photo-manager";
import { User, GraduationCap, Briefcase, Users, Coffee, ChevronRight, Image as ImageIcon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "career", label: "Career & Finances", icon: Briefcase },
    { id: "family", label: "Family Background", icon: Users },
    { id: "lifestyle", label: "Lifestyle & Interests", icon: Coffee },
    { id: "preferences", label: "Partner Preferences", icon: Heart },
    { id: "photos", label: "Manage Photos", icon: ImageIcon },
];

export default function ProfileEditClient({ profile }: { profile: any }) {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    const renderSection = () => {
        switch (activeSection) {
            case "personal":
                const verificationStatus = profile.verificationRequests?.[0]?.status;
                return <PersonalDetailsForm initialData={profile.personalDetails} userName={profile.name} verificationStatus={verificationStatus} />;
            case "education":
                return <EducationDetailsForm initialData={profile.educations} />;
            case "career":
                return <CareerDetailsForm careerProfile={profile.careerProfile} jobs={profile.jobs} />;
            case "family":
                return <FamilyDetailsForm initialData={profile.familyDetails} siblings={profile.siblings} />;
            case "lifestyle":
                return <LifestyleDetailsForm initialData={profile.lifestyleDetails} isEditMode={true} />;
            case "preferences":
                return <MatchPreferencesForm initialData={profile.matchPreferences} />;
            case "photos":
                return <PhotoManager
                    currentProfileImage={profile.profileImage}
                    galleryImages={profile.photos || []}
                    familyImages={profile.familyDetails?.familyImages}
                    userName={profile.name}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="h-[calc(100vh-5rem)] bg-gray-50 flex flex-col overflow-hidden">
            {/* Header - Reduced height */}
            <div className="bg-white border-b shrink-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
                    <a href="/profile" className="text-xs font-medium text-primary hover:text-primary/80">View Profile</a>
                </div>
            </div>

            {/* Main Layout - Flex row, full height minus header */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex gap-6 overflow-hidden">
                {/* Sidebar - Fixed */}
                <nav className="hidden md:block w-64 shrink-0 overflow-y-auto py-1 custom-scrollbar">
                    <div className="space-y-1">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-blue-200"
                                            : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                                    <span className="flex-1 text-left">{section.label}</span>
                                    {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Main Content Area - Scrollable */}
                <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 md:p-6 border-b shrink-0 bg-white z-10">
                        <h2 className="text-lg font-bold text-gray-900">
                            {SECTIONS.find(s => s.id === activeSection)?.label}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Update your information below.</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                        {renderSection()}
                    </div>
                </main>
            </div>
        </div>
    );
}
