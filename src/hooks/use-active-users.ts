"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";

const PRESENCE_CHANNEL = "presence-global";

export function useActiveUsers() {
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [connectionState, setConnectionState] = useState("disconnected");

    useEffect(() => {
        // Subscribe to global presence channel
        const channel = pusherClient.subscribe(PRESENCE_CHANNEL);

        channel.bind("pusher:subscription_succeeded", (members: any) => {
            // Get initial list of members
            const initialMembers: string[] = [];
            members.each((member: any) => initialMembers.push(member.id));
            setActiveUsers(initialMembers);
            setConnectionState("connected");
        });

        channel.bind("pusher:subscription_error", (error: any) => {
            console.error("Presence subscription error:", error);
            setConnectionState("error");
        });

        channel.bind("pusher:member_added", (member: any) => {
            setActiveUsers((prev) => [...prev, member.id]);
        });

        channel.bind("pusher:member_removed", (member: any) => {
            setActiveUsers((prev) => prev.filter((id) => id !== member.id));
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(PRESENCE_CHANNEL);
        };
    }, []);

    return { activeUsers, connectionState };
}
