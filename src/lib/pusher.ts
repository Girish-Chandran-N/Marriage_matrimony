import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server Instance (Triggers events)
// Used in Server Actions / API Routes
// Server Instance (Triggers events)
// Used in Server Actions / API Routes
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// Client code moved to @/lib/pusher-client.ts to avoid bundling issues

