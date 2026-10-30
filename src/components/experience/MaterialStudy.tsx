import { useRef, type CSSProperties } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BrandContours } from "./BrandContours";

export type TimberFinish = "oak" | "walnut" | "ebony";
export type AcousticMode = "absorb" | "diffuse" | "trap";

export function MaterialStudy({
  finish = "oak",
  exploded = false,
  mode = "absorb",
  className = "",
}: {
  finish?: TimberFinish;
  exploded?: boolean;
  mode?: AcousticMode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pointer = useMotionValue(0);
  const smooth = useSpring(pointer, { stiffness: 90, damping: 24 });
  const rotate = useTransform(smooth, [-1, 1], [-4, 4]);
  return (
    <div
      ref={host}
      className={`ta-material-study ${className}`}
      data-finish={finish}
      data-mode={mode}
      data-exploded={exploded}
      onPointerMove={(event) => {
        if (reduced || event.pointerType === "touch") return;
        const rect = host.current?.getBoundingClientRect();
        if (rect) pointer.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      }}
      onPointerLeave={() => pointer.set(0)}
      aria-hidden="true"
    >
      <BrandContours className="ta-material-contours" />
      <div className="ta-object-shadow" />
      <motion.div className="ta-object-orbit" style={reduced ? {} : { rotateY: rotate }}>
        {mode === "absorb" && (
          <div className="ta-material-board">
            <div className="ta-felt-layer" />
            <div className="ta-slat-layer">
              {Array.from({ length: 19 }, (_, index) => (
                <span
                  key={index}
                  className="ta-wood-slat"
                  style={{ "--slat": index, "--grain": `${(index * 17) % 100}%` } as CSSProperties}
                />
              ))}
            </div>
          </div>
        )}
        {mode === "diffuse" && (
          <div className="ta-diffuser-board">
            {Array.from({ length: 49 }, (_, index) => (
              <span
                key={index}
                style={
                  {
                    "--depth": `${12 + ((index * index + index * 3) % 11) * 9}px`,
                    "--grain": `${(index * 13) % 100}%`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
        {mode === "trap" && (
          <div className="ta-trap-object">
            {Array.from({ length: 11 }, (_, index) => (
              <span key={index} style={{ "--layer": index } as CSSProperties} />
            ))}
          </div>
        )}
      </motion.div>
      <span className="ta-object-cross ta-object-cross-a">+</span>
      <span className="ta-object-cross ta-object-cross-b">+</span>
    </div>
  );
}
