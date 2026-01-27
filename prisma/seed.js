const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Hash for 'password123'
    // using a pre-generated hash to avoid bcrypt dependency in seed script if possible, 
    // but better to match the app's hashing. 
    // Let's assume standard bcrypt. $2a$10$cwCI.9dijZM/... is common but let's just use a simple one or import if needed.
    // Actually, I'll just use a placeholder hash that works with the app's compareSync. 
    // If the app uses bcryptjs, I'll generate one: $2b$10$EpWaTgiFb/m.ok9F5l7.de/w/.. something.
    // Let's rely on the app's auth flow. I'll just generate one using a quick node command or hardcode.
    // Hardcoded hash for "password123":
    const passwordHash = "$2b$10$Top7.VI.1.1.1.1.1.1.1.1.1.1"; // This is fake.

    // Real bcrypt hash for 'password123' generated via: console.log(require('bcryptjs').hashSync('password123', 10))
    // I will assume I can require bcryptjs since it's in dependencies.
    let hashed = "password123";
    try {
        const bcrypt = require('bcryptjs');
        hashed = await bcrypt.hash('password123', 10);
    } catch (e) {
        console.log("bcryptjs not found, using plain text (will fail login if app requires hash)");
    }

    const users = [
        {
            email: "arjun@example.com",
            name: "Arjun Kapoor",
            role: "USER",
            personalDetails: {
                create: {
                    gender: "Male",
                    dateOfBirth: new Date("1995-05-15"),
                    maritalStatus: "Single",
                    religion: "Hindu",
                    height: 178,
                    bio: "Passionate software engineer who loves trekking."
                }
            },
            careerProfile: {
                create: {
                    jobTitle: "Senior Software Engineer",
                    companyName: "TechCorp",
                    industry: "IT",
                    yearsExperience: 6,
                    incomeRange: "20-25 LPA",
                    workLocation: "Bangalore",
                    isVerified: true
                }
            }
        },
        {
            email: "priya@example.com",
            name: "Priya Sharma",
            role: "USER",
            personalDetails: {
                create: {
                    gender: "Female",
                    dateOfBirth: new Date("1997-08-22"),
                    maritalStatus: "Single",
                    religion: "Hindu",
                    height: 165,
                    bio: "Architect with a love for classical dance."
                }
            },
            careerProfile: {
                create: {
                    jobTitle: "Architect",
                    companyName: "Design Studio",
                    industry: "Architecture",
                    yearsExperience: 4,
                    incomeRange: "10-15 LPA",
                    workLocation: "Mumbai",
                    isVerified: true
                }
            }
        },
        {
            email: "rohan@example.com",
            name: "Rohan Mehta",
            role: "USER",
            personalDetails: {
                create: {
                    gender: "Male",
                    dateOfBirth: new Date("1992-12-10"),
                    maritalStatus: "Single",
                    religion: "Jain",
                    height: 175,
                    bio: "Investment banker looking for a partner."
                }
            },
            careerProfile: {
                create: {
                    jobTitle: "Investment Banker",
                    companyName: "Global Bank",
                    industry: "Finance",
                    yearsExperience: 8,
                    incomeRange: "30-40 LPA",
                    workLocation: "Mumbai",
                    isVerified: false
                }
            }
        },
        {
            email: "sneha@example.com",
            name: "Sneha Reddy",
            role: "USER",
            personalDetails: {
                create: {
                    gender: "Female",
                    dateOfBirth: new Date("1996-03-30"),
                    maritalStatus: "Single",
                    religion: "Hindu",
                    height: 160,
                    bio: "Doctor dedicated to public health."
                }
            },
            careerProfile: {
                create: {
                    jobTitle: "Doctor",
                    companyName: "City Hospital",
                    industry: "Medical",
                    yearsExperience: 3,
                    incomeRange: "15-20 LPA",
                    workLocation: "Hyderabad",
                    isVerified: true
                }
            }
        },
        {
            email: "vikram@example.com",
            name: "Vikram Singh",
            role: "USER",
            personalDetails: {
                create: {
                    gender: "Male",
                    dateOfBirth: new Date("1990-01-01"),
                    maritalStatus: "Divorced",
                    religion: "Sikh",
                    height: 182,
                    bio: "Graphic designer and foodie."
                }
            },
            careerProfile: {
                create: {
                    jobTitle: "Graphic Designer",
                    companyName: "Creative Pulse",
                    industry: "Design",
                    yearsExperience: 10,
                    incomeRange: "12-18 LPA",
                    workLocation: "Delhi",
                    isVerified: true
                }
            }
        }
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                name: u.name,
                role: u.role,
                passwordHash: hashed,
                personalDetails: u.personalDetails,
                careerProfile: u.careerProfile
            },
        });
        console.log(`Created user with id: ${user.id}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
