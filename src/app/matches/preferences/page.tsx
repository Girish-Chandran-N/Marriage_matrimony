import { auth } from "@/auth";
import { getMatchPreferences } from "@/lib/match-actions";
import PreferencesForm from "@/components/preferences-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PreferencesPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const preferences = await getMatchPreferences();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Preferences</h1>
                    <Link href="/matches">
                        <Button variant="outline">View Matches</Button>
                    </Link>
                </div>

                <PreferencesForm initialData={preferences} />
            </div>
        </div>
    );
}
