/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "@/reference/router";
import { Plus, ShoppingBag } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { fetchProduct } from "@/reference/lib/api";
import { motion } from "framer-motion";
import { CONFIG, ROOM_TYPES } from "@/reference/data/configurator";
import { PageHero } from "@/reference/components/Chrome";
import RoomPreview from "@/reference/components/RoomPreview";
import { FadePage, Reveal } from "@/reference/components/Reveal";
import { formatPrice } from "@/reference/lib/api";

function Group({ legend, opts, value, onPick, swatch, testPrefix }) {
  return (
    <fieldset>
      <legend className="label-quiet">{legend}</legend>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {opts.map((o) => {
          const extra = o.price ?? o.add;
          const active = value === o.id;
          return (
            <motion.button
              key={o.id}
              whileTap={{ scale: 0.96 }}
              data-testid={`${testPrefix}-${o.id}`}
              onClick={() => onPick(o.id)}
              aria-pressed={active}
              className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] font-light transition-colors duration-300 ${
                active
                  ? "border-timber-orange bg-timber-orange/10 text-timber-ink"
                  : "border-timber-ink/15 text-timber-ink/65 hover:border-timber-ink/40 hover:text-timber-ink"
              }`}
            >
              {swatch && o.value && (
                <span
                  className="h-4 w-4 rounded-full border border-timber-ink/20"
                  style={{ background: o.value }}
                />
              )}
              {o.label}
              {extra ? (
                <span className="text-[11px] text-timber-ink/45">+{formatPrice(extra)}</span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Configurator() {
  const [params] = useSearchParams();
  const { add } = useBasket();
  const initialRoom = ROOM_TYPES.find((r) => r.id === params.get("room")) || ROOM_TYPES[0];
  const [roomType, setRoomType] = useState(initialRoom.id);
  const [basePrice, setBasePrice] = useState(null);
  const [priceError, setPriceError] = useState(false);
  useEffect(() => {
    fetchProduct("slat-panel-2400")
      .then((p) => setBasePrice(p.price))
      .catch(() => setPriceError(true));
  }, []);
  const [s, setS] = useState(() => {
    const defaults = {
      finish: "oak",
      felt: "charcoal",
      layout: "vertical",
      module: "600x1200",
      coverage: initialRoom.preset.coverage,
      walls: initialRoom.preset.walls,
    };
    const lists = {
      finish: CONFIG.finishes,
      felt: CONFIG.felts,
      module: CONFIG.modules,
      coverage: CONFIG.coverages,
      walls: CONFIG.walls,
      layout: CONFIG.layouts,
    };
    for (const key of Object.keys(lists))
      if (lists[key].some((x) => x.id === params.get(key))) defaults[key] = params.get(key);
    return defaults;
  });

  const pick = (k) => (id) => setS((c) => ({ ...c, [k]: id }));
  const chooseRoom = (id) => {
    setRoomType(id);
    const rt = ROOM_TYPES.find((r) => r.id === id);
    setS((c) => ({ ...c, coverage: rt.preset.coverage, walls: rt.preset.walls }));
  };

  const finish = CONFIG.finishes.find((f) => f.id === s.finish);
  const felt = CONFIG.felts.find((f) => f.id === s.felt);
  const mod = CONFIG.modules.find((m) => m.id === s.module);
  const layout = CONFIG.layouts.find((l) => l.id === s.layout);
  const wallLabel = CONFIG.walls.find((w) => w.id === s.walls).label;
  const rt = ROOM_TYPES.find((r) => r.id === roomType);
  const coverage = Math.max(1, Math.min(4, Number(s.coverage) || 1));
  const wallCount = s.walls === "both" ? 2 : 1;
  const panelCount = coverage * wallCount;
  const error = CONFIG.validate(s);
  const unit = (basePrice ?? 0) + (finish.price ?? 0) + (mod.add ?? 0);
  const total = unit * panelCount;

  return (
    <FadePage>
      <PageHero
        eyebrow="The room atelier / Concept preview"
        title="Your space."
        italic="Your signature."
      >
        A little timber. A little intention. A room that feels more like you.
      </PageHero>

      <div
        className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-28 md:px-10 lg:grid-cols-[1.45fr_1fr]"
        data-testid="configurator"
      >
        <Reveal className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <div className="overflow-hidden rounded-lg border border-timber-ink/10 bg-gradient-to-b from-white/60 to-timber-sand shadow-[0_24px_70px_rgba(21,58,84,0.08)]">
            <div className="flex items-center justify-between border-b border-timber-ink/10 px-6 py-4">
              <p className="label-eyebrow" data-testid="cfg-room-label">
                {rt.label}
              </p>
              <p className="label-quiet">{rt.dims}</p>
            </div>
            <div className="p-4 md:p-8">
              <RoomPreview
                roomType={roomType}
                finish={s.finish}
                felt={s.felt}
                module={s.module}
                coverage={s.coverage}
                walls={s.walls}
                layout={s.layout}
              />
            </div>
          </div>
          <p className="label-quiet mt-5" data-testid="cfg-caption">
            {panelCount} Ã— {mod.label} mm modules Â· {finish.label} slats Â· {felt.label} felt Â·{" "}
            {layout.label.toLowerCase()} Â· {wallLabel.toLowerCase()}
          </p>
          <p className="mt-2 text-xs font-light text-timber-ink/40">
            Concept preview â€” not to scale.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="space-y-9">
          <fieldset>
            <legend className="label-quiet">01 â€” Room type</legend>
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              {ROOM_TYPES.map((r) => {
                const active = roomType === r.id;
                return (
                  <motion.button
                    key={r.id}
                    whileTap={{ scale: 0.97 }}
                    data-testid={`cfg-room-${r.id}`}
                    onClick={() => chooseRoom(r.id)}
                    aria-pressed={active}
                    className={`rounded-md border p-4 text-left transition-colors duration-300 ${
                      active
                        ? "border-timber-orange bg-timber-orange/10"
                        : "border-timber-ink/15 hover:border-timber-ink/35"
                    }`}
                  >
                    <p
                      className={`font-display text-lg font-light ${active ? "text-timber-orange" : "text-timber-ink"}`}
                    >
                      {r.label}
                    </p>
                    <p className="mt-1.5 text-[11px] font-light leading-relaxed text-timber-ink/50">
                      {r.note}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </fieldset>

          <Group
            legend="02 â€” Timber finish"
            opts={CONFIG.finishes}
            value={s.finish}
            onPick={pick("finish")}
            swatch
            testPrefix="cfg-finish"
          />
          <Group
            legend="03 â€” Felt backing"
            opts={CONFIG.felts}
            value={s.felt}
            onPick={pick("felt")}
            swatch
            testPrefix="cfg-felt"
          />
          <Group
            legend="04 â€” Panel size"
            opts={CONFIG.modules}
            value={s.module}
            onPick={pick("module")}
            testPrefix="cfg-module"
          />
          <Group
            legend="05 â€” Coverage"
            opts={CONFIG.coverages}
            value={s.coverage}
            onPick={pick("coverage")}
            testPrefix="cfg-coverage"
          />
          <Group
            legend="06 â€” Walls"
            opts={CONFIG.walls}
            value={s.walls}
            onPick={pick("walls")}
            testPrefix="cfg-walls"
          />
          <Group
            legend="07 â€” Slat orientation"
            opts={CONFIG.layouts}
            value={s.layout}
            onPick={pick("layout")}
            testPrefix="cfg-layout"
          />

          <div
            className="rounded-md border border-timber-ink/10 bg-white/50 p-6 shadow-[0_8px_32px_rgba(21,58,84,0.06)] backdrop-blur-xl"
            data-testid="cfg-summary"
          >
            <p className="label-quiet">Summary</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-timber-ink/75">
              {panelCount} Ã— {mod.label} mm {finish.label} slat panel{panelCount > 1 ? "s" : ""}{" "}
              over {felt.label} felt â€” {wallLabel.toLowerCase()}, {layout.label.toLowerCase()}, in
              a {rt.label.toLowerCase()}.
            </p>
            <p
              className="mt-5 font-display text-4xl font-light text-timber-ink"
              data-testid="cfg-total-price"
            >
              {basePrice === null ? "â€”" : formatPrice(total)}{" "}
              <span className="label-eyebrow align-middle">Indicative price</span>
            </p>
            {error && (
              <p
                role="alert"
                data-testid="cfg-error"
                className="mt-4 border-l-2 border-timber-orange pl-3 text-sm font-light text-timber-orange"
              >
                {error}
              </p>
            )}
            {priceError && (
              <p className="error-notice" data-testid="cfg-price-error">
                This scheme is temporarily unavailable. Please try again later.
              </p>
            )}
            <button
              className="action-button w-full mt-6"
              data-testid="cfg-add-basket"
              disabled={Boolean(error) || basePrice === null}
              onClick={() =>
                add({
                  kind: "scheme",
                  name: `${rt.label} scheme`,
                  description: `${panelCount} panels Â· ${finish.label} / ${felt.label} Â· ${mod.label} mm Â· ${wallLabel} Â· ${layout.label}`,
                  scheme: { roomType, ...s },
                  unit_price: total,
                })
              }
            >
              <Plus size={17} />
              Add scheme to enquiry
            </button>
            <Link to="/basket" data-testid="cfg-view-basket" className="text-link mt-4">
              <ShoppingBag size={15} />
              View enquiry basket
            </Link>
            <p className="mt-5 border-t border-timber-ink/10 pt-4 text-xs leading-relaxed text-timber-ink/65">
              Visual concept, not a complete acoustic specification. The team will confirm coverage,
              mounting and pricing for your room.
            </p>
          </div>
        </Reveal>
      </div>
    </FadePage>
  );
}
