import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "@/reference/pages/Projects";
export const Route = createFileRoute("/projects/$slug")({ component: ProjectDetail });
