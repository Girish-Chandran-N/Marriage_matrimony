import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getMessages } from "@/lib/message-actions";
import ChatWindow from "@/components/chat-window";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { userId: receiverId } = await params;

    const receiver = await db.user.findUnique({
        where: { id: receiverId },
        select: { name: true, email: true, profileImage: true }
    });

    if (!receiver) {
        return <div className="p-8 text-center text-slate-500">User not found</div>;
    }

    const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, profileImage: true }
    });

    const initialMessages = await getMessages(receiverId);

    return (
        <div className="flex flex-col h-full bg-white/50">
            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden relative">
                <ChatWindow
                    initialMessages={initialMessages}
                    receiverId={receiverId}
                    receiverName={receiver.name || "User"}
                    receiverImage={receiver.profileImage || "/placeholder-user.jpg"}
                    currentUserId={session.user.id}
                    currentUserName={currentUser?.name || "Me"}
                    currentUserImage={currentUser?.profileImage || "/placeholder-user.jpg"}
                />
            </div>
        </div>
    );
}
