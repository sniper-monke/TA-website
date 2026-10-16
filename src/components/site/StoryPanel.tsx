import { Reveal, useInView, useScrollProgress } from "@/components/site/Reveal";
import { images } from "@/data/products";

const lines = ["We design", "silence like", "architecture."];
const stats = [
  ["05", "acoustic behaviours"],
  ["18mm", "timber expression"],
  ["01", "modular field"],
];

export function StoryPanel() {
  const [sectionRef, p] = useScrollProgress<HTMLElement>();
  const [copyRef, inView] = useInView<HTMLDivElement>();

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative z-10 scroll-mt-16 overflow-hidden bg-paper px-5 py-24 text-paper-foreground md:px-10 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[3vh] left-[30%] select-none font-display text-[30vw] leading-[0.8] tracking-[-0.1em] text-transparent [-webkit-text-stroke:1px_rgba(10,10,10,0.07)] md:left-[35%] md:text-[18vw]"
        style={{ transform: `translateX(${(p - 0.5) * 240}px)` }}
      >
        Origin
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-14 md:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] md:gap-[6vw]">
        <div ref={copyRef}>
          <Reveal>
            <p className="label-mono text-signal">Origin / 00</p>
          </Reveal>
          <h2
            className="font-display mt-5 text-[clamp(3.2rem,7vw,8.8rem)]"
            aria-label="We design silence like architecture."
          >
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.055em]">
                <Reveal as="span" className="block" delay={i * 120}>
                  {line}
                </Reveal>
              </span>
            ))}
          </h2>
          <div
            className="mt-8 h-px w-full max-w-[520px] origin-left bg-paper-foreground/35 transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
            style={{ transform: inView ? "scaleX(1)" : "scaleX(0)" }}
          />
          <Reveal delay={200}>
            <p className="mt-7 max-w-[480px] text-[15px] leading-[1.7] text-paper-foreground/70">
              Timber Acoustics began with a simple observation: most rooms are visually composed but
              sonically accidental. Every wall is treated as an instrument body — material,
              geometry, and air working as one system.
            </p>
          </Reveal>

          <div className="mt-12 grid max-w-[650px] grid-cols-1 gap-px border border-paper-foreground/25 bg-paper-foreground/25 sm:grid-cols-3">
            {stats.map(([value, label], i) => (
              <span
                key={label}
                className="min-h-[112px] bg-paper px-4 py-5 label-mono text-paper-foreground/60 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)]"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(30px)",
                  transitionDelay: `${420 + i * 100}ms`,
                }}
              >
                <b className="font-display mb-4 block text-[28px] tracking-[-0.05em] text-paper-foreground">
                  {value}
                </b>
                {label}
              </span>
            ))}
          </div>

          <Reveal delay={520}>
            <a
              href="#journey"
              className="label-mono inline-flex items-center gap-4 border-b border-paper-foreground/40 pb-3 transition-all duration-300 hover:gap-6 hover:text-signal"
            >
              Follow the five behaviours <span className="text-signal">↓</span>
            </a>
          </Reveal>
        </div>

        <div
          className="relative min-h-[430px] md:min-h-[660px]"
          aria-label="Timber material and listening room story"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-[18%] left-0 h-[18%] w-[42%] bg-signal mix-blend-multiply md:bottom-[13%] md:h-[24%] md:w-[34%]"
          />
          <Reveal className="absolute top-0 right-0 h-[70%] w-[86%] overflow-hidden bg-timber md:right-[10%] md:h-[74%] md:w-[72%] [clip-path:polygon(0_0,100%_7%,92%_100%,0_92%)]">
            <img
              src={images.slats}
              alt="Dark timber grain used for acoustic surfaces"
              loading="lazy"
              className="h-full w-full object-cover contrast-[1.08] saturate-[0.84]"
              style={{ transform: `translateY(${(p - 0.5) * -40}px) scale(${1.12 - p * 0.12})` }}
            />
          </Reveal>
          <Reveal
            as="figure"
            delay={220}
            className="absolute right-0 bottom-0 m-0 h-[38%] w-[56%] overflow-hidden border-[10px] border-paper bg-card shadow-[0_30px_80px_rgba(10,10,10,0.22)] md:w-[46%]"
          >
            <img
              src={images.studio}
              alt="Warm listening room with tuned audio equipment"
              loading="lazy"
              className="h-full w-full object-cover contrast-[1.08] saturate-[0.84]"
            />
            <figcaption className="absolute bottom-3 left-4 label-mono text-foreground">
              Listening is the final material.
            </figcaption>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
