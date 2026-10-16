import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { slatWall, type ConfigState } from "@/data/configurator";
import { RoomStage } from "@/components/site/RoomStage";
import { formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/configurator")({
  head: () => ({
    meta: [
      { title: "Configurator — Timber Acoustics" },
      {
        name: "description",
        content:
          "Configure a room with modular timber slat acoustic panels: panel size, coverage, wall placement, finish and felt colour.",
      },
      { property: "og:title", content: "Room configurator — Timber Acoustics" },
      {
        property: "og:description",
        content: "Build an acoustic room scheme and watch the panels update instantly.",
      },
    ],
  }),
  component: Configurator,
});

function Configurator() {
  const def = slatWall;
  const [s, setS] = useState<ConfigState>({
    finish: "oak",
    felt: "charcoal",
    layout: "vertical",
    module: "600",
    coverage: "2",
    walls: "rear",
  });
  const { add } = useCart();
  const pick = (k: keyof ConfigState) => (id: string) => setS({ ...s, [k]: id });

  const finish = def.finishes.find((f) => f.id === s.finish)!;
  const felt = def.felts.find((f) => f.id === s.felt)!;
  const mod = def.modules.find((m) => m.id === s.module)!;
  const coverage = Math.max(1, Math.min(4, Number(s.coverage) || 1));
  const wallCount = s.walls === "both" ? 2 : 1;
  const panelCount = coverage * wallCount;
  const layout = def.layouts.find((l) => l.id === s.layout)!;
  const wallLabel = def.walls.find((w) => w.id === s.walls)!.label;
  const error = def.validate(s);
  const unit = def.basePrice + (finish.price ?? 0) + (mod.add ?? 0);
  const total = unit * panelCount;

  return (
    <>
      <PageHero eyebrow="Configurator · concept preview" title="Build a room" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <RoomStage config={s} def={def} />
          <p className="label-mono text-muted-foreground">
            {panelCount} × {mod.label} mm module · {finish.label} slats · {felt.label} felt ·{" "}
            {layout.label} · {wallLabel}
          </p>
        </div>

        <div className="space-y-8">
          <Group
            legend="01 Timber finish"
            opts={def.finishes}
            value={s.finish}
            onPick={pick("finish")}
            swatch
          />
          <Group
            legend="02 Felt backing"
            opts={def.felts}
            value={s.felt}
            onPick={pick("felt")}
            swatch
          />
          <Group
            legend="03 Panel size"
            opts={def.modules}
            value={s.module}
            onPick={pick("module")}
          />
          <Group
            legend="04 Coverage"
            opts={def.coverages}
            value={s.coverage}
            onPick={pick("coverage")}
          />
          <Group legend="05 Walls" opts={def.walls} value={s.walls} onPick={pick("walls")} />
          <Group
            legend="06 Slat orientation"
            opts={def.layouts}
            value={s.layout}
            onPick={pick("layout")}
          />

          <div className="border bg-card p-5">
            <p className="label-mono text-muted-foreground">Summary</p>
            <p className="mt-2">
              {panelCount} × {mod.label} mm {finish.label} slat panel{panelCount > 1 ? "s" : ""}{" "}
              over {felt.label} felt — {wallLabel.toLowerCase()}, {layout.label.toLowerCase()}.
            </p>
            <p className="mt-4 font-mono text-2xl">
              {formatPrice(total)} <span className="label-mono text-signal">Demo price</span>
            </p>
            {error && (
              <p
                role="alert"
                className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            <button
              disabled={!!error}
              onClick={() =>
                add({
                  id: `cfg-${s.finish}-${s.felt}-${s.module}-${s.coverage}-${s.walls}-${s.layout}`,
                  title: def.productName,
                  detail: `${panelCount} × ${mod.label} mm ${finish.label} / ${felt.label} / ${wallLabel} / ${layout.label}`,
                  price: total,
                })
              }
              className="label-mono mt-5 w-full bg-signal py-4 text-accent-foreground transition-colors hover:bg-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              {error ? "Resolve conflict to continue" : "Add scheme to demo cart"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface GroupOption {
  id: string;
  label: string;
  value?: string;
  price?: number;
  add?: number;
}

function Group({
  legend,
  opts,
  value,
  onPick,
  swatch,
}: {
  legend: string;
  opts: GroupOption[];
  value: string;
  onPick: (id: string) => void;
  swatch?: boolean;
}) {
  return (
    <fieldset>
      <legend className="label-mono text-muted-foreground">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => {
          const extra = o.price ?? o.add;
          return (
            <button
              key={o.id}
              onClick={() => onPick(o.id)}
              aria-pressed={value === o.id}
              className={`flex items-center gap-2 border px-4 py-3 text-sm transition-colors ${
                value === o.id ? "border-signal bg-signal/10" : "hover:border-foreground"
              }`}
            >
              {swatch && o.value && (
                <span className="h-4 w-4 border" style={{ background: o.value }} />
              )}
              {o.label}
              {extra ? (
                <span className="font-mono text-xs text-muted-foreground">
                  +{formatPrice(extra)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
