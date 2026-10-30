import { RingsMark } from "@/reference/components/WoodRings";
const words = ["Absorb", "Diffuse", "Trap", "Shape", "Tune"];
export function EditorialMarquee() {
  return (
    <div className="reference-marquee" data-testid="editorial-marquee">
      <div>
        {[0, 1].flatMap((copy) =>
          words.map((word, i) => (
            <span key={`${copy}-${word}`} className={i % 2 ? "outline" : ""}>
              {word}
              <RingsMark size={26} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
