import { getNewMatches } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function NewMatchesPage() {
    const data = await getNewMatches();
    return (
        <DashboardSectionList
            title="New Matches"
            items={data}
            userKey="user" // Since getNewMatches returns { user: User, score: ... }
            emptyMessage="No new matches found recently. Try adjusting your preferences."
        />
    );
}
