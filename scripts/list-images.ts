import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const usersWithImage = await prisma.user.findMany({
        where: {
            profileImage: {
                not: null
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
        }
    });

    console.log(`\nFound ${usersWithImage.length} users with profile images:`);
    console.log("---------------------------------------------------");
    usersWithImage.forEach(u => {
        console.log(`Name: ${u.name}`);
        console.log(`Email: ${u.email}`);
        console.log(`Image: ${u.profileImage}`);
        console.log("---------------------------------------------------");
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
