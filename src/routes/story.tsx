import { createFileRoute } from "@tanstack/react-router";
import Story from "@/reference/pages/Story";
export const Route = createFileRoute("/story")({ component: Story });
