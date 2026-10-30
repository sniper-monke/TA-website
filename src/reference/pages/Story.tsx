/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { Link } from "@/reference/router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/reference/components/Chrome";
import { FadePage, Reveal } from "@/reference/components/Reveal";
import WoodRings from "@/reference/components/WoodRings";
import { IMG } from "@/reference/data/chapters";

const CHAPTERS = [
  {
    n: "01",
    t: "The room comes first",
    d: "Studios, home theatres, hi-fi rooms and workplaces each fail in their own way. Treatment starts with listening to the space.",
    img: IMG.studio,
  },
  {
    n: "02",
    t: "Timber, by intent",
    d: "Wood reflects, diffuses and ages well. Paired with felt and mineral cores, it becomes a working acoustic surface.",
    img: IMG.hero_slat,
  },
  {
    n: "03",
    t: "Shaped by geometry",
    d: "Diffusers and slat spacings are where acoustics becomes form â€” measured, repeatable, and free to curve.",
    img: IMG.diffuser_geo,
  },
];

const VALUES = [
  [
    "Material honesty",
    "Real timber, real felt, real cores. Nothing pretending to be something else.",
  ],
  [
    "Measured acoustics",
    "Every product targets a behaviour â€” absorb, diffuse, trap, shape, tune.",
  ],
  ["Craft in every joint", "Built by hand in India, finished like furniture, not fixtures."],
];

export default function Story() {
  return (
    <FadePage>
      <PageHero eyebrow="Our story" title="Designed in India." italic="Built for the world.">
        Timber Acoustics brings affordable soundproofing and acoustic treatment to recording
        studios, home theatres, restaurants, offices and auditoriums â€” solutions that improve how
        a room sounds and how it looks, together.
      </PageHero>

      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        {CHAPTERS.map((c, i) => (
          <section
            key={c.n}
            data-testid={`story-chapter-${c.n}`}
            className={`grid items-center gap-12 border-t border-timber-ink/10 py-20 md:grid-cols-12 md:py-28 ${
              i % 2 ? "" : ""
            }`}
          >
            <Reveal className={`md:col-span-6 ${i % 2 ? "md:order-2" : ""}`}>
              <div className="overflow-hidden rounded-md">
                <img
                  src={c.img}
                  alt={c.t}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal
              delay={0.15}
              className={`md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}
            >
              <p className="label-eyebrow">{c.n}</p>
              <h2 className="mt-4 font-display text-3xl font-light tracking-tight text-timber-ink sm:text-4xl lg:text-5xl">
                {c.t}
              </h2>
              <p className="mt-6 max-w-md text-base font-light leading-relaxed text-timber-ink/70">
                {c.d}
              </p>
            </Reveal>
          </section>
        ))}
      </div>

      <section
        className="grain relative overflow-hidden bg-timber-sand"
        data-testid="story-workshop"
      >
        <WoodRings
          size={460}
          opacity={0.1}
          className="pointer-events-none absolute -left-32 -bottom-28"
        />
        <div className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-14 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <Reveal className="md:col-span-5">
            <p className="label-eyebrow">The workshop</p>
            <h2 className="mt-5 font-display text-3xl font-light leading-[1.08] tracking-tight text-timber-ink sm:text-4xl">
              Where offcuts became instruments.
            </h2>
            <p className="mt-7 max-w-md text-base font-light leading-relaxed text-timber-ink/70">
              The first prototype was built from offcuts: a wall that looked calm because it was
              quietly doing the work. That is still the brief for everything that leaves the
              workshop â€” a surface that earns its place twice, once for the ear and once for the
              eye.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="relative md:col-span-6 md:col-start-7">
            <div className="overflow-hidden rounded-md">
              <img
                src={IMG.workshop_2}
                alt="Carpenter sanding a timber detail by hand"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <img
              src={IMG.material}
              alt="Macro of warm wood grain"
              loading="lazy"
              className="absolute -bottom-10 -left-6 hidden w-2/5 rounded-md border-8 border-timber-sand object-cover shadow-[0_24px_60px_rgba(21,58,84,0.16)] md:block md:aspect-square"
            />
          </Reveal>
        </div>
      </section>

      <section
        className="mx-auto max-w-[1500px] px-5 py-24 md:px-10 md:py-32"
        data-testid="story-values"
      >
        <Reveal>
          <p className="label-eyebrow">What holds it together</p>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="border-t border-timber-ink/15 pt-6">
                <p className="label-quiet">0{i + 1}</p>
                <h3 className="mt-4 font-display text-2xl font-light tracking-tight text-timber-ink">
                  {t}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-timber-ink/60">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-20 flex flex-wrap items-center gap-6">
            <p className="font-serif text-2xl italic text-timber-ink/70">
              The final test is not a graph â€” it is the moment a listener stops noticing the
              treatment.
            </p>
            <Link
              to="/products"
              data-testid="story-explore-cta"
              className="group inline-flex items-center gap-3 rounded-full bg-timber-ink px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-timber-cream transition-colors duration-300 hover:bg-timber-orange"
            >
              Explore products
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </section>
    </FadePage>
  );
}
