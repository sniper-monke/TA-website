import { useEffect, useId, useRef, useState } from "react";
import type { TimberFinish } from "./MaterialStudy";
import type { ListeningEngine, ListeningState } from "./listening-scene";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";

/** The inline architectural illustration also serves SSR, loading and no-WebGL states. */
export function HeroListeningScene({
  finish,
  exploded,
  active,
}: {
  finish: TimberFinish;
  exploded: boolean;
  active: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ListeningEngine | null>(null);
  const latest = useRef<ListeningState>({ finish, exploded, active });
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
    latest.current = { finish, exploded, active };
    engine.current?.update(latest.current);
  }, [finish, exploded, active]);
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
      aria-hidden="true"
    >
      <svg className="ta-alcove-fallback" viewBox="0 0 700 650" fill="none">
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
            <stop stopColor="#5b4a36" />
            <stop offset="0.45" stopColor="#2c3532" />
            <stop offset="1" stopColor="#172a2b" />
          </linearGradient>
          <radialGradient id={`${id}-shadow`}>
            <stop stopColor="#153a54" stopOpacity="0.22" />
            <stop offset="1" stopColor="#153a54" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="367" cy="556" rx="235" ry="59" fill={`url(#${id}-shadow)`} />
        <path d="M195 522V244Q195 137 300 137H398Q500 137 500 244V522Z" fill={`url(#${id}-felt)`} />
        <path d="M215 526L500 522L556 557L269 564Z" fill="#d5c7ac" />
        {Array.from({ length: 15 }, (_, i) => (
          <g key={i} transform={`translate(${i * 4} ${i * 1.5})`}>
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
      </svg>
      <div ref={host} className="ta-alcove-webgl" />
    </div>
  );
}
