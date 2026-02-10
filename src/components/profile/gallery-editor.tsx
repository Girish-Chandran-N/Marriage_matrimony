"use client";

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { addGalleryImages, removeGalleryImage, reorderGalleryImages, setProfileImageFromGallery } from "@/lib/photo-actions";
import { User, Trash2, Loader2, Image as ImageIcon, UploadCloud, Crop as CropIcon, X, Check } from "lucide-react";
import { useTransition, useState, useCallback } from "react";
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

// Matches UserPhoto model partially
export interface GalleryPhoto {
    id: string;
    url: string;
    isProfile?: boolean;
    order?: number;
}

interface GalleryEditorProps {
    galleryImages: GalleryPhoto[];
}

interface StagedFile {
    id: string;
    file: File;
    preview: string; // Original object URL
    croppedBlob?: Blob | null; // Final blob to upload
    croppedPreview?: string; // Preview of cropped version
}

interface SortableImageProps {
    photo: GalleryPhoto;
    onRemove: (id: string) => void;
    onSetProfile: (id: string) => void;
    isPending: boolean;
}

function SortableImage({ photo, onRemove, onSetProfile, isPending }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: photo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border shadow-sm touch-none"
        >
            <img src={photo.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />

            {photo.isProfile && (
                <div className="absolute top-2 left-2 p-1 bg-green-500 rounded-full z-10">
                    <User className="w-3 h-3 text-white" />
                </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-between p-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag
                        onRemove(photo.id);
                    }}
                    className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm"
                    title="Remove Image"
                    disabled={isPending}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Trash2 className="w-3 h-3" />
                </button>

                {!photo.isProfile && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSetProfile(photo.id);
                        }}
                        className="p-1.5 bg-white/90 text-purple-700 rounded-full hover:bg-white shadow-sm w-full flex items-center justify-center gap-1 text-[10px] font-bold"
                        title="Make Profile Photo"
                        disabled={isPending}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <User className="w-3 h-3" />
                        Set Profile
                    </button>
                )}
            </div>

            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                </div>
            )}
        </div>
    );
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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = galleryImages.findIndex(img => img.id === active.id);
            const newIndex = galleryImages.findIndex(img => img.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(galleryImages, oldIndex, newIndex);
                // Extract new order IDs
                const newOrderIds = newOrder.map(img => img.id);

                startTransition(async () => {
                    await reorderGalleryImages(newOrderIds);
                });
            }
        }
    };

    const handleSetProfileImage = async (id: string) => {
        if (confirm("Set this photo as your main profile picture?")) {
            startTransition(async () => {
                await setProfileImageFromGallery(id);
            });
        }
    };

    const handleRemoveGalleryImage = async (id: string) => {
        if (confirm("Are you sure you want to remove this photo?")) {
            startTransition(async () => {
                await removeGalleryImage(id);
            });
        }
    };

    // Batch Upload - Real Implementation
    const handleBatchUpload = async () => {
        if (stagedFiles.length === 0) return;

        const currentCount = galleryImages.length;
        const newCount = stagedFiles.length;

        if (currentCount + newCount > 10) {
            alert(`You can only have 10 gallery photos. You currently have ${currentCount}. Please remove some or select fewer photos.`);
            return;
        }

        setIsUploading(true);

        try {
            const uploadedUrls: string[] = [];

            // Parallel upload
            const uploadPromises = stagedFiles.map(async (file) => {
                const formData = new FormData();
                // Use cropped blob if available, otherwise original file
                if (file.croppedBlob) {
                    formData.append("file", file.croppedBlob, "gallery-photo.jpg");
                } else {
                    formData.append("file", file.file);
                }

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                });

                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                return data.url;
            });

            const results = await Promise.allSettled(uploadPromises);

            // Collect successful uploads
            results.forEach(result => {
                if (result.status === "fulfilled") {
                    uploadedUrls.push(result.value);
                } else {
                    console.error("Failed to upload a file", result.reason);
                }
            });

            if (uploadedUrls.length > 0) {
                const formData = new FormData();
                uploadedUrls.forEach(url => formData.append("urls", url));

                const res = await addGalleryImages(undefined, formData);
                if (res.success) {
                    setStagedFiles([]);
                    // Optional: Toast success
                } else {
                    alert(res.message);
                }
            } else {
                alert("Failed to upload any images.");
            }

        } catch (error) {
            console.error("Batch upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Photo Gallery
                </h3>
                <span className={`text-sm font-medium ${galleryImages.length >= 10 ? 'text-red-500' : 'text-gray-500'}`}>
                    {galleryImages.length} / 10 Photos
                </span>
            </div>

            <div className="space-y-8">
                {/* Upload / Staging Area */}
                {galleryImages.length < 10 ? (
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
                                {isDragActive ? "Drop files here" : "Click or drag to upload"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Max 10 photos total</p>
                        </div>

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
                ) : (
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <p className="text-yellow-800 font-medium">Gallery Limit Reached</p>
                        <p className="text-yellow-600 text-sm mt-1">You have reached the maximum of 10 photos. Please remove some to upload new ones.</p>
                    </div>
                )}


                {/* Existing Gallery Grid - Sortable */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 block">Your Gallery (Drag to Reorder)</h4>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={galleryImages.map(img => img.id)}
                            strategy={rectSortingStrategy}
                        >
                            {galleryImages.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryImages.map((photo) => (
                                        <SortableImage
                                            key={photo.id}
                                            photo={photo}
                                            onRemove={handleRemoveGalleryImage}
                                            onSetProfile={handleSetProfileImage}
                                            isPending={isPending}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 border border-dashed rounded-lg bg-gray-50/30">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No photos in gallery yet</p>
                                </div>
                            )}
                        </SortableContext>
                    </DndContext>
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
                            <Button type="button" variant={aspect === 1 ? "default" : "outline"} size="sm" onClick={() => setAspect(1)}>Square</Button>
                            <Button type="button" variant={aspect === 4 / 5 ? "default" : "outline"} size="sm" onClick={() => setAspect(4 / 5)}>Portrait</Button>
                            <Button type="button" variant={aspect === 16 / 9 ? "default" : "outline"} size="sm" onClick={() => setAspect(16 / 9)}>Landscape</Button>
                            <Button type="button" variant={aspect === undefined ? "default" : "outline"} size="sm" onClick={() => setAspect(undefined)}>Free</Button>
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
