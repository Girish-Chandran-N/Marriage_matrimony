"use client";

import { updatePersonalDetails } from "@/lib/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INDIAN_STATES, LOCATION_DATA, COUNTRIES } from "@/lib/location-data";

interface PersonalDetailsFormProps {
    onNext?: () => void;
    initialData?: any;
}

export default function PersonalDetailsForm({ onNext, initialData }: PersonalDetailsFormProps) {
    const [state, action, isPending] = useActionState(updatePersonalDetails, undefined);
    const router = useRouter();
    const [age, setAge] = useState<number | null>(null);

    // Cascading Dropdown States
    const [selectedCountry, setSelectedCountry] = useState<string>(initialData?.country || "India");
    const [selectedState, setSelectedState] = useState<string>(initialData?.state || "");
    const [selectedDistrict, setSelectedDistrict] = useState<string>(initialData?.district || "");
    const [isManualState, setIsManualState] = useState(false);
    const [isManualDistrict, setIsManualDistrict] = useState(false);
    // City is now always manual input as per request

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

    // Initial load check for manual entries
    useEffect(() => {
        if (initialData) {
            if (initialData.country && initialData.country !== "India") {
                setIsManualState(true);
                setIsManualDistrict(true);
            } else {
                // Country is India (or default)
                if (initialData.state && !INDIAN_STATES.includes(initialData.state as any)) {
                    setIsManualState(true);
                }
                if (initialData.state && initialData.district) {
                    const districts = LOCATION_DATA[initialData.state] ? Object.keys(LOCATION_DATA[initialData.state]) : [];
                    if (!districts.includes(initialData.district)) {
                        setIsManualDistrict(true);
                    }
                }
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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

                    {/* Country Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Country</label>
                        <select
                            name="country"
                            required
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                            value={selectedCountry}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedCountry(val);
                                if (val === "India") {
                                    setIsManualState(false);
                                    setIsManualDistrict(false);
                                    setSelectedState("");
                                    setSelectedDistrict("");
                                } else {
                                    setIsManualState(true);
                                    setIsManualDistrict(true);
                                    setSelectedState("");
                                    setSelectedDistrict("");
                                }
                            }}
                        >
                            {COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {state?.errors?.country && <p className="text-red-500 text-xs mt-1">{state.errors.country}</p>}
                    </div>

                    {/* State Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State</label>
                        {isManualState ? (
                            <div className="relative">
                                <Input
                                    type="text"
                                    name="state"
                                    placeholder="Enter State"
                                    required
                                    defaultValue={selectedCountry !== "India" ? initialData?.state : ""}
                                    key={`manual-state-${selectedCountry}`}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                />
                                {selectedCountry === "India" && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsManualState(false); setSelectedState(""); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
                                    >
                                        Select List
                                    </button>
                                )}
                            </div>
                        ) : (
                            <select
                                name="state"
                                required
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2"
                                value={selectedState}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "Other") {
                                        setIsManualState(true);
                                        setSelectedState("");
                                    } else {
                                        setSelectedState(val);
                                        setIsManualDistrict(false);
                                        setSelectedDistrict("");
                                    }
                                }}
                            >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        )}
                        {state?.errors?.state && <p className="text-red-500 text-xs mt-1">{state.errors.state}</p>}
                    </div>

                    {/* District Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">District</label>
                        {isManualDistrict ? (
                            <div className="relative">
                                <Input
                                    type="text"
                                    name="district"
                                    placeholder="Enter District"
                                    required
                                    defaultValue={selectedCountry !== "India" ? initialData?.district : ""}
                                    key={`manual-district-${selectedState}`}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                />
                                {selectedCountry === "India" && !isManualState && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsManualDistrict(false); setSelectedDistrict(""); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
                                    >
                                        Select List
                                    </button>
                                )}
                            </div>
                        ) : (
                            <select
                                name="district"
                                required
                                disabled={!selectedState}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 disabled:bg-gray-100"
                                value={selectedDistrict}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "Other") {
                                        setIsManualDistrict(true);
                                        setSelectedDistrict("");
                                    } else {
                                        setSelectedDistrict(val);
                                    }
                                }}
                            >
                                <option value="">Select District</option>
                                {selectedState && LOCATION_DATA[selectedState as any] && Object.keys(LOCATION_DATA[selectedState as any]).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        )}
                        {state?.errors?.district && <p className="text-red-500 text-xs mt-1">{state.errors.district}</p>}
                    </div>

                    {/* City Input (Always Manual) */}
                    <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City / Area</label>
                        <Input
                            type="text"
                            name="city"
                            placeholder="Type city or area name..."
                            required
                            defaultValue={initialData?.city || ""}
                        />
                        {state?.errors?.city && <p className="text-red-500 text-xs mt-1">{state.errors.city}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
                    <Input type="text" name="motherTongue" placeholder="e.g. Malayalam" required value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} />
                    {state?.errors?.motherTongue && <p className="text-red-500 text-xs">{state.errors.motherTongue}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Known Languages</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                    <Input type="text" name="religion" placeholder="Hindu, Muslim, Christian..." required value={religion} onChange={(e) => setReligion(e.target.value)} />
                    {state?.errors?.religion && <p className="text-red-500 text-xs">{state.errors.religion}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caste (Optional)</label>
                    <Input type="text" name="caste" placeholder="Caste" value={caste} onChange={(e) => setCaste(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <Input type="number" name="height" placeholder="175" required value={height} onChange={(e) => setHeight(e.target.value)} />
                    {state?.errors?.height && <p className="text-red-500 text-xs">{state.errors.height}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group (Optional)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Type (Optional)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complexion (Optional)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) (Optional)</label>
                    <Input type="number" name="weight" placeholder="65" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div className="relative">
                    <textarea
                        name="bio"
                        rows={4}
                        maxLength={215}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4 whitespace-pre-wrap resize-none"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                    <div className="text-xs text-right text-gray-500 mt-1">
                        {bio.length}/215 characters
                    </div>
                </div>
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
