export const timberStore = "https://www.timberacoustics.com";
export const expertAdvice = `${timberStore}/pages/contact`;

export const homeSeries = [
  {
    id: "absorption",
    name: "Absorption",
    product: "TimberSlat Panels",
    image: "slat",
    slug: "timberslat-panels",
  },
  {
    id: "diffusion",
    name: "Diffusion",
    product: "Skyline Sound Diffuser",
    image: "skyline",
    slug: "timber-acoustics®-skyline-sound-diffuser-sound-diffusion-pine-wood-noise-reduction-and-acoustic-room-treatment-single-60-x-60-x-12-cm-sheesham",
  },
  {
    id: "art",
    name: "Art",
    product: "Printed Acoustic Wall Panels",
    image: "art",
    slug: "printed-acoustic-wall-panels-set-of-3",
  },
] as const;

export type HomeSeriesId = (typeof homeSeries)[number]["id"];

export const homeRange = [
  { name: "Absorption panels", image: "absorption", family: "absorption" },
  { name: "Wood diffusers", image: "skyline", family: "diffusion" },
  { name: "Acoustic art", image: "art", slug: homeSeries[2].slug },
  { name: "TimberSlat", image: "slat", family: "timberslat" },
  { name: "Bass traps", image: "bass", family: "bass-traps" },
  { name: "Room kits", image: "kit", family: "room-kits" },
  { name: "Studio furniture", image: "rack", family: "racks-and-tables" },
] as const;

export const latestProducts = [
  {
    name: "TimberSlat Soffit Bass Traps",
    image: "bass-natural",
    slug: "low-frequency-absorption-timberslat-soffit-bass-traps",
  },
  {
    name: "AcousTiles",
    image: "tiles",
    slug: "acoustiles-acoustic-wall-tiles-sound-absorbing-echo-reduction-wall-panels-for-home-living-room-bedroom-office-commercial-spaces-1-x-1-set-of-8",
  },
  {
    name: "Starlit Acoustic Panel",
    image: "starlit",
    slug: "starlit-acoustic-panel-starry-sky-acoustic-ceiling-cloud-wall-panel",
  },
];

export const homeSpaces = [
  { name: "Music studios", image: "studio", path: "music-studio" },
  { name: "Listening rooms", image: "listening", path: "2-channel-listening-room" },
  { name: "Podcast setups", image: "podcast", path: "podcasting-setup" },
];

export const homeClients = [
  { name: "Amazon", image: "client-amazon" },
  { name: "WeWork", image: "client-wework" },
  { name: "Zee Studios", image: "client-zee-studios" },
  { name: "ROCKWOOL", image: "client-rockwool" },
  { name: "Policybazaar", image: "client-policybazaar" },
];

export const homeReviews = [
  { author: "Ankita", quote: "Instantly improved the sound of my studio." },
  { author: "Saddam", quote: "These really do make a difference" },
];

export const homePhoto = (image: string) => `/images/home/${image}.webp`;
