import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== Role.ADMIN) {
        redirect("/dashboard");
    }

    return (
        <div className="flex-1 flex h-full bg-gray-100">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/users">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            User Management
                        </Button>
                    </Link>
                    <Link href="/admin/verification">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Verification Center
                        </Button>
                    </Link>
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Monitoring
                        </p>
                    </div>
                    <Link href="/admin/reports">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Moderation Queue
                        </Button>
                    </Link>
                    <Link href="/admin/logs">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Activity Logs
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Back to App
                        </Button>
                    </Link>
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            System
                        </p>
                    </div>
                    <Link href="/admin/ads">
                        <Button variant="ghost" className="w-full justify-start !text-gray-300 hover:!text-white hover:!bg-slate-800">
                            Manage Ads
                        </Button>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
