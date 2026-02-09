import { getProfileVisited } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function ProfileVisitedPage() {
    const data = await getProfileVisited();
    return (
        <DashboardSectionList
            title="Profiles Visited"
            items={data}
            userKey="profile"
            emptyMessage="You haven't visited any profiles yet."
        />
    );
}
