import { getMyProfile } from "@/lib/user-actions";
import { redirect } from "next/navigation";
import { Briefcase, User, Users, GraduationCap, Coffee, MapPin, Edit, ShieldCheck, Heart, Star, Sparkles, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryEditor } from "@/components/profile/gallery-editor";
import ProfileAvatarEditor from "@/components/profile/profile-avatar-editor";

export default async function MyProfilePage() {
    const profile = await getMyProfile();

    if (!profile) {
        redirect("/login");
    }

    if (!profile.personalDetails) {
        redirect("/profile/setup");
    }

    const initials = profile.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U";

    // Calculate age
    let age = null;
    if (profile.personalDetails?.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(profile.personalDetails.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 overflow-x-hidden">
            {/* 1. Vibrant Cover Photo Section */}
            {/* Using a mesh-like gradient background */}
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
                                    galleryImages={profile.galleryImages || []}
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
                                            {[profile.personalDetails.city, profile.personalDetails.district, profile.personalDetails.state].filter(Boolean).join(", ") || "Location not set"}
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

                            {profile.personalDetails.bio && (
                                <div className="relative pl-4 border-l-4 border-purple-200 py-1 bg-purple-50/50 rounded-r-lg max-w-3xl">
                                    <p className="text-gray-600 leading-relaxed italic">
                                        "{profile.personalDetails.bio}"
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
                            <CustomTabTrigger value="about" icon={User} label="About Me" color="text-blue-600" activeBg="bg-blue-50" />
                            <CustomTabTrigger value="career" icon={Briefcase} label="Career" color="text-purple-600" activeBg="bg-purple-50" />
                            <CustomTabTrigger value="family" icon={Users} label="Family" color="text-pink-600" activeBg="bg-pink-50" />
                            <CustomTabTrigger value="gallery" icon={Sparkles} label="Photos" color="text-indigo-600" activeBg="bg-indigo-50" />
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
                                    <DetailTile label="Age" value={age} emoji="🎂" />
                                    <DetailTile label="Height" value={`${profile.personalDetails.height} cm`} emoji="📏" />
                                    <DetailTile label="Weight" value={profile.personalDetails.weight ? `${profile.personalDetails.weight} kg` : null} emoji="⚖️" />
                                    <DetailTile label="Body Type" value={profile.personalDetails.bodyType} emoji="💪" />
                                    <DetailTile label="Complexion" value={profile.personalDetails.complexion} emoji="✨" />
                                    <DetailTile label="Gender" value={profile.personalDetails.gender} emoji="⚧" />
                                    <DetailTile label="Blood Group" value={profile.personalDetails.bloodGroup} emoji="🩸" />
                                    <DetailTile label="Marital Status" value={profile.personalDetails.maritalStatus} emoji="💍" />
                                    <DetailTile label="Mother Tongue" value={profile.personalDetails.motherTongue} emoji="🗣️" />
                                    <DetailTile label="Known Languages" value={Array.isArray(profile.personalDetails.knownLanguages) ? profile.personalDetails.knownLanguages.join(", ") : profile.personalDetails.knownLanguages} emoji="🌐" />
                                    <DetailTile label="Diet" value={profile.lifestyleDetails?.diet} emoji="🥗" />
                                    <DetailTile label="Religion" value={profile.personalDetails.religion} emoji="🙏" />
                                    <DetailTile label="Caste" value={profile.personalDetails.caste} emoji="🕉️" />
                                </CardContent>
                            </Card>
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
                                        <DetailRow label="Profession" value={profile.careerProfile?.jobTitle} />
                                        <DetailRow label="Employer" value={profile.careerProfile?.companyName} />
                                        <DetailRow label="Employment Type" value={profile.careerProfile?.employmentType} />
                                        <DetailRow label="Work Location" value={profile.careerProfile?.workLocation} />
                                        <DetailRow label="Annual Income" value={profile.careerProfile?.incomeRange} />
                                        <DetailRow label="Experience" value={profile.careerProfile?.yearsExperience ? `${profile.careerProfile.yearsExperience} Years` : null} />
                                        <DetailRow label="Industry" value={profile.careerProfile?.industry} />
                                        {profile.careerProfile?.linkedinUrl && <DetailRow label="LinkedIn" value={profile.careerProfile.linkedinUrl} link />}
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
                                        <DetailRow label="Highest Degree" value={profile.educationDetails?.highestQualification} />
                                        <DetailRow label="Institution" value={profile.educationDetails?.institutionName} />
                                        <DetailRow label="College/University" value={profile.educationDetails?.collegeName} />
                                        <DetailRow label="Stream/Field" value={profile.educationDetails?.stream || "Not specified"} />
                                        <DetailRow label="Passing Year" value={profile.educationDetails?.passingYear} />
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
                                        <DetailRow label="Family Type" value={profile.familyDetails?.familyType} />
                                        <DetailRow label="Family Status" value={profile.familyDetails?.familyStatus} />
                                        <DetailRow label="Father's Job" value={profile.familyDetails?.fatherOccupation} />
                                        <DetailRow label="Mother's Job" value={profile.familyDetails?.motherOccupation} />
                                        <DetailRow label="Siblings" value={`${profile.familyDetails?.brothers || 0} Brothers, ${profile.familyDetails?.sisters || 0} Sisters`} />
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
                                            <HabitBox label="Smoking" value={profile.lifestyleDetails?.smoking} />
                                            <HabitBox label="Drinking" value={profile.lifestyleDetails?.drinking} />
                                            <HabitBox label="Diet" value={profile.lifestyleDetails?.diet} />
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
                                <GalleryEditor galleryImages={profile.galleryImages || []} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// Minimal Pill Tab Trigger
function CustomTabTrigger({ value, icon: Icon, label, color, activeBg }: any) {
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

// Fun Tile for Personal Details
function DetailTile({ label, value, emoji }: any) {
    if (!value) return null;
    return (
        <div className="group flex flex-col p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 hover:-translate-y-1">
            <span className="text-2xl mb-2 filter grayscale group-hover:grayscale-0 transition-all duration-300">{emoji}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
            <span className="text-base font-semibold text-slate-800">{value}</span>
        </div>
    );
}

// Cleaner Row for Professional/Education data
function DetailRow({ label, value, link }: any) {
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

// Box for Habits
function HabitBox({ label, value }: any) {
    if (!value) return null;
    return (
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50/50 border border-orange-100">
            <span className="text-xs font-bold text-orange-400 uppercase mb-1">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
        </div>
    );
}

