import { afterEach, describe, expect, it, vi } from "vitest";
import { catalogue, productByHandle } from "./catalogue.server";
vi.mock("./shopify.server", () => ({
  loadCatalogue: vi.fn(async () => null),
  loadProduct: vi.fn(async () => ({ mode: "preview", product: null })),
}));
import { loadCatalogue } from "./shopify.server";
afterEach(() => vi.clearAllMocks());
describe("CSV catalogue fallback", () => {
  it("serves imported listings without sending all variants on every page", async () => {
    const data = await catalogue();
    expect(data.products).toHaveLength(79);
    expect(data.products.every((p) => p.source === "csv" && !p.variants.length)).toBe(true);
    const detail = await productByHandle(data.products[0]!.slug);
    expect(detail.mode).toBe("csv");
    expect(detail.product?.variants.length).toBeGreaterThan(0);
    expect((await productByHandle("missing-product")).product).toBeNull();
  });
  it("surfaces Shopify failures instead of falling back to export prices", async () => {
    vi.mocked(loadCatalogue).mockRejectedValueOnce(new Error("Shop unavailable"));
    await expect(catalogue()).rejects.toThrow("Shop unavailable");
  });
});
