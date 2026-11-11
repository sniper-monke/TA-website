import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBagPage } from "@/components/experience/ShoppingBagPage";
export const Route = createFileRoute("/basket")({ component: ShoppingBagPage });
