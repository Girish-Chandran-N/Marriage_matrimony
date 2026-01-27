import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: "Priya",
                mode: 'insensitive',
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
        }
    });

    console.log(`Found ${users.length} user(s) named Priya:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email}) | ID: ${u.id} | Image: ${u.profileImage}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
