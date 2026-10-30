import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Layers3,
  Minus,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { LiveContourField } from "./LiveContourField";
import type { TimberFinish } from "./MaterialStudy";
import { HeroListeningScene } from "./HeroListeningScene";

const finishes: { id: TimberFinish; label: string; colour: string }[] = [
  { id: "oak", label: "Natural oak", colour: "#c9a875" },
  { id: "walnut", label: "Walnut", colour: "#6b4a33" },
  { id: "ebony", label: "Smoked ebony", colour: "#3b3a38" },
];
const ease = [0.22, 1, 0.36, 1] as const;

export function KineticHero() {
  const [finish, setFinish] = useState<TimberFinish>("oak");
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotionPreference();
  const active = !paused && !reduced;
  const selected = finishes.find((item) => item.id === finish)!;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, active ? 100 : 0]);

  return (
    <section
      ref={ref}
      className="ta-hero ta-hero-kinetic"
      data-testid="hero"
      data-motion={active ? "live" : "paused"}
    >
      <LiveContourField active={active} />
      <div className="ta-kinetic-grid" aria-hidden="true" />
      <div className="ta-kinetic-meta ta-shell ta-micro">
        <span>
          <i />A different kind of good vibration
        </span>
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
            Natural material. Unexpected feeling.
          </motion.p>
          <h1 className="ta-kinetic-title" data-testid="hero-headline">
            <span>
              <motion.span
                initial={reduced ? false : { y: "110%", rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.95, ease }}
              >
                Sound<span className="ta-title-dot">.</span>
              </motion.span>
            </span>
            <span>
              <motion.span
                initial={reduced ? false : { y: "110%", rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.95, delay: 0.12, ease }}
              >
                Shaped<span className="ta-title-dot">.</span>
              </motion.span>
            </span>
          </h1>
          <div className="ta-kinetic-intro">
            <span className="ta-kinetic-plus" aria-hidden="true">
              +
            </span>
            <p>
              Real timber. Considered acoustics.
              <br />
              For spaces that feel as good as they sound.
            </p>
          </div>
          <div className="ta-kinetic-links">
            <Link to="/products" className="ta-kinetic-cta" data-testid="hero-explore-button">
              Find your sound <ArrowUpRight size={20} />
            </Link>
            <Link
              to="/build-a-room"
              className="ta-kinetic-secondary"
              data-testid="hero-build-button"
            >
              Build your room <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <motion.div className="ta-kinetic-object" style={{ y }}>
          <div className="ta-kinetic-object-label ta-micro">
            <span>TA / Listening spaces</span>
            <span>Timber. Texture. Stillness.</span>
          </div>
          <HeroListeningScene finish={finish} exploded={exploded} active={active} />
          <span className="ta-kinetic-dimension ta-micro">
            A little space. A different feeling.
          </span>
        </motion.div>
        <div className="ta-resonate-stamp" aria-hidden="true">
          <svg viewBox="0 0 80 34" fill="none">
            {Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                d={`M${5 + i * 5} ${17 - (Math.sin(i * 0.8) * 0.5 + 0.5) * 13}V${17 + (Math.sin(i * 0.8) * 0.5 + 0.5) * 13}`}
                stroke="currentColor"
                strokeWidth="2"
              />
            ))}
          </svg>
          <span>
            Made to
            <br />
            resonate.
          </span>
          <ArrowUpRight size={17} />
        </div>
        <Link to="/projects" className="ta-kinetic-room">
          <div>
            <img src="/images/timber-studio.webp" alt="A timber-lined recording space" />
            <span>
              In the room <ArrowUpRight size={15} />
            </span>
          </div>
          <p className="ta-micro">Good sound lives here.</p>
        </Link>
        <span className="ta-kinetic-edge ta-micro" aria-hidden="true">
          Wood / Wave / Wonder
        </span>
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
        <button
          className="ta-kinetic-layer"
          onClick={() => setExploded(!exploded)}
          aria-pressed={exploded}
          data-testid="hero-layers"
        >
          <Layers3 size={16} />
          <span>{exploded ? "Close the build" : "Inside the build"}</span>
          {exploded ? <Minus size={15} /> : <Plus size={15} />}
        </button>
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
        <a href="#sound-study" className="ta-kinetic-scroll ta-micro">
          Feel the difference <ArrowDown size={16} />
        </a>
      </div>
      <div className="ta-kinetic-caption ta-shell ta-micro">
        <span>Acoustics with a natural soul.</span>
        <span>Illustrative listening space / Sample catalogue</span>
      </div>
    </section>
  );
}
