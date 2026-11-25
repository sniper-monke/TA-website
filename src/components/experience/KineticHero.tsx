import { useRef, useState, type PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { BrandContours } from "./BrandContours";
import { LiveContourField } from "./LiveContourField";
import { TimberWave } from "./TimberWave";
import type { TimberPulse } from "./timber-wave";

function moveArtwork(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return;
  const plate = event.currentTarget;
  const bounds = plate.getBoundingClientRect();
  plate.style.setProperty(
    "--wave-x",
    `${((event.clientX - bounds.left) / bounds.width - 0.5) * 24}px`,
  );
  plate.style.setProperty(
    "--wave-y",
    `${((event.clientY - bounds.top) / bounds.height - 0.5) * 14}px`,
  );
}

function resetArtwork(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty("--wave-x");
  event.currentTarget.style.removeProperty("--wave-y");
}

export function KineticHero() {
  const reduced = useReducedMotionPreference();
  const [ripplesPaused, setRipplesPaused] = useState(false);
  const pulse = useRef<TimberPulse>({ x: 1.22, strength: 0 });
  const rippleAction = ripplesPaused ? "Resume background ripples" : "Pause background ripples";

  return (
    <section data-testid="hero" data-home-section="hero" aria-labelledby="ta-v2-title">
      <div className="ta-v2-masthead ta-v2-shell">
        <div className="ta-v2-meta ta-v2-label">
          <span>Acoustic treatment, naturally</span>
          <span>Timber Acoustics / India</span>
        </div>
        <h1 id="ta-v2-title" data-testid="hero-headline">
          <span>Sound, in</span>{" "}
          <span>
            better <em>shape.</em>
          </span>
        </h1>
        <div className="ta-v2-cover-copy">
          <p className="ta-v2-kicker">Less echo. More clarity. Better balance.</p>
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
        <div
          className="ta-v2-cover-art"
          onPointerMove={reduced ? undefined : moveArtwork}
          onPointerLeave={resetArtwork}
        >
          <BrandContours className="ta-v2-cover-contours" />
          {!reduced && <LiveContourField active={!ripplesPaused} pulse={pulse} />}
          <TimberWave reduced={reduced} pulse={pulse} />
          {!reduced && (
            <button
              type="button"
              className="ta-v2-ripple-toggle"
              onClick={() => setRipplesPaused((paused) => !paused)}
              aria-label={rippleAction}
              title={rippleAction}
            >
              {ripplesPaused ? (
                <Play size={16} aria-hidden="true" />
              ) : (
                <Pause size={16} aria-hidden="true" />
              )}
            </button>
          )}
          <div className="ta-v2-stamp" aria-hidden="true">
            <img src="/brand/timber-mark.svg" alt="" width="28" height="28" />
            <span>
              Made to
              <br />
              resonate.
            </span>
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
    </section>
  );
}
