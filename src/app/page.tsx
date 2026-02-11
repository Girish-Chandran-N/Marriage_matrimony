import { getHighlightedProfiles } from "@/lib/home-actions";
import { HomeClient } from "./home-client";

export default async function Home() {
  const highlightedProfiles = await getHighlightedProfiles(15);

  return (
    <>
      <HomeClient highlightedProfiles={highlightedProfiles} />
    </>
  );
}
