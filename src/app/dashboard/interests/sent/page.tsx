import { getInterestSent } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function InterestSentPage() {
    const data = await getInterestSent();
    return (
        <DashboardSectionList
            title="Interest Sent"
            items={data}
            userKey="receiver"
            emptyMessage="You haven't sent any interests yet."
        />
    );
}
