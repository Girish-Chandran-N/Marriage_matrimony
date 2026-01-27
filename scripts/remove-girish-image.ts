import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetName = "GIRISH";

    const user = await prisma.user.findFirst({
        where: {
            name: {
                contains: targetName,
                mode: 'insensitive',
            }
        }
    });

    if (user) {
        console.log(`Removing image from user: ${user.name} (${user.id})`);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                profileImage: null,
                galleryImages: []
            }
        });
        console.log("Cleanup successful!");
    } else {
        console.log("Girish not found.");
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
