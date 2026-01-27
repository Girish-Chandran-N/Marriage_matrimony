
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error("Usage: npx tsx scripts/verify-login.ts <email> <password>");
    process.exit(1);
}

async function main() {
    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("❌ User NOT found in database.");
        return;
    }

    console.log("✅ User found.");
    console.log(`User ID: ${user.id}`);
    console.log(`Stored Hash: ${user.passwordHash ? user.passwordHash.substring(0, 10) + '...' : 'NULL'}`);

    if (!user.passwordHash) {
        console.error("❌ No password set for this user (OAuth account?).");
        return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (match) {
        console.log("✅ SUCCESS: Password matches!");
    } else {
        console.error("❌ FAILURE: Password does NOT match stored hash.");

        // Debug: Generate what the hash WOULD be
        const newHash = await bcrypt.hash(password, 10);
        console.log(`DEBUG: If you reset it now, hash would look like: ${newHash.substring(0, 10)}...`);
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
