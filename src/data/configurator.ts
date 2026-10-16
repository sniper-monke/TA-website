// DEMO configuration rules for the room configurator. Each configurable product
// supplies its own definition, so option sets and compatibility rules can differ
// per product (map to Shopify metafields later).
export interface Option {
  id: string;
  label: string;
  value: string;
  price?: number;
}
export interface ModuleOption {
  id: string;
  label: string;
  w: number; // panel width in room units
  h: number; // panel height in room units
  add?: number;
}
export interface ConfigDef {
  productName: string;
  basePrice: number;
  finishes: Option[]; // value = css colour for slats
  felts: Option[]; // value = css colour for backing
  modules: ModuleOption[];
  coverages: Option[]; // value = panel count per wall
  walls: Option[]; // value = rear | side | both
  layouts: Option[];
  validate: (s: ConfigState) => string | null;
}
export interface ConfigState {
  finish: string;
  felt: string;
  layout: string;
  module: string;
  coverage: string;
  walls: string;
}

export const slatWall: ConfigDef = {
  productName: "Acoustic Room Scheme (concept)",
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
  modules: [
    { id: "600", label: "600 × 600", w: 5, h: 5.4 },
    { id: "600x1200", label: "600 × 1200", w: 5, h: 9.5, add: 2400 },
    { id: "900", label: "900 × 900", w: 7, h: 7, add: 3200 },
  ],
  coverages: ["1", "2", "3", "4"].map((n) => ({
    id: n,
    label: `${n} ${+n > 1 ? "panels" : "panel"} / wall`,
    value: n,
  })),
  walls: [
    { id: "rear", label: "Rear wall", value: "rear" },
    { id: "side", label: "Side wall", value: "side" },
    { id: "both", label: "Both walls", value: "both" },
  ],
  layouts: [
    { id: "vertical", label: "Vertical slats", value: "vertical" },
    { id: "horizontal", label: "Horizontal slats", value: "horizontal" },
  ],
  validate: (s) => {
    if (s.felt === "bone" && s.finish === "ebony") {
      return "Smoked Ebony isn't offered over Bone felt (demo rule).";
    }
    if (s.walls === "both" && +s.coverage > 3) {
      return "Treating both walls supports up to 3 panels per wall (demo rule).";
    }
    return null;
  },
};
