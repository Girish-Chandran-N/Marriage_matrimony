import { auth } from "@/auth";
import { getMyProfile } from "@/lib/user-actions";
import { redirect } from "next/navigation";
import ProfileEditClient from "./client-view";

export default async function ProfileEditPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/login");
    }

    const profile = await getMyProfile();
    if (!profile) {
        redirect("/profile/setup");
    }

    // Serialize to plain JSON to handle Date objects passed to Client Component
    const serializedProfile = JSON.parse(JSON.stringify(profile));

    return <ProfileEditClient profile={serializedProfile} />;
}
