"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";

type ActiveUsersContextType = {
    members: string[]; // List of user IDs
    add: (id: string) => void;
    remove: (id: string) => void;
};

const ActiveUsersContext = createContext<ActiveUsersContextType>({
    members: [],
    add: () => { },
    remove: () => { },
});

export const useActiveUsers = () => {
    return useContext(ActiveUsersContext);
};

export const ActiveUsersProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [activeMembers, setActiveMembers] = useState<string[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        let channel = pusherClient.channel("presence-global");

        if (!channel) {
            channel = pusherClient.subscribe("presence-global");
        }

        channel.bind("pusher:subscription_succeeded", (members: any) => {
            const initialMembers: string[] = [];
            members.each((member: any) => initialMembers.push(member.id));
            setActiveMembers(initialMembers);
        });

        channel.bind("pusher:member_added", (member: any) => {
            setActiveMembers((prev) => [...prev, member.id]);
        });

        channel.bind("pusher:member_removed", (member: any) => {
            setActiveMembers((prev) => prev.filter((id) => id !== member.id));
        });

        return () => {
            if (channel) {
                channel.unbind_all();
                channel.unsubscribe();
            }
        };
    }, [session?.user?.id]); // Re-subscribe if user changes (though usually persistent)

    return (
        <ActiveUsersContext.Provider
            value={{
                members: activeMembers,
                add: (id) => setActiveMembers((prev) => [...prev, id]),
                remove: (id) => setActiveMembers((prev) => prev.filter((mid) => mid !== id)),
            }}
        >
            {children}
        </ActiveUsersContext.Provider>
    );
};
