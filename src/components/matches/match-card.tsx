"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    ChevronLeft,
    ChevronRight,
    X,
    Heart,
    Star,
    Sparkles,
    Check,
    Loader2,
    MoreVertical,
    Share2,
    Flag,
    Ban,
    EyeOff,
    Camera
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sendInterest, toggleShortlist, getInteractionStatus, blockUser, reportUser, ignoreUser, unblockUser } from "@/lib/interaction-actions";
import { toast } from "sonner";


interface MatchCardProps {
    user: any;
    score?: number;
    variant?: "default" | "blocked";
}

export function MatchCard({ user, score, variant = "default" }: MatchCardProps) {
    const router = useRouter(); // Import useRouter
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = [
        user.profileImage,
        ...(user.photos?.map((p: { url: string }) => p.url) || [])
    ].filter(Boolean);

    const hasImages = allImages.length > 0;
    const displayImage = hasImages ? allImages[0] : null;

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    useEffect(() => {
        if (!isGalleryOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNextImage();
            if (e.key === "ArrowLeft") handlePrevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGalleryOpen, allImages.length]);

    const calculateAge = (dob: string | Date | null) => {
        if (!dob) return "N/A";
        const dateObj = new Date(dob);
        const diff = Date.now() - dateObj.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Online Status Logic (Mocked if data missing, otherwise use lastSeen/isOnline)
    const isOnline = user.isOnline || (user.lastSeen && new Date(user.lastSeen).getTime() > Date.now() - 5 * 60 * 1000); // 5 mins
    const lastLogin = user.lastSeen ? new Date(user.lastSeen).toLocaleDateString() : "Just now"; // Default for demo

    return (
        <div
            onClick={() => router.push(`/users/${user.id}`)}
            className="group relative bg-[#121214] lg:bg-white rounded-3xl border border-[#222] lg:border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.3)] lg:shadow-sm hover:border-[#333] lg:hover:border-slate-100 lg:hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
        >

            {/* Top Bar: Online Status & Photo Count */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                {/* Online Status */}
                <div className="bg-black/60 lg:bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-500 lg:bg-slate-300'}`}></div>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-500 lg:text-green-700' : 'text-slate-300 lg:text-slate-500'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>

                {/* Photo Count */}
                <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-white/90">
                    <Camera className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{allImages.length}</span>
                </div>

                {/* 3-Dot Menu (Pointer events needed) */}
                <div onClick={(e) => e.stopPropagation()} className="pointer-events-auto absolute top-0 right-0">
                    <ProfileMenu user={user} />
                </div>
            </div>

            {/* Profile Image Area */}
            <div
                className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    if (hasImages) setIsGalleryOpen(true);
                }}
            >
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={user.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] lg:bg-slate-100 flex flex-col items-center justify-center gap-2">
                        <div className="w-24 h-24 rounded-full bg-[#222] lg:bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-500 lg:text-slate-400">
                            {user.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-500 lg:text-slate-400">No Photo</span>
                    </div>
                )}

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                {/* Name & Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                    <h2 className="text-2xl font-bold leading-tight mb-1">{user.name}</h2>
                    <p className="text-sm text-white/90 font-medium flex items-center gap-2">
                        <span>{calculateAge(user.personalDetails?.dateOfBirth)} Yrs</span>
                        <span className="text-white/40">|</span>
                        <span>{user.personalDetails?.height ? `${user.personalDetails.height} cm` : "N/A"}</span>
                        <span className="text-white/40">|</span>
                        <span>{user.personalDetails?.residingCity || user.personalDetails?.nativeState || "India"}</span>
                    </p>
                </div>
            </div>

            {/* Detailed Info List */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="space-y-3 text-sm text-slate-400 lg:text-slate-600">
                    <div className="flex gap-3 items-start">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-600 lg:bg-slate-300 shrink-0" />
                        <p className="line-clamp-1">{user.educations?.[0]?.qualification || "Education not specified"}</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-600 lg:bg-slate-300 shrink-0" />
                        <p className="line-clamp-1">{user.careerProfile?.jobTitle || "Job not specified"}, {user.careerProfile?.workLocation || "Location N/A"}</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-600 lg:bg-slate-300 shrink-0" />
                        <p className="line-clamp-1">{user.personalDetails?.religion || "Religion N/A"} {user.personalDetails?.caste ? `, ${user.personalDetails.caste}` : ""}</p>
                    </div>
                </div>

                <div className="my-2">
                    <div className="h-px bg-[#222] lg:bg-slate-100 w-full" />
                </div>

                <p className="text-xs text-slate-500 lg:text-slate-400 text-center font-medium">
                    Last Logged In : {lastLogin}
                </p>

                <div className="my-2">
                    <div className="h-px bg-[#222] lg:bg-slate-100 w-full" />
                </div>

                {/* Action Buttons */}
                <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                    {variant === "blocked" ? (
                        <UnblockButton user={user} />
                    ) : (
                        <MatchActions user={user} />
                    )}
                </div>
            </div>

            {/* Gallery Dialog (Same as before) */}
            <div onClick={(e) => e.stopPropagation()}>
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                    <DialogContent
                        className="max-w-5xl w-full h-[85vh] p-0 bg-black/95 border-none overflow-hidden focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DialogTitle className="sr-only">Profile Gallery</DialogTitle>
                        {/* ... Gallery Controls ... */}
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="flex-1 w-full h-full flex items-center justify-center relative">
                            {allImages.length > 0 ? (
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt="Gallery"
                                    className="max-h-full max-w-full object-contain cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNextImage();
                                    }}
                                />
                            ) : (
                                <div className="text-white/50">No photos available</div>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all z-[60]"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full transition-all z-[60]"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

function UnblockButton({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    const handleUnblock = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            const res = await unblockUser(user.id);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Failed to unblock");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleUnblock}
            disabled={loading}
            className="w-full bg-[#1a1a1a] lg:bg-slate-900 border border-[#333] lg:border-none text-white hover:bg-[#222] lg:hover:bg-slate-800 rounded-full font-bold shadow-md"
        >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <EyeOff className="w-4 h-4 mr-2" />}
            Unblock User
        </Button>
    );
}

function MatchActions({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const [upgradeRequired, setUpgradeRequired] = useState<string | null>(null);
    const [status, setStatus] = useState<{ isShortlisted: boolean; hasSentInterest: boolean; interestStatus?: string }>({
        isShortlisted: false,
        hasSentInterest: false
    });

    useEffect(() => {
        getInteractionStatus(user.id).then((s) => setStatus(s as any));
    }, [user.id]);

    const handleConnect = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (status.hasSentInterest) return;
        setLoading(true);
        try {
            const result = await sendInterest(user.id);
            if (result?.error === "UPGRADE_REQUIRED") {
                setUpgradeRequired(result.message || "Upgrade your plan to send more interests.");
                return;
            }
            if (result?.success) {
                setStatus(prev => ({ ...prev, hasSentInterest: true }));
                toast.success("Interest sent successfully!");
            } else {
                toast.error(result?.message || "Failed to send interest");
            }
        } catch {
            toast.error("Failed to send interest");
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newState = !status.isShortlisted;
        setStatus(prev => ({ ...prev, isShortlisted: newState }));
        try {
            await toggleShortlist(user.id);
            toast.success(newState ? "Added to shortlist" : "Removed from shortlist");
        } catch {
            setStatus(prev => ({ ...prev, isShortlisted: !newState }));
            toast.error("Failed to update shortlist");
        }
    };

    // Show inline upgrade prompt if user hit their plan limit
    if (upgradeRequired) {
        return (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="flex-1 line-clamp-2">{upgradeRequired}</span>
                <a
                    href="/pricing"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition-colors"
                >
                    Upgrade
                </a>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {/* Express Interest (50% width) */}
            <Button
                onClick={handleConnect}
                disabled={loading || status.hasSentInterest}
                className={`flex-1 rounded-full font-bold shadow-md transition-all border-none ${status.hasSentInterest
                    ? "bg-[#1f1f23] lg:bg-green-100 text-green-400 lg:text-green-700 lg:hover:bg-green-200"
                    : "bg-gradient-to-r from-rose-500 to-pink-600 lg:bg-none lg:bg-rose-600 lg:hover:bg-rose-700 text-white shadow-rose-500/20 lg:shadow-rose-200"
                    }`}
            >
                {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : status.hasSentInterest ? <Check className="w-4 h-4 mr-1" /> : <Heart className="w-4 h-4 mr-1 fill-current" />}
                {status.hasSentInterest ? "Interested" : "Connect"}
            </Button>

            {/* Shortlist */}
            <Button
                variant="outline"
                size="icon"
                onClick={handleShortlist}
                className={`rounded-full transition-colors ${status.isShortlisted ? 'text-blue-500 lg:text-purple-600 bg-blue-500/10 lg:bg-purple-50 lg:border-purple-200' : 'text-slate-400 lg:text-slate-400 border-[#333] lg:border-slate-200 hover:bg-[#1a1a1a] lg:hover:border-purple-300 lg:hover:bg-purple-50 lg:hover:text-purple-600 bg-transparent'}`}
            >
                <Star className={`w-4 h-4 ${status.isShortlisted ? "fill-current" : ""}`} />
            </Button>

            {/* Share (Mock) */}
            <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.success("Profile link copied!");
                }}
                className="rounded-full transition-colors text-slate-400 border-[#333] lg:border-slate-200 hover:bg-[#1a1a1a] lg:hover:border-blue-300 lg:hover:bg-blue-50 lg:hover:text-blue-600 bg-transparent"
            >
                <Share2 className="w-4 h-4" />
            </Button>
        </div>
    );
}

function ProfileMenu({ user }: { user: any }) {
    const handleAction = async (action: 'ignore' | 'block' | 'report') => {
        try {
            if (action === 'block') {
                await blockUser(user.id);
                toast.success("User blocked");
            } else if (action === 'ignore') {
                await ignoreUser(user.id);
                toast.success("User ignored");
            } else if (action === 'report') {
                await reportUser(user.id, "User reported via card");
                toast.success("User reported");
            }
        } catch (e) {
            toast.error("Action failed");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-black/20 rounded-full data-[state=open]:bg-black/20">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleAction('ignore')} className="text-slate-600 cursor-pointer">
                    <EyeOff className="w-4 h-4 mr-2" /> Ignore Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('block')} className="text-amber-600 cursor-pointer focus:text-amber-700 focus:bg-amber-50">
                    <Ban className="w-4 h-4 mr-2" /> Block Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('report')} className="text-rose-600 cursor-pointer focus:text-rose-700 focus:bg-rose-50">
                    <Flag className="w-4 h-4 mr-2" /> Report Profile
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
