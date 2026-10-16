const phrases = [
  "Timber Acoustics",
  "Precision Matters",
  "Rooms Are Instruments",
  "Silence Has Geometry",
];

export function EditorialMarquee() {
  return (
    <section
      aria-label="Timber Acoustics editorial statement"
      className="relative z-10 -rotate-[0.8deg] scale-[1.02] overflow-hidden border-y bg-paper text-paper-foreground"
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1}
            className="flex items-center gap-10 whitespace-nowrap px-5 py-4 md:gap-[74px] md:px-[37px] md:py-[17px]"
          >
            {phrases.map((phrase) => (
              <span
                key={`${group}-${phrase}`}
                className="label-mono flex items-center gap-10 md:gap-[74px]"
              >
                {phrase}
                <span aria-hidden className="block h-2 w-2 shrink-0 bg-signal" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
