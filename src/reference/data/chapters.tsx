/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
export const IMG = {
  hero_slat: "/reference-photos/photo-18.jpg",
  studio: "/reference-photos/photo-7.jpg",
  workshop: "/reference-photos/photo-19.jpg",
  home_theater: "/reference-photos/photo-20.jpg",
  diffuser_geo: "/reference-photos/photo-6.jpg",
  bass_corner: "/reference-photos/photo-9.jpg",
  listening: "/reference-photos/photo-11.jpg",
  office: "/reference-photos/photo-5.jpg",
  workshop_2: "/reference-photos/photo-21.jpg",
  material: "/reference-photos/photo-22.jpg",
  living: "/reference-photos/photo-23.jpg",
  slat_panel: "/reference-photos/photo-14.jpg",
};

export const CHAPTERS = [
  {
    id: "absorb",
    number: "01",
    word: "Absorb",
    title: "Catch the sound before it returns.",
    description:
      "Open timber faces and concealed mineral cores soften the first reflection, letting speech and instruments land without flattening the room.",
    image: IMG.slat_panel,
    alt: "Macro view of timber slats over acoustic felt",
  },
  {
    id: "diffuse",
    number: "02",
    word: "Diffuse",
    title: "Keep the detail. Lose the chaos.",
    description:
      "Faceted surfaces divide sound energy into smaller reflections, preserving air and dimension while removing hard edges from the room.",
    image: IMG.diffuser_geo,
    alt: "Timber diffuser breaking a reflection into scattered paths",
  },
  {
    id: "trap",
    number: "03",
    word: "Trap",
    title: "Put the low end back in proportion.",
    description:
      "Dense cores and deep cavities collect pressure where rooms naturally store it: corners, junctions, and structural seams.",
    image: IMG.bass_corner,
    alt: "Studio corner where low frequency build-up is managed",
  },
  {
    id: "shape",
    number: "04",
    word: "Shape",
    title: "Bend the wall until the room responds.",
    description:
      "Modules arc, split, and recompose so the acoustic surface can follow a staircase, a listening wall, or a room that refuses symmetry.",
    image: IMG.hero_slat,
    alt: "Timber slat wall following the geometry of a working space",
  },
  {
    id: "tune",
    number: "05",
    word: "Tune",
    title: "The room becomes the instrument.",
    description:
      "Absorption, diffusion, pressure, and form are adjusted as one composition until the space sounds inevitable rather than corrected.",
    image: IMG.living,
    alt: "Finished acoustic surface after the room has been tuned",
  },
];
