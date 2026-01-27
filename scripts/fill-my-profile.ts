import { db } from "../src/lib/db";

async function fillProfile(email: string) {
    if (!email) {
        console.error("Please provide an email address.");
        process.exit(1);
    }

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error(`User with email ${email} not found.`);
        process.exit(1);
    }

    console.log(`Updating profile for ${user.email} (${user.name})...`);

    const updatedUser = await db.user.update({
        where: { email },
        data: {
            name: "Girish Chandran", // Using user's name if known, or generic
            profileImage: "/uploads/handsome.png",
            personalDetails: {
                upsert: {
                    create: {
                        bio: "Senior Product Manager at a leading Fintech startup. I enjoy hiking, reading non-fiction, and exploring new coffee shops. Looking for a partner who is ambitious, kind, and loves to travel.",
                        gender: "Male",
                        height: 180,
                        maritalStatus: "Never Married",
                        religion: "Hindu",
                        motherTongue: "Malayalam",
                        caste: "Nair",
                        city: "Bangalore",
                        state: "Karnataka",
                        country: "India",
                        knownLanguages: ["English", "Malayalam", "Hindi"],
                        dateOfBirth: new Date("1995-05-15"),
                    },
                    update: {
                        bio: "Senior Product Manager at a leading Fintech startup. I enjoy hiking, reading non-fiction, and exploring new coffee shops. Looking for a partner who is ambitious, kind, and loves to travel.",
                        gender: "Male",
                        height: 180,
                        maritalStatus: "Never Married",
                        religion: "Hindu",
                        motherTongue: "Malayalam",
                        caste: "Nair",
                        city: "Bangalore",
                        state: "Karnataka",
                        country: "India",
                        knownLanguages: ["English", "Malayalam", "Hindi"],
                        dateOfBirth: new Date("1995-05-15"),
                    }
                }
            },
            careerProfile: {
                upsert: {
                    create: {
                        jobTitle: "Product Manager",
                        companyName: "Razorpay",
                        incomeRange: "35-50 LPA",
                        industry: "Fintech",
                        yearsExperience: 6,
                        workLocation: "Bangalore",
                    },
                    update: {
                        jobTitle: "Product Manager",
                        companyName: "Razorpay",
                        incomeRange: "35-50 LPA",
                        industry: "Fintech",
                        yearsExperience: 6,
                        workLocation: "Bangalore",
                    }
                }
            },
            educationDetails: {
                upsert: {
                    create: {
                        highestQualification: "MBA",
                        collegeName: "IIM Bangalore",
                        stream: "Business Administration",
                        passingYear: 2019,
                    },
                    update: {
                        highestQualification: "MBA",
                        collegeName: "IIM Bangalore",
                        stream: "Business Administration",
                        passingYear: 2019,
                    }
                }
            },
            lifestyleDetails: {
                upsert: {
                    create: {
                        diet: "Non-Vegetarian",
                        drinking: "Socially",
                        smoking: "No",
                        hobbies: ["Hiking", "Reading", "Investing", "Photography"],
                    },
                    update: {
                        diet: "Non-Vegetarian",
                        drinking: "Socially",
                        smoking: "No",
                        hobbies: ["Hiking", "Reading", "Investing", "Photography"],
                    }
                }
            },
            familyDetails: {
                upsert: {
                    create: {
                        familyType: "Nuclear",
                        familyStatus: "Upper Middle Class",
                        fatherOccupation: "Retired Engineer",
                        motherOccupation: "Homemaker",
                        brothers: 0,
                        sisters: 1,
                    },
                    update: {
                        familyType: "Nuclear",
                        familyStatus: "Upper Middle Class",
                        fatherOccupation: "Retired Engineer",
                        motherOccupation: "Homemaker",
                        brothers: 0,
                        sisters: 1,
                    }
                }
            },

            // trustScore is not on User, usually calculated or separate. 
            // If it's on User schema, uncomment:
            // trustScore: 85, 
        },
    });

    console.log("✅ Profile Updated Successfully!");
    console.log(updatedUser);
}

const email = process.argv[2];
fillProfile(email);
