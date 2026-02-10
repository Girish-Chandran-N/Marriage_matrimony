"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Heart, MessageCircle, Star, Sparkles, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sendInterest, toggleShortlist, getInteractionStatus } from "@/lib/interaction-actions";
import { toast } from "sonner";

interface MatchCardProps {
    user: any;
    score: number;
}

export function MatchCard({ user, score }: MatchCardProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = [
        user.profileImage,
        ...(user.photos?.map(p => p.url) || [])
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

    return (
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col">

            {/* Image Section */}
            <div
                className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer"
                onClick={() => hasImages && setIsGalleryOpen(true)}
            >
                {/* Match Score Badge - Top Left */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-green-100 animate-in fade-in zoom-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {score}% Match
                        </span>
                    </div>
                </div>

                {displayImage ? (
                    <>
                        <img
                            src={displayImage}
                            alt={user.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl font-bold text-indigo-300 shadow-inner">
                            {user.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-400">No Photo</span>
                    </div>
                )}

                {/* Floating Actions on Image Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    {hasImages && (
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-medium transform scale-90 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
                            View Photos
                        </span>
                    )}
                </div>

                {/* Name & Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-2xl font-bold leading-tight mb-1 drop-shadow-md">{user.name}</h2>
                    <p className="text-sm text-white/90 font-medium flex items-center gap-2 drop-shadow-sm">
                        <span>{calculateAge(user.personalDetails?.dateOfBirth)} yrs</span>
                        <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                        <span>{user.personalDetails?.city || "Unknown City"}</span>
                    </p>
                </div>
            </div>

            {/* Details Card Content */}
            <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/50">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Job</span>
                        <p className="text-sm font-semibold text-slate-700 truncate" title={user.careerProfile?.jobTitle}>
                            {user.careerProfile?.jobTitle || "Not specified"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Education</span>
                        <p className="text-sm font-semibold text-slate-700 truncate" title={user.educations?.[0]?.qualification}>
                            {user.educations?.[0]?.qualification || "Not specified"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Religion</span>
                        <p className="text-sm font-semibold text-slate-700 truncate">
                            {user.personalDetails?.religion || "Not specified"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Height</span>
                        <p className="text-sm font-semibold text-slate-700 truncate">
                            {user.personalDetails?.height ? `${user.personalDetails.height} cm` : "N/A"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                    <MatchActions user={user} />
                </div>
            </div>

            {/* Gallery Dialog */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-5xl w-full h-[85vh] p-0 bg-black/95 border-none overflow-hidden focus:outline-none">
                    <DialogTitle className="sr-only">Profile Gallery</DialogTitle>
                    <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white/20">
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-white font-medium text-lg shadow-black drop-shadow-lg">{user.name}</h3>
                            <p className="text-white/60 text-xs">{currentImageIndex + 1} of {allImages.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsGalleryOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

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

                    <div className="flex-1 w-full h-full flex items-center justify-center relative">
                        {allImages.length > 0 ? (
                            <img
                                src={allImages[currentImageIndex]}
                                alt="Gallery"
                                className="max-h-full max-w-full object-contain animate-in fade-in zoom-in-95 duration-300"
                            />
                        ) : (
                            <div className="text-white/50 flex flex-col items-center">
                                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                                <p>No photos available</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function MatchActions({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
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
            await sendInterest(user.id);
            setStatus(prev => ({ ...prev, hasSentInterest: true, interestStatus: "PENDING" }));
            toast.success("Interest sent successfully!");
        } catch (err) {
            toast.error("Failed to send interest");
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newState = !status.isShortlisted;
        setStatus(prev => ({ ...prev, isShortlisted: newState }));

        try {
            await toggleShortlist(user.id);
            toast.success(newState ? "Added to shortlist" : "Removed from shortlist");
        } catch (err) {
            setStatus(prev => ({ ...prev, isShortlisted: !newState })); // Revert
            toast.error("Failed to update shortlist");
        }
    };

    return (
        <>
            <Button
                onClick={handleConnect}
                disabled={loading || status.hasSentInterest}
                className={`w-full text-white shadow-lg border-0 transition-all hover:-translate-y-0.5 ${status.hasSentInterest
                    ? "bg-green-600 hover:bg-green-700 from-green-600 to-green-700"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-200"
                    }`}
                size="sm"
            >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
                    status.hasSentInterest ? <Check className="w-4 h-4 mr-2" /> :
                        <Heart className="w-4 h-4 mr-2" fill={status.hasSentInterest ? "currentColor" : "none"} />}
                {status.hasSentInterest ? "Interested" : "Connect"}
            </Button>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShortlist}
                    className={`border-slate-200 hover:bg-pink-50 hover:text-pink-600 transition-all ${status.isShortlisted ? "bg-pink-50 text-pink-600 border-pink-200" : "text-slate-400"}`}
                >
                    <Star className={`w-4 h-4 ${status.isShortlisted ? "fill-current" : ""}`} />
                </Button>
                <Link href={`/users/${user.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-all" size="sm">
                        View
                    </Button>
                </Link>
            </div>
        </>
    );
}
