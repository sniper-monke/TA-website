import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/reference/pages/ProductDetail";
export const Route = createFileRoute("/products/$slug")({ component: ProductDetail });
