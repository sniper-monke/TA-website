import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/products";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our story — Timber Acoustics" },
      { name: "description", content: "Timber Acoustics designs wood acoustic treatment in India for rooms around the world." },
      { property: "og:title", content: "Our story — Timber Acoustics" },
      { property: "og:description", content: "Designed in India. Built for the world." },
    ],
  }),
  component: Story,
});

const chapters = [
  { n: "01", t: "The room comes first", d: "Studios, home theatres, hi-fi rooms and workplaces each fail in their own way. Treatment starts with listening to the space.", img: images.studio },
  { n: "02", t: "Timber, by intent", d: "Wood reflects, diffuses and ages well. Paired with felt and mineral cores, it becomes a working acoustic surface.", img: images.slats },
  { n: "03", t: "Shaped by geometry", d: "Diffusers and slat spacings are where acoustics becomes form. [Process detail to be supplied by the team.]", img: images.diffuser },
];

function Story() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Designed in India.">Built for the world. Copy below is placeholder structure — history and capabilities will be written with Timber.</PageHero>
      {chapters.map((c, i) => (
        <section key={c.n} className={`mx-auto grid max-w-[1600px] items-center gap-10 border-b px-5 py-20 md:grid-cols-2 md:px-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
          <Reveal><img src={c.img} alt={c.t} loading="lazy" className="aspect-[4/3] w-full object-cover" /></Reveal>
          <Reveal delay={120}><p className="label-mono text-signal">{c.n}</p><h2 className="font-display mt-3 text-5xl md:text-7xl">{c.t}</h2><p className="mt-6 max-w-md text-lg text-muted-foreground">{c.d}</p></Reveal>
        </section>
      ))}
      <div className="px-5 py-20 text-center"><Link to="/products" className="label-mono bg-signal px-6 py-4 text-accent-foreground">Explore products</Link></div>
    </>
  );
}
