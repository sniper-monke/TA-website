import imported from "@/data/shopify-products.json";
import type { StoreProduct } from "./storefront";
import { loadCatalogue, loadProduct } from "./shopify.server";

export const importedProducts = imported.products as StoreProduct[];
export const importReport = imported.report;
export async function catalogue() {
  return (
    (await loadCatalogue()) || {
      products: importedProducts.map((p) => ({ ...p, variants: [] })),
      families: imported.families,
    }
  );
}
export async function productByHandle(handle: string) {
  const live = await loadProduct(handle);
  if (live.mode === "shopify") return live;
  return { mode: "csv" as const, product: importedProducts.find((p) => p.slug === handle) || null };
}
