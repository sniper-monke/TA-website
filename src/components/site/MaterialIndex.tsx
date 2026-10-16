import { Reveal } from "@/components/site/Reveal";
import { images } from "@/data/products";

const lead = {
  title: "Meridian",
  label: "Curved slat field / 01",
  image: images.slats,
  alt: "Patterned timber acoustic wall",
  className: "md:col-span-7 md:row-span-3",
};

const studies = [
  {
    key: "vector",
    title: "Vector",
    label: "Geometric diffuser / 02",
    image: images.diffuser,
    alt: "Geometric timber diffuser surface",
    className: "md:col-span-5 md:row-span-2",
  },
  {
    key: "signal",
    title: "Signal",
    label: "Listening room calibration / 03",
    image: images.studio,
    alt: "Warm listening room with studio equipment",
    className: "md:col-span-7 md:row-span-2",
  },
];

export function MaterialIndex() {
  return (
    <section
      id="material"
      className="relative z-10 scroll-mt-16 border-t bg-paper px-5 py-24 text-paper-foreground md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-12 grid items-end gap-8 md:mb-[70px] md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)] md:gap-[5vw]">
          <Reveal className="md:col-span-2">
            <p className="label-mono text-signal">Material index / prototype studies</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="font-display text-[clamp(3.1rem,6.2vw,7.4rem)]">
              A system before a catalogue.
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-[14px] leading-[1.7] text-paper-foreground/65">
              Three visual studies establish the language of the future product collection: warm
              ivory surfaces, natural wood rhythm, walnut mass, and charcoal depth.
            </p>
          </Reveal>
        </div>

        <div className="md:grid md:auto-rows-[190px] md:grid-cols-12 md:gap-[22px]">
          <StudyCard study={lead} />

          <Reveal
            delay={80}
            className="flex h-[300px] flex-col justify-end border border-paper-foreground/20 bg-card p-7 text-foreground md:col-span-5 md:row-span-2 md:h-auto"
          >
            <span className="label-mono text-foreground/60">Material thesis</span>
            <h3 className="font-display mt-5 max-w-[440px] text-[clamp(1.9rem,3vw,3.7rem)]">
              Texture carries the technology.
            </h3>
            <p className="mt-5 max-w-[390px] text-[13px] leading-[1.65] text-foreground/65">
              The interface is deliberately architectural: shadows reveal depth, grain reveals
              direction, and burnt orange marks the active acoustic state.
            </p>
          </Reveal>

          {studies.map((study, i) => (
            <StudyCard key={study.key} study={study} delay={140 + i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StudyCard({
  study,
  delay = 0,
}: {
  study: typeof lead | (typeof studies)[number];
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={`group relative h-[360px] overflow-hidden border border-paper-foreground/20 bg-background text-foreground md:h-auto ${study.className}`}
    >
      <img
        src={study.image}
        alt={study.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover contrast-[1.08] saturate-[0.82] transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.055]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent"
      />
      <div className="absolute right-5 bottom-5 left-5 z-10 flex items-end justify-between gap-5">
        <span className="label-mono text-foreground/70">{study.label}</span>
        <h3 className="font-display text-[clamp(1.9rem,3vw,3.7rem)]">{study.title}</h3>
      </div>
    </Reveal>
  );
}
