"use client";

import ProfileAvatarEditor from "@/components/profile/profile-avatar-editor";
import { GalleryEditor, GalleryPhoto } from "@/components/profile/gallery-editor";
import { FamilyPhotosEditor } from "@/components/profile/family-photos-editor";

interface PhotoManagerProps {
    currentProfileImage?: string | null;
    galleryImages?: GalleryPhoto[]; // Accepts UserPhoto[] as it matches structure
    familyImages?: string[];
    userName?: string;
}

export default function PhotoManager({ currentProfileImage, galleryImages = [], familyImages = [], userName = "User" }: PhotoManagerProps) {
    const initials = userName.slice(0, 2).toUpperCase();

    // Ensure we pass valid GalleryPhoto objects
    // If backend returns extra fields, that's fine.
    // If galleryImages is undefined, default to []
    const safeGalleryImages = galleryImages || [];

    return (
        <div className="space-y-10">
            {/* Profile Picture Section */}
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                    <p className="text-sm text-gray-500">Update your main profile photo. Click the image to edit.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
                    <ProfileAvatarEditor
                        initialImage={currentProfileImage}
                        initials={initials}
                        galleryImages={safeGalleryImages}
                    />

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                        <h4 className="font-medium text-gray-900">Visibility</h4>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Your profile photo is visible to all members. Make sure it follows our community guidelines.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900">Gallery Photos</h3>
                    <p className="text-sm text-gray-500">
                        Upload multiple photos to showcase your lifestyle and interests.
                    </p>
                </div>

                <GalleryEditor galleryImages={safeGalleryImages} />
            </div>

            {/* Family Photos Section */}
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="text-lg font-medium text-gray-900">Family Photos</h3>
                    <p className="text-sm text-gray-500">
                        Upload up to 3 photos of your family.
                    </p>
                </div>

                <FamilyPhotosEditor familyImages={familyImages} />
            </div>
        </div>
    );
}

