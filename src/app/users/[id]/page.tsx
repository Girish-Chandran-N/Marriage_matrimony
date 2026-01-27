import { getProfileDetails } from "@/lib/user-actions";
import { getMatchPreferences } from "@/lib/match-actions";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ResponsiveProfileView } from "./responsive-view";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Authorization Check
    const session = await auth();
    const isOwner = session?.user?.id === id;

    const profile = await getProfileDetails(id);
    const preferences = await getMatchPreferences();

    if (!profile) {
        return notFound();
    }

    const { calculateMatchBreakdown } = await import("@/lib/matching");
    const breakdown = !isOwner && preferences ? calculateMatchBreakdown(profile, preferences) : undefined;

    return (
        <ResponsiveProfileView profile={profile} isOwner={isOwner} matchBreakdown={breakdown} />
    );
}
