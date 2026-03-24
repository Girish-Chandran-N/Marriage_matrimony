import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] bg-[#09090b] text-center px-4">
            <MessageCircle size={64} className="text-slate-600 mb-6" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-white mb-2">No messages yet</h2>
            <p className="text-slate-400">Match with someone to start chatting!</p>
        </div>
    );
}
