
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    console.log("Verifying DB Schema...");
    try {
        // Create dummy users
        const u1 = await db.user.create({ data: { email: `test1_${Date.now()}@example.com`, role: 'USER', isOnline: false } });
        const u2 = await db.user.create({ data: { email: `test2_${Date.now()}@example.com`, role: 'USER', isOnline: false } });

        console.log("Users created", u1.id, u2.id);

        // Create conversation manually (mimicking logic)
        const conv = await db.conversation.create({
            data: {
                participants: { connect: [{ id: u1.id }, { id: u2.id }] }
            }
        });

        console.log("Conversation created", conv.id);

        // Create a message
        const msg = await db.message.create({
            data: {
                senderId: u1.id,
                receiverId: u2.id,
                content: "Hello World",
                conversationId: conv.id
            }
        });
        console.log("Message created", msg.id);

        // Verify fetch relations
        const fetched = await db.conversation.findUnique({
            where: { id: conv.id },
            include: { participants: true, messages: true }
        });

        if (!fetched || fetched.participants.length !== 2 || fetched.messages.length !== 1) {
            throw new Error("Verification failed: Relations not working");
        }
        console.log("Verified relations ok");

        // Clean up
        await db.message.deleteMany({ where: { conversationId: conv.id } });
        await db.conversation.delete({ where: { id: conv.id } });
        await db.user.delete({ where: { id: u1.id } });
        await db.user.delete({ where: { id: u2.id } });

        console.log("Cleanup done.");
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
}

main();
