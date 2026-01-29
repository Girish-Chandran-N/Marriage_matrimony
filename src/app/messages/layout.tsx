import { auth } from "@/auth";
import { getConversations } from "@/lib/message-actions";
import { redirect } from "next/navigation";
import { ConversationsList } from "@/components/conversations-list";
import { MessageLayoutShell } from "@/components/message-layout-shell";

export default async function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const conversations = await getConversations();

    return (
        <MessageLayoutShell
            sidebar={<ConversationsList initialConversations={conversations} />}
        >
            {children}
        </MessageLayoutShell>
    );
}
