"use client";

import { useState } from "react";
import PersonalDetailsForm from "@/components/profile-forms/personal-details-form";
import EducationDetailsForm from "@/components/profile-forms/education-details-form";
import CareerDetailsForm from "@/components/profile-forms/career-details-form";
import FamilyDetailsForm from "@/components/profile-forms/family-details-form";
import LifestyleDetailsForm from "@/components/profile-forms/lifestyle-details-form";
import PhotoManager from "@/components/profile-forms/photo-manager";
import { User, GraduationCap, Briefcase, Users, Coffee, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "career", label: "Career & Finances", icon: Briefcase },
    { id: "family", label: "Family Background", icon: Users },
    { id: "lifestyle", label: "Lifestyle & Interests", icon: Coffee },
    { id: "photos", label: "Manage Photos", icon: ImageIcon },
];

export default function ProfileEditClient({ profile }: { profile: any }) {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

    const renderSection = () => {
        switch (activeSection) {
            case "personal":
                return <PersonalDetailsForm initialData={profile.personalDetails} />;
            case "education":
                return <EducationDetailsForm initialData={profile.educationDetails} />;
            case "career":
                return <CareerDetailsForm initialData={profile.careerProfile} />;
            case "family":
                return <FamilyDetailsForm initialData={profile.familyDetails} />;
            case "lifestyle":
                return <LifestyleDetailsForm initialData={profile.lifestyleDetails} isEditMode={true} />;
            case "photos":
                return <PhotoManager
                    currentProfileImage={profile.profileImage}
                    galleryImages={profile.galleryImages}
                    familyImages={profile.familyDetails?.familyImages}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                    <a href="/profile" className="text-sm font-medium text-primary hover:text-primary/80">View Profile</a>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <nav className="w-full md:w-64 shrink-0 space-y-1">
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
                    </nav>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {SECTIONS.find(s => s.id === activeSection)?.label}
                                    </h2>
                                    <p className="text-gray-500 mt-1">Update your information below.</p>
                                </div>
                                {renderSection()}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
