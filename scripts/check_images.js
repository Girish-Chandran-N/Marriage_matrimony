
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            profileImage: true,
        },
    });

    console.log('User Images:');
    users.forEach(user => {
        console.log(`Email: ${user.email}, Name: ${user.name}, Image: ${user.profileImage}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
