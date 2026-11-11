/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import products from "@/data/reference-products.json";
import projects from "@/data/reference-projects.json";
import families from "@/data/reference-families.json";
import { getCatalogue, getStoreProduct } from "@/lib/commerce";
import { money } from "@/lib/storefront";
const missing = () => Object.assign(new Error("Not found"), { response: { status: 404 } });
let pendingCatalogue;
export const fetchCatalogue = () => {
  if (!pendingCatalogue) {
    pendingCatalogue = getCatalogue().then((catalogue) => catalogue || { products, families });
    // Deduplicate simultaneous readers without caching inventory across visits.
    pendingCatalogue
      .finally(() => {
        pendingCatalogue = undefined;
      })
      .catch(() => {});
  }
  return pendingCatalogue;
};
export const fetchProducts = async () => (await fetchCatalogue()).products;
export const fetchProduct = async (slug) => {
  const result = await getStoreProduct({ data: { handle: slug } });
  if (result.mode === "shopify") return result.product || Promise.reject(missing());
  return products.find((p) => p.slug === slug) || Promise.reject(missing());
};
export const fetchFamilies = async () => (await fetchCatalogue()).families;
export const api = {
  get: async (path) => {
    if (path === "/projects") return { data: projects };
    if (path === "/products") return { data: await fetchProducts() };
    if (path.startsWith("/projects/")) {
      const project = projects.find((p) => p.slug === path.slice(10));
      if (!project) throw missing();
      return { data: project };
    }
    throw missing();
  },
  post: async () => {
    throw Object.assign(new Error("Enquiries are not configured."), {
      response: { data: { detail: "Enquiries are not configured on this preview." } },
    });
  },
};
export const errorMessage = (e) =>
  e.response?.data?.detail || e.message || "Something went wrong. Please try again.";
export const mediaUrl = (url) => url;
export const formatPrice = (n, currency = "INR") => money(n, currency);
