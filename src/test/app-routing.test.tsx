import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/commerce", () => ({
  getStoreProduct: vi.fn(async () => ({ product: null })),
  getCatalogue: vi.fn(async () => ({ products: [], families: [] })),
  beginCheckout: vi.fn(),
}));

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    "/products",
    "/products/a-product",
    "/projects",
    "/projects/the-listening-retreat",
    "/guides",
    "/guides/home-theatre",
    "/story",
    "/build-a-room",
    "/configurator",
    "/basket",
    "/contact",
    "/admin",
    "/admin/login",
    "/admin/other",
  ])("matches the intended page at %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each(["/products/nonexistent", "/projects/nonexistent", "/guides/nonexistent"])(
    "rejects a nonexistent record before rendering %s",
    async (path) => {
      const router = createRouter({
        routeTree,
        context: { queryClient: new QueryClient() },
      });
      const match = router.matchRoutes(path).at(-1)!;
      const route = router.routesById[match.routeId]!;
      await expect(async () => {
        if (typeof route.options.beforeLoad === "function")
          await route.options.beforeLoad({ params: match.params } as never);
        if (typeof route.options.loader === "function")
          await route.options.loader({ params: match.params } as never);
      }).rejects.toMatchObject({ isNotFound: true });
    },
  );
});
