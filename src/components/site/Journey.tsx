import { useEffect, useRef, useState, type CSSProperties } from "react";
import { chapters } from "@/data/chapters";

const OUT_DURATION_MS = 300;

export function Journey({
  onChapterChange,
  onVisibilityChange,
}: {
  onChapterChange?: (index: number) => void;
  onVisibilityChange?: (visible: boolean) => void;
} = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pendingRef = useRef(0);

  const activeIndex = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
  const shown = chapters[displayIndex] ?? chapters[0]!;
  const mobileShown = chapters[mobileIndex] ?? chapters[0]!;

  useEffect(() => {
    onChapterChange?.(activeIndex);
  }, [activeIndex, onChapterChange]);

  useEffect(() => {
    if (activeIndex === displayIndex) return;
    pendingRef.current = activeIndex;
    if (phase === "out") return;
    setPhase("out");
  }, [activeIndex, displayIndex, phase]);

  useEffect(() => {
    if (phase !== "out") return;
    const timer = window.setTimeout(() => {
      setDisplayIndex(pendingRef.current);
      setPhase("in");
    }, OUT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      onVisibilityChange?.(entry?.isIntersecting ?? false);
    });
    io.observe(section);
    return () => io.disconnect();
  }, [onVisibilityChange]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(max-width: 767px)").matches) {
        setProgress(0);
        return;
      }
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -bounds.top / travel)));
    };
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const seek = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = section.offsetHeight - window.innerHeight;
    const top = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({
      top: top + travel * (index / (chapters.length - 1)) + 2,
      behavior: "smooth",
    });
  };

  const chooseMobileChapter = (index: number) => {
    setMobileIndex(index);
    onChapterChange?.(index);
  };

  const panelAnimation = phase === "out" ? "animate-chapter-out" : "animate-chapter-in";
  const photoAnimation = phase === "out" ? "animate-chapter-photo-out" : "animate-chapter-photo-in";

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative z-10 md:h-[620vh]"
      style={{ "--chapter-accent": shown.accent } as CSSProperties}
    >
      <div
        className="relative overflow-hidden border-y bg-[#111310] px-5 py-16 md:hidden"
        style={{ "--chapter-accent": mobileShown.accent } as CSSProperties}
      >
        <div className="mx-auto max-w-xl">
          <div className="mb-6 flex items-center justify-between label-mono text-muted-foreground">
            <span>The five behaviours</span>
            <span style={{ color: mobileShown.accent }}>{mobileShown.number} / 05</span>
          </div>
          <figure className="relative mb-7 aspect-[4/3] overflow-hidden [clip-path:polygon(0_5%,94%_0,100%_94%,6%_100%)]">
            <img
              key={mobileShown.id}
              src={mobileShown.image}
              alt={mobileShown.alt}
              loading="lazy"
              className="h-full w-full object-cover animate-in fade-in duration-500"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent"
            />
            <figcaption
              className="label-mono absolute bottom-4 left-4"
              style={{ color: mobileShown.accent }}
            >
              {mobileShown.number} / {mobileShown.word}
            </figcaption>
          </figure>
          <p className="label-mono mb-3" style={{ color: mobileShown.accent }}>
            {mobileShown.label}
          </p>
          <h2 className="font-display text-[clamp(3.2rem,15vw,5rem)]">
            {mobileShown.word}
            <span style={{ color: mobileShown.accent }}>.</span>
          </h2>
          <h3 className="mt-4 font-display text-2xl leading-tight">{mobileShown.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/70">
            {mobileShown.description}
          </p>
          <p
            className="label-mono mt-5 border-l-2 pl-3 leading-relaxed text-muted-foreground"
            style={{ borderColor: mobileShown.accent }}
          >
            {mobileShown.stat}
          </p>
          <div className="mt-7 flex items-center justify-between gap-4">
            <button
              type="button"
              aria-label="Previous chapter"
              onClick={() =>
                chooseMobileChapter((mobileIndex - 1 + chapters.length) % chapters.length)
              }
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border text-xl transition-colors hover:border-signal"
              style={{ borderColor: `${mobileShown.accent}80` }}
            >
              ←
            </button>
            <nav aria-label="Acoustic journey chapters" className="flex items-center gap-2">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => chooseMobileChapter(index)}
                  aria-label={`Go to ${chapter.word} chapter`}
                  aria-current={index === mobileIndex ? "true" : undefined}
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: index === mobileIndex ? 28 : 10,
                    backgroundColor:
                      index === mobileIndex ? mobileShown.accent : "rgba(255,255,255,.28)",
                  }}
                />
              ))}
            </nav>
            <button
              type="button"
              aria-label="Next chapter"
              onClick={() => chooseMobileChapter((mobileIndex + 1) % chapters.length)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full border text-xl transition-colors hover:border-signal"
              style={{ borderColor: `${mobileShown.accent}80` }}
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div className="sticky top-0 hidden h-screen overflow-hidden md:block">
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(10,10,10,0.74)] md:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background: `radial-gradient(circle at 72% 45%, color-mix(in srgb, ${shown.accent} 19%, transparent), transparent 28%), linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.62) 44%, rgba(10,10,10,0.14) 100%)`,
          }}
        />

        <div className="relative z-10 mx-auto grid h-full max-w-[1600px] grid-rows-[auto_minmax(0,1fr)_auto] px-5 pt-[10vh] pb-[6vh] md:px-10 md:pt-[11vh]">
          <div className="label-mono flex justify-between text-muted-foreground">
            <span>The five behaviours</span>
            <span style={{ color: shown.accent }}>
              {String(Math.round(progress * 100)).padStart(2, "0")}%
            </span>
          </div>

          <div className="grid min-h-0 items-center gap-5 overflow-hidden py-3 md:grid-cols-2 md:gap-10 md:py-0">
            <article
              key={displayIndex}
              className={`${panelAnimation} relative overflow-hidden border-l pl-4 md:max-w-[min(43vw,660px)] md:pl-6`}
              style={{ borderLeftColor: shown.accent }}
              data-testid={`chapter-panel-${shown.id}`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-[4vh] right-[-2vw] hidden select-none font-display text-[12vw] leading-[0.75] tracking-[-0.1em] text-transparent [-webkit-text-stroke:1px_rgba(244,240,234,0.07)] md:block"
              >
                {shown.word}
              </span>
              <div className="relative">
                <p className="label-mono mb-4 md:mb-6" style={{ color: shown.accent }}>
                  {shown.number} / {shown.label}
                </p>
                <h2 className="font-display text-[clamp(2.6rem,10vw,4rem)] md:text-[clamp(3.4rem,5.6vw,7rem)]">
                  {shown.word}
                  <span style={{ color: shown.accent }}>.</span>
                </h2>
                <h3 className="mt-4 max-w-[440px] font-display text-[clamp(1.1rem,1.9vw,1.75rem)] leading-[1.05] tracking-[-0.04em] text-foreground md:mt-5">
                  {shown.title}
                </h3>
                <p className="mt-3 max-w-[420px] text-[13px] leading-[1.65] text-foreground/70 md:text-sm">
                  {shown.description}
                </p>
                <p className="label-mono mt-5 hidden max-w-[360px] border-t border-white/15 pt-4 leading-[1.75] text-muted-foreground md:block">
                  {shown.story}
                </p>
                <p
                  className="label-mono mt-5 flex items-center gap-3"
                  style={{ color: shown.accent }}
                >
                  {shown.stat}
                  <i aria-hidden="true" className="block h-px w-[58px] bg-current" />
                </p>
              </div>
            </article>

            <figure
              key={displayIndex}
              className={`${photoAnimation} relative h-[14vh] shrink-0 overflow-hidden [clip-path:polygon(0_7%,88%_0,100%_93%,10%_100%)] shadow-[0_42px_100px_rgba(0,0,0,0.55)] md:mx-auto md:h-auto md:aspect-[4/4.65] md:w-[min(30vw,470px)]`}
            >
              <img
                src={shown.image}
                alt={shown.alt}
                loading="lazy"
                className="h-full w-full object-cover contrast-[1.1] saturate-[0.82]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 52% 18%, rgba(244,240,234,0.2), transparent 25%), linear-gradient(0deg, rgba(10,10,10,0.76), transparent 48%)",
                }}
              />
              <figcaption className="label-mono absolute right-4 bottom-4 left-4 hidden justify-between gap-4 text-foreground md:flex">
                <span>
                  {shown.number} / {shown.word}
                </span>
                <span>{shown.stat}</span>
              </figcaption>
            </figure>
          </div>

          <nav
            aria-label="Acoustic journey chapters"
            className="flex gap-2 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-0 md:overflow-visible"
          >
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => seek(index)}
                aria-label={`Go to ${chapter.word} chapter`}
                aria-current={index === displayIndex ? "true" : undefined}
                className={`label-mono flex flex-none items-center gap-2 rounded-full border border-white/15 px-3 py-3 transition-colors md:min-h-14 md:rounded-none md:border-l-0 md:border-b-0 md:border-t md:border-r md:last:border-r-0 md:px-3 md:py-4 md:text-left ${
                  index === displayIndex
                    ? "bg-foreground/95 text-background md:bg-foreground/5 md:text-foreground"
                    : "bg-background/75 text-muted-foreground md:bg-transparent md:hover:bg-foreground/5 md:hover:text-foreground"
                }`}
                style={index === displayIndex ? { borderTopColor: shown.accent } : undefined}
              >
                <span>{chapter.number}</span>
                <i className="hidden not-italic md:inline">{chapter.word}</i>
              </button>
            ))}
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="absolute right-0 bottom-0 left-0 z-30 h-0.5 bg-foreground/10"
        >
          <i
            className="block h-full origin-left"
            style={{ background: shown.accent, transform: `scaleX(${Math.max(0.025, progress)})` }}
          />
        </div>
      </div>
    </section>
  );
}
