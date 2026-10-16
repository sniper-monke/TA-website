// DEMO DATA — representative products for the design prototype only.
// Names, prices and specs are placeholders, not Timber Acoustics' real catalogue.
// Shape loosely mirrors Shopify: product -> variants (options) + metafields (specs).
import studio from "@/assets/hero-studio.jpg";
import slats from "@/assets/macro-slats.jpg";
import diffuser from "@/assets/diffuser.jpg";
import office from "@/assets/office.jpg";

export const images = { studio, slats, diffuser, office };

export type FamilySlug =
  | "absorption"
  | "timberslat"
  | "bass-traps"
  | "diffusion"
  | "room-kits"
  | "racks-and-tables";

export interface Family {
  slug: FamilySlug;
  name: string;
  index: string;
  principle: "Absorption" | "Diffusion" | "Low-frequency control" | "Systems" | "Furniture";
  blurb: string;
  image: string;
}

export const families: Family[] = [
  { slug: "absorption", index: "01", name: "Absorption Panels", principle: "Absorption", blurb: "Convert reflected energy into heat. Shorter reverb, clearer speech.", image: office },
  { slug: "timberslat", index: "02", name: "TimberSlat", principle: "Absorption", blurb: "Solid slats over acoustic felt — architecture that listens.", image: slats },
  { slug: "bass-traps", index: "03", name: "Bass Traps", principle: "Low-frequency control", blurb: "Corner mass for the frequencies rooms love to exaggerate.", image: studio },
  { slug: "diffusion", index: "04", name: "Diffusion", principle: "Diffusion", blurb: "Scatter, don't kill. Keep a room alive without flutter.", image: diffuser },
  { slug: "room-kits", index: "05", name: "Room Kits", principle: "Systems", blurb: "Matched sets specified for common room sizes.", image: studio },
  { slug: "racks-and-tables", index: "06", name: "Racks & Tables", principle: "Furniture", blurb: "Timber furniture for the gear that fills the room.", image: slats },
];

export interface Finish { id: string; name: string; swatch: string }
export interface Product {
  slug: string;
  name: string;
  family: FamilySlug;
  purpose: string;
  price: number; // INR, demo
  nrc?: number;
  dims: string;
  material: string;
  installation: string;
  finishes: Finish[];
  sizes: string[];
  gallery: string[];
  featured?: boolean;
}

const wood: Finish[] = [
  { id: "oak", name: "Natural Oak", swatch: "oklch(0.72 0.08 75)" },
  { id: "walnut", name: "Walnut", swatch: "oklch(0.42 0.06 50)" },
  { id: "ebony", name: "Smoked Ebony", swatch: "oklch(0.25 0.01 60)" },
];
const fabric: Finish[] = [
  { id: "charcoal", name: "Charcoal Felt", swatch: "oklch(0.3 0.005 120)" },
  { id: "rust", name: "Rust Felt", swatch: "oklch(0.58 0.16 40)" },
  { id: "bone", name: "Bone Felt", swatch: "oklch(0.88 0.02 85)" },
];

export const products: Product[] = [
  { slug: "slat-panel-2400", name: "Slat Panel 2400", family: "timberslat", purpose: "Floor-to-ceiling slat wall absorber for studios and lounges.", price: 14900, nrc: 0.85, dims: "2400 × 600 × 21 mm", material: "Veneered MDF slats, 9 mm polyester felt", installation: "Screw-fix to battens or direct to wall", finishes: wood, sizes: ["2400 mm", "1200 mm"], gallery: [slats, studio, office], featured: true },
  { slug: "felt-tile-600", name: "Felt Tile 600", family: "absorption", purpose: "Fabric-wrapped broadband absorber for first reflections.", price: 4200, nrc: 0.9, dims: "600 × 600 × 50 mm", material: "Mineral core, acoustic fabric wrap, timber frame", installation: "Z-clip or adhesive", finishes: fabric, sizes: ["600 × 600", "1200 × 600"], gallery: [office, slats], featured: true },
  { slug: "qrd-diffuser-7", name: "QRD Diffuser 7", family: "diffusion", purpose: "Prime-7 quadratic residue diffuser for rear walls.", price: 9800, dims: "600 × 600 × 120 mm", material: "Solid birch blocks", installation: "French cleat", finishes: wood, sizes: ["600 × 600"], gallery: [diffuser, studio], featured: true },
  { slug: "skyline-2d", name: "Skyline 2D", family: "diffusion", purpose: "Two-dimensional block diffuser for ceilings and back walls.", price: 11500, dims: "600 × 600 × 150 mm", material: "Solid pine blocks", installation: "Ceiling grid or cleat", finishes: wood, sizes: ["600 × 600"], gallery: [diffuser] },
  { slug: "corner-trap-pro", name: "Corner Trap Pro", family: "bass-traps", purpose: "Floor-to-ceiling corner absorber targeting low-mid buildup.", price: 12400, nrc: 1.0, dims: "1200 × 400 × 400 mm", material: "High-density mineral wool, fabric, timber", installation: "Free-standing", finishes: fabric, sizes: ["1200 mm", "1800 mm"], gallery: [studio, office], featured: true },
  { slug: "membrane-trap", name: "Membrane Trap", family: "bass-traps", purpose: "Tuned pressure absorber for modal problems.", price: 18900, dims: "1200 × 600 × 200 mm", material: "Sealed timber cabinet, membrane", installation: "Wall-mount", finishes: wood, sizes: ["1200 × 600"], gallery: [studio] },
  { slug: "edge-panel-1200", name: "Edge Panel 1200", family: "absorption", purpose: "Slim bevelled absorber for offices and meeting rooms.", price: 6900, nrc: 0.8, dims: "1200 × 600 × 40 mm", material: "PET felt, bevelled edges", installation: "Adhesive or hanging rail", finishes: fabric, sizes: ["1200 × 600"], gallery: [office] },
  { slug: "studio-kit-s", name: "Studio Kit S", family: "room-kits", purpose: "Starter treatment for rooms up to 12 m².", price: 48000, dims: "8 panels + 2 traps", material: "Mixed", installation: "Includes fixings", finishes: fabric, sizes: ["Up to 12 m²"], gallery: [studio, slats] },
  { slug: "studio-kit-m", name: "Studio Kit M", family: "room-kits", purpose: "Balanced absorption and diffusion for 12–20 m².", price: 82000, dims: "12 panels + 4 traps + 2 diffusers", material: "Mixed", installation: "Includes fixings", finishes: fabric, sizes: ["12–20 m²"], gallery: [studio, diffuser] },
  { slug: "rack-6u", name: "Desk Rack 6U", family: "racks-and-tables", purpose: "Solid timber rack for outboard gear.", price: 16500, dims: "6U, 19 in", material: "Solid oak", installation: "Free-standing", finishes: wood, sizes: ["6U", "10U"], gallery: [slats, studio] },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getFamily = (slug: string) => families.find((f) => f.slug === slug);
export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");
