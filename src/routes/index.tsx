import { createFileRoute } from "@tanstack/react-router";
import { CinematicInvitation } from "@/components/invitation/CinematicInvitation";
import {
  Footer,
  LiveWeddingSection,
  SaveTheDateSection,
  VenueSection,
  WeddingDetailsSection,
} from "@/components/sections/WeddingSections";

const title = "Ralph & Venilda — Wedding Invitation · January 1st, 2027";
const description =
  "Join Ralph & Venilda on January 1st, 2027 at 5:30 PM, St. Mary's Syrian (S.M.S) Community Hall, Varamballi, Brahmavara, Udupi.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <CinematicInvitation />
      <SaveTheDateSection />
      <WeddingDetailsSection />
      <VenueSection />
      <LiveWeddingSection />
      <Footer />
    </main>
  );
}
