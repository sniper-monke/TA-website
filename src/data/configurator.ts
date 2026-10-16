// DEMO configuration rules. Each configurable product supplies its own definition,
// so option sets and compatibility rules can differ per product (map to Shopify metafields later).
export interface Option { id: string; label: string; value: string; price?: number }
export interface ConfigDef {
  productName: string;
  basePrice: number;
  finishes: Option[];  // value = css colour for slat
  felts: Option[];     // value = css colour for backing
  modules: Option[];   // value = module count
  layouts: Option[];
  validate: (s: ConfigState) => string | null;
}
export interface ConfigState { finish: string; felt: string; modules: string; layout: string }

export const slatWall: ConfigDef = {
  productName: "Slat Wall System (concept)",
  basePrice: 14900,
  finishes: [
    { id: "oak", label: "Natural Oak", value: "oklch(0.72 0.08 75)" },
    { id: "walnut", label: "Walnut", value: "oklch(0.45 0.07 50)", price: 1500 },
    { id: "ebony", label: "Smoked Ebony", value: "oklch(0.28 0.01 60)", price: 2500 },
  ],
  felts: [
    { id: "charcoal", label: "Charcoal", value: "oklch(0.22 0.005 120)" },
    { id: "rust", label: "Rust", value: "oklch(0.55 0.15 40)" },
    { id: "bone", label: "Bone", value: "oklch(0.88 0.02 85)" },
  ],
  modules: ["2", "3", "4", "6", "8"].map((n) => ({ id: n, label: `${n} modules`, value: n })),
  layouts: [
    { id: "vertical", label: "Vertical", value: "vertical" },
    { id: "horizontal", label: "Horizontal", value: "horizontal" },
  ],
  validate: (s) => {
    if (s.felt === "bone" && s.finish === "ebony") return "Smoked Ebony isn't offered over Bone felt (demo rule).";
    if (s.layout === "horizontal" && +s.modules > 4) return "Horizontal layout supports up to 4 modules.";
    return null;
  },
};
