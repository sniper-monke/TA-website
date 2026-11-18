import { createFileRoute } from "@tanstack/react-router";
import { GuideDetail } from "@/reference/pages/Guides";
import { notFound } from "@tanstack/react-router";
import { GUIDES } from "@/reference/data/guides";

export const Route = createFileRoute("/guides/$slug")({
  beforeLoad: ({ params }) => {
    if (!GUIDES.some((guide) => guide.slug === params.slug)) throw notFound();
  },
  component: GuideDetail,
});
