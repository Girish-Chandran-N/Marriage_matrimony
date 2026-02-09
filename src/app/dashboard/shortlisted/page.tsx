import { getShortlistedProfiles } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function ShortlistedPage() {
    const data = await getShortlistedProfiles();
    return (
        <DashboardSectionList
            title="Shortlisted Profiles"
            items={data}
            userKey="shortlistedUser"
            emptyMessage="You haven't shortlisted anyone yet."
        />
    );
}
