import { createFileRoute } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "All products — Timber Acoustics" },
      { name: "description", content: "Browse acoustic panels, TimberSlat, diffusers, bass traps, room kits and racks." },
      { property: "og:title", content: "All products — Timber Acoustics" },
      { property: "og:description", content: "Browse the full Timber Acoustics range." },
    ],
  }),
  component: () => (<><PageHero eyebrow="Catalogue · demo data" title="All products" /><Catalogue /></>),
});
