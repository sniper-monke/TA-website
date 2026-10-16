import { images } from "@/data/products";

export type Chapter = {
  id: string;
  number: string;
  word: string;
  label: string;
  title: string;
  description: string;
  story: string;
  stat: string;
  accent: string;
  image: string;
  alt: string;
};

export const chapters: Chapter[] = [
  {
    id: "absorb",
    number: "01",
    word: "Absorb",
    label: "Porous field / first reflection",
    title: "Catch the sound before it returns.",
    description:
      "Open timber faces and concealed mineral cores soften the first reflection, letting speech and instruments land without flattening the room.",
    story:
      "The first prototype was built from offcuts: a wall that looked calm because it was quietly doing the work.",
    stat: "RT60 / 0.42s",
    accent: "#D4A373",
    image: images.slats,
    alt: "Macro view of walnut slats over charcoal acoustic felt",
  },
  {
    id: "diffuse",
    number: "02",
    word: "Diffuse",
    label: "Geometry / controlled scatter",
    title: "Keep the detail. Lose the chaos.",
    description:
      "Faceted surfaces divide sound energy into smaller reflections, preserving air and dimension while removing hard edges from the room.",
    story: "A ceiling study became a diffuser when the shadows began to measure the reflections.",
    stat: "1D / quadratic",
    accent: "#C85A27",
    image: images.diffuser,
    alt: "Timber diffuser breaking a reflection into scattered paths",
  },
  {
    id: "trap",
    number: "03",
    word: "Trap",
    label: "Low frequency / pressure control",
    title: "Put the low end back in proportion.",
    description:
      "Dense graphite cores and deep cavities collect pressure where rooms naturally store it: corners, junctions, and structural seams.",
    story:
      "Bass was treated as architecture—not volume, but weight distributed through the envelope.",
    stat: "LF / 80–160Hz",
    accent: "#4A3525",
    image: images.studio,
    alt: "Studio control room where low frequency build-up is managed",
  },
  {
    id: "shape",
    number: "04",
    word: "Shape",
    label: "Curvature / spatial tuning",
    title: "Bend the wall until the room responds.",
    description:
      "Meridian modules arc, split, and recompose so the acoustic surface can follow a staircase, a listening wall, or a room that refuses symmetry.",
    story:
      "The system stopped being a panel when it began behaving like joinery: measured, repeatable, and free to curve.",
    stat: "R / 1200–∞",
    accent: "#E8E3D5",
    image: images.office,
    alt: "Timber slat wall following the geometry of a working space",
  },
  {
    id: "tune",
    number: "05",
    word: "Tune",
    label: "Calibration / final equilibrium",
    title: "The room becomes the instrument.",
    description:
      "Absorption, diffusion, pressure, and form are adjusted as one composition until the space sounds inevitable rather than corrected.",
    story:
      "The final test is not a graph. It is the moment a listener stops noticing the treatment.",
    stat: "EQ / room balance",
    accent: "#F4F0EA",
    image: images.slats,
    alt: "Finished acoustic surface after the room has been tuned",
  },
];
