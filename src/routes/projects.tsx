import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Reveal, useInView, useScrollProgress } from "@/components/site/Reveal";
import { images } from "@/data/products";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & spaces — Timber Acoustics" },
      {
        name: "description",
        content:
          "An archive of studios, home theatres and workplaces treated with Timber Acoustics.",
      },
      { property: "og:title", content: "Projects & spaces — Timber Acoustics" },
      {
        property: "og:description",
        content: "Studios, theatres and workplaces — an editorial archive.",
      },
    ],
  }),
  component: Projects,
});

// Placeholder archive — concept visuals, to be replaced with real installations.
const archive = [
  {
    id: "P-01",
    t: "Control room",
    type: "Studio",
    img: images.studio,
    products: "Slat Panel, Corner Trap",
  },
  {
    id: "P-02",
    t: "Board room",
    type: "Workplace",
    img: images.office,
    products: "Felt Tile, Ceiling baffles",
  },
  {
    id: "P-03",
    t: "Listening room",
    type: "Hi-fi",
    img: images.diffuser,
    products: "QRD Diffuser",
  },
  {
    id: "P-04",
    t: "Lounge wall",
    type: "Residential",
    img: images.slats,
    products: "Slat Panel 2400",
  },
  { id: "P-05", t: "Mix suite", type: "Studio", img: images.studio, products: "Studio Kit M" },
  { id: "P-06", t: "Focus booth", type: "Workplace", img: images.office, products: "Edge Panel" },
];

const heroCards = [
  {
    img: images.studio,
    w: "10.2cqw",
    h: "14.1cqw",
    l: "4%",
    t: "2.3cqw",
    zi: 1,
    rot: -9,
    depth: 14,
  },
  {
    img: images.office,
    w: "12.5cqw",
    h: "17.2cqw",
    l: "12%",
    t: "3.9cqw",
    zi: 2,
    rot: -5,
    depth: 10,
  },
  {
    img: images.diffuser,
    w: "15.6cqw",
    h: "21.1cqw",
    l: "22%",
    t: "1.6cqw",
    zi: 4,
    rot: -2,
    depth: 8,
  },
  {
    img: images.slats,
    w: "11.7cqw",
    h: "15.6cqw",
    l: "36%",
    t: "5.5cqw",
    zi: 3,
    rot: 3,
    depth: 12,
  },
  { img: images.studio, w: "18cqw", h: "24.2cqw", l: "44%", t: "0cqw", zi: 5, rot: 0, depth: 6 },
  {
    img: images.office,
    w: "12.5cqw",
    h: "16.8cqw",
    l: "59%",
    t: "4.3cqw",
    zi: 3,
    rot: 4,
    depth: 11,
  },
  {
    img: images.diffuser,
    w: "13.7cqw",
    h: "18.8cqw",
    l: "70%",
    t: "2.3cqw",
    zi: 4,
    rot: 7,
    depth: 9,
  },
  {
    img: images.slats,
    w: "10.2cqw",
    h: "13.7cqw",
    l: "84%",
    t: "3.9cqw",
    zi: 2,
    rot: -4,
    depth: 13,
  },
];

// Scroll fan-out, in container units (cqw ≈ px/12.8 at 1280w).
const fanMoves = [
  { x: -20.3, y: -3.1, rot: -25 },
  { x: -15.6, y: 1.6, rot: -18 },
  { x: -9.4, y: 6.3, rot: -10 },
  { x: -3.1, y: 9.4, rot: -4 },
  { x: 3.1, y: 9.4, rot: 4 },
  { x: 9.4, y: 6.3, rot: 12 },
  { x: 15.6, y: 1.6, rot: 22 },
  { x: 20.3, y: -3.1, rot: 28 },
];

const ghost = "IN SITU".split("");

function Projects() {
  return (
    <>
      <Hero />
      <section id="archive" className="border-t px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="label-mono flex items-center gap-3 text-muted-foreground">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
                Project archive · concept visuals
              </p>
              <h2 className="font-display mt-4 text-[clamp(2.5rem,6vw,5.5rem)]">
                Selected{" "}
                <em className="bg-gradient-to-br from-signal to-[oklch(0.82_0.12_70)] bg-clip-text not-italic text-transparent">
                  work
                </em>
                .
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Six spaces across studios, workplaces and homes — each one tuned for how the room is
              actually used.
            </p>
          </Reveal>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((a, i) => (
              <Reveal as="li" key={a.id} delay={i * 80}>
                <article className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-card">
                  <img
                    src={a.img}
                    alt={a.t}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-3 bottom-3 translate-y-0 rounded-xl border border-foreground/10 bg-background/75 p-4 opacity-100 backdrop-blur-md transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{a.t}</span>
                      <span className="label-mono text-signal">{a.id}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.type} · {a.products}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <Stats />
    </>
  );
}

function Hero() {
  const [heroRef, p] = useScrollProgress<HTMLElement>();
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const row = rowRef.current;
    if (!row) return;
    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0,
      raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = row.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };
    const tick = () => {
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
      for (let i = 0; i < heroCards.length; i++) {
        const el = cardRefs.current[i];
        const d = heroCards[i]?.depth ?? 8;
        if (el) el.style.translate = `${(tx * d).toFixed(2)}px ${(ty * d * 0.5).toFixed(2)}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    row.addEventListener("pointermove", onMove);
    row.addEventListener("pointerleave", onLeave);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      row.removeEventListener("pointermove", onMove);
      row.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const tiltOn = (e: ReactPointerEvent<HTMLDivElement>, i: number) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = `perspective(700px) rotateX(${(-py * 16).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg) scale(1.12)`;
    const slot = cardRefs.current[i];
    if (slot) slot.style.zIndex = "20";
  };
  const tiltOff = (e: ReactPointerEvent<HTMLDivElement>, i: number) => {
    const el = e.currentTarget;
    el.style.transition = "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "none";
    const slot = cardRefs.current[i];
    if (slot) slot.style.zIndex = "";
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,90,39,0.10),transparent_60%)]"
      />
      <h1
        className="font-display relative z-10 text-center text-[clamp(2.25rem,6.4vw,5.75rem)]"
        style={{ transform: `translateY(${-60 * p}px)`, opacity: 1 - p * 1.5 }}
      >
        <span className="inline-block overflow-hidden align-top">
          <span className="animate-rise inline-block" style={{ animationDelay: "0.3s" }}>
            Every room
          </span>
        </span>
      </h1>
      <div
        aria-hidden
        className="relative z-0 mt-[-1.25rem] flex justify-center"
        style={{ transform: `scale(${1 + 0.15 * p})`, opacity: 1 - 0.4 * p }}
      >
        <span className="font-display select-none whitespace-nowrap text-[clamp(4rem,19vw,17rem)] italic leading-[0.85] text-foreground/12">
          {ghost.map((ch, i) => (
            <span
              key={i}
              className="animate-letter-up inline-block transition-transform duration-500 hover:translate-y-[-0.5rem]"
              style={{ animationDelay: `${0.55 + i * 0.05}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </div>

      <div
        ref={rowRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[25cqw] [container-type:inline-size]"
        style={{ zIndex: 3 }}
      >
        {heroCards.map((c, i) => {
          const m = fanMoves[i]!;
          const centerDist = Math.abs(i - (heroCards.length - 1) / 2);
          return (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="p-card pointer-events-auto will-change-transform"
              style={
                {
                  "--w": c.w,
                  "--h": c.h,
                  "--l": c.l,
                  "--t": c.t,
                  "--zi": String(c.zi),
                  transform: `translate(calc(${m.x}cqw * ${p}), calc(${m.y}cqw * ${p})) rotate(${m.rot * p}deg)`,
                } as CSSProperties
              }
            >
              <div
                className="animate-card-drop h-full"
                style={
                  {
                    "--rot": `${c.rot}deg`,
                    animationDelay: `${0.8 + centerDist * 0.08}s`,
                  } as CSSProperties
                }
              >
                <div
                  className="animate-card-float h-full"
                  style={
                    {
                      "--float-y": `${-8 - (i % 3) * 5}px`,
                      "--float-rot": `${i % 2 === 0 ? 1.5 : -1.5}deg`,
                      "--float-dur": `${3 + (i % 4) * 0.5}s`,
                      "--float-delay": `${1.9 + i * 0.1}s`,
                      perspective: "700px",
                    } as CSSProperties
                  }
                >
                  <div
                    className="p-card-inner h-full"
                    onPointerMove={(e) => tiltOn(e, i)}
                    onPointerLeave={(e) => tiltOff(e, i)}
                  >
                    <img src={c.img} alt="" loading="eager" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="relative z-10 mt-[clamp(6rem,14vw,11.25rem)] text-center"
        style={{ opacity: 1 - p * 2 }}
      >
        <a
          href="#archive"
          className="label-mono group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-background transition-transform duration-500 hover:-translate-y-0.5"
        >
          See the archive
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-full bg-signal text-background transition-transform duration-500 group-hover:rotate-45"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </a>
        <p className="label-mono mt-6 text-muted-foreground">6 spaces · 4 typologies · zero echo</p>
      </div>
    </section>
  );
}

function Stats() {
  const [ref, inView] = useInView<HTMLElement>(0.3);
  return (
    <section ref={ref} className="px-5 pb-28 md:px-10">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] bg-foreground px-8 py-14 text-background md:px-14 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(200,90,39,0.28),transparent_65%)] blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-1/4 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(212,163,115,0.22),transparent_65%)] blur-2xl"
        />
        <div className="relative grid items-end gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <Reveal>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)]">
              Quiet,{" "}
              <em className="bg-gradient-to-br from-[oklch(0.55_0.16_40)] to-[oklch(0.72_0.12_60)] bg-clip-text not-italic text-transparent">
                by design
              </em>
              .
            </h2>
          </Reveal>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={120 + i * 120}>
              <Counter to={s.to} label={s.label} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { to: 62, label: "Spaces treated" },
  { to: 14, label: "Cities" },
  { to: 96, label: "% would specify again" },
];

function Counter({ to, label }: { to: number; label: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const pr = Math.min(1, (t - start) / 2000);
      setV(Math.round(to * (1 - Math.pow(1 - pr, 3))));
      if (pr < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <div ref={ref}>
      <div className="font-display text-[clamp(2.75rem,4.5vw,4.25rem)] tabular-nums">{v}</div>
      <div className="label-mono mt-3 border-t border-background/20 pt-3 text-background/60">
        {label}
      </div>
    </div>
  );
}
