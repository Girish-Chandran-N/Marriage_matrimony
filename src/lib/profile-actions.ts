"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// --- Validation Schemas ---
const PersonalDetailsSchema = z.object({
    dateOfBirth: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Invalid date" }).transform((str) => new Date(str)),
    gender: z.string().min(1),
    religion: z.string().min(1),
    caste: z.string().optional(),
    motherTongue: z.string().min(1),
    knownLanguages: z.string().optional(), // Will process comma-separated string
    maritalStatus: z.string().min(1),
    height: z.coerce.number().min(50), // cm
    weight: z.coerce.number().optional(), // kg
    bloodGroup: z.string().optional(),
    bodyType: z.string().optional(),
    complexion: z.string().optional(),
    bio: z.string().max(215, "Bio cannot exceed 215 characters").optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
});

const EducationDetailsSchema = z.object({
    highestQualification: z.string().min(1),
    institutionName: z.string().optional(),
    collegeName: z.string().optional(),
    stream: z.string().optional(),
    passingYear: z.coerce.number().min(1950).max(new Date().getFullYear()),
});

const CareerDetailsSchema = z.object({
    jobTitle: z.string().min(1),
    companyName: z.string().min(1),
    employmentType: z.string().min(1),
    incomeRange: z.string().optional(),
    workLocation: z.string().min(1),
    industry: z.string().min(1),
    yearsExperience: z.coerce.number().min(0),
    linkedinUrl: z.string().optional(),
});

const FamilyDetailsSchema = z.object({
    familyType: z.string().min(1),
    familyStatus: z.string().min(1),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    brothers: z.coerce.number().min(0).default(0),
    sisters: z.coerce.number().min(0).default(0),
});

const LifestyleDetailsSchema = z.object({
    diet: z.string().optional(),
    drinking: z.string().optional(),
    smoking: z.string().optional(),
    hobbies: z.string().optional(), // Comma separated string from form
});

// --- Actions ---

export async function updatePersonalDetails(prevState: any, formData: FormData) {
    console.log("updatePersonalDetails started");
    const session = await auth();
    if (!session?.user?.id) {
        console.log("Unauthorized access attempt");
        return { message: "Unauthorized" };
    }

    console.log("Parsing PersonalDetails form data...");
    const rawData = Object.fromEntries(formData.entries());
    console.log("Raw Data keys:", Object.keys(rawData));

    const validation = PersonalDetailsSchema.safeParse({
        dateOfBirth: formData.get("dateOfBirth"),
        gender: formData.get("gender"),
        religion: formData.get("religion"),
        caste: formData.get("caste"),
        motherTongue: formData.get("motherTongue"),
        knownLanguages: formData.get("knownLanguages"),
        maritalStatus: formData.get("maritalStatus"),
        height: formData.get("height"),
        weight: formData.get("weight"),
        bloodGroup: formData.get("bloodGroup"),
        bodyType: formData.get("bodyType"),
        complexion: formData.get("complexion"),
        bio: formData.get("bio"),
        city: formData.get("city"),
        district: formData.get("district"),
        state: formData.get("state"),
        country: formData.get("country"),
    });

    if (!validation.success) {
        console.log("Validation failed:", validation.error.flatten().fieldErrors);
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        console.log("Validation success, saving to DB...");
        const dataToSave = {
            ...validation.data,
            knownLanguages: validation.data.knownLanguages ? validation.data.knownLanguages.split(",").map(lang => lang.trim()) : [],
        };

        await db.personalDetails.upsert({
            where: { userId: session.user.id },
            update: dataToSave,
            create: { ...dataToSave, userId: session.user.id },
        });
        console.log("DB save successful. Revalidating...");

        revalidatePath("/profile", "layout");

        console.log("Revalidation complete.");
        return { success: true, message: "Personal details saved!", data: dataToSave };
    } catch (error) {
        console.error("CRITICAL ERROR saving personal details:", error);
        return { message: error instanceof Error ? error.message : "Failed to save details" };
    }
}

export async function updateEducationDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = EducationDetailsSchema.safeParse({
        highestQualification: formData.get("highestQualification"),
        institutionName: formData.get("institutionName"),
        collegeName: formData.get("collegeName"),
        stream: formData.get("stream"),
        passingYear: formData.get("passingYear"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.educationDetails.upsert({
            where: { userId: session.user.id },
            update: validation.data,
            create: { ...validation.data, userId: session.user.id },
        });
        if (session.user.id) revalidatePath("/profile", "layout");
        return { success: true, message: "Education details saved!", data: validation.data };
    } catch (error) {
        console.error("Error saving education details:", error);
        return { message: "Failed to save details." };
    }
}

export async function updateCareerDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = CareerDetailsSchema.safeParse({
        jobTitle: formData.get("jobTitle"),
        companyName: formData.get("companyName"),
        employmentType: formData.get("employmentType"),
        incomeRange: formData.get("incomeRange"),
        workLocation: formData.get("workLocation"),
        industry: formData.get("industry"),
        yearsExperience: formData.get("yearsExperience"),
        linkedinUrl: formData.get("linkedinUrl"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.careerProfile.upsert({
            where: { userId: session.user.id },
            update: validation.data,
            create: { ...validation.data, userId: session.user.id },
        });
        if (session.user.id) revalidatePath("/profile", "layout");
        return { success: true, message: "Career details saved!", data: validation.data };
    } catch (error) {
        console.error("Error saving career details:", error);
        return { message: "Failed to save details." };
    }
}

export async function updateFamilyDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = FamilyDetailsSchema.safeParse({
        familyType: formData.get("familyType"),
        familyStatus: formData.get("familyStatus"),
        fatherOccupation: formData.get("fatherOccupation"),
        motherOccupation: formData.get("motherOccupation"),
        brothers: formData.get("brothers"),
        sisters: formData.get("sisters"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        await db.familyDetails.upsert({
            where: { userId: session.user.id },
            update: validation.data,
            create: { ...validation.data, userId: session.user.id },
        });
        if (session.user.id) revalidatePath("/profile", "layout");
        return { success: true, message: "Family details saved!", data: validation.data };
    } catch (error) {
        console.error("Error saving family details:", error);
        return { message: "Failed to save details: " + (error instanceof Error ? error.message : String(error)) };
    }
}

export async function updateLifestyleDetails(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "Unauthorized" };

    const validation = LifestyleDetailsSchema.safeParse({
        diet: formData.get("diet"),
        drinking: formData.get("drinking"),
        smoking: formData.get("smoking"),
        hobbies: formData.get("hobbies"),
    });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors, message: "Invalid Data" };
    }

    try {
        const dataToSave = {
            diet: validation.data.diet,
            drinking: validation.data.drinking,
            smoking: validation.data.smoking,
            hobbies: validation.data.hobbies ? validation.data.hobbies.split(",").map(h => h.trim()) : [],
        };

        await db.lifestyleDetails.upsert({
            where: { userId: session.user.id },
            update: dataToSave,
            create: { ...dataToSave, userId: session.user.id },
        });
        if (session.user.id) revalidatePath("/profile", "layout");
        return { success: true, message: "Lifestyle details saved!", data: dataToSave };
    } catch (error) {
        console.error("Error saving lifestyle details:", error);
        return { message: "Failed to save details." };
    }
}
