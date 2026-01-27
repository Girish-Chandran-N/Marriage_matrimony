"use client";

import { updatePersonalDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INDIAN_STATES, LOCATION_DATA } from "@/lib/location-data";

interface PersonalDetailsFormProps {
    onNext?: () => void;
    initialData?: any;
}

export default function PersonalDetailsForm({ onNext, initialData }: PersonalDetailsFormProps) {
    const [state, action, isPending] = useActionState(updatePersonalDetails, undefined);
    const router = useRouter();
    const [age, setAge] = useState<number | null>(null);

    // Cascading Dropdown States
    const [selectedState, setSelectedState] = useState<string>(initialData?.state || "");
    const [selectedDistrict, setSelectedDistrict] = useState<string>(initialData?.district || "");
    const [isManualCity, setIsManualCity] = useState(false);

    // Controlled fields for immediate UI update
    // Controlled fields for immediate UI update
    const [bodyType, setBodyType] = useState<string>(initialData?.bodyType || "");
    const [complexion, setComplexion] = useState<string>(initialData?.complexion || "");
    const [weight, setWeight] = useState<string>(initialData?.weight?.toString() || "");
    const [bloodGroup, setBloodGroup] = useState<string>(initialData?.bloodGroup || "");
    const [gender, setGender] = useState<string>(initialData?.gender || "");
    const [religion, setReligion] = useState<string>(initialData?.religion || "");
    const [caste, setCaste] = useState<string>(initialData?.caste || "");
    const [motherTongue, setMotherTongue] = useState<string>(initialData?.motherTongue || "");
    const [knownLanguages, setKnownLanguages] = useState<string>(Array.isArray(initialData?.knownLanguages) ? initialData?.knownLanguages.join(", ") : (initialData?.knownLanguages || ""));
    const [maritalStatus, setMaritalStatus] = useState<string>(initialData?.maritalStatus || "");
    const [height, setHeight] = useState<string>(initialData?.height?.toString() || "");
    const [bio, setBio] = useState<string>(initialData?.bio || "");

    // Initial load check: if saved city is not in our list, show manual input
    useEffect(() => {
        if (initialData?.state && initialData?.district && initialData?.city) {
            const cities = LOCATION_DATA[initialData.state]?.[initialData.district] || [];
            // If the city saved in DB is NOT in the predefined list, it's a manual entry
            if (!cities.includes(initialData.city)) {
                setIsManualCity(true);
            }
        }
    }, [initialData]);

    useEffect(() => {
        if (state?.success) {
            if (state.data) {
                // Update local state with the saved data
                setBodyType(state.data.bodyType || "");
                setComplexion(state.data.complexion || "");
                setWeight(state.data.weight?.toString() || "");
                setBloodGroup(state.data.bloodGroup || "");
                setGender(state.data.gender || "");
                setReligion(state.data.religion || "");
                setCaste(state.data.caste || "");
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

                // Update location states if returned
                if (state.data.state) setSelectedState(state.data.state);
                if (state.data.district) setSelectedDistrict(state.data.district);
                router.refresh();
            }
            if (onNext) {
                onNext();
            }
        }
    }, [state, onNext]);

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
        <form action={action} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date of Birth
                        {age !== null && <span className="ml-2 text-blue-600 font-semibold">({age} years old)</span>}
                    </label>
                    <Input
                        type="date"
                        name="dateOfBirth"
                        required
                        onChange={handleDateChange}
                        defaultValue={initialData?.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : ''}
                    />
                    {state?.errors?.dateOfBirth && <p className="text-red-500 text-xs">{state.errors.dateOfBirth}</p>}
                </div>

                {/* Dynamic Location Section */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="sm:col-span-3">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                            Current Location
                        </h3>
                    </div>

                    {/* State Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State</label>
                        <select
                            name="state"
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            defaultValue={initialData?.state || ""}
                            onChange={(e) => {
                                setSelectedState(e.target.value);
                                setSelectedDistrict("");
                                setIsManualCity(false);
                            }}
                        >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {state?.errors?.state && <p className="text-red-500 text-xs mt-1">{state.errors.state}</p>}
                    </div>

                    {/* District Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">District</label>
                        <select
                            name="district"
                            required
                            disabled={!selectedState}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 disabled:bg-gray-100 disabled:text-gray-400"
                            defaultValue={initialData?.district || ""}
                            onChange={(e) => {
                                setSelectedDistrict(e.target.value);
                                setIsManualCity(false);
                            }}
                        >
                            <option value="">Select District</option>
                            {selectedState && LOCATION_DATA[selectedState] && Object.keys(LOCATION_DATA[selectedState]).map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        {state?.errors?.district && <p className="text-red-500 text-xs mt-1">{state.errors.district}</p>}
                    </div>

                    {/* City Dropdown or Manual Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City / Area</label>

                        {isManualCity ? (
                            <div className="relative animate-in fade-in zoom-in-95 duration-200">
                                <Input
                                    type="text"
                                    name="city"
                                    placeholder="Type city name..."
                                    required
                                    autoFocus
                                    className="pr-20"
                                    defaultValue={initialData?.city || ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsManualCity(false)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <select
                                name="city"
                                required
                                disabled={!selectedDistrict}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 disabled:bg-gray-100 disabled:text-gray-400"
                                defaultValue={initialData?.city && !isManualCity ? initialData.city : ""}
                                onChange={(e) => {
                                    if (e.target.value === "OTHER_MANUAL_ENTRY") {
                                        setIsManualCity(true);
                                        // Reset select to empty to allow re-selection if cancelled
                                        e.target.value = "";
                                    }
                                }}
                            >
                                <option value="">Select City</option>
                                {selectedState && selectedDistrict && LOCATION_DATA[selectedState]?.[selectedDistrict]?.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                {selectedDistrict && (
                                    <option value="OTHER_MANUAL_ENTRY" className="font-semibold text-blue-600 bg-blue-50">
                                        + Other (Enter Manually)
                                    </option>
                                )}
                            </select>
                        )}

                        {state?.errors?.city && <p className="text-red-500 text-xs mt-1">{state.errors.city}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {state?.errors?.gender && <p className="text-red-500 text-xs">{state.errors.gender}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mother Tongue</label>
                    <Input type="text" name="motherTongue" placeholder="e.g. Malayalam" required value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} />
                    {state?.errors?.motherTongue && <p className="text-red-500 text-xs">{state.errors.motherTongue}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Known Languages</label>
                    <Input
                        type="text"
                        name="knownLanguages"
                        placeholder="e.g. English, Hindi, Tamil"
                        value={knownLanguages}
                        onChange={(e) => setKnownLanguages(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Separate multiple languages with commas</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Religion</label>
                    <Input type="text" name="religion" placeholder="Hindu, Muslim, Christian..." required value={religion} onChange={(e) => setReligion(e.target.value)} />
                    {state?.errors?.religion && <p className="text-red-500 text-xs">{state.errors.religion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Caste (Optional)</label>
                    <Input type="text" name="caste" placeholder="Caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <select
                        name="maritalStatus"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">Awaiting Divorce</option>
                    </select>
                    {state?.errors?.maritalStatus && <p className="text-red-500 text-xs">{state.errors.maritalStatus}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <Input type="number" name="height" placeholder="175" required value={height} onChange={(e) => setHeight(e.target.value)} />
                    {state?.errors?.height && <p className="text-red-500 text-xs">{state.errors.height}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group (Optional)</label>
                    <select
                        name="bloodGroup"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Body Type (Optional)</label>
                    <select
                        name="bodyType"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Complexion (Optional)</label>
                    <select
                        name="complexion"
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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
                    <label className="block text-sm font-medium text-gray-700">Weight (kg) (Optional)</label>
                    <Input type="number" name="weight" placeholder="65" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                    name="bio"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                ></textarea>
            </div>

            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : onNext ? "Next: Education" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
