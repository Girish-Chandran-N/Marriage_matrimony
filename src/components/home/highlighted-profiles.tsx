"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
    id: string;
    profileId: string;
    name: string;
    profileImage: string | null;
    personalDetails: {
        dateOfBirth: Date | null;
        city: string | null;
        state: string | null;
        country: string | null;
        height: number | null;
        gender: string | null;
    } | null;
    careerProfile: {
        jobTitle: string | null;
        companyName: string | null;
    } | null;
    educations: Array<{
        qualification: string | null;
        institution: string | null;
    }>;
}

interface HighlightedProfilesProps {
    profiles: ProfileData[];
}

export function HighlightedProfiles({ profiles }: HighlightedProfilesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const profilesPerView = 3;

    const maxIndex = Math.max(0, profiles.length - profilesPerView);

    const next = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const calculateAge = (dob: Date | null) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (profiles.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        HIGHLIGHTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">PROFILES</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium italic">
                        Own the Spotlight, and Let Your Personality Speaks!
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <Button
                        onClick={prev}
                        disabled={currentIndex === 0}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-xl border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed p-0"
                        variant="ghost"
                    >
                        <ChevronLeft className="h-6 w-6 text-slate-700" />
                    </Button>

                    <Button
                        onClick={next}
                        disabled={currentIndex >= maxIndex}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-12 w-12 rounded-full bg-white shadow-xl border-2 border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed p-0"
                        variant="ghost"
                    >
                        <ChevronRight className="h-6 w-6 text-slate-700" />
                    </Button>

                    {/* Profile Cards Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out gap-6"
                            style={{ transform: `translateX(-${currentIndex * (100 / profilesPerView)}%)` }}
                        >
                            {profiles.map((profile) => {
                                const age = calculateAge(profile.personalDetails?.dateOfBirth || null);
                                const location = [
                                    profile.personalDetails?.city,
                                    profile.personalDetails?.state,
                                    profile.personalDetails?.country
                                ].filter(Boolean).join(", ");

                                return (
                                    <Link
                                        key={profile.id}
                                        href={`/users/${profile.id}`}
                                        className="flex-shrink-0 group"
                                        style={{ width: `calc(${100 / profilesPerView}% - ${(profilesPerView - 1) * 24 / profilesPerView}px)` }}
                                    >
                                        <Card className="overflow-hidden border-2 border-slate-100 hover:border-purple-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
                                            {/* Profile Image */}
                                            <div className="relative h-80 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                                                {profile.profileImage ? (
                                                    <img
                                                        src={profile.profileImage}
                                                        alt={profile.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-slate-400">
                                                        {profile.name?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                {/* Profile ID Badge */}
                                                <Badge className="absolute top-4 right-4 bg-white/90 text-slate-800 hover:bg-white border-0 font-mono text-xs">
                                                    ID: {profile.profileId}
                                                </Badge>
                                            </div>

                                            <CardContent className="p-6 space-y-4">
                                                {/* Name & Age */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                                        {profile.name}
                                                        {age && <span className="text-slate-500 font-normal ml-2">({age} yrs)</span>}
                                                    </h3>
                                                </div>

                                                {/* Occupation */}
                                                {profile.careerProfile?.jobTitle && (
                                                    <div className="flex items-start gap-3">
                                                        <Briefcase className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{profile.careerProfile.jobTitle}</p>
                                                            {profile.careerProfile.companyName && (
                                                                <p className="text-xs text-slate-500">{profile.careerProfile.companyName}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Education */}
                                                {profile.educations[0]?.qualification && (
                                                    <div className="flex items-start gap-3">
                                                        <GraduationCap className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{profile.educations[0].qualification}</p>
                                                            {profile.educations[0].institution && (
                                                                <p className="text-xs text-slate-500">{profile.educations[0].institution}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Location */}
                                                {location && (
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm text-slate-600">{location}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-purple-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
