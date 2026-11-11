import { useEffect, useId, useRef, useState } from "react";
import type { TimberFinish } from "./MaterialStudy";
import type {
  AlcoveLayer,
  AlcoveMode,
  AlcoveView,
  ListeningEngine,
  ListeningState,
} from "./listening-scene";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";

/** The inline architectural illustration also serves SSR, loading and no-WebGL states. */
export function HeroListeningScene({
  finish,
  exploded,
  active,
  mode = "space",
  view = "angle",
  layer = "timber",
  treated = true,
  pulse = 0,
  reset = 0,
}: {
  finish: TimberFinish;
  exploded: boolean;
  active: boolean;
  mode?: AlcoveMode;
  view?: AlcoveView;
  layer?: AlcoveLayer;
  treated?: boolean;
  pulse?: number;
  reset?: number;
}) {
  const id = useId().replaceAll(":", "");
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ListeningEngine | null>(null);
  const latest = useRef<ListeningState>({
    finish,
    exploded,
    active,
    mode,
    view,
    layer,
    treated,
    pulse,
    reset,
  });
  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const reduced = useReducedMotionPreference();
  useEffect(() => {
    const query = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    latest.current = { finish, exploded, active, mode, view, layer, treated, pulse, reset };
    engine.current?.update(latest.current);
  }, [finish, exploded, active, mode, view, layer, treated, pulse, reset]);
  useEffect(() => {
    if (import.meta.env.SSR || !host.current || !desktop || reduced) {
      setReady(false);
      return;
    }
    let disposed = false;
    const element = host.current;
    void Promise.all([import("three"), import("./listening-scene")])
      .then(([THREE, module]) => {
        if (disposed) return;
        try {
          engine.current = module.createListeningScene(element, THREE, latest.current, () =>
            setReady(false),
          );
          setReady(true);
        } catch {
          setReady(false);
        }
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });
    return () => {
      disposed = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [desktop, reduced]);
  return (
    <div
      className="ta-listening-scene"
      data-testid="hero-listening-scene"
      data-finish={finish}
      data-exploded={exploded}
      data-renderer={ready ? "webgl" : "fallback"}
      data-mode={mode}
      data-view={view}
      data-layer={layer}
      data-treated={treated}
      data-pulse={pulse}
      data-active={active}
      aria-hidden="true"
    >
      <svg
        className="ta-alcove-fallback"
        viewBox={view === "inside" ? "215 240 320 320" : "0 0 700 650"}
        fill="none"
      >
        <defs>
          <linearGradient
            id={`${id}-wood`}
            x1="190"
            y1="160"
            x2="550"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--alcove-light)" />
            <stop offset="0.6" stopColor="var(--alcove-wood)" />
            <stop offset="1" stopColor="var(--alcove-dark)" />
          </linearGradient>
          <linearGradient
            id={`${id}-felt`}
            x1="250"
            y1="300"
            x2="470"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={mode === "sound" && !treated ? "#e6d5b9" : "#5b4a36"} />
            <stop offset="0.45" stopColor={mode === "sound" && !treated ? "#cbbda5" : "#2c3532"} />
            <stop offset="1" stopColor={mode === "sound" && !treated ? "#b6a78f" : "#172a2b"} />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop stopColor="#153a54" stopOpacity="0.22" />
            <stop offset="1" stopColor="#153a54" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="367" cy="556" rx="235" ry="59" fill={`url(#${id}-shadow)`} />
        <path
          className="ta-alcove-fallback-backing"
          d="M195 522V244Q195 137 300 137H398Q500 137 500 244V522Z"
          fill={`url(#${id}-felt)`}
        />
        <path d="M215 526L500 522L556 557L269 564Z" fill="#d5c7ac" />
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i} className="ta-alcove-rib" transform={`translate(${i * 4} ${i * 1.5})`}>
            <path
              className={i > 10 ? "ta-alcove-front-rib" : undefined}
              d="M195 522V244Q195 137 300 137H398Q500 137 500 244V522L486 526V244Q486 152 398 152H300Q211 152 211 244V526Z"
              fill={`url(#${id}-wood)`}
              stroke="var(--alcove-dark)"
              strokeWidth="1"
            />
          </g>
        ))}
        <path d="M265 290V440" stroke="#ffd499" strokeWidth="4" />
        <g stroke="#243b42" strokeWidth="5">
          <path d="M323 464L314 525M400 464L411 525M342 451L337 513M414 451L425 513" />
        </g>
        <path d="M317 428V370Q317 348 340 348H385Q408 348 408 370V428Z" fill="#a95432" />
        <path
          d="M313 429Q307 419 321 418H400L426 452Q432 466 416 469H332Q320 469 318 460Z"
          fill="#c77449"
        />
        <ellipse cx="467" cy="446" rx="27" ry="10" fill="#d5c7ac" />
        <path d="M467 453V514" stroke="#243b42" strokeWidth="4" />
        {mode === "layers" && layer === "gap" && (
          <path
            className="ta-alcove-gap-guide"
            d="M238 218H275M238 210V226M275 210V226M238 218V410"
            stroke="#bf673b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        )}
        {mode === "sound" && (
          <g
            key={pulse}
            className={`ta-alcove-svg-sound ${active && pulse > 0 ? "is-playing" : ""}`}
            stroke={treated ? "#68b6ac" : "#bf673b"}
            strokeWidth="2.5"
            fill="none"
          >
            <circle cx="365" cy="360" r="5" fill={treated ? "#68b6ac" : "#bf673b"} />
            <path
              className="ta-alcove-svg-path"
              d="M365 360L245 280L465 245L285 405L470 365L260 250L455 310"
            />
            <path
              className="ta-alcove-svg-path"
              d="M365 360L475 315L270 230L465 405L245 350L460 265L280 395"
            />
          </g>
        )}
      </svg>
      <div ref={host} className="ta-alcove-webgl" />
    </div>
  );
}
