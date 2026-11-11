/** Add only client-approved names here; an empty list shows room types instead. */
export const trustedClients: string[] = [];

export const spaceLinks = [
  { label: "Recording studio", href: "/guides/studio" },
  { label: "Home studio", href: "/build-a-room?room=studio" },
  { label: "Podcast studio", href: "/contact" },
  { label: "Listening room", href: "/build-a-room?room=listening-room" },
];

export const acousticNeeds = [
  {
    title: "Less echo",
    description: "Absorption for clearer speech and a calmer room.",
    family: "absorption",
    label: "Explore absorption",
  },
  {
    title: "More detail",
    description: "Diffusion to scatter reflections and retain a room’s life.",
    family: "diffusion",
    label: "Explore diffusers",
  },
  {
    title: "Better bass",
    description: "Deeper treatment for the low frequencies that linger.",
    family: "bass-traps",
    label: "Explore bass traps",
  },
];
