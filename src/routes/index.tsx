import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { images } from "@/data/products";
import { Reveal } from "@/components/site/Reveal";
import { EditorialMarquee } from "@/components/site/EditorialMarquee";
import { StoryPanel } from "@/components/site/StoryPanel";
import { Journey } from "@/components/site/Journey";
import { MaterialIndex } from "@/components/site/MaterialIndex";
import { BrandsMarquee } from "@/components/site/BrandsMarquee";
import { AcousticCanvas } from "@/components/site/AcousticCanvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Timber Acoustics — Shape the space. Control the sound." },
      {
        name: "description",
        content:
          "Wood acoustic panels, diffusers and bass traps for studios, home theatres and commercial spaces.",
      },
      { property: "og:title", content: "Timber Acoustics — Shape the space. Control the sound." },
      {
        property: "og:description",
        content: "Wood acoustic treatment engineered for studios, home theatres and workplaces.",
      },
    ],
  }),
  component: Home,
});

const pool = [images.studio, images.slats, images.diffuser, images.office];

function TiltedGrid() {
  const cols = 6;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1400px]"
    >
      <div className="absolute left-1/2 top-1/2 flex h-[180%] w-[150%] -translate-x-1/2 -translate-y-1/2 gap-4 [transform:translate(-50%,-50%)_rotateX(38deg)_rotateZ(-22deg)]">
        {Array.from({ length: cols }).map((_, c) => (
          <div
            key={c}
            className={`flex flex-1 flex-col gap-4 ${c % 2 ? "animate-drift-down" : "animate-drift-up"}`}
            style={{ animationDuration: `${50 + c * 9}s` }}
          >
            {Array.from({ length: 12 }).map((_, r) => {
              const src = pool[(c + r) % pool.length];
              return (
                <div key={r} className="relative aspect-[3/4] shrink-0 overflow-hidden bg-card">
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover opacity-70"
                    style={{ objectPosition: `${(r * 37) % 100}% ${(c * 23) % 100}%` }}
                  />
                  {r % 5 === 2 && <div className="perforation absolute inset-0 bg-timber/40" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_0%,var(--background)_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

function Hero() {
  return (
    <section className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-28 md:px-10">
      <TiltedGrid />
      <div className="relative mx-auto w-full max-w-[1600px]">
        <div className="label-mono mb-8 flex flex-wrap gap-x-8 gap-y-2 text-muted-foreground">
          <span>
            <span className="text-signal">●</span> Wood acoustic treatment
          </span>
          <span>Studios / Home theatre / Workplace</span>
          <span>Designed in India</span>
        </div>
        <h1 className="font-display text-[clamp(3.4rem,13vw,13.5rem)]">
          <span className="block overflow-hidden">
            <span className="block animate-rise">Shape</span>
          </span>
          <span className="block overflow-hidden pl-[8vw]">
            <span className="block animate-rise [animation-delay:120ms]">
              the space<span className="text-signal">.</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="block animate-rise text-muted-foreground [animation-delay:240ms]">
              Control
            </span>
          </span>
          <span className="block overflow-hidden pl-[16vw]">
            <span className="block animate-rise [animation-delay:360ms]">
              the sound<span className="text-signal">.</span>
            </span>
          </span>
        </h1>
        <div className="mt-10 grid items-end gap-8 border-t pt-6 md:grid-cols-[1fr_auto_auto]">
          <p className="max-w-md text-muted-foreground">
            Panels, slats, diffusers and bass traps — made from timber and felt to make rooms sound
            like they should.
          </p>
          <Link
            to="/products"
            className="group flex items-center gap-4 bg-foreground px-6 py-4 text-background transition-colors hover:bg-signal"
          >
            <span className="label-mono">Explore products</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/story"
            className="label-mono border px-6 py-4 transition-colors hover:border-foreground"
          >
            Our story
          </Link>
        </div>
      </div>
      <a
        href="#material"
        className="label-mono absolute right-5 bottom-10 hidden origin-bottom-right translate-y-[-120px] rotate-90 text-muted-foreground md:block md:right-10"
      >
        Scroll ↓ 01 / 06
      </a>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="grain relative overflow-hidden bg-timber/20 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 md:grid-cols-2">
        <Reveal className="relative">
          <img
            src={images.slats}
            alt="Timber slat detail"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover md:w-4/5"
          />
          <img
            src={images.diffuser}
            alt=""
            loading="lazy"
            className="absolute -bottom-10 right-0 hidden aspect-square w-1/2 border-8 border-background object-cover md:block"
          />
        </Reveal>
        <Reveal delay={150}>
          <p className="label-mono text-signal">06 — Brand story</p>
          <h2 className="font-display mt-4 text-[clamp(2.6rem,6vw,6rem)]">
            Designed in India.
            <br />
            <span className="text-muted-foreground">Built for the world.</span>
          </h2>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">
            Timber Acoustics makes wood acoustic treatment for studios, home theatres, hi-fi rooms
            and commercial spaces. The full story — people, workshop, process — will be written with
            the team.
          </p>
          <Link
            to="/story"
            className="label-mono mt-10 inline-block border px-6 py-4 hover:border-foreground"
          >
            Read the story →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  const [chapter, setChapter] = useState(0);
  const [journeyVisible, setJourneyVisible] = useState(false);

  return (
    <>
      <AcousticCanvas activeChapter={chapter} active={journeyVisible} />
      <Hero />
      <EditorialMarquee />
      <StoryPanel />
      <Journey onChapterChange={setChapter} onVisibilityChange={setJourneyVisible} />
      <MaterialIndex />
      <BrandsMarquee />
      <BrandStory />
    </>
  );
}
