import { createFileRoute, Link } from "@tanstack/react-router";
import { families, products, images, formatPrice } from "@/data/products";
import { Reveal, useScrollProgress } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Timber Acoustics — Shape the space. Control the sound." },
      { name: "description", content: "Wood acoustic panels, diffusers and bass traps for studios, home theatres and commercial spaces." },
      { property: "og:title", content: "Timber Acoustics — Shape the space. Control the sound." },
      { property: "og:description", content: "Wood acoustic treatment engineered for studios, home theatres and workplaces." },
    ],
  }),
  component: Home,
});

const pool = [images.studio, images.slats, images.diffuser, images.office];

function TiltedGrid() {
  const cols = 6;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1400px]">
      <div className="absolute left-1/2 top-1/2 flex h-[180%] w-[150%] -translate-x-1/2 -translate-y-1/2 gap-4 [transform:translate(-50%,-50%)_rotateX(38deg)_rotateZ(-22deg)]">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className={`flex flex-1 flex-col gap-4 ${c % 2 ? "animate-drift-down" : "animate-drift-up"}`} style={{ animationDuration: `${50 + c * 9}s` }}>
            {Array.from({ length: 12 }).map((_, r) => {
              const src = pool[(c + r) % pool.length];
              return (
                <div key={r} className="relative aspect-[3/4] shrink-0 overflow-hidden bg-card">
                  <img src={src} alt="" className="h-full w-full object-cover opacity-70" style={{ objectPosition: `${(r * 37) % 100}% ${(c * 23) % 100}%` }} />
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
          <span><span className="text-signal">●</span> Wood acoustic treatment</span>
          <span>Studios / Home theatre / Workplace</span>
          <span>Designed in India</span>
        </div>
        <h1 className="font-display text-[clamp(3.4rem,13vw,13.5rem)]">
          <span className="block overflow-hidden"><span className="block animate-rise">Shape</span></span>
          <span className="block overflow-hidden pl-[8vw]"><span className="block animate-rise [animation-delay:120ms]">the space<span className="text-signal">.</span></span></span>
          <span className="block overflow-hidden"><span className="block animate-rise text-muted-foreground [animation-delay:240ms]">Control</span></span>
          <span className="block overflow-hidden pl-[16vw]"><span className="block animate-rise [animation-delay:360ms]">the sound<span className="text-signal">.</span></span></span>
        </h1>
        <div className="mt-10 grid items-end gap-8 border-t pt-6 md:grid-cols-[1fr_auto_auto]">
          <p className="max-w-md text-muted-foreground">Panels, slats, diffusers and bass traps — made from timber and felt to make rooms sound like they should.</p>
          <Link to="/products" className="group flex items-center gap-4 bg-foreground px-6 py-4 text-background transition-colors hover:bg-signal">
            <span className="label-mono">Explore products</span><span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link to="/story" className="label-mono border px-6 py-4 transition-colors hover:border-foreground">Our story</Link>
        </div>
      </div>
      <a href="#material" className="label-mono absolute bottom-10 right-5 hidden origin-bottom-right rotate-90 translate-y-[-120px] text-muted-foreground md:block md:right-10">Scroll ↓ 01 / 09</a>
    </section>
  );
}

function Material() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const scale = 0.55 + Math.min(1, p * 1.6) * 0.45;
  return (
    <section id="material" ref={ref} className="relative h-[220vh] bg-card">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="relative h-[80svh] w-[90vw] max-w-[1400px] overflow-hidden" style={{ transform: `scale(${scale})`, clipPath: `inset(${(1 - scale) * 30}% round 2px)` }}>
          <img src={images.slats} alt="Macro view of walnut slats over charcoal acoustic felt" loading="lazy" className="h-full w-full object-cover" style={{ transform: `scale(${1.3 - p * 0.3}) translateY(${(p - 0.5) * -6}%)` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          <div className="absolute left-6 top-6 md:left-12 md:top-12">
            <p className="label-mono text-signal">02 — Material in motion</p>
            <h2 className="font-display mt-4 text-[clamp(2.5rem,7vw,7rem)]">Grain<br />meets<br />gap.</h2>
          </div>
          <Annotation className="right-[12%] top-[30%]" label="Timber slat" value="Solid face, reflects HF" />
          <Annotation className="right-[30%] top-[62%]" label="Felt channel" value="Porous, absorbs mid–high" />
          <Annotation className="right-[6%] bottom-[10%]" label="Air cavity" value="Extends low-frequency reach" />
        </div>
      </div>
    </section>
  );
}

function Annotation({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className={`absolute hidden items-center gap-3 md:flex ${className}`}>
      <span className="h-3 w-3 rounded-full border-2 border-signal bg-background" />
      <span className="h-px w-10 bg-foreground/60" />
      <span className="bg-background/80 px-3 py-2 backdrop-blur"><span className="label-mono block text-muted-foreground">{label}</span><span className="text-sm">{value}</span></span>
    </div>
  );
}

const principles = [
  { k: "Absorption", t: "Energy in, less energy out.", d: "Porous materials — felt, mineral wool — turn sound into tiny amounts of heat. Reverb time drops; speech and mixes get clearer.", svg: (
    <g>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M10 ${30 + i * 18} L 120 ${30 + i * 18}`} stroke="currentColor" strokeOpacity={1 - i * 0.18} />)}<rect x="120" y="20" width="30" height="100" className="fill-signal/60" /><path d="M150 70 L 190 70" stroke="currentColor" strokeOpacity=".15" strokeDasharray="3 4" /></g>
  ) },
  { k: "Diffusion", t: "Scatter instead of silence.", d: "Surfaces of varying depth break one strong reflection into many weaker ones spread in time and direction. The room stays lively, without flutter echo.", svg: (
    <g><path d="M10 70 L 110 70" stroke="currentColor" />{[-40, -20, 0, 20, 40].map((a) => <path key={a} d="M140 70 L 190 70" stroke="currentColor" strokeOpacity=".6" transform={`rotate(${a + 180} 140 70) translate(-50 0) rotate(180 165 70)`} />)}{[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x="130" y={20 + i * 14} width={[6, 14, 22, 10, 18, 4, 12][i]} height="13" className="fill-timber" />)}</g>
  ) },
  { k: "Isolation", t: "A different problem entirely.", d: "Keeping sound in or out needs mass, airtightness and decoupling — construction, not panels. Treatment shapes how a room sounds; it doesn't soundproof it.", svg: (
    <g><path d="M10 70 L 100 70" stroke="currentColor" /><rect x="100" y="15" width="14" height="110" className="fill-foreground/80" /><rect x="120" y="15" width="14" height="110" className="fill-foreground/80" /><path d="M140 70 L 190 70" stroke="currentColor" strokeOpacity=".1" /></g>
  ) },
];

function Idea() {
  return (
    <section className="grid-lines px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <Reveal><p className="label-mono text-signal">03 — The acoustic idea</p><h2 className="font-display mt-4 text-[clamp(2.6rem,6vw,6rem)]">Sound is<br />geometry.</h2></Reveal>
          <Reveal delay={150}><p className="max-w-xl self-end text-lg text-muted-foreground md:mt-24">Every room is an instrument. Its surfaces decide what you hear after the source stops. Three ideas — often confused — do very different work.</p></Reveal>
        </div>
        <div className="mt-20 grid border-t md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.k} delay={i * 120} className="border-b p-6 md:border-b-0 md:border-r md:p-10 last:border-r-0">
              <span className="label-mono text-muted-foreground">0{i + 1} / {p.k}</span>
              <svg viewBox="0 0 200 140" className="my-10 w-full text-foreground" fill="none" strokeWidth="1.2" role="img" aria-label={`${p.k} diagram`}>{p.svg}</svg>
              <h3 className="font-display text-3xl">{p.t}</h3>
              <p className="mt-4 text-muted-foreground">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Families() {
  return (
    <section className="bg-paper px-5 py-28 text-paper-foreground md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.6rem,7vw,7rem)]">Product<br />families</h2>
          <p className="label-mono">04 — Six systems · categories to validate</p>
        </div>
        <ul className="mt-16 border-t border-paper-foreground/30">
          {families.map((f) => (
            <li key={f.slug}>
              <Link to="/collections/$family" params={{ family: f.slug }} className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-paper-foreground/30 py-6 md:grid-cols-[5rem_1.2fr_1fr_8rem] md:py-8">
                <span className="label-mono">{f.index}</span>
                <span className="font-display text-[clamp(1.8rem,4.5vw,4.5rem)] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-4">{f.name}</span>
                <span className="hidden text-sm md:block">{f.blurb}</span>
                <span className="label-mono text-right">{f.principle.split(" ")[0]} →</span>
                <img src={f.image} alt="" loading="lazy" className="pointer-events-none absolute right-[22%] top-1/2 hidden h-40 w-32 -translate-y-1/2 rotate-6 scale-75 object-cover opacity-0 shadow-2xl transition-all duration-500 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 lg:block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Signature() {
  const featured = products.filter((p) => p.featured);
  return (
    <section className="px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between">
          <div><p className="label-mono text-signal">05 — Signature objects</p><h2 className="font-display mt-4 text-[clamp(2.6rem,6vw,6rem)]">The catalogue</h2></div>
          <Link to="/products" className="label-mono hidden border px-5 py-3 hover:border-foreground md:block">All products →</Link>
        </div>
        <div className="mt-14 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Link key={p.slug} to="/products/$slug" params={{ slug: p.slug }} className="group flex flex-col bg-background p-5">
              <div className="flex justify-between label-mono text-muted-foreground"><span>TA–{String(i + 1).padStart(3, "0")}</span><span>{p.nrc ? `NRC ${p.nrc.toFixed(2)}` : "Diffuser"}</span></div>
              <div className="relative my-6 aspect-square overflow-hidden bg-card">
                <img src={p.gallery[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110" />
                <span className="label-mono absolute bottom-3 left-3 bg-background/80 px-2 py-1">{p.dims}</span>
              </div>
              <h3 className="font-display text-2xl">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.purpose}</p>
              <p className="mt-4 flex justify-between font-mono text-sm"><span>{formatPrice(p.price)} <span className="text-muted-foreground">demo</span></span><span className="text-signal transition-transform group-hover:translate-x-1">→</span></p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Clients() {
  const names = ["WeWork", "Amazon"];
  return (
    <section aria-label="Clients" className="overflow-hidden border-y bg-card py-10">
      <p className="label-mono mb-6 text-center text-muted-foreground">06 — Trusted in spaces by</p>
      <div className="flex w-max animate-marquee">
        {Array.from({ length: 8 }).flatMap((_, k) => names.map((n) => (
          <span key={`${k}${n}`} aria-hidden={k > 0} className="font-display mx-12 text-6xl text-muted-foreground/60 md:text-8xl">{n}<span className="text-signal">/</span></span>
        )))}
      </div>
    </section>
  );
}

function Projects() {
  const items = [
    { img: images.studio, t: "Control room", tag: "Studio", n: "Concept visual" },
    { img: images.office, t: "Meeting suite", tag: "Workplace", n: "Concept visual" },
    { img: images.diffuser, t: "Listening room", tag: "Hi-fi", n: "Concept visual" },
  ];
  return (
    <section className="px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <p className="label-mono text-signal">07 — Projects & spaces</p>
        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 100} className={i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"}>
              <Link to="/projects" className="group block">
                <div className={`overflow-hidden bg-card ${i === 0 ? "aspect-[4/5] md:aspect-auto md:h-[78vh]" : "aspect-[16/10]"}`}>
                  <img src={it.img} alt={it.t} loading="lazy" className="h-full w-full object-cover grayscale-[40%] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <div className="mt-3 flex justify-between border-t pt-3"><span className="font-display text-xl">{it.t}</span><span className="label-mono text-muted-foreground">{it.tag} · {it.n}</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="grain relative overflow-hidden bg-timber/20 px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 md:grid-cols-2">
        <Reveal className="relative">
          <img src={images.slats} alt="Timber slat detail" loading="lazy" className="aspect-[4/5] w-full object-cover md:w-4/5" />
          <img src={images.diffuser} alt="" loading="lazy" className="absolute -bottom-10 right-0 hidden aspect-square w-1/2 border-8 border-background object-cover md:block" />
        </Reveal>
        <Reveal delay={150}>
          <p className="label-mono text-signal">08 — Brand story</p>
          <h2 className="font-display mt-4 text-[clamp(2.6rem,6vw,6rem)]">Designed in India.<br /><span className="text-muted-foreground">Built for the world.</span></h2>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground">Timber Acoustics makes wood acoustic treatment for studios, home theatres, hi-fi rooms and commercial spaces. The full story — people, workshop, process — will be written with the team.</p>
          <Link to="/story" className="label-mono mt-10 inline-block border px-6 py-4 hover:border-foreground">Read the story →</Link>
        </Reveal>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative flex min-h-[90svh] items-end overflow-hidden px-5 pb-14 md:px-10">
      <img src={images.studio} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-[1600px]">
        <p className="label-mono text-signal">09 — Your room next</p>
        <h2 className="font-display mt-4 text-[clamp(3rem,11vw,11rem)]">Listen<br />to the room.</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/configurator" className="label-mono bg-signal px-6 py-4 text-accent-foreground hover:bg-foreground">Configure a wall</Link>
          <Link to="/products" className="label-mono border bg-background/50 px-6 py-4 backdrop-blur hover:border-foreground">Shop products</Link>
          <Link to="/contact" className="label-mono border bg-background/50 px-6 py-4 backdrop-blur hover:border-foreground">Project enquiry</Link>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (<><Hero /><Material /><Idea /><Families /><Signature /><Clients /><Projects /><Story /><Closing /></>);
}
