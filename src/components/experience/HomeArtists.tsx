import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageFallback } from "@/lib/image-fallback";
import { BrandContours } from "./BrandContours";

const artists = [
  { name: "Asees Kaur", image: "asees-kaur" },
  { name: "Peter Cat Recording Co.", image: "peter-cat-recording-co", position: "48% 40%" },
  { name: "KR$NA", image: "krsna" },
  { name: "Mame Khan", image: "mame-khan", position: "58% 40%" },
  { name: "Salim Merchant", image: "salim-merchant", position: "63% 40%" },
  { name: "Lifafa", image: "lifafa" },
  { name: "DJ NYK", image: "dj-nyk" },
  { name: "DJ Perch", image: "dj-perch", position: "62% 40%" },
  { name: "Radhika Bhide", image: "radhika-bhide" },
  { name: "Prakhar Ke Pravachan", image: "prakhar-ke-pravachan" },
  { name: "Jaaved Jaaferi", image: "jaaved-jaaferi" },
  { name: "Suleman", image: "suleman" },
];

export function HomeArtists({ reducedMotion }: { reducedMotion: boolean }) {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const syncRail = useCallback(() => {
    const viewport = rail.current;
    if (!viewport?.scrollWidth) return;

    const { clientWidth, scrollLeft, scrollWidth } = viewport;
    // Snap positions can differ from the scroll bounds by a fraction of a pixel.
    setCanGoBack(scrollLeft > 1);
    setCanGoForward(scrollLeft + clientWidth < scrollWidth - 1);
    indicator.current?.style.setProperty("inline-size", `${(clientWidth / scrollWidth) * 100}%`);
    indicator.current?.style.setProperty("translate", `${(scrollLeft / clientWidth) * 100}%`);
  }, []);

  useEffect(() => {
    syncRail();
    const viewport = rail.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(syncRail);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [syncRail]);

  useEffect(() => {
    const element = section.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry?.isIntersecting ?? false),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function move(direction: -1 | 1) {
    const viewport = rail.current;
    if (!viewport || (direction < 0 ? !canGoBack : !canGoForward)) return;

    viewport.scrollBy({ left: direction * viewport.clientWidth });
  }

  return (
    <section
      className="timber-home-chapter timber-home-artists"
      id="artists"
      aria-labelledby="home-artists-title"
      data-motion={inView && !paused && !reducedMotion ? "playing" : "paused"}
      ref={section}
    >
      <BrandContours className="timber-home-artist-contours" />
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-artists-title">
            Artists we’ve <em>worked with.</em>
          </h2>
          <div
            className="timber-home-artist-controls"
            role="group"
            aria-label="Artist gallery controls"
          >
            {!reducedMotion && (
              <button
                type="button"
                aria-label={paused ? "Play gallery animation" : "Pause gallery animation"}
                onClick={() => setPaused((wasPaused) => !wasPaused)}
              >
                {paused ? (
                  <Play size={17} aria-hidden="true" />
                ) : (
                  <Pause size={17} aria-hidden="true" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label="Previous artists"
              aria-controls="home-artist-rail"
              aria-disabled={!canGoBack}
              onClick={() => move(-1)}
            >
              <ArrowLeft size={21} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="timber-home-artist-next"
              aria-label="Next artists"
              aria-controls="home-artist-rail"
              aria-disabled={!canGoForward}
              onClick={() => move(1)}
            >
              <ArrowRight size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul
          className="timber-home-artist-rail"
          id="home-artist-rail"
          role="list"
          aria-label="Artist portraits"
          tabIndex={0}
          data-lenis-prevent-horizontal=""
          ref={rail}
          onScroll={syncRail}
        >
          {artists.map(({ name, image, position }) => (
            <li key={image}>
              <figure>
                <div className="timber-home-artist-photo">
                  <img
                    src={`/images/artists/${image}.webp`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={imageFallback}
                    style={
                      position ? { objectPosition: position, transformOrigin: position } : undefined
                    }
                  />
                </div>
                <figcaption>{name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="timber-home-artist-progress" aria-hidden="true">
          <span ref={indicator} />
        </div>
      </div>
    </section>
  );
}
