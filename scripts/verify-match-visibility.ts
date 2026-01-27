import { getMatches } from '@/lib/match-actions';
// We can't easily run server actions from a script without mocking session/auth.
// Instead, let's replicate the query logic from `getMatches` using Prisma directly.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const targetName = "Priya";

    // Find Priya first
    const priya = await prisma.user.findFirst({
        where: { name: { contains: targetName, mode: 'insensitive' } },
        include: { careerProfile: true, personalDetails: true }
    });

    if (!priya) {
        console.log("Priya not found in DB.");
        return;
    }

    console.log("Priya's Data Status:");
    console.log(`- Career Profile: ${priya.careerProfile ? 'Present' : 'MISSING'}`);
    console.log(`- Personal Details: ${priya.personalDetails ? 'Present' : 'MISSING'}`);

    if (!priya.careerProfile) {
        console.log("!!! ATTENTION: Priya has no Career Profile. getMatches EXCLUDES users without careerProfile.");
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
