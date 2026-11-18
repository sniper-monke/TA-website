import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "@/reference/pages/Projects";
import { notFound } from "@tanstack/react-router";
import projects from "@/data/reference-projects.json";

export const Route = createFileRoute("/projects/$slug")({
  beforeLoad: ({ params }) => {
    if (!projects.some((project) => project.slug === params.slug)) throw notFound();
  },
  component: ProjectDetail,
});
