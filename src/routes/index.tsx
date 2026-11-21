import { createFileRoute } from "@tanstack/react-router";
import { HomeExperience } from "@/components/experience/HomeExperience";
import lenisCss from "lenis/dist/lenis.css?url";
import homeRedesignCss from "../home-redesign.css?url";

const title = "Timber Acoustics | Wood Acoustic Panels, Diffusers & Bass Traps";
const description =
  "Explore Timber Acoustics’ wood acoustic panels, sound diffusers and bass traps for studios, listening rooms, home theatres and commercial spaces.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [
      { rel: "stylesheet", href: lenisCss },
      { rel: "stylesheet", href: homeRedesignCss },
    ],
  }),
  component: HomeExperience,
});
