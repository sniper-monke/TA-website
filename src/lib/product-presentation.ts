import demoProducts from "@/data/reference-products.json";
import type { StoreProduct } from "./storefront";

export type DemoProduct = (typeof demoProducts)[number];
export type ProductItem = DemoProduct | StoreProduct;
export const isStoreProduct = (product: ProductItem): product is StoreProduct =>
  "source" in product && product.source === "shopify";

export function productGuidance(family: string) {
  if (family === "racks-and-tables")
    return {
      furniture: true,
      principle: "Studio furniture",
      headline: "A considered place for your setup.",
      overview:
        "Start with the equipment you use and the way you work. Check dimensions, access and cable routes before choosing a piece for your studio or listening space.",
      performanceTitle: "Make space for the equipment.",
      performance:
        "Check usable dimensions and equipment clearances with the team. Load ratings and assembly details should come from the final product sheet; an acoustic absorption rating does not apply to furniture.",
      benefits: [
        "Equipment in its place",
        "Material & finish choices",
        "A setup that fits your space",
      ],
    };
  if (family === "diffusion")
    return {
      furniture: false,
      principle: "Diffusion",
      headline: "Keep the life. Soften the reflections.",
      overview:
        "Diffusers use surface geometry to scatter reflections in different directions. They can form part of a balanced treatment plan where the room and listening distance suit the design.",
      performanceTitle: "Geometry makes a difference.",
      performance:
        "Diffusion is frequency-dependent. Ask for the product's working frequency range, scattering data and recommended listening distance before deciding on placement. An NRC figure alone does not describe diffusion.",
      benefits: [
        "Considered reflection control",
        "Sculpted material geometry",
        "Placement-led treatment",
      ],
    };
  if (family === "bass-traps")
    return {
      furniture: false,
      principle: "Bass management",
      headline: "A more balanced foundation for your room.",
      overview:
        "Low-frequency treatment starts with the room, the listening position and the frequencies that linger. Choose treatment depth and placement around those needs, then listen and measure again.",
      performanceTitle: "Look beyond a single number.",
      performance:
        "Bass treatment needs frequency-specific data and installation details. Ask the team about useful bandwidth, depth and placement for this design. A single absorption rating cannot establish low-frequency performance.",
      benefits: ["Low-frequency focus", "Room-led placement", "A considered treatment plan"],
    };
  if (family === "room-kits")
    return {
      furniture: false,
      principle: "Room treatment",
      headline: "Bring the whole room into balance.",
      overview:
        "A coordinated room kit is a starting point for planning treatment. Consider the room dimensions, listening position and intended use before choosing a set or deciding where each piece belongs.",
      performanceTitle: "The room is part of the specification.",
      performance:
        "The results of a treatment scheme depend on the room, the products included and their placement. Confirm the kit contents and individual product data, then review the room after installation.",
      benefits: [
        "A coordinated starting point",
        "Room-led treatment choices",
        "Placement guidance",
      ],
    };
  return {
    furniture: false,
    principle: "Absorption",
    headline: "A little less echo. A little more clarity.",
    overview:
      "Absorptive treatment helps manage reflected sound. The face material, acoustic core, thickness and mounting work together, so the right choice starts with the way you use the room.",
    performanceTitle: "Specify with the full picture.",
    performance:
      "Review the tested frequency response and mounting conditions alongside any single-number rating. Thickness, backing and installation can change how a treatment behaves, so confirm the final product data before specifying.",
    benefits: [
      "Considered reflection control",
      "Material & finish choices",
      "A calmer acoustic setting",
    ],
  };
}
