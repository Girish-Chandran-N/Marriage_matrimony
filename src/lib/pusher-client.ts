import PusherClient from "pusher-js";

// Enable Pusher logging - useful for debugging
PusherClient.logToConsole = true;

if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
    console.error("NEXT_PUBLIC_PUSHER_KEY is missing! Pusher will not work.");
}

// Client Instance (Subscribes to events)
// Used in Client Components (ChatWindow)
const key = process.env.NEXT_PUBLIC_PUSHER_KEY!;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER!;

console.log("[PusherConfig] Client initializing with:", {
    key: key ? `${key.substring(0, 5)}...` : "MISSING",
    cluster
});

export const pusherClient = new PusherClient(key, {
    cluster,
    authEndpoint: "/api/pusher/auth",
    authTransport: "ajax",
    forceTLS: true,
    // enabledTransports: ['ws', 'wss'], // Commented out to allow fallback if WS is blocked
});
