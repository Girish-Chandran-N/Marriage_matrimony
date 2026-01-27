"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    className?: string;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
}

export function FileUpload({
    onUploadComplete,
    className,
    accept = { 'image/*': [] }, // Default to images
    maxSize = 5 * 1024 * 1024 // Default 5MB
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        // Create optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            if (data.url) {
                onUploadComplete(data.url);
            } else {
                throw new Error("No URL returned");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to upload file. Please try again.");
            setPreview(null); // Clear preview on error
        } finally {
            setIsUploading(false);
        }
    }, [onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles: 1,
    });

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setError(null);
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative min-h-[150px]",
                    isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                    error && "border-red-500 bg-red-50",
                    preview && "border-solid border-gray-200 bg-gray-50"
                )}
            >
                <input {...getInputProps()} />

                {/* Loading / Uploading State */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-sm font-medium text-primary">Uploading...</p>
                        </div>
                    </div>
                )}

                {/* Preview State */}
                {preview ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* If image, show preview, else show file icon */}
                        {Object.keys(accept).some(key => key.startsWith('image/')) ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-[200px] object-contain rounded-md"
                            />
                        ) : (
                            <div className="flex flex-col items-center p-4">
                                <FileIcon className="w-10 h-10 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">File Selected</span>
                            </div>
                        )}

                        <button
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                            title="Remove file"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center text-center">
                        <UploadCloud className={cn("w-10 h-10 mb-3", error ? "text-red-400" : "text-gray-400")} />
                        {error ? (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-red-600">{error}</p>
                                <p className="text-xs text-red-500">Click to try again</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">
                                    {isDragActive ? "Drop the file here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Max size {(maxSize / (1024 * 1024)).toFixed(0)}MB
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
