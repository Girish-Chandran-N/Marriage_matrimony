"use client";

import { addGalleryImages, removeGalleryImage } from "@/lib/photo-actions";
import { useTransition, useState, useCallback, useRef } from "react";
import { X, Image as ImageIcon, UploadCloud, Crop as CropIcon, Trash2, Check, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/canvasUtils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GalleryEditorProps {
    galleryImages: string[];
}

interface StagedFile {
    id: string;
    file: File;
    preview: string; // Original object URL
    croppedBlob?: Blob | null; // Final blob to upload
    croppedPreview?: string; // Preview of cropped version
}

export function GalleryEditor({ galleryImages = [] }: GalleryEditorProps) {
    const [isPending, startTransition] = useTransition();

    // Staging State
    const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Cropping State
    const [cropFileId, setCropFileId] = useState<string | null>(null);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState<number | undefined>(1); // Default 1:1
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Drop handler
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview: URL.createObjectURL(file),
        }));
        setStagedFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true
    });

    const removeStagedFile = (id: string) => {
        setStagedFiles(prev => prev.filter(f => f.id !== id));
    };

    // Cropping Handlers
    const openCrop = (fileId: string, src: string) => {
        setCropFileId(fileId);
        setCropImageSrc(src);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspect(1);
    };

    const handleCropComplete = async () => {
        if (!cropFileId || !cropImageSrc || !croppedAreaPixels) return;

        try {
            const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
            if (!croppedBlob) return;

            const croppedUrl = URL.createObjectURL(croppedBlob);

            setStagedFiles(prev => prev.map(f =>
                f.id === cropFileId
                    ? { ...f, croppedBlob, croppedPreview: croppedUrl }
                    : f
            ));

            // Close modal
            setCropFileId(null);
            setCropImageSrc(null);
        } catch (e) {
            console.error(e);
        }
    };

    // Batch Upload
    const handleBatchUpload = async () => {
        if (stagedFiles.length === 0) return;
        setIsUploading(true);

        try {
            const uploadedUrls: string[] = [];

            // 1. Upload all files to Cloud/Storage first
            for (const item of stagedFiles) {
                const formData = new FormData();
                if (item.croppedBlob) {
                    formData.append("file", item.croppedBlob, item.file.name);
                } else {
                    formData.append("file", item.file);
                }

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    console.error("Upload failed for file:", item.file.name, response.status, response.statusText);
                    continue;
                }

                const data = await response.json();
                console.log("Upload success:", data);
                if (data.url) {
                    uploadedUrls.push(data.url);
                }
            }

            if (uploadedUrls.length === 0) {
                // All uploads failed
                setIsUploading(false);
                return;
            }

            // 2. Save all URLs to DB in one go
            const galleryForm = new FormData();
            uploadedUrls.forEach(url => galleryForm.append("urls", url));

            console.log("Submitting URLs to server action:", uploadedUrls);

            startTransition(async () => {
                const result = await addGalleryImages(null, galleryForm);
                console.log("Server action result:", result);
                if (result?.success) {
                    setStagedFiles([]); // Clear gathered files
                } else {
                    alert("Failed to save to gallery: " + result?.message);
                }
                setIsUploading(false);
            });

        } catch (e) {
            console.error("Batch upload failed", e);
            setIsUploading(false);
        }
    };

    const handleRemoveGalleryImage = async (url: string) => {
        if (confirm("Are you sure you want to delete this image from your gallery?")) {
            startTransition(async () => {
                await removeGalleryImage(url);
            });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Photo Gallery
                </h3>
                <span className="text-sm text-gray-500">{galleryImages.length} Saved</span>
            </div>

            <div className="space-y-8">
                {/* Upload / Staging Area */}
                <div className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50",
                            isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                        )}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud className={cn("w-10 h-10 mb-3", isDragActive ? "text-purple-600" : "text-gray-400")} />
                        <p className="text-sm font-medium text-gray-700">
                            {isDragActive ? "Drop files here" : "Click or drag to upload multiple photos"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                    </div>

                    {/* Staging Grid */}
                    {stagedFiles.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-700">Drafts ({stagedFiles.length})</h4>
                                <Button
                                    size="sm"
                                    onClick={handleBatchUpload}
                                    disabled={isUploading}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>Save All Photos</>
                                    )}
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {stagedFiles.map((item) => (
                                    <div key={item.id} className="relative group aspect-square bg-white rounded-lg shadow-sm overflow-hidden border">
                                        <img
                                            src={item.croppedPreview || item.preview}
                                            className="w-full h-full object-cover"
                                            alt="Preview"
                                        />

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openCrop(item.id, item.preview)}
                                                className="p-2 bg-white text-gray-900 rounded-full hover:bg-gray-100"
                                                title="Crop"
                                            >
                                                <CropIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeStagedFile(item.id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                title="Remove"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {item.croppedPreview && (
                                            <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Existing Gallery Grid */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 block">Your Gallery</h4>
                    {galleryImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />

                                    <button
                                        onClick={() => handleRemoveGalleryImage(img)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-700"
                                        title="Remove Image"
                                        disabled={isPending}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>

                                    {isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                                            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border border-dashed rounded-lg bg-gray-50/30">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No photos in gallery yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cropping Modal */}
            <Dialog open={!!cropFileId} onOpenChange={(open) => !open && setCropFileId(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                        <DialogDescription>Adjust your image selection.</DialogDescription>
                    </DialogHeader>

                    <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden my-4">
                        {cropImageSrc && (
                            <Cropper
                                image={cropImageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 px-2">
                            <span className="text-sm font-medium w-12 text-gray-500">Zoom</span>
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

                        <div className="flex items-center gap-2 justify-center flex-wrap">
                            <Button
                                type="button"
                                variant={aspect === 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAspect(1)}
                            >
                                Square (1:1)
                            </Button>
                            <Button
                                type="button"
                                variant={aspect === 4 / 5 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAspect(4 / 5)}
                            >
                                Portrait (4:5)
                            </Button>
                            <Button
                                type="button"
                                variant={aspect === 16 / 9 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAspect(16 / 9)}
                            >
                                Landscape (16:9)
                            </Button>
                            <Button
                                type="button"
                                variant={aspect === undefined ? "default" : "outline"}
                                size="sm"
                                onClick={() => setAspect(undefined)}
                            >
                                Free
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCropFileId(null)}>Cancel</Button>
                        <Button onClick={handleCropComplete}>Apply Crop</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
