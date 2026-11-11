import { useQuery } from "@tanstack/react-query";
import { fetchCatalogue } from "@/reference/lib/api";
import demoProducts from "@/data/reference-products.json";
import demoFamilies from "@/data/reference-families.json";
import type { StoreProduct } from "@/lib/storefront";

export type CatalogueProduct = (typeof demoProducts)[number] | StoreProduct;
export function useCatalogue() {
  return useQuery({
    queryKey: ["storefront-catalogue"],
    queryFn: async () =>
      (await fetchCatalogue()) as {
        products: CatalogueProduct[];
        families: (typeof demoFamilies)[number][];
      },
    staleTime: 30000,
    retry: 1,
  });
}
