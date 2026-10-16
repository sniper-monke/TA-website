import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { slatWall, type ConfigState, type Option } from "@/data/configurator";
import { formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/configurator")({
  head: () => ({
    meta: [
      { title: "Configurator — Timber Acoustics" },
      { name: "description", content: "Configure a modular timber slat acoustic wall: finish, felt colour, modules and layout." },
      { property: "og:title", content: "Slat wall configurator — Timber Acoustics" },
      { property: "og:description", content: "Build a modular acoustic wall and see it update instantly." },
    ],
  }),
  component: Configurator,
});

function Configurator() {
  const def = slatWall;
  const [s, setS] = useState<ConfigState>({ finish: "oak", felt: "charcoal", modules: "4", layout: "vertical" });
  const { add } = useCart();
  const pick = (k: keyof ConfigState) => (id: string) => setS({ ...s, [k]: id });
  const finish = def.finishes.find((f) => f.id === s.finish)!;
  const felt = def.felts.find((f) => f.id === s.felt)!;
  const n = +s.modules;
  const error = def.validate(s);
  const unit = def.basePrice + (finish.price ?? 0);
  const total = unit * n;
  const horiz = s.layout === "horizontal";

  return (
    <>
      <PageHero eyebrow="Configurator · concept preview" title="Build a wall" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid-lines relative grid min-h-[60vh] place-items-center overflow-hidden border bg-card p-8 [perspective:1600px]">
          <div className={`flex gap-2 transition-all duration-700 [transform:rotateY(-18deg)_rotateX(6deg)] ${horiz ? "flex-col" : "flex-row"}`} role="img" aria-label={`Preview: ${n} ${finish.label} modules over ${felt.label} felt, ${s.layout}`}>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className={`flex gap-[3px] p-[3px] shadow-2xl transition-colors duration-500 ${horiz ? "h-14 w-72 flex-col md:w-96" : "h-72 w-14 md:h-96 md:w-16"}`} style={{ background: felt.value }}>
                {Array.from({ length: 5 }).map((_, j) => <span key={j} className="flex-1 transition-colors duration-500" style={{ background: `linear-gradient(${horiz ? "180deg" : "90deg"}, ${finish.value}, color-mix(in oklab, ${finish.value} 75%, black))` }} />)}
              </div>
            ))}
          </div>
          <p className="label-mono absolute bottom-4 left-4 text-muted-foreground">Conceptual preview — not to scale</p>
          <p className="label-mono absolute right-4 top-4 text-muted-foreground">{n} × 600 mm module (demo)</p>
        </div>

        <div className="space-y-8">
          <Group legend="01 Timber finish" opts={def.finishes} value={s.finish} onPick={pick("finish")} swatch />
          <Group legend="02 Felt backing" opts={def.felts} value={s.felt} onPick={pick("felt")} swatch />
          <Group legend="03 Modules" opts={def.modules} value={s.modules} onPick={pick("modules")} />
          <Group legend="04 Layout" opts={def.layouts} value={s.layout} onPick={pick("layout")} />

          <div className="border bg-card p-5">
            <p className="label-mono text-muted-foreground">Summary</p>
            <p className="mt-2">{n} × {finish.label} slats on {felt.label} felt, {s.layout}</p>
            <p className="mt-4 font-mono text-2xl">{formatPrice(total)} <span className="label-mono text-signal">Demo price</span></p>
            {error && <p role="alert" className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
            <button disabled={!!error} onClick={() => add({ id: `cfg-${s.finish}-${s.felt}-${s.modules}-${s.layout}`, title: def.productName, detail: `${n} × ${finish.label} / ${felt.label} / ${s.layout}`, price: total })} className="label-mono mt-5 w-full bg-signal py-4 text-accent-foreground transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground">
              {error ? "Resolve conflict to continue" : "Add configuration to demo cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Group({ legend, opts, value, onPick, swatch }: { legend: string; opts: Option[]; value: string; onPick: (id: string) => void; swatch?: boolean }) {
  return (
    <fieldset>
      <legend className="label-mono text-muted-foreground">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => (
          <button key={o.id} onClick={() => onPick(o.id)} aria-pressed={value === o.id} className={`flex items-center gap-2 border px-4 py-3 text-sm transition-colors ${value === o.id ? "border-signal bg-signal/10" : "hover:border-foreground"}`}>
            {swatch && <span className="h-4 w-4 border" style={{ background: o.value }} />}
            {o.label}{o.price ? <span className="font-mono text-xs text-muted-foreground">+{formatPrice(o.price)}</span> : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
