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
        console.log(`Updating image for user: ${user.name} (${user.id})`);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                profileImage: "/priya.png",
                galleryImages: ["/priya.png", "/priya.png", "/priya.png"]
            }
        });
        console.log("Update successful! New image path: /priya.png");
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
