import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { LiveContourField } from "./LiveContourField";
import { homePhoto, homeSeries, type HomeSeriesId } from "./home-content";
import type { TimberMorphStage } from "./home-morph";

const rotationIntervalMs = 2_000;

function HomeSeriesStage({
  series,
  enabled,
  moving,
  onUnavailable,
}: {
  series: HomeSeriesId;
  enabled: boolean;
  moving: boolean;
  onUnavailable: (unavailable: boolean) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<TimberMorphStage | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled || import.meta.env.SSR) return;
    const element = canvas.current;
    if (!element) return;
    let disposed = false;

    void import("./home-morph")
      .then(({ createTimberMorph }) => {
        if (disposed) return;
        stage.current = createTimberMorph(element, () => onUnavailable(true));
        setReady(true);
      })
      .catch(() => {
        if (!disposed) onUnavailable(true);
      });

    return () => {
      disposed = true;
      stage.current?.dispose();
      stage.current = null;
      setReady(false);
    };
  }, [enabled, onUnavailable]);

  useEffect(() => {
    if (enabled && ready) stage.current?.setSeries(series);
  }, [enabled, series, ready]);

  useEffect(() => {
    if (enabled && ready) stage.current?.setMotion(moving);
  }, [enabled, moving, ready]);

  return (
    <canvas
      ref={canvas}
      className="timber-home-morph"
      data-ready={enabled && ready}
      aria-hidden="true"
    />
  );
}

export function HomeHero() {
  const reduced = useReducedMotionPreference();
  const stage = useRef<HTMLDivElement>(null);
  const [series, setSeries] = useState<HomeSeriesId>("absorption");
  const [webGLUnavailable, setWebGLUnavailable] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const canShow3D = !reduced && !webGLUnavailable;
  const selected = homeSeries.find((item) => item.id === series) ?? homeSeries[0];

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible((entry?.intersectionRatio ?? 0) >= 0.25),
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced || !playing) return;
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (document.hidden) return;
      timer = window.setTimeout(() => {
        const index = homeSeries.findIndex((item) => item.id === series);
        setSeries(homeSeries[(index + 1) % homeSeries.length]!.id);
      }, rotationIntervalMs);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [visible, reduced, playing, series]);

  return (
    <section className="timber-home-hero" aria-labelledby="home-hero-title" data-testid="hero">
      <LiveContourField active={!reduced && playing} appearance="brand" />
      <div className="timber-home-hero-copy">
        <h1 id="home-hero-title" data-testid="hero-headline">
          <span>Shape</span> <em>your sound.</em>
        </h1>
        <p>Wood acoustic treatment for studios and listening rooms.</p>
        <a className="timber-home-button" href="#our-range">
          Explore the range
        </a>
      </div>
      <div ref={stage} className="timber-home-stage" data-series={series}>
        <div className="timber-home-stage-view" aria-hidden="true">
          <img
            key={selected.image}
            className="timber-home-stage-photo"
            src={homePhoto(`hero-${selected.image}`)}
            alt=""
            width="900"
            height="900"
            fetchPriority={series === "absorption" ? "high" : "auto"}
          />
          <HomeSeriesStage
            series={series}
            enabled={canShow3D}
            moving={visible && playing}
            onUnavailable={setWebGLUnavailable}
          />
        </div>
        <div className="timber-home-stage-controls">
          <div className="timber-home-series" role="group" aria-label="Acoustic treatments">
            {homeSeries.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                data-treatment={id}
                aria-pressed={series === id}
                onClick={() => setSeries(id)}
              >
                <span className="timber-home-series-mark" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                {name}
              </button>
            ))}
          </div>
          <div className="timber-home-stage-footer">
            <div aria-live={!playing || reduced ? "polite" : "off"}>
              <Link to="/products/$slug" params={{ slug: selected.slug }}>
                {selected.product} <ArrowUpRight size={12} aria-hidden="true" />
              </Link>
            </div>
            {!reduced && (
              <button
                className="timber-home-hero-play"
                type="button"
                onClick={() => setPlaying(!playing)}
                aria-label={playing ? "Pause hero rotation" : "Play hero rotation"}
                title={playing ? "Pause hero rotation" : "Play hero rotation"}
              >
                {playing ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
