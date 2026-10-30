import { createFileRoute } from "@tanstack/react-router";
import Products from "@/reference/pages/Products";
export const Route = createFileRoute("/products/")({ component: Products });
