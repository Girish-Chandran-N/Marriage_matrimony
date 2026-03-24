import { getMyProfile } from "@/lib/user-actions";
import { redirect } from "next/navigation";
import {
    Briefcase, User, Users, GraduationCap, Coffee, MapPin, Edit,
    ShieldCheck, Heart, Star, Sparkles, Settings, LogOut, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileAvatarEditor from "@/components/profile/profile-avatar-editor";
import { GalleryEditor } from "@/components/profile/gallery-editor";

export default async function MyProfilePage() {
    const profile = await getMyProfile();

    if (!profile) redirect("/login");
    if (!profile.personalDetails) redirect("/profile/setup");

    const initials = profile.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U";

    // Calculate age
    let age = null;
    if (profile.personalDetails?.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(profile.personalDetails.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white pb-24 overflow-x-hidden">
            {/* Header / Avatar Section */}
            <div className="relative w-full aspect-[4/3] max-h-[40vh] flex flex-col items-center justify-end pb-8">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-[#09090b]/80 to-[#09090b] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-full blur opacity-40"></div>
                        <div className="relative rounded-full p-1 bg-[#1a1a1a]">
                            <ProfileAvatarEditor
                                initialImage={profile.profileImage}
                                initials={initials}
                                galleryImages={profile.photos || []}
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-[#09090b]" />
                    </div>

                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        {profile.name?.split(' ')[0]}, {age}
                        <ShieldCheck className="h-6 w-6 text-blue-500 fill-blue-500/20" />
                    </h1>
                    <p className="text-slate-400 font-medium mt-1">
                        {profile.careerProfile?.jobTitle || "Professional"}
                    </p>
                </div>
            </div>

            {/* Floating Action Orbit */}
            <div className="flex justify-center items-center gap-6 mb-10 px-4 -mt-2 relative z-20">
                <Link href="/matches/preferences" className="group flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-[#1a1a1a] shadow-lg flex items-center justify-center border border-[#333] transition-colors group-hover:bg-[#222]">
                        <Settings2 className="w-6 h-6 text-slate-400" />
                    </div>
                </Link>

                <Link href="/profile/edit" className="group flex flex-col items-center gap-2 -translate-y-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 shadow-xl shadow-rose-500/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                        <Edit className="w-8 h-8 text-white" />
                    </div>
                </Link>

                <div className="group flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-[#1a1a1a] shadow-lg flex items-center justify-center border border-[#333]">
                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="px-4 max-w-lg mx-auto">
                {/* 3. Navigation Tabs - Mobile Optimized */}
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="bg-[#121214] border border-[#222] p-1.5 rounded-full inline-flex h-auto gap-1 w-full flex-wrap justify-between shadow-sm mb-6">
                        <CustomTabTrigger value="about" label="Bio" activeBg="bg-blue-500/20" color="text-blue-400" />
                        <CustomTabTrigger value="career" label="Work" activeBg="bg-purple-500/20" color="text-purple-400" />
                        <CustomTabTrigger value="family" label="Family" activeBg="bg-pink-500/20" color="text-pink-400" />
                        <CustomTabTrigger value="gallery" label="Photos" activeBg="bg-indigo-500/20" color="text-indigo-400" />
                    </TabsList>

                    {/* Content */}
                    <TabsContent value="about" className="space-y-4 focus:outline-none">
                        {profile.personalDetails.about && (
                            <div className="bg-[#121214] border border-[#222] rounded-3xl p-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">About Me</h3>
                                <p className="text-white leading-relaxed text-[15px] whitespace-pre-wrap">
                                    {profile.personalDetails.about}
                                </p>
                            </div>
                        )}

                        <div className="bg-[#121214] border border-[#222] rounded-3xl p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                            <DetailTile label="Height" value={profile.personalDetails.height ? `${profile.personalDetails.height} cm` : null} emoji="📏" />
                            <DetailTile label="Blood Group" value={profile.personalDetails.bloodGroup} emoji="🩸" />
                            <DetailTile label="Marital Status" value={profile.personalDetails.maritalStatus} emoji="💍" />
                            <DetailTile label="Religion" value={profile.personalDetails.religion} emoji="🙏" />
                            <DetailTile label="Caste" value={profile.personalDetails.caste} emoji="🕉️" />
                            <DetailTile label="Mother Tongue" value={profile.personalDetails.motherTongue} emoji="🗣️" />
                        </div>
                    </TabsContent>

                    <TabsContent value="career" className="space-y-4 focus:outline-none">
                        <div className="bg-[#121214] border border-[#222] rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Profession
                            </h3>
                            <div className="space-y-4">
                                <DetailRow label="Role" value={profile.careerProfile?.jobTitle} />
                                <DetailRow label="Company" value={profile.careerProfile?.companyName} />
                                <DetailRow label="Income" value={profile.careerProfile?.incomeRange} />
                                <DetailRow label="Location" value={profile.careerProfile?.workLocation} />
                            </div>
                        </div>

                        <div className="bg-[#121214] border border-[#222] rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Education
                            </h3>
                            <div className="space-y-4">
                                <DetailRow label="Degree" value={profile.educations?.[0]?.qualification} />
                                <DetailRow label="College" value={profile.educations?.[0]?.institution} />
                                <DetailRow label="Year" value={profile.educations?.[0]?.passedYear} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="family" className="space-y-4 focus:outline-none">
                        <div className="bg-[#121214] border border-[#222] rounded-3xl p-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Family Setup
                            </h3>
                            <div className="space-y-4">
                                <DetailRow label="Type" value={profile.familyDetails?.familyType} />
                                <DetailRow label="Status" value={profile.familyDetails?.familyStatus} />
                                <DetailRow label="Siblings" value={`${profile.familyDetails?.brothers || 0} Bros, ${profile.familyDetails?.sisters || 0} Sis`} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="gallery" className="focus:outline-none">
                        <div className="bg-[#121214] border border-[#222] rounded-3xl p-6">
                            <GalleryEditor galleryImages={profile.photos || []} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Minimal Dark Tab Trigger
function CustomTabTrigger({ value, label, color, activeBg }: any) {
    return (
        <TabsTrigger
            value={value}
            className={`rounded-full px-4 py-2 flex-1 data-[state=active]:${activeBg} data-[state=active]:${color} text-slate-500 data-[state=active]:text-white transition-all duration-300 font-bold text-sm tracking-wide`}
        >
            {label}
        </TabsTrigger>
    );
}

// Minimal Mobile Detail Tile
function DetailTile({ label, value, emoji }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 tracking-wider">
                {emoji} {label}
            </span>
            <span className="text-sm font-semibold text-white pl-[1.6rem]">{value}</span>
        </div>
    );
}

// Minimal Mobile Row
function DetailRow({ label, value }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-[15px] font-semibold text-white mt-1">{value}</span>
        </div>
    );
}
