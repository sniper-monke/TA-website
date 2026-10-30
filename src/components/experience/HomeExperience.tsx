import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import products from "@/data/reference-products.json";
import projects from "@/data/reference-projects.json";
import { BrandContours } from "./BrandContours";
import { MaterialStudy, type AcousticMode } from "./MaterialStudy";
import { KineticHero } from "./KineticHero";

const ease = [0.22, 1, 0.36, 1] as const;
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

function SoundStudy() {
  const [active, setActive] = useState(0);
  const section = useRef<HTMLElement>(null);
  const scrollEnabled = useRef(false);
  const lastScrollChapter = useRef(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px) and (min-height: 850px)");
    const update = () => {
      scrollEnabled.current = query.matches && !reduced;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduced]);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!scrollEnabled.current) return;
    const chapter = Math.min(2, Math.floor(progress * 3));
    if (chapter !== lastScrollChapter.current) {
      lastScrollChapter.current = chapter;
      setActive(chapter);
    }
  });
  const principle = principles[active]!;
  return (
    <section
      ref={section}
      id="sound-study"
      className="ta-sound-study ta-shell"
      data-testid="sound-study"
    >
      <div className="ta-study-stick">
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
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => {
                    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
                    event.preventDefault();
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? principles.length - 1
                          : (index + (event.key === "ArrowRight" ? 1 : -1) + principles.length) %
                            principles.length;
                    setActive(next);
                    document.getElementById(`tab-${principles[next]!.id}`)?.focus();
                  }}
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
        <div className="ta-study-scroll-track" aria-hidden="true">
          <motion.div style={{ scaleX: scrollYProgress }} />
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
      <KineticHero />
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
