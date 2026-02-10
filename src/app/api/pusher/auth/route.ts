import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    console.log("[PusherAuth] Session attempt:", {
        hasSession: !!session,
        userId: session?.user?.id,
        cookies: req.headers.get("cookie")
    });

    if (!session?.user?.id) {
        console.error("Pusher Auth Failed: No Session", { session });
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const text = await req.text();
        const params = new URLSearchParams(text);
        const socketId = params.get("socket_id");
        const channel = params.get("channel_name");

        if (!socketId || !channel) {
            return new NextResponse("Missing socket_id or channel_name", { status: 400 });
        }

        // Authorization logic
        if (channel.startsWith("private-chat-") || channel.startsWith("presence-chat-")) {
            if (!channel.includes(session.user.id)) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        }

        const data = {
            user_id: session.user.id,
            user_info: {
                name: session.user.name,
                image: session.user.image,
            }
        };

        const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
        return NextResponse.json(authResponse);
    } catch (error) {
        console.error("Pusher Auth Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
