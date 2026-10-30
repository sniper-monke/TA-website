/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
export const ROOM_TYPES = [
  {
    id: "home-theatre",
    label: "Home Theatre",
    dims: "5.2 × 4.1 m",
    note: "Rear + side treatment behind the screen wall",
    preset: { coverage: "3", walls: "both" },
  },
  {
    id: "listening-room",
    label: "Listening Room",
    dims: "4.5 × 3.6 m",
    note: "First-reflection control for two-channel systems",
    preset: { coverage: "2", walls: "rear" },
  },
  {
    id: "studio",
    label: "Studio",
    dims: "4.0 × 3.2 m",
    note: "Denser coverage for mixing and recording",
    preset: { coverage: "3", walls: "both" },
  },
  {
    id: "office",
    label: "Office",
    dims: "6.0 × 4.5 m",
    note: "Speech clarity for meeting and work spaces",
    preset: { coverage: "2", walls: "side" },
  },
];

export const CONFIG = {
  basePrice: 14900,
  finishes: [
    { id: "oak", label: "Natural Oak", value: "#C9A875" },
    { id: "walnut", label: "Walnut", value: "#6B4A33", price: 1500 },
    { id: "ebony", label: "Smoked Ebony", value: "#3B3A38", price: 2500 },
  ],
  felts: [
    { id: "charcoal", label: "Charcoal", value: "#43423F" },
    { id: "rust", label: "Rust", value: "#BF673B" },
    { id: "bone", label: "Bone", value: "#EDE4D3" },
  ],
  modules: [
    { id: "600", label: "600 × 600", w: 92, h: 92 },
    { id: "600x1200", label: "600 × 1200", w: 92, h: 160, add: 2400 },
    { id: "900", label: "900 × 900", w: 120, h: 120, add: 3200 },
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
