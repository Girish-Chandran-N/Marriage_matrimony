import { getMyProfile } from "@/lib/user-actions";
import { redirect } from "next/navigation";
import {
    Briefcase, User, Users, GraduationCap, Coffee, MapPin, Edit,
    ShieldCheck, Heart, Star, Sparkles, Settings, LogOut, Settings2, Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <>
            {/* === MOBILE NATIVE APP VIEW === */}
            <div className="block lg:hidden min-h-screen bg-[#09090b] text-white pb-24 overflow-x-hidden">
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

                    <Link href="/settings" className="group flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-[#1a1a1a] shadow-lg flex items-center justify-center border border-[#333] transition-colors group-hover:bg-[#222]">
                            <Settings className="w-6 h-6 text-slate-400" />
                        </div>
                    </Link>
                </div>

                <div className="px-4 max-w-lg md:max-w-3xl mx-auto">
                    {/* 3. Navigation Tabs - Mobile Optimized */}
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="bg-[#121214] border border-[#222] p-1.5 rounded-full inline-flex h-auto gap-1 w-full flex-wrap justify-between shadow-sm mb-6">
                            <MobileTabTrigger value="about" label="Bio" activeBg="bg-blue-500/20" color="text-blue-400" />
                            <MobileTabTrigger value="career" label="Work" activeBg="bg-purple-500/20" color="text-purple-400" />
                            <MobileTabTrigger value="family" label="Family" activeBg="bg-pink-500/20" color="text-pink-400" />
                            <MobileTabTrigger value="gallery" label="Photos" activeBg="bg-indigo-500/20" color="text-indigo-400" />
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

                            <div className="bg-[#121214] border border-[#222] rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                <MobileDetailTile label="Height" value={profile.personalDetails.height ? `${profile.personalDetails.height} cm` : null} emoji="📏" />
                                <MobileDetailTile label="Blood Group" value={profile.personalDetails.bloodGroup} emoji="🩸" />
                                <MobileDetailTile label="Marital Status" value={profile.personalDetails.maritalStatus} emoji="💍" />
                                <MobileDetailTile label="Religion" value={profile.personalDetails.religion} emoji="🙏" />
                                <MobileDetailTile label="Caste" value={profile.personalDetails.caste} emoji="🕉️" />
                                <MobileDetailTile label="Mother Tongue" value={profile.personalDetails.motherTongue} emoji="🗣️" />
                            </div>
                        </TabsContent>

                        <TabsContent value="career" className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 focus:outline-none">
                            <div className="bg-[#121214] border border-[#222] rounded-3xl p-6 h-fit">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Profession
                                </h3>
                                <div className="space-y-4">
                                    <MobileDetailRow label="Role" value={profile.careerProfile?.jobTitle} />
                                    <MobileDetailRow label="Company" value={profile.careerProfile?.companyName} />
                                    <MobileDetailRow label="Income" value={profile.careerProfile?.incomeRange} />
                                    <MobileDetailRow label="Location" value={profile.careerProfile?.workLocation} />
                                </div>
                            </div>

                            <div className="bg-[#121214] border border-[#222] rounded-3xl p-6 h-fit">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" /> Education
                                </h3>
                                <div className="space-y-4">
                                    <MobileDetailRow label="Degree" value={profile.educations?.[0]?.qualification} />
                                    <MobileDetailRow label="College" value={profile.educations?.[0]?.institution} />
                                    <MobileDetailRow label="Year" value={profile.educations?.[0]?.passedYear} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="family" className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 focus:outline-none">
                            <div className="bg-[#121214] border border-[#222] rounded-3xl p-6 h-fit">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Family Setup
                                </h3>
                                <div className="space-y-4">
                                    <MobileDetailRow label="Type" value={profile.familyDetails?.familyType} />
                                    <MobileDetailRow label="Status" value={profile.familyDetails?.familyStatus} />
                                    <MobileDetailRow label="Siblings" value={`${profile.familyDetails?.brothers || 0} Bros, ${profile.familyDetails?.sisters || 0} Sis`} />
                                </div>
                            </div>
                            
                            {/* Hobby filler for structural balance on tablet layout */}
                            <div className="hidden md:block bg-[#121214] border border-[#222] rounded-3xl p-6 h-fit">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Coffee className="w-4 h-4" /> Habits
                                </h3>
                                <div className="space-y-4">
                                    <MobileDetailRow label="Diet" value={profile.lifestyleDetails?.diet} />
                                    <MobileDetailRow label="Drinking" value={profile.lifestyleDetails?.drinking} />
                                    <MobileDetailRow label="Smoking" value={profile.lifestyleDetails?.smoking} />
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

            {/* === DESKTOP WEB VIEW === */}
            <div className="hidden lg:block min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
                {/* 1. Vibrant Cover Photo Section */}
                <div className="h-80 w-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 transition-all duration-500 ease-out">
                    {/* 2. Glassmorphism Profile Header */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 sm:p-10 mb-8 transform hover:scale-[1.005] transition-transform duration-300">
                        <div className="md:flex items-start gap-10">
                            {/* Avatar Wrapper with Gradient Ring */}
                            <div className="shrink-0 relative group perspective-1000">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                                <div className="relative rounded-full p-1.5 bg-white shadow-xl ring-1 ring-gray-100">
                                    <ProfileAvatarEditor
                                        initialImage={profile.profileImage}
                                        initials={initials}
                                        galleryImages={profile.photos || []}
                                    />
                                </div>
                                <div className="absolute bottom-4 right-4 bg-green-500 h-5 w-5 rounded-full border-[3px] border-white shadow-md animate-pulse" title="Online"></div>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 mt-6 md:mt-2 space-y-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                                            {profile.name}
                                            <ShieldCheck className="h-7 w-7 text-blue-500 fill-blue-50" />
                                        </h1>
                                        <div className="flex flex-wrap gap-3 mt-3 text-gray-600 font-medium">
                                            <Badge variant="secondary" className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border-0 flex gap-1.5 items-center rounded-lg">
                                                <Briefcase className="h-3.5 w-3.5" />
                                                {profile.careerProfile?.jobTitle || "Professional"}
                                            </Badge>
                                            <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 flex gap-1.5 items-center rounded-lg">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {[profile.personalDetails?.residingDistrict, profile.personalDetails?.residingState].filter(Boolean).join(", ") || "Location not set"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button asChild className="rounded-full px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300">
                                            <Link href="/profile/edit">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Link>
                                        </Button>
                                        <Button variant="outline" asChild className="rounded-full px-6 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700">
                                            <Link href="/dashboard">Dashboard</Link>
                                        </Button>
                                    </div>
                                </div>

                                {profile.personalDetails.about && (
                                    <div className="relative pl-4 border-l-4 border-purple-200 py-1 bg-purple-50/50 rounded-r-lg max-w-3xl">
                                        <p className="text-gray-600 leading-relaxed italic">
                                            "{profile.personalDetails.about}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Navigation Tabs */}
                    <Tabs defaultValue="about" className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList className="bg-white/70 backdrop-blur-sm p-1.5 rounded-full border border-white/50 shadow-md inline-flex h-auto gap-2">
                                <DesktopTabTrigger value="about" icon={User} label="About Me" color="text-blue-600" activeBg="bg-blue-50" />
                                <DesktopTabTrigger value="career" icon={Briefcase} label="Career" color="text-purple-600" activeBg="bg-purple-50" />
                                <DesktopTabTrigger value="family" icon={Users} label="Family" color="text-pink-600" activeBg="bg-pink-50" />
                                <DesktopTabTrigger value="gallery" icon={Sparkles} label="Photos" color="text-indigo-600" activeBg="bg-indigo-50" />
                            </TabsList>
                        </div>

                        <div className="pb-12 space-y-8">
                            {/* Tab Contents with Animation */}
                            <TabsContent value="about" className="space-y-6 focus:outline-none animate-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
                                <Card className="border-none shadow-lg shadow-blue-100/50 overflow-hidden ring-1 ring-slate-100">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-50/50 px-8 py-6">
                                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                                <User className="h-6 w-6" />
                                            </div>
                                            Personal Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                                        <DesktopDetailTile label="Age" value={age} emoji="🎂" />
                                        <DesktopDetailTile label="Height" value={`${profile.personalDetails.height} cm`} emoji="📏" />
                                        <DesktopDetailTile label="Weight" value={profile.personalDetails.weight ? `${profile.personalDetails.weight} kg` : null} emoji="⚖️" />
                                        <DesktopDetailTile label="Body Type" value={profile.personalDetails.bodyType} emoji="💪" />
                                        <DesktopDetailTile label="Complexion" value={profile.personalDetails.complexion} emoji="✨" />
                                        <DesktopDetailTile label="Gender" value={profile.personalDetails.gender} emoji="⚧" />
                                        <DesktopDetailTile label="Blood Group" value={profile.personalDetails.bloodGroup} emoji="🩸" />
                                        <DesktopDetailTile label="Marital Status" value={profile.personalDetails.maritalStatus} emoji="💍" />
                                        <DesktopDetailTile label="Mother Tongue" value={profile.personalDetails.motherTongue} emoji="🗣️" />
                                        <DesktopDetailTile label="Known Languages" value={Array.isArray(profile.personalDetails.knownLanguages) ? profile.personalDetails.knownLanguages.join(", ") : profile.personalDetails.knownLanguages} emoji="🌐" />
                                        <DesktopDetailTile label="Diet" value={profile.lifestyleDetails?.diet} emoji="🥗" />
                                        <DesktopDetailTile label="Religion" value={profile.personalDetails.religion} emoji="🙏" />
                                        <DesktopDetailTile label="Caste" value={profile.personalDetails.caste} emoji="🕉️" />
                                    </CardContent>
                                </Card>

                                {/* About the Candidate Section - Moved to Bottom */}
                                {profile.personalDetails.about && (
                                    <Card className="border-none shadow-lg shadow-indigo-100/50 overflow-hidden ring-1 ring-slate-100">
                                        <CardHeader className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-50/50 px-8 py-6">
                                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600">
                                                    <Heart className="h-6 w-6" />
                                                </div>
                                                About Me
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="prose prose-slate max-w-none">
                                                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                                                    {profile.personalDetails.about}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="career" className="space-y-6 focus:outline-none animate-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-none shadow-lg shadow-purple-100/50 overflow-hidden ring-1 ring-slate-100">
                                        <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-50/50 px-8 py-6">
                                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                                <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
                                                    <Briefcase className="h-6 w-6" />
                                                </div>
                                                Professional Info
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 grid grid-cols-1 gap-6">
                                            <DesktopDetailRow label="Profession" value={profile.careerProfile?.jobTitle} />
                                            <DesktopDetailRow label="Employer" value={profile.careerProfile?.companyName} />
                                            <DesktopDetailRow label="Employment Type" value={profile.careerProfile?.employmentType} />
                                            <DesktopDetailRow label="Work Location" value={profile.careerProfile?.workLocation} />
                                            <DesktopDetailRow label="Annual Income" value={profile.careerProfile?.incomeRange} />
                                            <DesktopDetailRow label="Experience" value={profile.careerProfile?.yearsExperience ? `${profile.careerProfile.yearsExperience} Years` : null} />
                                            <DesktopDetailRow label="Industry" value={profile.careerProfile?.industry} />
                                            {profile.careerProfile?.linkedinUrl && <DesktopDetailRow label="LinkedIn" value={profile.careerProfile.linkedinUrl} link />}
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-lg shadow-indigo-100/50 overflow-hidden ring-1 ring-slate-100 h-fit">
                                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-50/50 px-8 py-6">
                                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                                                    <GraduationCap className="h-6 w-6" />
                                                </div>
                                                Education
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 grid grid-cols-1 gap-6">
                                            <DesktopDetailRow label="Highest Degree" value={profile.educations?.[0]?.qualification} />
                                            <DesktopDetailRow label="Institution" value={profile.educations?.[0]?.institution} />
                                            <DesktopDetailRow label="College/University" value={profile.educations?.[0]?.university} />
                                            <DesktopDetailRow label="Stream/Field" value={profile.educations?.[0]?.stream || "Not specified"} />
                                            <DesktopDetailRow label="Passing Year" value={profile.educations?.[0]?.passedYear} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="family" className="space-y-6 focus:outline-none animate-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-none shadow-lg shadow-pink-100/50 overflow-hidden ring-1 ring-slate-100">
                                        <CardHeader className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-50/50 px-8 py-6">
                                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                                <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                Family
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 grid grid-cols-1 gap-6">
                                            <DesktopDetailRow label="Family Type" value={profile.familyDetails?.familyType} />
                                            <DesktopDetailRow label="Family Status" value={profile.familyDetails?.familyStatus} />
                                            <DesktopDetailRow label="Father's Job" value={profile.familyDetails?.fatherOccupation} />
                                            <DesktopDetailRow label="Mother's Job" value={profile.familyDetails?.motherOccupation} />
                                            <DesktopDetailRow label="Siblings" value={`${profile.familyDetails?.brothers || 0} Brothers, ${profile.familyDetails?.sisters || 0} Sisters`} />
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-lg shadow-orange-100/50 overflow-hidden ring-1 ring-slate-100 h-fit">
                                        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-50/50 px-8 py-6">
                                            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                                                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                                                    <Coffee className="h-6 w-6" />
                                                </div>
                                                Habits & Hobbies
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-8">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <DesktopHabitBox label="Smoking" value={profile.lifestyleDetails?.smoking} />
                                                <DesktopHabitBox label="Drinking" value={profile.lifestyleDetails?.drinking} />
                                                <DesktopHabitBox label="Diet" value={profile.lifestyleDetails?.diet} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Interests</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.lifestyleDetails?.hobbies?.map((hobby: string) => (
                                                        <Badge key={hobby} className="px-3 py-1.5 text-sm bg-orange-50 text-orange-700 border-orange-100/50 hover:bg-orange-100 transition-colors cursor-default rounded-lg">
                                                            {hobby}
                                                        </Badge>
                                                    )) || <span className="text-gray-400 italic">No hobbies listed</span>}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="gallery" className="focus:outline-none animate-in slide-in-from-bottom-6 duration-500 ease-out fill-mode-both">
                                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-slate-200/50">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                                            <Sparkles className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Your Photo Gallery</h3>
                                    </div>
                                    <GalleryEditor galleryImages={profile.photos || []} />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
    );
}

// === MOBILE UI COMPONENTS ===
function MobileTabTrigger({ value, label, color, activeBg }: any) {
    return (
        <TabsTrigger
            value={value}
            className={`rounded-full px-4 py-2 flex-1 data-[state=active]:${activeBg} data-[state=active]:${color} text-slate-500 data-[state=active]:text-white transition-all duration-300 font-bold text-sm tracking-wide`}
        >
            {label}
        </TabsTrigger>
    );
}

function MobileDetailTile({ label, value, emoji }: any) {
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

function MobileDetailRow({ label, value }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
            <span className="text-[15px] font-semibold text-white mt-1">{value}</span>
        </div>
    );
}

// === DESKTOP UI COMPONENTS ===
function DesktopTabTrigger({ value, icon: Icon, label, color, activeBg }: any) {
    return (
        <TabsTrigger
            value={value}
            className={`rounded-full px-6 py-2.5 data-[state=active]:shadow-sm data-[state=active]:${activeBg} data-[state=active]:${color} text-gray-500 hover:text-gray-900 transition-all duration-300 font-medium flex items-center gap-2`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </TabsTrigger>
    );
}

function DesktopDetailTile({ label, value, emoji }: any) {
    if (!value) return null;
    return (
        <div className="group flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-1">
            <span className="text-2xl mb-2 filter grayscale group-hover:grayscale-0 transition-all duration-300">{emoji}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
            <span className="text-base font-semibold text-slate-800">{value}</span>
        </div>
    );
}

function DesktopDetailRow({ label, value, link }: any) {
    if (!value) return null;
    return (
        <div className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-3 last:pb-0 hover:bg-slate-50/50 p-2 -mx-2 rounded-lg transition-colors">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            {link ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate max-w-[200px]">
                    View Link
                </a>
            ) : (
                <span className="text-sm font-semibold text-slate-800 text-right">{value}</span>
            )}
        </div>
    );
}

function DesktopHabitBox({ label, value }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50/50 border border-orange-100">
            <span className="text-xs font-bold text-orange-400 uppercase mb-1">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
        </div>
    );
}
