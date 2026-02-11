import { HighlightedProfiles } from "@/components/home/highlighted-profiles";
import { getHighlightedProfiles } from "@/lib/home-actions";
import { HomeClient } from "./home-client";

export default async function Home() {
  const highlightedProfiles = await getHighlightedProfiles(15);

  return (
    <>
      <HomeClient />
      <HighlightedProfiles profiles={highlightedProfiles} />
    </>
  );
}
