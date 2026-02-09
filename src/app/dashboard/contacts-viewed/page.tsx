import { getContactsViewed } from "@/lib/dashboard-actions";
import { DashboardSectionList } from "@/components/dashboard/dashboard-section-list";

export default async function ContactsViewedPage() {
    const data = await getContactsViewed();
    return (
        <DashboardSectionList
            title="Contacts Viewed"
            items={data}
            userKey="viewer"
            emptyMessage="No one has viewed your contact details yet."
        />
    );
}
