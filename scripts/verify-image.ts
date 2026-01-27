import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetName = "Priya";
    const user = await prisma.user.findFirst({
        where: {
            name: {
                contains: targetName,
                mode: 'insensitive',
            }
        }
    });

    if (user) {
        console.log(`User found: ${user.name}`);
        console.log(`ID: ${user.id}`);
        console.log(`Profile Image: ${user.profileImage}`);
        console.log(`Gallery Images: ${user.galleryImages}`);
    } else {
        console.log("Priya not found.");
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
