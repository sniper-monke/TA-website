const names = ["WeWork", "Amazon"];

export function BrandsMarquee() {
  return (
    <section aria-label="Clients" className="overflow-hidden border-y bg-card py-10">
      <p className="label-mono mb-6 text-center text-muted-foreground">Trusted in spaces by</p>
      <div className="flex w-max animate-marquee">
        {Array.from({ length: 8 }).flatMap((_, k) =>
          names.map((name) => (
            <span
              key={`${k}-${name}`}
              aria-hidden={k > 0}
              className="font-display mx-12 text-6xl text-muted-foreground/60 md:text-8xl"
            >
              {name}
              <span className="text-signal">/</span>
            </span>
          )),
        )}
      </div>
    </section>
  );
}
