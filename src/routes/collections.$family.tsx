import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import families from "@/data/reference-families.json";
export const Route = createFileRoute("/collections/$family")({
  beforeLoad: ({ params }) => {
    if (!families.some((family) => family.slug === params.family)) throw notFound();
    throw redirect({ href: `/products?family=${encodeURIComponent(params.family)}` });
  },
});
