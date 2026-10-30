import { useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Layers3, Minus, Plus } from "lucide-react";
import products from "@/data/reference-products.json";
import projects from "@/data/reference-projects.json";
import { BrandContours } from "./BrandContours";
import { MaterialStudy, type AcousticMode, type TimberFinish } from "./MaterialStudy";

const ease = [0.22, 1, 0.36, 1] as const;
const finishes: { id: TimberFinish; label: string; colour: string }[] = [
  { id: "oak", label: "Natural oak", colour: "#c9a875" },
  { id: "walnut", label: "Walnut", colour: "#6b4a33" },
  { id: "ebony", label: "Smoked ebony", colour: "#3b3a38" },
];
const principles: {
  id: AcousticMode;
  title: string;
  line: string;
  copy: string;
  detail: string;
  family: string;
}[] = [
  {
    id: "absorb",
    title: "Absorb",
    line: "Less echo. More of what matters.",
    copy: "Timber and acoustic backing work together to soften reflections. A clearer conversation. A little more detail in your favourite record.",
    detail: "Timber face / Acoustic backing",
    family: "absorption",
  },
  {
    id: "diffuse",
    title: "Diffuse",
    line: "Keep the life. Lose the glare.",
    copy: "Sculpted surfaces scatter reflections in different directions, helping a room feel open and balanced without taking all its energy away.",
    detail: "Sculpted timber / Varied depth",
    family: "diffusion",
  },
  {
    id: "trap",
    title: "Balance",
    line: "Give the low end somewhere to go.",
    copy: "Deeper treatment helps manage the energy that collects in a room. Start with placement and measurement, then choose the treatment your space needs.",
    detail: "Corner placement / Deeper treatment",
    family: "bass-traps",
  },
];
const rooms = [
  {
    id: "home-theatre",
    name: "Home theatre",
    note: "Feel every scene.",
    image: "/images/timber-theatre.webp",
  },
  {
    id: "listening-room",
    name: "Listening room",
    note: "Closer to the music.",
    image: "/reference-photos/photo-16.jpg",
  },
  {
    id: "studio",
    name: "Studio",
    note: "Hear what is there.",
    image: "/images/timber-studio.webp",
  },
  {
    id: "office",
    name: "Workplace",
    note: "Make space to think.",
    image: "/images/timber-office.webp",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const [finish, setFinish] = useState<TimberFinish>("oak");
  const [exploded, setExploded] = useState(false);
  const selected = finishes.find((item) => item.id === finish)!;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  return (
    <section ref={ref} className="ta-hero" data-testid="hero">
      <div className="ta-hero-meta ta-shell ta-micro">
        <span>
          <i />
          Material meets sound
        </span>
        <span>Timber Acoustics / Designed in India</span>
      </div>
      <div className="ta-hero-main ta-shell">
        <div className="ta-hero-copy">
          <motion.p
            className="ta-micro ta-rust"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Acoustic surfaces. Natural soul.
          </motion.p>
          <h1 data-testid="hero-headline">
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
          <p className="ta-hero-description">
            Create spaces that sound as good as they look. Considered acoustic design, made from
            timber, texture and a little intention.
          </p>
          <div className="ta-hero-links">
            <Link to="/products" className="ta-button" data-testid="hero-explore-button">
              Explore the collection <ArrowUpRight size={17} />
            </Link>
            <Link to="/build-a-room" className="ta-text-link" data-testid="hero-build-button">
              Build your room <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <motion.div className="ta-hero-product" style={{ y }}>
          <span className="ta-hero-serial ta-micro">TA—01 / Aalto Slat</span>
          <MaterialStudy finish={finish} exploded={exploded} />
          <div className="ta-product-annotation ta-micro">
            <span>Timber face</span>
            <span>Acoustic felt</span>
            <span>2400 × 600 mm</span>
          </div>
        </motion.div>
      </div>
      <div className="ta-hero-controls ta-shell">
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
          className="ta-layer-control ta-micro"
          onClick={() => setExploded(!exploded)}
          aria-pressed={exploded}
          data-testid="hero-layers"
        >
          <Layers3 size={15} />
          {exploded ? "Bring it together" : "Explore the layers"}
          {exploded ? <Minus size={14} /> : <Plus size={14} />}
        </button>
        <a href="#sound-study" className="ta-scroll-link ta-micro">
          A closer look <ArrowDown size={15} />
        </a>
      </div>
      <div className="ta-hero-caption ta-shell ta-micro">
        <span>Natural materials. Considered acoustics.</span>
        <span>Sample material study / Indicative dimensions</span>
      </div>
    </section>
  );
}

function SoundStudy() {
  const [active, setActive] = useState(0);
  const principle = principles[active]!;
  return (
    <section id="sound-study" className="ta-sound-study ta-shell" data-testid="sound-study">
      <Reveal className="ta-section-heading">
        <p className="ta-micro ta-rust">01 / A different way to hear</p>
        <h2>
          A room is more than
          <br />
          what you <em>see.</em>
        </h2>
        <p>
          It’s the conversation that flows.
          <br />
          The quiet that lets you think.
          <br />
          The feeling when a record comes alive.
        </p>
      </Reveal>
      <div className="ta-study-console">
        <div className="ta-study-visual">
          <div className="ta-study-readout ta-micro">
            <span>Material behaviour</span>
            <span>0{active + 1} / 03</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.35 }}
            >
              <MaterialStudy mode={principle.id} finish="walnut" />
            </motion.div>
          </AnimatePresence>
          <p className="ta-study-detail ta-micro">
            {principle.detail}
            <span>Illustrative geometry</span>
          </p>
        </div>
        <div className="ta-study-content">
          <div className="ta-principle-tabs" role="tablist" aria-label="Acoustic principles">
            {principles.map((item, index) => (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="ta-principle-panel"
                onClick={() => setActive(index)}
                data-testid={`principle-${item.id}`}
              >
                <span className="ta-micro">0{index + 1}</span>
                {item.title}
                <span>{active === index ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
            ))}
          </div>
          <div
            id="ta-principle-panel"
            role="tabpanel"
            aria-labelledby={`tab-${principle.id}`}
            className="ta-principle-copy"
            data-testid="principle-description"
          >
            <p className="ta-micro ta-rust">The idea / {principle.id}</p>
            <h3>{principle.line}</h3>
            <p>{principle.copy}</p>
            <a href={`/products?family=${principle.family}`} className="ta-text-link">
              Explore the treatment <ArrowUpRight size={16} />
            </a>
          </div>
          <Link to="/story" className="ta-study-footnote ta-micro">
            The Timber philosophy <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Collection() {
  const featured = [
    ...products.filter((item) => item.featured),
    ...products.filter((item) => !item.featured),
  ].slice(0, 4);
  return (
    <section className="ta-collection" data-testid="explore-products">
      <div className="ta-shell">
        <Reveal className="ta-section-heading">
          <p className="ta-micro ta-rust">02 / Objects with purpose</p>
          <h2>
            Good sound.
            <br />
            <em>Great company.</em>
          </h2>
          <div>
            <p>
              Considered pieces.
              <br />A world of possibilities.
            </p>
            <Link to="/products" className="ta-text-link">
              All products <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="ta-collection-grid">
          {featured.map((product, index) => (
            <Reveal
              key={product.slug}
              className={`ta-collection-item ta-piece-${index}`}
              delay={(index % 2) * 0.08}
            >
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="ta-product-link"
                data-testid={`showcase-product-${product.slug}`}
              >
                <div className="ta-product-photo">
                  <img src={product.gallery[0]} alt={product.name} loading="lazy" />
                  <span className="ta-item-code ta-micro">TA / 0{index + 1}</span>
                  <span className="ta-product-arrow">
                    <ArrowUpRight size={22} strokeWidth={1.3} />
                  </span>
                </div>
                <div className="ta-product-caption">
                  <div>
                    <p className="ta-micro">{product.family.replaceAll("-", " ")}</p>
                    <h3>{product.name}</h3>
                  </div>
                  <span>₹{product.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="ta-product-rule ta-micro">
                  <span>{product.dims}</span>
                  <span>
                    Discover <Plus size={12} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="ta-micro ta-catalogue-note">
          Sample catalogue / Reference photography / Indicative prices
        </p>
      </div>
    </section>
  );
}

function Spaces() {
  return (
    <section className="ta-spaces ta-shell">
      <Reveal className="ta-section-heading">
        <p className="ta-micro ta-rust">03 / Spaces with soul</p>
        <h2>
          Different rooms.
          <br />
          <em>One feeling.</em>
        </h2>
        <Link to="/projects" className="ta-text-link">
          Explore the spaces <ArrowUpRight size={16} />
        </Link>
      </Reveal>
      <div className="ta-spaces-grid">
        {projects.slice(0, 2).map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.1}>
            <Link to="/projects/$slug" params={{ slug: project.slug }} className="ta-space-link">
              <div className="ta-space-photo">
                <img src={project.gallery[0]} alt={project.title} loading="lazy" />
                <span className="ta-micro">Illustrative space</span>
                <ArrowUpRight size={24} />
              </div>
              <div className="ta-space-caption">
                <span className="ta-micro">
                  0{index + 1} / {project.room_type.replaceAll("-", " ")}
                </span>
                <h3>{project.title}</h3>
                <span>{project.area} m²</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RoomInvitation() {
  return (
    <section className="ta-room-section">
      <div className="ta-shell">
        <Reveal className="ta-section-heading">
          <p className="ta-micro ta-rust">04 / Your room. Reimagined.</p>
          <h2>
            Find your
            <br />
            <em>room’s rhythm.</em>
          </h2>
          <div>
            <p>
              A little timber. A little intention.
              <br />
              Start with the space you have.
            </p>
            <Link to="/build-a-room" className="ta-text-link">
              Enter the room atelier <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="ta-room-grid">
          {rooms.map((room, index) => (
            <a
              key={room.id}
              href={`/build-a-room?room=${room.id}`}
              className="ta-room-link"
              data-testid={`home-room-${room.id}`}
            >
              <div className="ta-room-image">
                <img src={room.image} alt={`${room.name} inspiration`} loading="lazy" />
                <span className="ta-micro">0{index + 1}</span>
                <ArrowUpRight size={20} />
              </div>
              <h3>{room.name}</h3>
              <p>{room.note}</p>
            </a>
          ))}
        </div>
        <div className="ta-room-note ta-micro">
          <span>Explore a material palette. Make it yours.</span>
          <Link to="/guides">
            A little sound advice <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeExperience() {
  return (
    <div className="ta-home">
      <Hero />
      <SoundStudy />
      <div className="ta-material-statement">
        <BrandContours />
        <p>
          Timber. Texture. <em>Feeling.</em>
        </p>
        <span className="ta-micro">Made to be heard. Designed to be felt.</span>
      </div>
      <Collection />
      <Spaces />
      <RoomInvitation />
    </div>
  );
}
