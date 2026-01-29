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
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-indigo-50/50 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                {/* Back Button - Mobile Only */}
                <Link href="/messages" className="md:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -ml-2 text-slate-500">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                {/* Profile Info */}
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <Dialog>
                        <DialogTrigger className="focus:outline-none group relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                                <img
                                    src={receiver.profileImage || "/placeholder-user.jpg"}
                                    alt={receiver.name || "User"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none outline-none">
                            <img
                                src={receiver.profileImage || "/placeholder-user.jpg"}
                                alt={receiver.name || "User"}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                            />
                        </DialogContent>
                    </Dialog>

                    <Link href={`/users/${receiverId}`} className="hover:opacity-80 transition-opacity flex-1 min-w-0">
                        <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">{receiver.name || "Chat"}</h1>
                        <p className="text-[10px] md:text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                        </p>
                    </Link>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 overflow-hidden relative">
                <ChatWindow
                    initialMessages={initialMessages}
                    receiverId={receiverId}
                    currentUserId={session.user.id}
                    currentUserName={currentUser?.name || "Me"}
                    currentUserImage={currentUser?.profileImage || "/placeholder-user.jpg"}
                />
            </div>
        </div>
    );
}
