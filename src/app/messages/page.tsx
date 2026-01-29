import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 animate-in zoom-in duration-500">
                <MessageCircle className="w-10 h-10 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Select a Conversation</h2>
            <p className="text-slate-500 max-w-sm">
                Choose a person from the left to start chatting.
            </p>
        </div>
    );
}
