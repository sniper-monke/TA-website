import type { CSSProperties } from "react";

const contours = Array.from({ length: 19 }, (_, ring) => {
  const radius = 16 + ring * 17;
  return (
    Array.from({ length: 100 }, (_, step) => {
      const angle = (step / 100) * Math.PI * 2;
      const organic = radius + Math.sin(angle * 3 + ring * 0.12) * 17 + Math.cos(angle * 2) * 11;
      return `${step ? "L" : "M"}${(300 + Math.cos(angle) * organic * 0.88).toFixed(2)},${(300 + Math.sin(angle) * organic).toFixed(2)}`;
    }).join(" ") + "Z"
  );
});

export function BrandContours({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true">
      {contours.map((path, ring) => (
        <path
          key={ring}
          className="ta-contour-line"
          d={path}
          stroke="currentColor"
          strokeWidth="0.9"
          style={{ "--contour": ring } as CSSProperties}
        />
      ))}
    </svg>
  );
}
