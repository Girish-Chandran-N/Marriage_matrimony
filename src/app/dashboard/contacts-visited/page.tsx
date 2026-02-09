import { getContactsVisited } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function ContactsVisitedPage() {
    const data = await getContactsVisited();
    return (
        <DashboardSectionList
            title="Contacts Visited"
            items={data}
            userKey="profile"
            emptyMessage="You haven't viewed any contact details yet."
        />
    );
}
