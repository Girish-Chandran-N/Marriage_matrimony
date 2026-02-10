"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- Validation Schemas ---
const PersonalDetailsSchema = z.object({
    // Basic
    dateOfBirth: z.string().refine((date) => {
        const d = new Date(date);
        return d.toString() !== 'Invalid Date' && (new Date().getFullYear() - d.getFullYear()) >= 18;
    }, { message: "Must be at least 18 years old" }).transform((str) => new Date(str)),
    gender: z.string().min(1),
    maritalStatus: z.string().min(1),
    height: z.coerce.number().min(50),
    weight: z.coerce.number().optional(),
    bloodGroup: z.string().optional(),
    bodyType: z.string().optional(),
    complexion: z.string().optional(),
    physicalStatus: z.string().optional(),
    motherTongue: z.string().min(1),
    knownLanguages: z.string().optional(),

    // Bio
    bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),
    about: z.string().max(5000, "About section cannot exceed 5000 characters").optional(),

    // Location
    nativeCountry: z.string().optional(),
    nativeState: z.string().optional(),
    nativeDistrict: z.string().optional(),
    nativeCity: z.string().optional(),
    nationality: z.string().optional(),

    residingCountry: z.string().min(1, "Residing Country is required"),
    residingState: z.string().optional(),
    residingDistrict: z.string().optional(),
    residingCity: z.string().optional(),

    leaveDateFrom: z.string().optional().transform(str => str ? new Date(str) : undefined),
    leaveDateTo: z.string().optional().transform(str => str ? new Date(str) : undefined),

    // Religion
    religion: z.string().min(1),
    caste: z.string().optional(),
    subCaste: z.string().optional(),

    // Contact
    primaryContact: z.string().optional(),
    whatsapp: z.coerce.boolean().optional(),
    custodianName: z.string().optional(),
    custodianRelation: z.string().optional(),
    preferredTime: z.string().optional(),
    communicationAddress: z.string().optional(),

    // Reference
    referenceName: z.string().optional(),
    referenceRelation: z.string().optional(),
    referenceContact: z.string().optional(),

    // ID Proof
    idProof: z.string().optional(),
});

export async function updatePersonalDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData: Record<string, any> = {};
    for (const key of formData.keys()) {
        if (key.startsWith("$")) continue; // Skip internal Next.js keys
        const value = formData.get(key);
        // Convert empty strings to undefined for optional fields to satisfy Zod
        rawData[key] = value === "" ? undefined : value;
    }

    // Handle checkbox
    rawData.whatsapp = formData.get("whatsapp") === "on";

    // Map form field names to schema field names for backward compatibility
    if (rawData.country && !rawData.residingCountry) {
        rawData.residingCountry = rawData.country;
    }
    if (rawData.state && !rawData.residingState) {
        rawData.residingState = rawData.state;
    }
    if (rawData.district && !rawData.residingDistrict) {
        rawData.residingDistrict = rawData.district;
    }
    if (rawData.city && !rawData.residingCity) {
        rawData.residingCity = rawData.city;
    }

    const validation = PersonalDetailsSchema.safeParse(rawData);

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        const dataToSave = {
            ...validation.data,
            knownLanguages: typeof validation.data.knownLanguages === 'string'
                ? validation.data.knownLanguages.split(",").map(l => l.trim())
                : [],
        };

        await db.personalDetails.upsert({
            where: { userId: session.user.id },
            update: dataToSave,
            create: { ...dataToSave, userId: session.user.id },
        });

        revalidatePath("/profile", "layout");
        return { success: true, message: "Personal details saved!", data: dataToSave };
    } catch (error) {
        console.error("Error saving personal details:", error);
        return { message: "Failed to save details." };
    }
}

const EducationSchema = z.object({
    qualification: z.string().min(1, "Qualification is required"),
    institution: z.string().optional(),
    university: z.string().optional(),
    stream: z.string().optional(),
    passedYear: z.coerce.number().min(1950).max(new Date().getFullYear()),
    isHighest: z.coerce.boolean().optional(),
});

const JobSchema = z.object({
    title: z.string().min(1, "Job Title is required"),
    company: z.string().min(1, "Company Name is required"),
    occupationCategory: z.string().optional(),
    employmentCategory: z.string().optional(), // Occupation vs Employment category?
    workType: z.string().optional(), // Full-time, etc.
    country: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    fromMonth: z.coerce.number().optional(),
    fromYear: z.coerce.number().optional(),
    toMonth: z.coerce.number().optional(),
    toYear: z.coerce.number().optional(),
    isCurrent: z.coerce.boolean().optional(),
    annualIncome: z.string().optional(),
    description: z.string().max(200).optional(),
});

const CareerProfileSchema = z.object({
    currentStatus: z.enum(["Working", "Not Working", "Internship", "Student"]),
    internshipRole: z.string().optional(),
    internshipCompany: z.string().optional(),
    internshipDuration: z.string().optional(),
    careerGoal: z.string().optional(),
    linkedinUrl: z.string().optional(),
});

// --- Education Actions ---

export async function createEducation(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = EducationSchema.safeParse({
        qualification: formData.get("qualification"),
        institution: formData.get("institution"),
        university: formData.get("university"),
        stream: formData.get("stream"),
        passedYear: formData.get("passedYear"),
        isHighest: formData.get("isHighest") === "on",
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.education.create({
            data: { ...validation.data, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Education added!" };
    } catch (error) {
        return { message: "Failed to add education." };
    }
}

export async function deleteEducation(educationId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.education.delete({
            where: { id: educationId, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Education removed" };
    } catch (error) {
        return { message: "Failed to delete education" };
    }
}

// --- Career & Job Actions ---

export async function updateCareerProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = CareerProfileSchema.safeParse({
        currentStatus: formData.get("currentStatus"),
        internshipRole: formData.get("internshipRole"),
        internshipCompany: formData.get("internshipCompany"),
        internshipDuration: formData.get("internshipDuration"),
        careerGoal: formData.get("careerGoal"),
        linkedinUrl: formData.get("linkedinUrl"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.careerProfile.upsert({
            where: { userId: session.user.id },
            update: validation.data,
            create: { ...validation.data, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Career status updated!" };
    } catch (error) {
        return { message: "Failed to update career status" };
    }
}

export async function createJob(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    const validation = JobSchema.safeParse({
        ...rawData,
        isCurrent: formData.get("isCurrent") === "on",
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.job.create({
            data: { ...validation.data, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Job added!" };
    } catch (error) {
        return { message: "Failed to add job." };
    }
}

export async function deleteJob(jobId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.job.delete({
            where: { id: jobId, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Job removed" };
    } catch (error) {
        return { message: "Failed to delete job" };
    }
}

const FamilyDetailsSchema = z.object({
    familyStatus: z.string().optional(),
    familyType: z.string().optional(),
    familyValue: z.string().optional(),
    familyName: z.string().optional(),
    fatherName: z.string().min(1, "Father Name is required"),
    fatherOccupation: z.string().optional(),
    fatherNativePlace: z.string().optional(),
    fatherHouseName: z.string().optional(),
    motherName: z.string().min(1, "Mother Name is required"),
    motherOccupation: z.string().optional(),
    motherNativePlace: z.string().optional(),
    motherHouseName: z.string().optional(),
    grandParentsDetails: z.string().optional(),
    familyIntro: z.string().optional(),
    brothers: z.coerce.number().min(0).default(0),
    sisters: z.coerce.number().min(0).default(0),
    // Siblings array validation could be complex, assuming parsed client side or handled separately
});

const LifestyleDetailsSchema = z.object({
    hobbies: z.string().optional(),
    music: z.string().optional(),
    books: z.string().optional(),
    movies: z.string().optional(),
    sports: z.string().optional(),
    eatingHabits: z.string().optional(),
    drinking: z.string().optional(),
    smoking: z.string().optional(),
    favoriteCuisine: z.string().optional(),
    dressStyle: z.string().optional(),
    culturalBackground: z.string().optional(),
    adventureLevel: z.string().optional(),
    petPreference: z.string().optional(),
    drivingLicense: z.coerce.boolean().optional(),
    weekendPreference: z.string().optional(),
    travelFrequency: z.string().optional(),
    learningInterest: z.string().optional(),
    // Social
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    blogger: z.string().optional(),
    linkedin: z.string().optional(),
    otherSocial: z.string().optional(),
});

const MatchPreferencesSchema = z.object({
    minAge: z.coerce.number().optional(),
    maxAge: z.coerce.number().optional(),
    minHeight: z.coerce.number().optional(),
    maxHeight: z.coerce.number().optional(),
    maritalStatus: z.string().optional(), // Array in DB, comma separated in form?
    physicalStatus: z.string().optional(),
    complexion: z.string().optional(),
    bodyType: z.string().optional(),
    familyStatus: z.string().optional(),

    education: z.string().optional(),
    jobStatus: z.string().optional(),
    employmentCategory: z.string().optional(),
    incomeRange: z.string().optional(),
    workingCountry: z.string().optional(),
    readyToRelocate: z.coerce.boolean().optional(),

    preferredLocations: z.string().optional(),
    preferredReligions: z.string().optional(),
    otherReligions: z.coerce.boolean().optional(),

    expectations: z.string().max(5000).optional(),
});

// --- Family Actions ---

export async function updateFamilyDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    const validation = FamilyDetailsSchema.safeParse(rawData);

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    // Siblings Handling:
    // If we want to save siblings from the same form, we need to extract them.
    // Assuming for now we just save the main details. Siblings can be separate if needed.

    try {
        await db.familyDetails.upsert({
            where: { userId: session.user.id },
            update: validation.data,
            create: { ...validation.data, userId: session.user.id },
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Family details saved!" };
    } catch (error) {
        return { message: "Failed to save family details." };
    }
}

// --- Sibling Actions ---

const SiblingSchema = z.object({
    gender: z.enum(["Brother", "Sister"]),
    name: z.string().optional(),
    maritalStatus: z.string().optional(),
    spouseName: z.string().optional(),
});

export async function createSibling(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = SiblingSchema.safeParse({
        gender: formData.get("gender"),
        name: formData.get("name"),
        maritalStatus: formData.get("maritalStatus"),
        spouseName: formData.get("spouseName"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.sibling.create({
            data: { ...validation.data, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Sibling added!" };
    } catch (error) {
        return { message: "Failed to add sibling." };
    }
}

export async function deleteSibling(siblingId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.sibling.delete({
            where: { id: siblingId, userId: session.user.id }
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Sibling removed" };
    } catch (error) {
        return { message: "Failed to delete sibling" };
    }
}

// --- Lifestyle Actions ---

export async function updateLifestyleDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    // Convert common checkbox/boolean fields if any
    const validation = LifestyleDetailsSchema.safeParse({
        ...rawData,
        drivingLicense: formData.get("drivingLicense") === "on",
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    const processList = (val: string | undefined | null) => val ? val.split(",").map(v => v.trim()) : [];

    try {
        const dataToSave = {
            ...validation.data,
            hobbies: processList(validation.data.hobbies),
            music: processList(validation.data.music),
            books: processList(validation.data.books),
            movies: processList(validation.data.movies),
            sports: processList(validation.data.sports),
            favoriteCuisine: processList(validation.data.favoriteCuisine),
        };

        await db.lifestyleDetails.upsert({
            where: { userId: session.user.id },
            update: dataToSave,
            create: { ...dataToSave, userId: session.user.id },
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Lifestyle details saved!" };
    } catch (error) {
        return { message: "Failed to save lifestyle details." };
    }
}

// --- Photo Actions ---

export async function addUserPhoto(url: string, isProfile: boolean = false) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        // If setting as profile, unset others
        if (isProfile) {
            await db.userPhoto.updateMany({
                where: { userId: session.user.id },
                data: { isProfile: false }
            });
            await db.user.update({
                where: { id: session.user.id },
                data: { profileImage: url }
            });
        }

        await db.userPhoto.create({
            data: {
                userId: session.user.id,
                url: url,
                isProfile: isProfile
            }
        });

        revalidatePath("/profile", "layout");
        return { success: true, message: "Photo added!" };
    } catch (error) {
        return { message: "Failed to add photo." };
    }
}

export async function setProfilePhoto(photoId: string, url: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        // Unset all
        await db.userPhoto.updateMany({
            where: { userId: session.user.id },
            data: { isProfile: false }
        });

        // Set specific one
        await db.userPhoto.update({
            where: { id: photoId, userId: session.user.id },
            data: { isProfile: true }
        });

        // Update User model
        await db.user.update({
            where: { id: session.user.id },
            data: { profileImage: url }
        });

        revalidatePath("/profile", "layout");
        return { success: true, message: "Profile picture updated!" };
    } catch (error) {
        return { message: "Failed to update profile picture." };
    }
}

export async function deleteUserPhoto(photoId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    try {
        await db.userPhoto.delete({
            where: { id: photoId, userId: session.user.id }
        });

        // If we deleted the profile pic, we might want to clear user.profileImage or pick another? 
        // For now, let's leave it, or client handles it.

        revalidatePath("/profile", "layout");
        return { success: true, message: "Photo deleted" };
    } catch (error) {
        return { message: "Failed to delete photo" };
    }
}



// --- Match Preference Actions ---

export async function updateMatchPreferences(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    const validation = MatchPreferencesSchema.safeParse({
        ...rawData,
        readyToRelocate: formData.get("readyToRelocate") === "on",
        otherReligions: formData.get("otherReligions") === "on",
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    const processList = (val: string | undefined | null) => val ? val.split(",").map(v => v.trim()) : [];

    try {
        const dataToSave = {
            ...validation.data,
            maritalStatus: processList(validation.data.maritalStatus),
            complexion: processList(validation.data.complexion),
            bodyType: processList(validation.data.bodyType),
            familyStatus: processList(validation.data.familyStatus),
            education: processList(validation.data.education),
            jobStatus: processList(validation.data.jobStatus),
            employmentCategory: processList(validation.data.employmentCategory),
            incomeRange: processList(validation.data.incomeRange),
            workingCountry: processList(validation.data.workingCountry),
            preferredLocations: processList(validation.data.preferredLocations),
            preferredReligions: processList(validation.data.preferredReligions),
        };

        await db.matchPreferences.upsert({
            where: { userId: session.user.id },
            update: dataToSave,
            create: { ...dataToSave, userId: session.user.id },
        });
        revalidatePath("/profile", "layout");
        return { success: true, message: "Partner preferences saved!" };
    } catch (error) {
        console.error(error);
        return { message: "Failed to save preferences." };
    }
}
