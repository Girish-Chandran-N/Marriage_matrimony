import { getInterestReceived } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function InterestReceivedPage() {
    const data = await getInterestReceived();
    return (
        <DashboardSectionList
            title="Interest Received"
            items={data}
            userKey="sender"
            emptyMessage="No one has sent you an interest yet."
        />
    );
}
