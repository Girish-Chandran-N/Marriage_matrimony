const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INDIAN_PROFESSIONS = [
    "Software Engineer",
    "Doctor",
    "Teacher",
    "Civil Engineer",
    "Accountant",
    "Govt Employee",
    "Nurse",
    "Police Officer",
    "Business Owner",
    "Mechanic",
    "Farmer",
    "Lawyer",
    "Chef",
    "Driver",
    "Electrician"
];

async function main() {
    console.log('Start seeding dummy profiles...');

    for (const profession of INDIAN_PROFESSIONS) {
        const email = `test_${profession.replace(/\s+/g, '_').toLowerCase()}@example.com`;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log(`User ${email} already exists.`);
            continue;
        }

        // Create User with Job
        const user = await prisma.user.create({
            data: {
                name: `${profession} User`,
                email: email,
                passwordHash: "hashedpassword", // Dummy hash
                role: "USER",
                status: "ACTIVE",
                personalDetails: {
                    create: {
                        dateOfBirth: new Date("1995-01-01"),
                        gender: "Male", // Moved here
                        religion: "Hindu",
                        caste: "Nair",
                        height: 175,
                        residingCountry: "India",
                        residingState: "Kerala",
                        residingDistrict: "Ernakulam",
                        residingCity: "Kochi"
                    }
                },
                careerProfile: {
                    create: {
                        jobTitle: profession,
                        companyName: "Demo Corp",
                        workLocation: "Kochi, India",
                        incomeRange: "10-15 LPA"
                    }
                }
            }
        });
        console.log(`Created user: ${user.name} (${profession})`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
