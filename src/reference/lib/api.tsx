/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import products from "@/data/reference-products.json";
import projects from "@/data/reference-projects.json";
import families from "@/data/reference-families.json";
const missing = () => Object.assign(new Error("Not found"), { response: { status: 404 } });
export const fetchProducts = async () => products;
export const fetchProduct = async (slug) =>
  products.find((p) => p.slug === slug) || Promise.reject(missing());
export const fetchFamilies = async () => families;
export const api = {
  get: async (path) => {
    if (path === "/projects") return { data: projects };
    if (path === "/products") return { data: products };
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
  e.response?.data?.detail || "Something went wrong. Please try again.";
export const mediaUrl = (url) => url;
export const formatPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");
