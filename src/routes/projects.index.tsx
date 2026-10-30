import { createFileRoute } from "@tanstack/react-router";
import Projects from "@/reference/pages/Projects";
export const Route = createFileRoute("/projects/")({ component: Projects });
