"use client";

import { updateProfileImage } from "@/lib/photo-actions";
import { Button } from "@/components/ui/button";
import { useActionState, useState, startTransition, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Image as ImageIcon, Eye, Edit } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvasUtils";

interface ProfilePictureEditorProps {
    currentImage?: string | null;
    galleryImages?: string[];
    name?: string | null;
    isOwnProfile?: boolean;
}

export function ProfilePictureEditor({ currentImage, galleryImages = [], name, isOwnProfile }: ProfilePictureEditorProps) {
    const [profileState, profileAction, isProfilePending] = useActionState(updateProfileImage, undefined);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Track previous pending state to detect completion
    const prevPending = useRef(isProfilePending);

    // Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const initials = name?.split(" ").map((n) => n[0]).join("") || "??";

    // Close dialog only on successful update (transition from pending -> success)
    useEffect(() => {
        if (prevPending.current && !isProfilePending && profileState?.success && isEditOpen) {
            setIsEditOpen(false);
            // Reset crop state
            setImageSrc(null);
            setIsCropping(false);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
            setUploadError(null);
        }
        prevPending.current = isProfilePending;
    }, [isProfilePending, profileState, isEditOpen]);

    // Cleanup when edit dialog closes manually
    useEffect(() => {
        if (!isEditOpen) {
            setImageSrc(null);
            setIsCropping(false);
            setUploadError(null);
        }
    }, [isEditOpen]);

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileSelect = (url: string) => {
        setImageSrc(url);
        setIsCropping(true);
        setUploadError(null);
    };

    const showCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);
        setUploadError(null);
        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedBlob) return;

            // Upload the cropped blob
            const formData = new FormData();
            formData.append("file", croppedBlob, "profile-cropped.jpg");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
                throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Now save the profile image URL
            startTransition(async () => {
                const profileFormData = new FormData();
                profileFormData.append("url", data.url);
                await profileAction(profileFormData);
            });

        } catch (e: any) {
            console.error(e);
            setUploadError(e.message || "Something went wrong during upload");
        } finally {
            setUploading(false);
        }
    };

    if (!isOwnProfile) {
        return (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <Avatar className="w-32 h-32 md:w-32 md:h-32 border-4 border-white shadow-lg rounded-full">
                            <AvatarImage src={currentImage || "/placeholder-user.jpg"} alt={name || "User"} className="object-cover" />
                            <AvatarFallback className="text-4xl font-bold text-purple-600 bg-purple-50">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] max-h-[80vh] flex items-center justify-center p-0 bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Profile Picture</DialogTitle>
                        <DialogDescription>View profile picture</DialogDescription>
                    </DialogHeader>
                    <img
                        src={currentImage || "/placeholder-user.jpg"}
                        alt={name || "User"}
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                    <div className="relative group cursor-pointer">
                        <Avatar className="w-32 h-32 md:w-32 md:h-32 border-4 border-white shadow-lg rounded-full">
                            <AvatarImage src={currentImage || "/placeholder-user.jpg"} alt={name || "User"} className="object-cover" />
                            <AvatarFallback className="text-4xl font-bold text-purple-600 bg-purple-50">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    {currentImage && (
                        <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Photo
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        {currentImage ? "Change Photo" : "Upload Photo"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* View Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-[80vw] max-h-[80vh] flex items-center justify-center p-0 bg-transparent border-none shadow-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Profile Picture</DialogTitle>
                        <DialogDescription>View current profile picture</DialogDescription>
                    </DialogHeader>
                    <img
                        src={currentImage || "/placeholder-user.jpg"}
                        alt={name || "User"}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                        <DialogDescription>
                            {isCropping ? "Crop your image" : "Upload a new photo or choose one from your gallery."}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="upload" className="w-full h-full flex flex-col" value={isCropping ? "upload" : undefined}>
                        <TabsList className={`grid w-full grid-cols-2 ${isCropping ? 'hidden' : ''}`}>
                            <TabsTrigger value="upload">Upload New</TabsTrigger>
                            <TabsTrigger value="gallery">From Gallery</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="flex-1 flex flex-col py-4 min-h-0 data-[state=inactive]:hidden">
                            {!isCropping ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Upload Image</label>
                                        <FileUpload onUploadComplete={handleFileSelect} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col relative min-h-[300px]">
                                    <div className="relative flex-1 bg-black rounded-lg overflow-hidden border mb-4">
                                        <Cropper
                                            image={imageSrc || ""}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 px-2">
                                            <span className="text-xs text-muted-foreground w-12">Zoom</span>
                                            <input
                                                type="range"
                                                value={zoom}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                aria-labelledby="Zoom"
                                                onChange={(e) => setZoom(Number(e.target.value))}
                                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" onClick={() => setIsCropping(false)} className="flex-1">
                                                Cancel
                                            </Button>
                                            <Button onClick={showCroppedImage} disabled={uploading} className="flex-1">
                                                {uploading ? "Saving..." : "Save Profile Picture"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(isProfilePending || uploading) && <p className="text-sm text-center text-muted-foreground mt-2">Processing...</p>}
                            {profileState?.message && !profileState.success && (
                                <p className="text-sm text-center text-red-500 mt-2">{profileState.message}</p>
                            )}
                            {uploadError && (
                                <p className="text-sm text-center text-red-500 mt-2">{uploadError}</p>
                            )}
                        </TabsContent>

                        <TabsContent value="gallery" className="py-4 h-full overflow-y-auto data-[state=inactive]:hidden">
                            {galleryImages.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4">
                                    {galleryImages.map((img, idx) => (
                                        <form key={idx} action={async (formData) => {
                                            await profileAction(formData);
                                        }}>
                                            <input type="hidden" name="url" value={img} />
                                            <button
                                                type="submit"
                                                className={`relative aspect-square w-full rounded-lg overflow-hidden border-2 hover:border-primary transition-all ${currentImage === img ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}
                                                disabled={isProfilePending}
                                            >
                                                <img src={img} alt="Gallery option" className="w-full h-full object-cover" />
                                                {isProfilePending && (
                                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                                        <span className="loading-spinner" />
                                                    </div>
                                                )}
                                            </button>
                                        </form>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/30 rounded-lg border-2 border-dashed">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-sm">Gallery is empty</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
