import { createFileRoute } from "@tanstack/react-router";
import Guides from "@/reference/pages/Guides";
export const Route = createFileRoute("/guides/")({ component: Guides });
