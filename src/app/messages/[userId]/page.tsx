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

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const { userId: receiverId } = await params;

    // Get receiver details for header
    const receiver = await db.user.findUnique({
        where: { id: receiverId },
        select: { name: true, email: true, profileImage: true }
    });

    if (!receiver) {
        return <div className="p-8">User not found</div>;
    }

    // Get current user details for optimistic updates
    const currentUser = await db.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, profileImage: true }
    });

    const initialMessages = await getMessages(receiverId);

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
            {/* Vibrant Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-pink-50 via-purple-50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl w-full h-[85vh] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-purple-900/10 border border-white/60 relative z-10 overflow-hidden flex flex-col">
                {/* Custom Header */}
                <div className="p-4 md:p-6 border-b border-indigo-50/50 flex items-center justify-between bg-white/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Link href="/messages">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 transition-all">
                                ←
                            </Button>
                        </Link>

                        <div className="flex items-center gap-4">
                            {/* Header Avatar */}
                            <Dialog>
                                <DialogTrigger className="focus:outline-none group relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform ring-2 ring-transparent group-hover:ring-purple-200">
                                        <img
                                            src={receiver.profileImage || "/placeholder-user.jpg"}
                                            alt={receiver.name || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none outline-none">
                                    <img
                                        src={receiver.profileImage || "/placeholder-user.jpg"}
                                        alt={receiver.name || "User"}
                                        className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                                    />
                                </DialogContent>
                            </Dialog>

                            <Link href={`/users/${receiverId}`} className="hover:opacity-80 transition-opacity">
                                <h1 className="text-xl font-bold text-slate-900">{receiver.name || "Chat"}</h1>
                                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 overflow-hidden relative bg-slate-50/30">
                    <ChatWindow
                        initialMessages={initialMessages}
                        receiverId={receiverId}
                        currentUserId={session.user.id}
                        currentUserName={currentUser?.name || "Me"}
                        currentUserImage={currentUser?.profileImage || "/placeholder-user.jpg"}
                    />
                </div>
            </div>
        </div>
    );
}
