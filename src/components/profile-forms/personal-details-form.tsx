"use client";

import { updatePersonalDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INDIAN_STATES, LOCATION_DATA, COUNTRIES } from "@/lib/location-data";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, Clock, BadgeCheck } from "lucide-react";

interface PersonalDetailsFormProps {
    onNext?: () => void;
    initialData?: any;
    userName?: string;
    verificationStatus?: string;
}

export default function PersonalDetailsForm({ onNext, initialData, userName, verificationStatus }: PersonalDetailsFormProps) {
    const [state, action, isPending] = useActionState(updatePersonalDetails, undefined);
    const router = useRouter();
    const [age, setAge] = useState<number | null>(null);

    // Form inputs state
    const [name, setName] = useState<string>(userName || "");
    const [gender, setGender] = useState<string>(initialData?.gender || "");
    const [maritalStatus, setMaritalStatus] = useState<string>(initialData?.maritalStatus || "");
    const [height, setHeight] = useState<string>(initialData?.height?.toString() || "");
    const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || "");
    const [bloodGroup, setBloodGroup] = useState<string>(initialData?.bloodGroup || "");
    const [bodyType, setBodyType] = useState<string>(initialData?.bodyType || "");
    const [complexion, setComplexion] = useState<string>(initialData?.complexion || "");
    const [motherTongue, setMotherTongue] = useState<string>(initialData?.motherTongue || "");
    const [knownLanguages, setKnownLanguages] = useState<string>(initialData?.knownLanguages?.join(", ") || "");

    const [bio, setBio] = useState<string>(initialData?.bio || "");
    const [about, setAbout] = useState<string>(initialData?.about || "");

    // Weight Options Generator
    const weightOptions = Array.from({ length: 116 }, (_, i) => i + 35); // 35 to 150

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                // Update local state with the saved data
                setBodyType(state.data.bodyType || "");
                setComplexion(state.data.complexion || "");
                setWeight(state.data.weight?.toString() || "");
                setBloodGroup(state.data.bloodGroup || "");
                setGender(state.data.gender || "");
                setMotherTongue(state.data.motherTongue || "");

                const langs = state.data.knownLanguages;
                if (Array.isArray(langs)) {
                    setKnownLanguages(langs.join(", "));
                } else {
                    setKnownLanguages(langs || "");
                }

                setMaritalStatus(state.data.maritalStatus || "");
                setHeight(state.data.height?.toString() || "");
                setBio(state.data.bio || "");
                setAbout(state.data.about || "");

                router.refresh();
            }
            if (onNext) {
                onNext();
            } else {
                router.push("/profile");
            }
        }
    }, [state, onNext, router]);

    useEffect(() => {
        if (initialData?.dateOfBirth) {
            calculateAge(new Date(initialData.dateOfBirth));
        }
    }, [initialData]);

    const calculateAge = (birthDate: Date) => {
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        setAge(calculatedAge);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateStr = e.target.value;
        if (!dateStr) {
            setAge(null);
            return;
        }
        calculateAge(new Date(dateStr));
    };

    return (
        <form action={action} className="space-y-8">
            {/* Verification Banner */}
            {verificationStatus === "APPROVED" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-900 text-sm flex items-center gap-1.5">
                            Verified Profile <CheckCircle2 className="w-4 h-4 fill-green-600 text-white" />
                        </h4>
                        <p className="text-xs text-green-700">Your profile is verified and trusted.</p>
                    </div>
                </div>
            ) : verificationStatus === "PENDING" ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-900 text-sm">Verification Pending</h4>
                            <p className="text-xs text-amber-700">We are reviewing your details. Please wait.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 text-sm">Get Verified</h4>
                            <p className="text-xs text-blue-700">Add trust to your profile and get more matches.</p>
                        </div>
                    </div>
                    <Link href="/verification">
                        <Button variant="outline" size="sm" className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200">
                            Verify Now
                        </Button>
                    </Link>
                </div>
            )}

            {/* ROW 1: Name (Full Width) */}
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="font-medium h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                />
            </div>

            {/* ROW 2: Age, Gender, Marital Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            name="dateOfBirth"
                            required
                            className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200 text-sm"
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            defaultValue={initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : ''}
                        />
                        {age !== null && <span className="text-xs text-gray-600 whitespace-nowrap">{age} Yrs</span>}
                    </div>
                    {state?.errors?.dateOfBirth && <p className="text-red-500 text-[10px] mt-1">{state.errors.dateOfBirth}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={gender}
                        disabled
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="hidden" name="gender" value={gender} />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Marital Status</label>
                    <select
                        name="maritalStatus"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">Awaiting Divorce</option>
                    </select>
                    {state?.errors?.maritalStatus && <p className="text-red-500 text-[10px] mt-1">{state.errors.maritalStatus}</p>}
                </div>
            </div>

            {/* ROW 3: Height, Weight, Blood Group, Physical Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Height (cm)</label>
                    <Input
                        type="number"
                        name="height"
                        placeholder="175"
                        required
                        min={121}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                    />
                    {height && parseInt(height) < 121 && (
                        <p className="text-[10px] text-red-500 mt-1">Min: 121</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Weight (kg)</label>
                    <select
                        name="weight"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    >
                        <option value="">Select</option>
                        {weightOptions.map((w) => (
                            <option key={w} value={w}>{w} kg</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
                    <select
                        name="bloodGroup"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Physical Status</label>
                    <select
                        name="physicalStatus"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        defaultValue={initialData?.physicalStatus || ""}
                    >
                        <option value="">Select</option>
                        <option value="Normal">Normal</option>
                        <option value="Physically Challenged">Challenged</option>
                    </select>
                </div>
            </div>

            {/* ROW 4: Body Type, Complexion, Mother Tongue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Body Type</label>
                    <select
                        name="bodyType"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Slim">Slim</option>
                        <option value="Athletic">Athletic</option>
                        <option value="Average">Average</option>
                        <option value="Heavy">Heavy</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Complexion</label>
                    <select
                        name="complexion"
                        className="block w-full rounded-md border border-green-100 bg-green-50/50 py-1.5 px-3 text-sm focus:border-green-300 focus:outline-none focus:ring-green-200"
                        value={complexion}
                        onChange={(e) => setComplexion(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Fair">Fair</option>
                        <option value="Wheatish">Wheatish</option>
                        <option value="Dark">Dark</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mother Tongue</label>
                    <Input
                        type="text"
                        name="motherTongue"
                        placeholder="e.g. Malayalam"
                        required
                        value={motherTongue}
                        onChange={(e) => setMotherTongue(e.target.value)}
                        className="h-9 bg-green-50/50 border-green-100 focus:border-green-300 focus:ring-green-200"
                    />
                    {state?.errors?.motherTongue && <p className="text-red-500 text-[10px] mt-1">{state.errors.motherTongue}</p>}
                </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Max 200 Characters)*</label>
                <div className="relative">
                    <textarea
                        name="bio"
                        rows={3}
                        maxLength={200}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 whitespace-pre-wrap resize-none"
                        placeholder="Short intro..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                    <div className="text-xs text-right text-gray-500 mt-1">
                        {bio.length}/200 characters
                    </div>
                </div>
                {state?.errors?.bio && <p className="text-red-500 text-xs">{state.errors.bio}</p>}
            </div>

            {/* About Candidate */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About the Candidate (Max 5000 characters )</label>
                <div className="relative">
                    <textarea
                        name="about"
                        rows={8}
                        maxLength={5000}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 whitespace-pre-wrap resize-y"
                        placeholder="Detailed description..."
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
                    <div className="text-xs text-right text-gray-500 mt-1">
                        {about.length}/5000 characters
                    </div>
                </div>
            </div>


            {state?.message && <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : onNext ? "Next: Education" : "Save & Exit"}
                </Button>
            </div>
        </form>
    );
}
