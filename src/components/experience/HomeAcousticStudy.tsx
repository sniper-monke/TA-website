import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";

type Surface = "wall" | "panel";
type StudyColors = { ink: string; incoming: string; reflected: string };

function drawStudy(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  absorption: number,
  colors: StudyColors,
) {
  const middle = height * 0.51;
  const left = width * 0.36;
  const right = width * 0.64;
  const waveLength = Math.max(54, width / 6.4);
  const waveNumber = (Math.PI * 2) / waveLength;
  const incomingAmplitude = height * 0.25;
  const reflectedAmplitude = incomingAmplitude * (0.84 - absorption * 0.68);

  context.clearRect(0, 0, width, height);

  // Open woodgrain behind the signal. A stroke gradient lets the strands dissolve at the edges.
  const fibers = context.createLinearGradient(left, 0, right, 0);
  fibers.addColorStop(0, "transparent");
  fibers.addColorStop(0.18, colors.reflected);
  fibers.addColorStop(0.65, colors.ink);
  fibers.addColorStop(1, "transparent");
  const grainWidth = right - left;
  context.strokeStyle = fibers;

  for (let line = 0; line < 36; line++) {
    context.beginPath();
    context.lineWidth = line % 6 === 0 ? 1.1 : 0.65;
    context.globalAlpha = (line % 6 === 0 ? 0.25 : 0.15) * (0.55 + absorption * 0.45);
    for (let step = 0; step <= 56; step++) {
      const t = step / 56;
      const drift = Math.sin(t * 14 + line * 0.38 + phase * 0.18);
      const ripple = Math.sin(t * 25 - line * 0.27 - phase * 0.12);
      const x =
        left + (line / 35) * grainWidth + (drift * 8 + ripple * 3) * (0.14 + absorption * 0.86);
      const y = t * height;
      if (step === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }

  for (let dot = 0; dot < 24; dot++) {
    const local = (((dot * 0.618 + phase * 0.045) % 1) + 1) % 1;
    const x = left + grainWidth * local;
    const y = middle + Math.sin(dot * 1.9 + phase * 0.48) * height * (0.28 - local * 0.12);
    context.beginPath();
    context.arc(x, y, dot % 6 === 0 ? 2.8 : 1.6, 0, Math.PI * 2);
    context.globalAlpha = absorption * Math.sin(local * Math.PI) * (0.55 - local * 0.3);
    context.fillStyle = colors.incoming;
    context.fill();
  }

  const wave = (start: number, end: number, reflected: boolean) => {
    for (let layer = 2; layer >= 0; layer--) {
      context.beginPath();
      const segments = Math.ceil((end - start) / 2);
      for (let step = 0; step <= segments; step++) {
        const x = start + (step / segments) * (end - start);
        const inside = Math.max(0, (x - left) / grainWidth);
        const amplitude = reflected
          ? reflectedAmplitude
          : incomingAmplitude * Math.exp(-inside * (0.8 + absorption * 2.9));
        const direction = reflected ? 1 : -1;
        const y =
          middle +
          Math.sin(x * waveNumber + phase * direction + layer * 0.56) *
            amplitude *
            (1 - layer * 0.07);
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.globalAlpha = [1, 0.44, 0.21][layer]!;
      context.strokeStyle = reflected ? colors.reflected : colors.incoming;
      context.lineWidth = layer === 0 ? 2.35 : 1.25;
      context.stroke();
    }
  };

  wave(0, left + grainWidth * (0.03 + 0.96 * absorption), false);
  wave(right, width, true);
  context.globalAlpha = 1;
}

export function HomeAcousticStudy() {
  const [surface, setSurface] = useState<Surface>("panel");
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotionPreference();
  const ref = useRef<HTMLCanvasElement>(null);
  const phase = useRef(1.3);
  const mix = useRef(1);
  const panel = surface === "panel";
  const moving = playing && !reduced;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const styles = window.getComputedStyle(canvas);
    const colors = {
      ink: styles.getPropertyValue("--home-ink").trim() || "#153a54",
      incoming: styles.getPropertyValue("--home-signal").trim() || "#bf673b",
      reflected: styles.getPropertyValue("--home-teal").trim() || "#248082",
    };
    let width = 0;
    let height = 0;
    let frame = 0;
    let previous = 0;
    let visible = typeof IntersectionObserver === "undefined";
    const target = panel ? 1 : 0;
    if (!moving) mix.current = target;

    const draw = () => {
      if (width && height) drawStudy(context, width, height, phase.current, mix.current, colors);
    };

    const tick = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || !moving) return;
      if (now - previous >= 30) {
        const elapsed = Math.min((now - previous) / 1000, 0.08);
        phase.current += elapsed * 3.2;
        mix.current += (target - mix.current) * Math.min(1, elapsed * 8);
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      if (visible && moving && !document.hidden) {
        if (!frame) {
          previous = performance.now();
          frame = requestAnimationFrame(tick);
        }
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            sync();
          });
    observer?.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [moving, panel]);

  return (
    <section className="timber-home-chapter timber-home-study" aria-labelledby="home-study-title">
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-study-title">
            Shape the <em>reflection.</em>
          </h2>
          <div className="timber-home-study-controls">
            <div className="timber-home-surface" role="group" aria-label="Compare surfaces">
              <button type="button" aria-pressed={!panel} onClick={() => setSurface("wall")}>
                Bare wall
              </button>
              <button type="button" aria-pressed={panel} onClick={() => setSurface("panel")}>
                Timber panel
              </button>
            </div>
            {!reduced && (
              <button
                className="timber-home-hero-play"
                type="button"
                onClick={() => setPlaying(!playing)}
                aria-label={playing ? "Pause acoustic animation" : "Play acoustic animation"}
                title={playing ? "Pause acoustic animation" : "Play acoustic animation"}
              >
                {playing ? (
                  <Pause size={18} aria-hidden="true" />
                ) : (
                  <Play size={18} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
        <figure className="timber-home-signal" data-home-reveal="">
          <div className="timber-home-signal-labels" aria-hidden="true">
            <span>Incoming sound</span>
            <span>{panel ? "Acoustic backing" : "Hard surface"}</span>
            <span>Reflected sound</span>
          </div>
          <canvas ref={ref} aria-hidden="true" />
          <figcaption aria-live="polite">
            {panel
              ? "Absorbent backing takes up some of the sound energy, softening the reflection."
              : "A hard surface sends much of the incoming sound back into the room."}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
