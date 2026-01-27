import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetName = "Priya";
    console.log(`Searching for user with name containing: ${targetName}...`);

    const user = await prisma.user.findFirst({
        where: {
            name: {
                contains: targetName,
                mode: 'insensitive',
            }
        }
    });

    if (user) {
        console.log(`Found user: ${user.name} (${user.id})`);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                profileImage: "/female-profile.png",
                galleryImages: [
                    "/female-profile.png",
                    "/female-profile.png",
                    "/female-profile.png"
                ]
            }
        });
        console.log("Update successful!");
    } else {
        console.log(`No user found with name "${targetName}". Listing first 5 users to help identify target:`);
        const users = await prisma.user.findMany({
            take: 5,
            select: { id: true, name: true, email: true }
        });
        users.forEach(u => console.log(`- ${u.name} (${u.email})`));
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
