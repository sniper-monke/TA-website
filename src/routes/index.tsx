import { createFileRoute } from "@tanstack/react-router";
import { HomeExperience } from "@/components/experience/HomeExperience";
import homeDesignCss from "../home-design-v2.css?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Timber Acoustics — Sound, in better shape." },
      {
        name: "description",
        content:
          "Natural timber, considered acoustics. Explore acoustic surfaces and create a space that sounds as good as it looks.",
      },
    ],
    links: [{ rel: "stylesheet", href: homeDesignCss }],
  }),
  component: HomeExperience,
});
