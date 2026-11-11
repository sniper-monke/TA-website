import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { LiveContourField } from "./LiveContourField";
import type { TimberFinish } from "./MaterialStudy";
import { AlcoveExplorer } from "./AlcoveExplorer";

const finishes: { id: TimberFinish; label: string; colour: string }[] = [
  { id: "oak", label: "Natural oak", colour: "#c9a875" },
  { id: "walnut", label: "Walnut", colour: "#6b4a33" },
  { id: "ebony", label: "Smoked ebony", colour: "#3b3a38" },
];
const ease = [0.22, 1, 0.36, 1] as const;

export function KineticHero() {
  const [finish, setFinish] = useState<TimberFinish>("oak");
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  const active = !paused && !reduced;
  const selected = finishes.find((item) => item.id === finish)!;

  return (
    <section
      className="ta-hero ta-hero-kinetic ta-hero-experiment"
      data-testid="hero"
      data-home-section="hero"
      data-motion={active ? "live" : "paused"}
    >
      <LiveContourField active={active} />
      <div className="ta-kinetic-grid" aria-hidden="true" />
      <div className="ta-kinetic-meta ta-shell ta-micro">
        <span>Acoustic treatment, naturally</span>
        <span>Timber Acoustics / India</span>
      </div>
      <div className="ta-kinetic-stage ta-shell">
        <div className="ta-kinetic-copy">
          <motion.p
            className="ta-micro ta-kinetic-kicker"
            initial={reduced ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Less echo. More clarity. Better balance.
          </motion.p>
          <h1 className="ta-kinetic-title" data-testid="hero-headline">
            <motion.span
              initial={reduced ? false : { y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease }}
            >
              Sound, in
            </motion.span>
            <motion.span
              initial={reduced ? false : { y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease }}
            >
              better <em>shape.</em>
            </motion.span>
          </h1>
          <div className="ta-kinetic-intro">
            <span className="ta-kinetic-plus" aria-hidden="true">
              +
            </span>
            <p>
              Acoustic panels, diffusers and bass traps.
              <br />
              Thoughtful treatment for the way your room sounds.
            </p>
          </div>
          <div className="ta-kinetic-links">
            <Link to="/products" className="ta-kinetic-cta" data-testid="hero-explore-button">
              Explore products <ArrowUpRight size={20} />
            </Link>
            <Link to="/contact" className="ta-kinetic-secondary" data-testid="hero-build-button">
              Book a consultation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="ta-kinetic-object">
          <AlcoveExplorer finish={finish} active={active} />
        </div>
      </div>
      <div className="ta-kinetic-controls ta-shell">
        <div className="ta-finish-selector">
          <span className="ta-micro">Finish /</span>
          <div role="group" aria-label="Preview timber finish">
            {finishes.map((item) => (
              <button
                key={item.id}
                aria-label={item.label}
                aria-pressed={finish === item.id}
                onClick={() => setFinish(item.id)}
                data-testid={`hero-finish-${item.id}`}
              >
                <span style={{ background: item.colour }} />
              </button>
            ))}
          </div>
          <span className="ta-finish-name" aria-live="polite">
            {selected.label}
          </span>
        </div>
        <a
          className="ta-alcove-use-finish"
          href={`/build-a-room?finish=${finish}`}
          data-testid="hero-use-finish"
        >
          Use this finish in a room <ArrowUpRight size={15} />
        </a>
        <button
          className="ta-motion-toggle ta-micro"
          onClick={() => setPaused(!paused)}
          aria-label={active ? "Pause scene motion" : "Resume scene motion"}
          aria-pressed={!active}
          disabled={!!reduced}
          data-testid="hero-motion"
        >
          {active ? <Pause size={13} /> : <Play size={13} />}
          <span>Motion {active ? "on" : "off"}</span>
        </button>
        <a href="#our-approach" className="ta-kinetic-scroll ta-micro">
          Our approach <ArrowDown size={16} />
        </a>
      </div>
      <div className="ta-kinetic-caption ta-shell ta-micro">
        <span>Acoustics with a natural soul.</span>
        <span>Concept study / Not a product model or acoustic measurement</span>
      </div>
    </section>
  );
}
