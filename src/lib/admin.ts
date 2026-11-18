import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }))
  .handler(async ({ data }) => (await import("./admin.server")).login(data.email, data.password));
export const adminIdentity = createServerFn({ method: "GET" }).handler(async () =>
  (await import("./admin.server")).identity(),
);
export const adminLogout = createServerFn({ method: "POST" }).handler(async () =>
  (await import("./admin.server")).logout(),
);
export const adminDashboard = createServerFn({ method: "GET" }).handler(async () =>
  (await import("./admin.server")).dashboard(),
);
export const adminProduct = createServerFn({ method: "GET" })
  .validator(z.object({ handle: z.string().min(1).max(255) }))
  .handler(async ({ data }) => {
    if (!(await (await import("./admin.server")).identity()))
      throw new Error("Sign in to view products.");
    return (await import("./catalogue.server")).productByHandle(data.handle);
  });
