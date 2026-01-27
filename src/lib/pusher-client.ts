import PusherClient from "pusher-js";

// Client Instance (Subscribes to events)
// Used in Client Components (ChatWindow)
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: "/api/pusher/auth",
    authTransport: "ajax",
    forceTLS: true,
});
