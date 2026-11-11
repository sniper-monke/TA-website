import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkout, checkoutInput, loadCatalogue } from "./shopify.server";

vi.mock("@tanstack/react-start/server", () => ({ getRequestIP: () => "192.0.2.10" }));

const fetchMock = vi.fn();
beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", "");
  vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});
const configure = () => {
  vi.stubEnv("SHOPIFY_STORE_DOMAIN", "timber-test.myshopify.com");
  vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "test-private-token");
};
const reply = (data: unknown) => ({ ok: true, json: async () => ({ data }) });

describe("Shopify connection boundary", () => {
  it("keeps the frontend in preview mode without contacting Shopify when unconfigured", async () => {
    expect(await loadCatalogue()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(
      checkout({ lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 1 }] }),
    ).rejects.toThrow("preview");
  });
  it("rejects partial configuration and domains outside Shopify instead of silently showing samples", async () => {
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "other.example");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "test-private-token");
    await expect(loadCatalogue()).rejects.toThrow("incomplete");
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("loads every catalogue page and forwards the private token and buyer IP only to Shopify", async () => {
    configure();
    const product = {
      handle: "panel",
      title: "Panel",
      description: "Acoustic panel",
      tags: [],
      priceRange: { minVariantPrice: { amount: "1200.50", currencyCode: "INR" } },
      images: { nodes: [{ url: "https://cdn.shopify.com/panel.jpg" }] },
      collections: { nodes: [{ handle: "panels", title: "Panels" }] },
      options: [],
      metafields: [],
    };
    fetchMock
      .mockResolvedValueOnce(
        reply({
          products: { nodes: [product], pageInfo: { hasNextPage: true, endCursor: "next" } },
        }),
      )
      .mockResolvedValueOnce(
        reply({
          products: {
            nodes: [{ ...product, handle: "second-panel" }],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        }),
      );
    const result = await loadCatalogue();
    expect(result?.products.map((p) => p.slug)).toEqual(["panel", "second-panel"]);
    expect(result?.products[0]?.price).toBe(1200.5);
    expect(result?.products[0]?.sample).toBe(false);
    expect(result?.families).toHaveLength(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://timber-test.myshopify.com/api/2026-10/graphql.json",
    );
    expect(fetchMock.mock.calls[0]?.[1].headers).toMatchObject({
      "Shopify-Storefront-Private-Token": "test-private-token",
      "Shopify-Storefront-Buyer-IP": "192.0.2.10",
    });
    expect(JSON.parse(fetchMock.mock.calls[1]?.[1].body).variables.after).toBe("next");
  });
  it("does not fall back to sample data after a shop API failure", async () => {
    configure();
    fetchMock.mockResolvedValue({ ok: false });
    await expect(loadCatalogue()).rejects.toThrow("temporarily unavailable");
  });
  it("rejects sample product identifiers and invalid quantities at the checkout boundary", () => {
    expect(
      checkoutInput.safeParse({ lines: [{ merchandiseId: "slat-panel-2400", quantity: 1 }] })
        .success,
    ).toBe(false);
    expect(
      checkoutInput.safeParse({
        lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 0 }],
      }).success,
    ).toBe(false);
  });
  it("returns Shopify checkout only when the whole requested bag is available", async () => {
    configure();
    const input = { lines: [{ merchandiseId: "gid://shopify/ProductVariant/1", quantity: 2 }] };
    fetchMock.mockResolvedValueOnce(
      reply({
        cartCreate: {
          cart: {
            checkoutUrl: "https://timber-test.myshopify.com/checkouts/test",
            totalQuantity: 2,
          },
          warnings: [],
          userErrors: [],
        },
      }),
    );
    await expect(checkout(input)).resolves.toEqual({
      checkoutUrl: "https://timber-test.myshopify.com/checkouts/test",
    });
    fetchMock.mockResolvedValueOnce(
      reply({
        cartCreate: {
          cart: {
            checkoutUrl: "https://timber-test.myshopify.com/checkouts/test",
            totalQuantity: 1,
          },
          warnings: [],
          userErrors: [],
        },
      }),
    );
    await expect(checkout(input)).rejects.toThrow("requested quantity");
    fetchMock.mockResolvedValueOnce(
      reply({
        cartCreate: {
          cart: null,
          warnings: [],
          userErrors: [{ message: "This item is sold out." }],
        },
      }),
    );
    await expect(checkout(input)).rejects.toThrow("sold out");
  });
});
