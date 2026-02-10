"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface DocumentViewerProps {
    documentUrls: string[];
}

export function DocumentViewer({ documentUrls }: DocumentViewerProps) {
    const [selectedDoc, setSelectedDoc] = useState<{ url: string; index: number } | null>(null);

    if (documentUrls.length === 0) {
        return <div className="text-white/50 italic">No documents attached</div>;
    }

    const isPDF = (url: string) => url.toLowerCase().endsWith('.pdf');

    return (
        <>
            <div className="w-full space-y-8">
                {documentUrls.map((url, index) => {
                    const isFilePDF = isPDF(url);

                    return (
                        <div key={index} className="relative group">
                            <div className="bg-white p-2 rounded shadow-lg mx-auto max-w-4xl">
                                {isFilePDF ? (
                                    // PDF Preview
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                            <span className="text-sm font-medium text-gray-700">
                                                📄 Document {index + 1}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedDoc({ url, index })}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                >
                                                    View Full Screen
                                                </button>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                >
                                                    Open in New Tab →
                                                </a>
                                            </div>
                                        </div>
                                        <iframe
                                            src={url}
                                            className="w-full h-[400px] border rounded cursor-pointer"
                                            title={`Document ${index + 1}`}
                                            onClick={() => setSelectedDoc({ url, index })}
                                        />
                                    </div>
                                ) : (
                                    // Image Preview
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                            <span className="text-sm font-medium text-gray-700">
                                                🖼️ Image {index + 1}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedDoc({ url, index })}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                >
                                                    View Full Screen
                                                </button>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                >
                                                    Open Full Size →
                                                </a>
                                            </div>
                                        </div>
                                        <img
                                            src={url}
                                            alt={`Document ${index + 1}`}
                                            className="w-full h-auto rounded border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setSelectedDoc({ url, index })}
                                        />
                                    </div>
                                )}
                                <div className="mt-2 text-xs text-center text-gray-500 break-all px-2">
                                    {url}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full Screen Modal */}
            {selectedDoc && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedDoc(null)}
                >
                    <button
                        onClick={() => setSelectedDoc(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <div className="max-w-7xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {isPDF(selectedDoc.url) ? (
                            <iframe
                                src={selectedDoc.url}
                                className="w-full h-full bg-white rounded"
                                title={`Document ${selectedDoc.index + 1} - Full Screen`}
                            />
                        ) : (
                            <img
                                src={selectedDoc.url}
                                alt={`Document ${selectedDoc.index + 1}`}
                                className="max-w-full max-h-full object-contain rounded"
                            />
                        )}
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                        Document {selectedDoc.index + 1} of {documentUrls.length}
                    </div>
                </div>
            )}
        </>
    );
}
