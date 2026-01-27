import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;

    // Authorization logic:
    // 1. Shared Chat: private-chat-[id1]-[id2]
    // 2. Presence Channel: presence-global (for online status)

    if (channel.startsWith("private-chat-")) {
        // Simple check: does the channel name contain the user ID?
        if (!channel.includes(session.user.id)) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
    } else if (channel === "presence-global") {
        // Allow any authenticated user to join the global presence channel
        // No additional checks needed beyond authentication
    } else {
        // Default deny for other channel types
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const data = {
        user_id: session.user.id,
        user_info: {
            name: session.user.name,
            image: session.user.image,
            // Last seen could be added here if needed, but we'll fetch it separately
        }
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return NextResponse.json(authResponse);
}
