import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/collections/$family")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/products?family=${encodeURIComponent(params.family)}` });
  },
});
