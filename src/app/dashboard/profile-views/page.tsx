import { getProfileViews } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function ProfileViewsPage() {
    const data = await getProfileViews();
    return (
        <DashboardSectionList
            title="Profile Views"
            items={data}
            userKey="viewer"
            emptyMessage="Start being active to get more profile views!"
        />
    );
}
