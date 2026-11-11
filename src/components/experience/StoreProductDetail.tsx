import type { StoreProduct } from "@/lib/storefront";
import { ProductExperience } from "./ProductExperience";

/** Live and preview products share the same presentation and selection behaviour. */
export function StoreProductDetail({ product }: { product: StoreProduct }) {
  return <ProductExperience product={product} />;
}
