import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/configurator")({
  beforeLoad: () => {
    throw redirect({ to: "/build-a-room" });
  },
});
