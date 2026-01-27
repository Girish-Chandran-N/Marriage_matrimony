
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FIRST_NAMES = ["Aarav", "Vihaan", "Aditya", "Sai", "Ishaan", "Diya", "Ananya", "Saanvi", "Pari", "Myra", "Rohan", "Vikram", "Neha", "Priya", "Rahul", "Sneha", "Amit", "Kavita", "Sanjay", "Meera"];
const LAST_NAMES = ["Sharma", "Verma", "Patel", "Singh", "Gupta", "Kumar", "Bhat", "Rao", "Nair", "Reddy", "Mehta", "Iyer", "Joshi", "Kapoor", "Khan"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];
const JOBS = ["Software Engineer", "Doctor", "Architect", "Teacher", "Business Analyst", "Designer", "Content Writer", "Marketing Manager", "Lawyer", "Accountant"];
const INDUSTRIES = ["IT", "Medical", "Architecture", "Education", "Finance", "Design", "Media", "Marketing", "Legal", "Accounting"];

async function main() {
    console.log("Seeding fake users...");

    // Pre-calculate hash for "password123" to speed up
    const passwordHash = await bcrypt.hash("password123", 10);

    for (let i = 0; i < 20; i++) {
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;

        // Random gender based on name index roughly (first 5 male, next 5 female etc - simplified)
        // Actually let's just randomize it mostly matches name for realism but for test it's fine.
        const isFemale = i % 2 !== 0;
        const gender = isFemale ? "Female" : "Male";

        await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email: email,
                passwordHash: passwordHash,
                role: 'USER',
                personalDetails: {
                    create: {
                        dateOfBirth: new Date(1990 + Math.floor(Math.random() * 10), 0, 1),
                        gender: gender,
                        religion: "Hindu", // Simplified
                        maritalStatus: "Single",
                        height: 150 + Math.floor(Math.random() * 40),
                        bio: `Hi, I'm ${firstName}. I love traveling and reading.`
                    }
                },
                careerProfile: {
                    create: {
                        jobTitle: JOBS[Math.floor(Math.random() * JOBS.length)],
                        companyName: "Tech Solutions Ltd",
                        industry: INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)],
                        workLocation: CITIES[Math.floor(Math.random() * CITIES.length)],
                        incomeRange: "10-20 LPA",
                        yearsExperience: Math.floor(Math.random() * 10) + 1,
                        isVerified: Math.random() > 0.5
                    }
                }
            }
        });
        console.log(`Created user: ${email}`);
    }

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
