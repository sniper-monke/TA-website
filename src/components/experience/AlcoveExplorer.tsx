import { useId, useState } from "react";
import { ArrowUpRight, MoveUpRight, RotateCcw, Waves } from "lucide-react";
import type { TimberFinish } from "./MaterialStudy";
import { HeroListeningScene } from "./HeroListeningScene";
import type { AlcoveLayer, AlcoveMode, AlcoveView } from "./listening-scene";

const modes: { id: AlcoveMode; label: string }[] = [
  { id: "space", label: "The space" },
  { id: "layers", label: "The layers" },
  { id: "sound", label: "Sound paths" },
];
const layers: { id: AlcoveLayer; label: string; copy: string; family: string }[] = [
  {
    id: "timber",
    label: "Timber face",
    copy: "A timber face gives the treatment its rhythm and finish. The full construction determines how it behaves.",
    family: "timberslat",
  },
  {
    id: "backing",
    label: "Acoustic backing",
    copy: "Look behind the timber. The acoustic backing is part of the treatment, rather than decoration alone.",
    family: "absorption",
  },
  {
    id: "gap",
    label: "Space behind",
    copy: "Depth and mounting matter. The space behind a treatment can change its behaviour; confirm the final build-up.",
    family: "absorption",
  },
];

export function AlcoveExplorer({ finish, active }: { finish: TimberFinish; active: boolean }) {
  const id = useId();
  const [mode, setMode] = useState<AlcoveMode>("space");
  const [view, setView] = useState<AlcoveView>("angle");
  const [layer, setLayer] = useState<AlcoveLayer>("timber");
  const [treated, setTreated] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [reset, setReset] = useState(0);
  const chosenLayer = layers.find((item) => item.id === layer)!;
  const selectMode = (next: AlcoveMode) => {
    setMode(next);
    setView(next === "sound" ? "front" : "angle");
    setReset((value) => value + 1);
    if (next === "sound") setPulse((value) => value + 1);
  };
  return (
    <div
      className="ta-alcove-explorer"
      data-mode={mode}
      data-view={view}
      data-treated={treated}
      data-layer={layer}
    >
      <div className="ta-alcove-mode-tabs" role="tablist" aria-label="Explore the listening alcove">
        {modes.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            id={`${id}-${item.id}`}
            aria-selected={mode === item.id}
            aria-controls={`${id}-panel`}
            tabIndex={mode === item.id ? 0 : -1}
            data-testid={`alcove-mode-${item.id}`}
            onClick={() => selectMode(item.id)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 2
                    : (index + (event.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length;
              selectMode(modes[next]!.id);
              document.getElementById(`${id}-${modes[next]!.id}`)?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        className="ta-alcove-explorer-panel"
        role="tabpanel"
        aria-labelledby={`${id}-${mode}`}
      >
        <HeroListeningScene
          finish={finish}
          exploded={mode === "layers"}
          active={active}
          mode={mode}
          view={view}
          layer={layer}
          treated={treated}
          pulse={pulse}
          reset={reset}
        />
        <div className="ta-alcove-scene-tools">
          {mode === "space" && (
            <>
              <div className="ta-alcove-segments" role="group" aria-label="Alcove view">
                {(
                  [
                    ["angle", "Angle"],
                    ["front", "Front"],
                    ["inside", "Inside"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    aria-pressed={view === value}
                    onClick={() => {
                      setView(value);
                      setReset((count) => count + 1);
                    }}
                    data-testid={`alcove-view-${value}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                className="ta-alcove-reset"
                aria-label="Reset alcove view"
                onClick={() => {
                  setView("angle");
                  setReset((count) => count + 1);
                }}
              >
                <RotateCcw size={14} />
              </button>
            </>
          )}
          {mode === "layers" && (
            <div
              className="ta-alcove-segments ta-alcove-layer-steps"
              role="group"
              aria-label="Explore construction layers"
            >
              {layers.map((item, index) => (
                <button
                  key={item.id}
                  aria-pressed={layer === item.id}
                  onClick={() => setLayer(item.id)}
                  data-testid={`alcove-layer-${item.id}`}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {mode === "sound" && (
            <>
              <div
                className="ta-alcove-segments"
                role="group"
                aria-label="Compare surface treatment"
              >
                <button
                  aria-pressed={!treated}
                  onClick={() => {
                    setTreated(false);
                    setPulse((count) => count + 1);
                  }}
                  data-testid="alcove-bare"
                >
                  Bare
                </button>
                <button
                  aria-pressed={treated}
                  onClick={() => {
                    setTreated(true);
                    setPulse((count) => count + 1);
                  }}
                  data-testid="alcove-treated"
                >
                  Treated
                </button>
              </div>
              <button
                className="ta-alcove-pulse-button"
                onClick={() => setPulse((count) => count + 1)}
                data-testid="alcove-pulse"
              >
                <Waves size={15} />
                {active ? "Send a pulse" : "Show paths"}
              </button>
            </>
          )}
        </div>
        <div className="ta-alcove-insight" aria-live="polite">
          {mode === "space" && (
            <p>
              <MoveUpRight size={13} />
              <span>
                <span className="ta-alcove-drag-hint">Drag to look around. </span>
                Choose a view, or look behind the finish.
              </span>
            </p>
          )}
          {mode === "layers" && (
            <>
              <p>{chosenLayer.copy}</p>
              <a href={`/products?family=${chosenLayer.family}`}>
                Explore the treatment <ArrowUpRight size={12} />
              </a>
            </>
          )}
          {mode === "sound" && (
            <>
              <p>
                {treated
                  ? "With treatment: a shorter, softer reflection trail."
                  : "Bare surfaces: the illustrated reflections linger."}
              </p>
              <span>Illustrative paths, not measured acoustic performance.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
