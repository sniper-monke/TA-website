import { createFileRoute, redirect } from "@tanstack/react-router";
import { adminIdentity } from "@/lib/admin";
import { AdminWorkspace } from "@/components/admin/AdminWorkspace";
import adminCss from "@/components/admin/admin.css?url";
export const Route = createFileRoute("/admin/")({
  head: () => ({ links: [{ rel: "stylesheet", href: adminCss }] }),
  beforeLoad: async () => {
    if (!(await adminIdentity())) throw redirect({ to: "/admin/login" });
  },
  component: AdminWorkspace,
});
