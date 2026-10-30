/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
export const EDITORIAL_IMAGES = {
  hero: "/images/timber-hero.webp",
  slat: "/images/timber-detail.webp",
  theatre: "/images/timber-theatre.webp",
  studio: "/images/timber-studio.webp",
  office: "/images/timber-office.webp",
};

export const GUIDES = [
  {
    slug: "home-theatre",
    number: "01",
    title: "Home theatre",
    phrase: "Feel every scene.",
    image: EDITORIAL_IMAGES.theatre,
    intro:
      "The quietest detail. The biggest moment. A good cinema room gives both somewhere to land.",
    goal: "Dialogue clarity, controlled reflections, even bass",
    size: "Illustrative room Â· 5.2 Ã— 4.1 m",
    scheme: {
      room: "home-theatre",
      finish: "walnut",
      felt: "charcoal",
      coverage: "3",
      walls: "both",
      module: "600x1200",
      layout: "vertical",
    },
    schemeName: "The cinema edit",
    products: ["slat-panel-2400", "felt-tile-600", "corner-trap-pro"],
    sections: [
      [
        "Start with the seats, not the panels.",
        "Decide where you will sit and where the speakers belong before treating the room. Avoid assuming that the middle of the room is the best bass position. Move the main seat and subwoofer in small steps, listen, and measure several seats when possible.",
      ],
      [
        "Make room for the dialogue.",
        "Use broadband absorption at the first-reflection points on side walls, and consider the ceiling where appropriate. A helper with a mirror can identify where you see each speaker from the listening seat. Decorative slats alone do not guarantee broadband performance: the backing, depth and mounting matter.",
      ],
      [
        "Give bass the space it needs.",
        "Low-frequency control typically requires depth, thoughtful placement and measurements. Corner treatment is a starting point, not a promise of flat bass. Thin felt and foam cannot solve deep bass problems. Specify tuned absorbers only after identifying the problem frequencies.",
      ],
      [
        "Keep the room alive.",
        "Do not cover every surface by default. Treat the early reflections first, then reassess dialogue and decay. Diffusion requires an appropriate frequency range and listening distance; it is not automatically suitable immediately behind a sofa.",
      ],
    ],
    checklist: [
      "Confirm seating and speaker positions",
      "Note doors, windows and ceiling height",
      "Photograph front, rear and side walls",
      "Share where bass feels too loud or too quiet",
    ],
  },
  {
    slug: "studio",
    number: "02",
    title: "Studio",
    phrase: "Hear what is there.",
    image: EDITORIAL_IMAGES.studio,
    intro: "A room that lets you trust your ears. Less second-guessing, more making.",
    goal: "A stable stereo image and more reliable mix decisions",
    size: "Illustrative room Â· 4.0 Ã— 3.2 m",
    scheme: {
      room: "studio",
      finish: "oak",
      felt: "charcoal",
      coverage: "3",
      walls: "both",
      module: "600x1200",
      layout: "vertical",
    },
    schemeName: "The reference edit",
    products: ["felt-tile-600", "corner-trap-pro", "qrd-diffuser-7"],
    sections: [
      [
        "Find your reference position.",
        "Set the monitors and listening seat symmetrically across the room width. Keep the left and right speakers in comparable surroundings. Speaker-boundary interactions vary with distance, so there is no universally correct desk position; use the monitor manufacturerâ€™s guidance, listening tests and measurements.",
      ],
      [
        "Control the first arrival.",
        "Broadband absorbers at side-wall reflection points help separate the direct sound from strong early reflections. A ceiling cloud may help too, but it needs fixings rated for the construction and load. Never improvise overhead mounting.",
      ],
      [
        "Work on the low end first.",
        "Small rooms can have long bass decay and large peaks and nulls. Experiment with placement before adding treatment. Deep corner absorption may help over a wider range; the exact depth and construction must be selected for the room, not just its floor area.",
      ],
      [
        "Measure. Listen. Adjust.",
        "Compare before-and-after frequency and decay measurements at several nearby listening positions. Do not judge treatment by a single clap test or a claimed NRC alone. Use diffusion only when the available distance and intended bandwidth support it.",
      ],
    ],
    checklist: [
      "Record width, length and ceiling height",
      "List monitors and their wall distances",
      "Share listening-position photos",
      "Include measurements if you have them",
    ],
  },
  {
    slug: "office",
    number: "03",
    title: "Office",
    phrase: "Space to think.",
    image: EDITORIAL_IMAGES.office,
    intro:
      "Conversations that feel effortless. Calls that sound closer. Work with a little more headspace.",
    goal: "Clearer speech and less distracting reverberation",
    size: "Illustrative room Â· 6.0 Ã— 4.5 m",
    scheme: {
      room: "office",
      finish: "oak",
      felt: "bone",
      coverage: "2",
      walls: "side",
      module: "600x1200",
      layout: "vertical",
    },
    schemeName: "The focus edit",
    products: ["edge-panel-1200", "slat-panel-2400"],
    sections: [
      [
        "Listen to how the room is used.",
        "A meeting room, a shared desk area and a private office need different strategies. Note whether the problem is reverberation inside the room, noise from equipment, or conversations travelling between spaces. Absorption inside one room is not the same as sound isolation.",
      ],
      [
        "Spread the quiet around.",
        "Distribute absorptive treatment across available surfaces rather than placing everything on one small wall. Rooms with extensive glazing may benefit from appropriately specified ceiling absorption. Keep vents, sprinklers, lights and access panels unobstructed.",
      ],
      [
        "Put speech first.",
        "For meetings and video calls, reduce strong reflections near talkers and microphones. Soft furnishings can contribute, but they do not substitute for a designed treatment plan. Test the actual conferencing equipment in the room after changes.",
      ],
      [
        "Treat privacy as a separate brief.",
        "Acoustic panels can reduce reverberation but do not reliably stop sound passing through doors and walls. Privacy may require changes to partition construction, seals, services and flanking paths. Have a qualified specialist assess confidential meeting spaces.",
      ],
    ],
    checklist: [
      "Note room occupancy and primary use",
      "Identify noisy equipment or adjoining spaces",
      "Mark glass, doors and available ceiling area",
      "Confirm fire, access and maintenance requirements",
    ],
  },
];

export const schemeLink = (guide) =>
  `/build-a-room?${new URLSearchParams(guide.scheme).toString()}`;
