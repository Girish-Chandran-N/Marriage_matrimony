"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface DocumentUploadFormProps {
    label: string;
    onUploadComplete: (url: string) => void;
}

export default function DocumentUploadForm({ label, onUploadComplete }: DocumentUploadFormProps) {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const handleUpload = (url: string) => {
        setUploadedUrl(url);
        onUploadComplete(url);
    };

    return (
        <div className="border p-4 rounded-md bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>

            {!uploadedUrl ? (
                <div className="bg-white rounded-md">
                    <FileUpload
                        onUploadComplete={handleUpload}
                    />
                    <p className="text-xs text-gray-400 mt-2 px-1">
                        Supported: JPG, PNG, PDF (Max 5MB)
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                            <span className="text-green-800 text-sm font-medium block">Document Uploaded</span>
                            <span className="text-green-600 text-xs">Ready for submission</span>
                        </div>
                    </div>
                    <a
                        href={uploadedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 text-xs font-medium hover:underline px-3 py-1 bg-white rounded border"
                    >
                        View
                    </a>
                </div>
            )}
        </div>
    );
}
