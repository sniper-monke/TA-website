import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Layers3, Minus, Pause, Play, Plus } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { BrandContours } from "./BrandContours";
import { HeroListeningScene } from "./HeroListeningScene";
import type { TimberFinish } from "./MaterialStudy";

const finishes = {
  oak: { label: "Natural oak", colour: "#c9a875" },
  walnut: { label: "Walnut", colour: "#6b4a33" },
  ebony: { label: "Smoked ebony", colour: "#3b3a38" },
} satisfies Record<TimberFinish, { label: string; colour: string }>;

function ListeningStudy() {
  const [finish, setFinish] = useState<TimberFinish>("oak");
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  const active = !paused && !reduced;

  return (
    <div className="ta-v2-study">
      <div className="ta-v2-shell ta-v2-study-grid">
        <figure className="ta-v2-material">
          <div className="ta-v2-material-stage" data-motion={active ? "live" : "paused"}>
            <BrandContours className="ta-v2-material-contours" />
            <div className="ta-v2-material-label">
              <p className="ta-v2-label">TA / Listening spaces</p>
              <p>Timber. Texture. Stillness.</p>
            </div>
            <HeroListeningScene finish={finish} exploded={exploded} active={active} />
            <p className="ta-v2-material-tag">A little space. A different feeling.</p>
          </div>
          <div className="ta-v2-study-controls">
            <div className="ta-v2-finish">
              <span className="ta-v2-label">Finish /</span>
              <div role="group" aria-label="Preview timber finish">
                {(Object.keys(finishes) as TimberFinish[]).map((id) => (
                  <button
                    type="button"
                    key={id}
                    aria-label={finishes[id].label}
                    aria-pressed={finish === id}
                    onClick={() => setFinish(id)}
                    data-testid={`hero-finish-${id}`}
                  >
                    <span style={{ backgroundColor: finishes[id].colour }} />
                  </button>
                ))}
              </div>
              <span className="ta-v2-finish-name" aria-live="polite">
                {finishes[finish].label}
              </span>
            </div>
            <button
              type="button"
              className="ta-v2-control"
              onClick={() => setExploded(!exploded)}
              aria-pressed={exploded}
              data-testid="hero-layers"
            >
              <Layers3 size={17} aria-hidden="true" />
              <span>{exploded ? "Close the build" : "Inside the build"}</span>
              {exploded ? (
                <Minus size={14} aria-hidden="true" />
              ) : (
                <Plus size={14} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="ta-v2-control ta-v2-motion"
              onClick={() => setPaused(!paused)}
              aria-label={active ? "Pause scene motion" : "Resume scene motion"}
              aria-pressed={!active}
              disabled={reduced}
              data-testid="hero-motion"
            >
              {active ? (
                <Pause size={14} aria-hidden="true" />
              ) : (
                <Play size={14} aria-hidden="true" />
              )}
              <span>Motion {active ? "on" : "off"}</span>
            </button>
          </div>
          <figcaption>Illustrative listening space / Sample catalogue</figcaption>
        </figure>
        <Link to="/projects" className="ta-v2-in-the-room">
          <img
            src="/images/timber-studio.webp"
            alt="A timber-lined recording space"
            loading="lazy"
            decoding="async"
            width="2000"
            height="1333"
          />
          <div className="ta-v2-room-label">
            <p className="ta-v2-label">Good sound lives here.</p>
            <span>In the room</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function KineticHero() {
  return (
    <section data-testid="hero" data-home-section="hero" aria-labelledby="ta-v2-title">
      <div className="ta-v2-masthead">
        <div className="ta-v2-shell">
          <div className="ta-v2-meta ta-v2-label">
            <span>Acoustic treatment, naturally</span>
            <span>Timber Acoustics / India</span>
          </div>
          <div className="ta-v2-cover">
            <div className="ta-v2-cover-copy">
              <p className="ta-v2-kicker">Less echo. More clarity. Better balance.</p>
              <h1 id="ta-v2-title" data-testid="hero-headline">
                <span>Sound, in</span>{" "}
                <span>
                  better <em>shape.</em>
                </span>
              </h1>
              <p className="ta-v2-intro">
                Acoustic panels, diffusers and bass traps.
                <br />
                Thoughtful treatment for the way your room sounds.
              </p>
              <div className="ta-v2-hero-actions">
                <Link to="/products" className="ta-v2-button" data-testid="hero-explore-button">
                  Explore products
                </Link>
                <Link to="/contact" className="ta-v2-link" data-testid="hero-build-button">
                  Book a consultation
                </Link>
              </div>
            </div>
            <div className="ta-v2-cover-art">
              <div className="ta-v2-cover-image">
                <img
                  src="/images/timber-hero.webp"
                  alt="Mustard lounge chair against a wall of curved timber slats"
                  fetchPriority="high"
                  width="2000"
                  height="1197"
                />
              </div>
              <BrandContours className="ta-v2-cover-contours" />
              <div className="ta-v2-stamp" aria-hidden="true">
                <img src="/brand/timber-mark.svg" alt="" width="28" height="28" />
                <span>
                  Made to
                  <br />
                  resonate.
                </span>
              </div>
            </div>
            <div className="ta-v2-cover-edge ta-v2-label" aria-hidden="true">
              Absorb / Diffuse / Balance
            </div>
          </div>
          <div className="ta-v2-hero-foot">
            <span className="ta-v2-label">Acoustics with a natural soul.</span>
            <a href="#our-approach" className="ta-v2-link">
              Our approach
            </a>
          </div>
        </div>
      </div>
      <ListeningStudy />
    </section>
  );
}
