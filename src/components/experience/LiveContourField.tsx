import { useEffect, useRef } from "react";

/** A slowly evolving wood-grain field, displaced by the visitor's pointer. */
export function LiveContourField({
  active,
  appearance = "light",
}: {
  active: boolean;
  appearance?: "light" | "brand";
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);

  useEffect(() => {
    const element = canvas.current;
    const host = element?.parentElement;
    if (!element || !host || typeof ResizeObserver === "undefined") return;
    const context = element?.getContext("2d");
    if (!context) return;
    const brand = appearance === "brand";
    const grainColors = brand
      ? ["rgba(191,103,59,0.46)", "rgba(36,128,130,0.28)", "rgba(21,58,84,0.19)"]
      : ["rgba(191,103,59,0.31)", "rgba(36,128,130,0.18)", "rgba(21,58,84,0.12)"];

    let width = 1;
    let height = 1;
    let frame = 0;
    let previous = 0;
    let visible = true;
    let targetX = 0.66;
    let targetY = 0.45;
    let pointerX = targetX;
    let pointerY = targetY;
    let pointerStrength = 0;
    let hovering = false;
    const compact = () => width < 768;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const time = phase.current;
      const cx = width * (brand ? 0.11 + Math.sin(time * 0.36) * 0.026 : compact() ? 0.6 : 0.73);
      const cy = height * (brand ? 0.63 + Math.cos(time * 0.27) * 0.024 : compact() ? 0.69 : 0.48);
      const scale = brand
        ? Math.min(width * (compact() ? 1.06 : 0.53), height * 1.19)
        : Math.min(width * (compact() ? 0.85 : 0.55), height * 0.82);
      const rings = brand ? 47 : compact() ? 23 : 31;

      for (let ring = 0; ring < rings; ring++) {
        const radius = scale * (0.1 + ring * (brand ? 0.022 : 0.038));
        context.beginPath();
        for (let step = 0; step <= 120; step++) {
          const angle = (step / 120) * Math.PI * 2;
          const ripple = Math.sin(angle * 3 + time * 0.45 + ring * 0.13) * scale * 0.037;
          const grain = Math.cos(angle * 5 - time * 0.19 + ring * 0.055) * scale * 0.014;
          let x = cx + Math.cos(angle) * (radius + ripple + grain) * 1.17;
          let y = cy + Math.sin(angle) * (radius + ripple + grain) * 0.82;
          const dx = x - pointerX * width;
          const dy = y - pointerY * height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.exp(-distance / (scale * 0.28)) * pointerStrength;
          x += Math.sin(angle * 2 + time * 0.7) * influence * (brand ? 72 : 54);
          y += Math.cos(angle * 3 - time * 0.5) * influence * (brand ? 53 : 38);
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.strokeStyle = grainColors[ring % 7 === 0 ? 0 : ring % 4 === 0 ? 1 : 2]!;
        context.lineWidth = ring % 7 === 0 ? 1.2 : 0.7;
        context.stroke();
      }
    };

    const tick = (now: number) => {
      frame = 0;
      if (!canAnimate()) return;
      if (now - previous > 32) {
        phase.current += Math.min((now - previous) / 1000 || 0.033, 0.05);
        previous = now;
        pointerX += (targetX - pointerX) * 0.065;
        pointerY += (targetY - pointerY) * 0.065;
        pointerStrength += ((hovering ? 1 : 0) - pointerStrength) * 0.045;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const canAnimate = () => active && visible && !document.hidden && (brand || width >= 900);
    const resume = () => {
      if (canAnimate() && !frame) {
        previous = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
      resume();
    };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width;
      targetY = (event.clientY - bounds.top) / bounds.height;
      hovering = true;
      resume();
    };
    const leave = () => {
      hovering = false;
    };
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            if (visible) resume();
            else {
              cancelAnimationFrame(frame);
              frame = 0;
            }
          })
        : null;
    const resizeObserver = new ResizeObserver(resize);
    observer?.observe(host);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", resume);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [active, appearance]);

  return <canvas ref={canvas} className="ta-live-contours" aria-hidden="true" />;
}
