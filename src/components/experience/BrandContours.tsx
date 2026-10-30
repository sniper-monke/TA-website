export function BrandContours({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true">
      {Array.from({ length: 19 }, (_, ring) => {
        const radius = 16 + ring * 17;
        const points = Array.from({ length: 100 }, (_, step) => {
          const angle = (step / 100) * Math.PI * 2;
          const organic =
            radius + Math.sin(angle * 3 + ring * 0.12) * 17 + Math.cos(angle * 2) * 11;
          return `${step ? "L" : "M"}${(300 + Math.cos(angle) * organic * 0.88).toFixed(2)},${(300 + Math.sin(angle) * organic).toFixed(2)}`;
        }).join(" ");
        return <path key={ring} d={`${points}Z`} stroke="currentColor" strokeWidth="0.9" />;
      })}
    </svg>
  );
}
