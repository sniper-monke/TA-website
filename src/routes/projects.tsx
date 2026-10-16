import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/Chrome";
import { images } from "@/data/products";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & spaces — Timber Acoustics" },
      { name: "description", content: "An archive of studios, home theatres and workplaces treated with Timber Acoustics." },
      { property: "og:title", content: "Projects & spaces — Timber Acoustics" },
      { property: "og:description", content: "Studios, theatres and workplaces — an editorial archive." },
    ],
  }),
  component: Projects,
});

// Placeholder archive — concept visuals, to be replaced with real installations.
const archive = [
  { id: "P-01", t: "Control room", type: "Studio", img: images.studio, products: "Slat Panel, Corner Trap" },
  { id: "P-02", t: "Board room", type: "Workplace", img: images.office, products: "Felt Tile, Ceiling baffles" },
  { id: "P-03", t: "Listening room", type: "Hi-fi", img: images.diffuser, products: "QRD Diffuser" },
  { id: "P-04", t: "Lounge wall", type: "Residential", img: images.slats, products: "Slat Panel 2400" },
  { id: "P-05", t: "Mix suite", type: "Studio", img: images.studio, products: "Studio Kit M" },
  { id: "P-06", t: "Focus booth", type: "Workplace", img: images.office, products: "Edge Panel" },
];

function Projects() {
  const types = ["All", ...new Set(archive.map((a) => a.type))];
  const [f, setF] = useState("All");
  const list = archive.filter((a) => f === "All" || a.type === f);
  return (
    <>
      <PageHero eyebrow="Archive · concept visuals" title="Projects">Placeholder entries — real installations and photography to be supplied.</PageHero>
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10">
        <div className="flex flex-wrap gap-2">{types.map((t) => <button key={t} aria-pressed={f === t} onClick={() => setF(t)} className={`label-mono border px-4 py-2 ${f === t ? "border-foreground bg-foreground text-background" : ""}`}>{t}</button>)}</div>
        <ul className="mt-10 border-t">
          {list.map((a) => (
            <li key={a.id} className="group grid items-center gap-4 border-b py-6 md:grid-cols-[6rem_1fr_1fr_14rem]">
              <span className="label-mono text-muted-foreground">{a.id}</span>
              <span className="font-display text-4xl md:text-5xl">{a.t}</span>
              <span className="text-sm text-muted-foreground">{a.type} · {a.products}</span>
              <div className="aspect-[16/10] overflow-hidden bg-card"><img src={a.img} alt={a.t} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" /></div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
