import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        console.error("Pusher Auth: Unauthorized (No User)");
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Handle application/x-www-form-urlencoded
        const text = await req.text();
        const params = new URLSearchParams(text);

        const socketId = params.get("socket_id");
        const channel = params.get("channel_name");

        if (!socketId || !channel) {
            console.error("Pusher Auth: Missing fields", { text });
            return new NextResponse("Missing socket_id or channel_name", { status: 400 });
        }

        console.log(`Pusher Auth: Authorizing ${session.user.id} for ${channel}`);

        // Authorization logic:
        if (channel.startsWith("private-chat-")) {
            if (!channel.includes(session.user.id)) {
                console.error(`Pusher Auth: Forbidden. User ${session.user.id} not in ${channel}`);
                return new NextResponse("Forbidden", { status: 403 });
            }
        } else if (channel === "presence-global") {
            // Allowed
        } else {
            console.error(`Pusher Auth: Unknown channel type ${channel}`);
            return new NextResponse("Forbidden", { status: 403 });
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
