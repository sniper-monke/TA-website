import { useEffect, useRef, type RefObject } from "react";
import type { TimberPulse } from "./timber-wave";

const contourSteps = 88;
const samples = Array.from({ length: contourSteps }, (_, index) => {
  const angle = (index / contourSteps) * Math.PI * 2;
  return { angle, x: Math.cos(angle), y: Math.sin(angle) };
});

const grainColors = ["#aa6b4366", "#94745440", "#80654d31"] as const;

type ContourMotion = {
  time: number;
  x: number;
  y: number;
  pressure: number;
  tapAt: number;
  waveX: number;
  waveStrength: number;
};

function paintContours(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  motion: ContourMotion,
) {
  context.clearRect(0, 0, width, height);
  const { time, x, y, pressure, tapAt, waveX, waveStrength } = motion;
  const compact = width < 680;
  const centerX = width * ((compact ? 0.66 : 0.73) + Math.sin(time * 0.42) * 0.017);
  const centerY = height * ((compact ? 0.53 : 0.48) + Math.cos(time * 0.34) * 0.026);
  const scale = Math.min(width * (compact ? 0.86 : 0.56), height * (compact ? 1.05 : 1.43));
  const rings = compact ? 23 : 34;
  const pointerX = x * width;
  const pointerY = y * height;
  const pointerRadius = Math.min(width * 0.29, height * 0.58);
  const tapAge = time - tapAt;
  const tapStrength = Math.max(0, 1 - tapAge / 0.84);

  for (let ring = 0; ring < rings; ring++) {
    const radius = scale * (0.095 + ring * (compact ? 0.047 : 0.034));
    context.beginPath();
    for (const point of samples) {
      const { angle } = point;
      const ripple = Math.sin(angle * 3 + time * 0.56 + ring * 0.12) * scale * 0.035;
      const grain = Math.cos(angle * 5 - time * 0.25 + ring * 0.055) * scale * 0.014;
      const edge = radius + ripple + grain;
      let px = centerX + point.x * edge * 1.15;
      let py = centerY + point.y * edge * 0.79;

      if (waveStrength > 0.01) {
        const distance = px / width - waveX;
        const strength = Math.exp(-65 * distance * distance) * waveStrength;
        px += point.x * strength * 8;
        py += Math.sin(distance * 27 + ring * 0.13) * strength * Math.min(26, height * 0.08);
      }

      if (pressure > 0.01 || tapStrength > 0) {
        const dx = px - pointerX;
        const dy = py - pointerY;
        const squaredDistance = (dx * dx + dy * dy) / (pointerRadius * pointerRadius);
        const push = Math.exp(-squaredDistance) * pressure * 0.31;
        let echo = 0;
        if (tapStrength > 0) {
          const tapDistance = Math.sqrt(squaredDistance) - tapAge * 2.6;
          echo = Math.exp(-24 * tapDistance * tapDistance) * tapStrength;
        }
        px += dx * push + point.x * echo * 11;
        py += dy * push + point.y * echo * 9;
      }

      if (angle === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
    context.strokeStyle = grainColors[ring % 6 === 0 ? 0 : ring % 3 === 0 ? 1 : 2];
    context.lineWidth = ring % 6 === 0 ? 1.12 : 0.78;
    context.stroke();
  }
}

/** Wood-grain contours inspired by the live hero field on the main homepage. */
export function LiveContourField({
  active,
  pulse,
}: {
  active: boolean;
  pulse: RefObject<TimberPulse>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const setRunning = useRef<((running: boolean) => void) | null>(null);
  const phase = useRef<ContourMotion>({
    time: 0,
    x: 0.73,
    y: 0.5,
    pressure: 0,
    tapAt: -1,
    waveX: 1.2,
    waveStrength: 0,
  });

  useEffect(() => {
    const element = canvas.current;
    const host = element?.parentElement;
    if (!element || !host) return;
    const context = element.getContext("2d");
    if (!context) return;

    const motion = phase.current;
    let width = host.clientWidth;
    let height = host.clientHeight;
    let visible = typeof IntersectionObserver === "undefined";
    let running = false;
    let frame = 0;
    let previous = 0;
    let targetX = motion.x;
    let targetY = motion.y;
    let hovering = false;

    const canDraw = () => visible && !document.hidden && width > 0 && height > 0;

    const draw = () => {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        1.25,
        Math.sqrt(480_000 / (width * height)),
      );
      const bufferWidth = Math.max(1, Math.floor(width * ratio));
      const bufferHeight = Math.max(1, Math.floor(height * ratio));
      if (element.width !== bufferWidth || element.height !== bufferHeight) {
        element.width = bufferWidth;
        element.height = bufferHeight;
      }
      context.setTransform(bufferWidth / width, 0, 0, bufferHeight / height, 0, 0);
      paintContours(context, width, height, motion);
      if (!element.hasAttribute("data-ready")) element.setAttribute("data-ready", "true");
    };

    const tick = (now: number) => {
      frame = 0;
      if (!running || !canDraw()) return;
      const rate = hovering || pulse.current.strength > 0 ? 36 : 24;
      const elapsed = now - previous;
      if (elapsed >= 1000 / rate) {
        const step = Math.min(elapsed / 1000, 0.07);
        const follow = 1 - Math.exp(-step * 8);
        motion.time += step;
        motion.x += (targetX - motion.x) * follow;
        motion.y += (targetY - motion.y) * follow;
        motion.pressure += ((hovering ? 1 : 0) - motion.pressure) * follow;
        motion.waveX = pulse.current.x;
        motion.waveStrength += (pulse.current.strength - motion.waveStrength) * follow;
        previous = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const sync = () => {
      if (!canDraw()) {
        stop();
        if (element.hasAttribute("data-ready")) {
          element.removeAttribute("data-ready");
          element.width = 1;
          element.height = 1;
        }
        return;
      }
      if (!element.hasAttribute("data-ready")) draw();
      if (!running) {
        stop();
      } else if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    setRunning.current = (enabled) => {
      running = enabled;
      if (!running) hovering = false;
      sync();
    };

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      if (canDraw()) draw();
      sync();
    };
    const locate = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / (bounds.width || 1);
      targetY = (event.clientY - bounds.top) / (bounds.height || 1);
    };
    const move = (event: PointerEvent) => {
      if (!running || event.pointerType === "touch") return;
      locate(event);
      hovering = true;
    };
    const leave = () => {
      hovering = false;
    };
    const tap = (event: PointerEvent) => {
      if (!running || event.pointerType !== "touch") return;
      locate(event);
      motion.x = targetX;
      motion.y = targetY;
      motion.tapAt = motion.time;
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            sync();
          });
    const sizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(host);
    sizeObserver?.observe(host);
    if (!sizeObserver) window.addEventListener("resize", resize);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerup", tap, { passive: true });
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      setRunning.current = null;
      observer?.disconnect();
      sizeObserver?.disconnect();
      if (!sizeObserver) window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerup", tap);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [pulse]);

  useEffect(() => {
    setRunning.current?.(active);
  }, [active, pulse]);

  return (
    <canvas
      ref={canvas}
      className="ta-v2-live-contours"
      data-testid="hero-live-contours"
      width="1"
      height="1"
      aria-hidden="true"
    />
  );
}
