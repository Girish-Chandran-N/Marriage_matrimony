"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerificationBadge } from "./verification-badge";
import { Badge } from "@/components/ui/badge";
import { ReportDialog } from "@/components/report-dialog";
import { Briefcase, MapPin, Pencil, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ProfileDetails } from "@/lib/user-actions";
import { ProfilePictureEditor } from "./profile-picture-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { MatchBreakdown } from "@/lib/matching";
import OnlineIndicator from "@/components/ui/online-indicator";

interface ProfileHeaderProps {
    profile: ProfileDetails;
    isOwnProfile?: boolean;
    matchScore?: number;
    matchBreakdown?: MatchBreakdown;
}

export function ProfileHeader({ profile, isOwnProfile, matchScore, matchBreakdown }: ProfileHeaderProps) {
    const [isScoreOpen, setIsScoreOpen] = useState(false);
    const initials = profile.name?.split(" ").map((n: string) => n[0]).join("") || "??";
    const age = profile.personalDetails?.dateOfBirth
        ? new Date().getFullYear() - new Date(profile.personalDetails.dateOfBirth).getFullYear()
        : null;

    return (
        <div className="relative mb-6 md:mb-8">
            {/* Cover Image Placeholder - Desktop Only */}
            <div className="hidden md:block h-48 w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl rounded-b-none"></div>

            {/* Mobile Header Bar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Full Profile</span>
                </div>
                <div className="flex items-center gap-2">
                    {matchScore !== undefined && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                            ★ {matchScore}% Match
                        </Badge>
                    )}
                    <div className="text-xs text-gray-500">
                        {new Date(profile.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 pb-6 pt-4 md:pt-0">
                <div className="relative flex flex-col items-center md:flex-row md:items-end md:-mt-16 gap-4 md:gap-6 text-center md:text-left">
                    {/* Avatar */}
                    {/* Avatar */}
                    {/* Avatar */}
                    <div className="relative">
                        <ProfilePictureEditor
                            currentImage={profile.profileImage}
                            galleryImages={profile.photos?.map((p: any) => p.url) || []}
                            name={profile.name}
                            isOwnProfile={isOwnProfile}
                        />
                        {!isOwnProfile && <OnlineIndicator userId={profile.id} size="lg" />}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 space-y-1 py-2 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-2 justify-center md:justify-start">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name}</h1>
                            <VerificationBadge isVerified={profile.careerProfile?.isVerified} showText={false} className="md:mb-1" />
                            {matchScore !== undefined && (
                                <Badge
                                    className="hidden md:inline-flex bg-green-100 text-green-700 hover:bg-green-200 border-green-200 ml-2 md:mb-1 text-sm py-1 px-3 cursor-pointer"
                                    onClick={() => matchBreakdown && setIsScoreOpen(true)}
                                >
                                    ★ {matchScore}% Compatibility
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 font-medium">ID: M{profile.id.slice(-6).toUpperCase()}</p>

                        <div className="flex justify-center md:justify-start mt-2">
                            <Badge className="bg-purple-700 hover:bg-purple-800 gap-1 px-3">
                                <span className="text-xs">👑 Premium</span>
                            </Badge>
                        </div>

                        {/* Quick Stats Tags - Desktop */}
                        <div className="hidden md:flex flex-wrap gap-2 pt-3">
                            {age && <Badge variant="outline" className="border-gray-300 text-gray-600">{age} years old</Badge>}
                            {profile.personalDetails?.maritalStatus && <Badge variant="outline" className="border-gray-300 text-gray-600">{profile.personalDetails.maritalStatus}</Badge>}
                            {profile.careerProfile?.jobTitle && <Badge variant="outline" className="border-gray-300 text-gray-600">{profile.careerProfile.jobTitle}</Badge>}
                        </div>
                    </div>

                    {/* Actions - Visible on both Mobile and Desktop */}
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0 justify-center md:justify-end">
                        {isOwnProfile ? (
                            <div className="flex gap-2">
                                <Link href="/profile/edit">
                                    <Button variant="outline" className="gap-2">
                                        <Pencil className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                                <Link href="/settings/blocked">
                                    <Button variant="outline" size="icon" title="Settings">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-4 h-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href={`/messages/${profile.id}`}>
                                    <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                                        <MessageCircle className="w-4 h-4" /> Message
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                    <ReportDialog userId={profile.id} userName={profile.name || "User"} />
                                    <Button
                                        variant="outline"
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                        onClick={async () => {
                                            if (confirm(`Are you sure you want to block ${profile.name}? They won't be able to message you.`)) {
                                                const { blockUser } = await import("@/lib/block-actions");
                                                await blockUser(profile.id);
                                                window.location.href = '/matches'; // Redirect away after blocking
                                            }
                                        }}
                                    >
                                        Block
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Verification Stats Grid */}
                <div className="grid grid-cols-4 gap-2 mt-6 md:hidden text-center">
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center gap-1 border border-gray-100">
                        <VerificationBadge isVerified={true} showText={false} className="bg-transparent border-0 p-0" />
                        <span className="text-[10px] text-gray-600 leading-tight">ID Proof<br />Verified</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center gap-1 border border-gray-100">
                        <span className="text-green-600 text-xs">📱</span>
                        <span className="text-[10px] text-gray-600 leading-tight">Mobile<br />Verified</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center gap-1 border border-gray-100">
                        <span className="text-gray-400 text-xs">💼</span>
                        <span className="text-[10px] text-gray-600 leading-tight">Salary<br />Verified</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center gap-1 border border-gray-100">
                        <span className="text-gray-400 text-xs">✉️</span>
                        <span className="text-[10px] text-gray-600 leading-tight">Email<br />Verified</span>
                    </div>
                </div>
            </div>

            {/* Match Breakdown Dialog */}
            <Dialog open={isScoreOpen} onOpenChange={setIsScoreOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center pb-2 border-b">Compatibility Breakdown</DialogTitle>
                    </DialogHeader>
                    {matchBreakdown && (
                        <div className="py-4 space-y-4">
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total Match Score</span>
                                <span className="text-purple-600">{matchBreakdown.total} / {matchBreakdown.maxPossible}</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <BreakdownItem label="Industry & Career" score={matchBreakdown.industry} max={50} />
                                <BreakdownItem label="Trust & Verification" score={matchBreakdown.trust} max={20} />
                                <BreakdownItem label="Location Preference" score={matchBreakdown.location} max={20} />
                                <BreakdownItem label="Age Compatibility" score={matchBreakdown.age} max={10} />
                                <BreakdownItem label="Height Compatibility" score={matchBreakdown.height} max={10} />
                                <BreakdownItem label="Religion & Caste" score={matchBreakdown.religion + matchBreakdown.caste} max={25} />
                                <BreakdownItem label="Language" score={matchBreakdown.language} max={10} />
                                <BreakdownItem label="Marital Status" score={matchBreakdown.maritalStatus} max={20} />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

function BreakdownItem({ label, score, max }: { label: string, score: number, max: number }) {
    const isMatch = score > 0;
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}</span>
            <div className="flex items-center gap-2">
                <span className={isMatch ? "text-green-600 font-medium" : "text-gray-400"}>
                    {isMatch ? `+${score}` : "0"}
                </span>
                <span className="text-gray-300 text-xs">/ {max}</span>
            </div>
        </div>
    );
}
