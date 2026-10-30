import { createFileRoute } from "@tanstack/react-router";
import { GuideDetail } from "@/reference/pages/Guides";
export const Route = createFileRoute("/guides/$slug")({ component: GuideDetail });
