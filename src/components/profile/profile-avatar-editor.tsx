"use client";

import { useState, useCallback, useTransition, useRef } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, Loader2, ZoomIn, Check } from "lucide-react";
import getCroppedImg from "@/lib/canvasUtils";
import { updateProfileImage } from "@/lib/photo-actions";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Defined in GalleryEditor too, better to share but duplication is fine for now
interface GalleryPhoto {
    id: string;
    url: string;
    isProfile?: boolean;
}

interface ProfileAvatarEditorProps {
    initialImage?: string | null;
    initials: string;
    galleryImages?: GalleryPhoto[];
}

export default function ProfileAvatarEditor({ initialImage, initials, galleryImages = [] }: ProfileAvatarEditorProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState<number | undefined>(1); // Default 1:1
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            try {
                const imageDataUrl = await readFile(file);
                setImageSrc(imageDataUrl as string);
            } catch (error) {
                console.error("Error reading file:", error);
                alert("Failed to read image file.");
            }
        }
    };

    const handleGallerySelect = async (url: string) => {
        // For gallery images, we can use the URL directly, but we need to ensure CORS works for canvas
        setImageSrc(url);
    };

    const readFile = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), false);
            reader.addEventListener("error", (error) => reject(error), false);
            reader.readAsDataURL(file);
        });
    };

    const handleSave = () => {
        if (!imageSrc || !croppedAreaPixels) return;

        startTransition(async () => {
            try {
                // NOTE: getCroppedImg handles crossOrigin="anonymous"
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (!croppedBlob) throw new Error("Failed to crop image");

                const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });

                // Upload to get URL
                const uploadFormData = new FormData();
                uploadFormData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    const text = await uploadRes.text();
                    console.error("Upload failed response:", text);
                    throw new Error("Upload failed");
                }

                const { url } = await uploadRes.json();

                // Update Profile using Profile Actions
                const profileFormData = new FormData();
                profileFormData.append("url", url);
                const result = await updateProfileImage({}, profileFormData);

                if (result?.message && !result.success) {
                    throw new Error(result.message);
                }

                setIsDialogOpen(false);
                setImageSrc(null);
                router.refresh();
            } catch (e: any) {
                console.error("Save error:", e);
                alert(`Failed to update profile picture: ${e.message || "Unknown error"}`);
            }
        });
    };

    const handleRemove = () => {
        if (confirm("Are you sure you want to remove your profile photo?")) {
            startTransition(async () => {
                try {
                    const formData = new FormData();
                    formData.append("url", "");
                    await updateProfileImage({}, formData);
                    setIsDialogOpen(false);
                    router.refresh();
                } catch (e) {
                    console.error("Remove error:", e);
                    alert("Failed to remove profile picture");
                }
            });
        }
    };

    const resetEditor = () => {
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetEditor();
        }}>
            <DialogTrigger className="focus:outline-none">
                <div className="relative group cursor-pointer h-40 w-40 rounded-full border-4 border-white shadow-md bg-white p-1 overflow-hidden">
                    <Avatar className="h-full w-full rounded-full transition-opacity group-hover:opacity-90">
                        <AvatarImage src={initialImage || undefined} className="object-cover" />
                        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile Picture</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {imageSrc ? (
                        /* Crop View */
                        <div className="space-y-4">
                            <div className="relative w-full h-[300px] bg-black rounded-lg overflow-hidden">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={aspect} // undefined means free crop
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <ZoomIn className="h-4 w-4 text-gray-500" />
                                <Slider
                                    value={[zoom]}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onValueChange={(val) => setZoom(val[0])}
                                    className="flex-1"
                                />
                            </div>

                            <div className="flex items-center gap-2 justify-center flex-wrap">
                                <Button type="button" variant={aspect === 1 ? "default" : "outline"} size="sm" onClick={() => setAspect(1)}>Square</Button>
                                <Button type="button" variant={aspect === 4 / 5 ? "default" : "outline"} size="sm" onClick={() => setAspect(4 / 5)}>Portrait</Button>
                                <Button type="button" variant={aspect === 16 / 9 ? "default" : "outline"} size="sm" onClick={() => setAspect(16 / 9)}>Landscape</Button>
                                <Button type="button" variant={aspect === undefined ? "default" : "outline"} size="sm" onClick={() => setAspect(undefined)}>Free</Button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={resetEditor} disabled={isPending}>Cancel</Button>
                                <Button onClick={handleSave} disabled={isPending}>
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Selection View - Tabs for Upload vs Gallery */
                        <Tabs defaultValue="upload" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="upload">Upload New</TabsTrigger>
                                <TabsTrigger value="gallery">Select from Gallery</TabsTrigger>
                            </TabsList>

                            <TabsContent value="upload" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 cursor-pointer transition-all">
                                        <Upload className="h-8 w-8 text-primary" />
                                        <span className="text-sm font-medium text-gray-700">Upload New</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={onFileChange}
                                            ref={fileInputRef}
                                        />
                                    </label>
                                    {initialImage && (
                                        <button
                                            onClick={handleRemove}
                                            disabled={isPending}
                                            className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-red-200 rounded-xl hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all group"
                                        >
                                            <X className="h-8 w-8 text-red-400 group-hover:text-red-500" />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Remove Current</span>
                                        </button>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="gallery">
                                {galleryImages.length > 0 ? (
                                    <div className="h-64 w-full rounded-md border p-4 overflow-y-auto">
                                        <div className="grid grid-cols-3 gap-2">
                                            {galleryImages.map((img) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => handleGallerySelect(img.url)}
                                                    className="relative aspect-square rounded-md overflow-hidden border border-transparent hover:border-primary hover:ring-2 hover:ring-primary hover:ring-offset-1 transition-all"
                                                >
                                                    <img src={img.url} alt={`Gallery ${img.id}`} className="object-cover w-full h-full" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                                        <p className="text-sm">No photos in gallery</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
