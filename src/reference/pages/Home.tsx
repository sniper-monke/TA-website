/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Link } from "@/reference/router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { api, fetchProducts, formatPrice, mediaUrl } from "@/reference/lib/api";
import { MaskedLine, Reveal, FadePage } from "@/reference/components/Reveal";
import { RingsMark } from "@/reference/components/WoodRings";
import { EditorialMarquee } from "@/reference/components/Marquee";
import { ProjectTile } from "@/reference/pages/Projects";
import { GUIDES, EDITORIAL_IMAGES } from "@/reference/data/guides";
import { ErrorNotice } from "@/reference/components/Forms";

function Hero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  return (
    <section ref={ref} className="cinematic-hero" data-testid="hero">
      <motion.div
        className="hero-photo"
        initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", scale: 1.07 }}
        animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          style={reduced ? {} : { y }}
          src="/images/timber-hero.webp"
          alt="Sculptural yellow lounge chair against richly textured timber acoustic slats"
          fetchPriority="high"
          data-testid="hero-image"
        />
      </motion.div>
      <div className="hero-vignette" />
      <div className="hero-inner shell">
        <motion.div
          className="hero-topline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p data-testid="hero-brand">TIMBER ACOUSTICS</p>
          <span>Designed in India. Felt everywhere.</span>
        </motion.div>
        <h1 data-testid="hero-headline">
          <MaskedLine delay={0.4}>Less noise.</MaskedLine>
          <MaskedLine delay={0.58}>
            <em>More feeling.</em>
          </MaskedLine>
        </h1>
        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <div>
            <p>
              Beautiful spaces deserve beautiful sound.
              <br />
              Meet acoustic design with a natural soul.
            </p>
            <Link to="/products" className="hero-cta" data-testid="hero-explore-button">
              Discover the collection <ArrowUpRight size={19} />
            </Link>
          </div>
          <Link to="/build-a-room" className="hero-room-link" data-testid="hero-build-button">
            <span>Imagine your space</span>
            <span>
              Build a room <ArrowUpRight size={17} />
            </span>
          </Link>
        </motion.div>
      </div>
      <span className="hero-photo-note">Material study / Timber & felt</span>
      <a
        className="hero-scroll"
        href="#sound-considered"
        aria-label="Explore our approach"
        data-testid="hero-scroll"
      >
        <ArrowDown size={19} />
      </a>
    </section>
  );
}

function Manifesto() {
  const [active, setActive] = useState(0);
  const notes = [
    [
      "Absorb",
      "Less echo. More clarity.",
      "Felt and fibre absorb reflections, giving conversations and music room to breathe.",
    ],
    [
      "Diffuse",
      "Keep the life. Lose the glare.",
      "Sculpted timber scatters reflections rather than simply absorbing them.",
    ],
    [
      "Trap",
      "Find balance in the low end.",
      "Deeper treatment helps manage the energy that gathers at the edges of a room.",
    ],
  ];
  return (
    <section id="sound-considered" className="manifesto shell" data-testid="sound-considered">
      <Reveal className="manifesto-intro">
        <p className="label-eyebrow">01 / Sound, considered</p>
        <h2>
          A room is more
          <br />
          than what you <em>see.</em>
        </h2>
        <p>
          It’s the way a conversation flows. The detail in a favourite record. The quiet that lets
          you think.
        </p>
        <p>
          We bring timber, texture and acoustic intent together. Not to silence your space. To bring
          it into balance.
        </p>
        <Link to="/story" className="text-link" data-testid="manifesto-story">
          The Timber philosophy <ArrowRight size={16} />
        </Link>
      </Reveal>
      <Reveal className="material-study" delay={0.15}>
        <div className="material-image">
          <img
            src="/images/timber-detail.webp"
            alt="Close study of natural timber slats and acoustic felt"
            loading="lazy"
          />
          <span>Wood. With a purpose.</span>
          <RingsMark size={58} stroke="#f8f4ee" accent="#f3a228" />
        </div>
        <div className="material-tabs" role="tablist" aria-label="Acoustic principles">
          {notes.map(([label], i) => (
            <button
              role="tab"
              aria-selected={active === i}
              aria-controls="principle-panel"
              key={label}
              data-testid={`principle-${label.toLowerCase()}`}
              onClick={() => setActive(i)}
              className={active === i ? "active" : ""}
            >
              <span>0{i + 1}</span>
              {label}
              <Plus size={14} />
            </button>
          ))}
        </div>
        <div
          className="material-description"
          role="tabpanel"
          id="principle-panel"
          data-testid="principle-description"
        >
          <h3>{notes[active][1]}</h3>
          <p>{notes[active][2]}</p>
        </div>
      </Reveal>
    </section>
  );
}

function Collection() {
  const [items, setItems] = useState([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetchProducts()
      .then((p) =>
        setItems([...p.filter((x) => x.featured), ...p.filter((x) => !x.featured)].slice(0, 4)),
      )
      .catch(() => setFailed(true));
  }, []);
  return (
    <section className="collection-section" data-testid="explore-products">
      <div className="shell">
        <div className="section-heading">
          <Reveal>
            <p className="label-eyebrow">02 / The collection</p>
            <h2>
              Good sound.
              <br />
              <em>Great company.</em>
            </h2>
          </Reveal>
          <Reveal>
            <p>Considered pieces. Endless possibilities.</p>
            <Link to="/products" className="text-link" data-testid="explore-view-all">
              All products <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
        {failed && (
          <p data-testid="home-products-error">
            The collection is temporarily unavailable. Please try again shortly.
          </p>
        )}
        <div className="collection-grid">
          {items.map((p, i) => (
            <Reveal key={p.slug} className={`collection-piece piece-${i}`} delay={i * 0.07}>
              <Link
                to={`/products/${p.slug}`}
                data-testid={`showcase-product-${p.slug}`}
                className="collection-link"
              >
                <div className="collection-photo">
                  <img src={mediaUrl(p.gallery[0])} alt={p.name} loading="lazy" />
                  <span className="collection-index">T / 0{i + 1}</span>
                  <span className="round-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <div className="collection-caption">
                  <div>
                    <span className="label-quiet">{p.family.replaceAll("-", " ")}</span>
                    <h3>{p.name}</h3>
                  </div>
                  <span data-testid={`showcase-price-${p.slug}`}>{formatPrice(p.price)}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="fine-print mt-8" data-testid="home-catalogue-note">
          Sample catalogue · Reference photography · Indicative prices
        </p>
      </div>
    </section>
  );
}

function Spaces() {
  const [projects, setProjects] = useState([]);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setFailed(false);
    api
      .get("/projects")
      .then((r) => {
        if (active) setProjects(r.data.slice(0, 2));
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return (
    <section className="shell home-spaces">
      <div className="section-heading">
        <Reveal>
          <p className="label-eyebrow">03 / Spaces with soul</p>
          <h2>
            Different rooms.
            <br />
            <em>One feeling.</em>
          </h2>
        </Reveal>
        <Link to="/projects" className="text-link" data-testid="home-all-projects">
          Explore the spaces <ArrowUpRight size={18} />
        </Link>
      </div>
      {failed && (
        <>
          <ErrorNotice id="home-projects-error">
            The spaces could not be loaded. Please try again.
          </ErrorNotice>
          <button
            className="text-link"
            data-testid="home-projects-retry"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        </>
      )}
      <div className="home-project-grid">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.12}>
            <ProjectTile project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RoomNotes() {
  return (
    <section className="room-notes">
      <div className="shell room-notes-inner">
        <Reveal>
          <p className="label-eyebrow">04 / A little sound advice</p>
          <h2>
            Find your
            <br />
            <em>room’s rhythm.</em>
          </h2>
          <p>
            Every space asks for something different.
            <br />
            Start with what matters in yours.
          </p>
          <Link to="/guides" className="text-link" data-testid="home-guides">
            All room guides <ArrowRight size={16} />
          </Link>
        </Reveal>
        <div className="room-notes-links">
          {GUIDES.map((g) => (
            <Link to={`/guides/${g.slug}`} key={g.slug} data-testid={`home-guide-${g.slug}`}>
              <span className="label-quiet">{g.number}</span>
              <div>
                <h3>{g.title}</h3>
                <p>{g.phrase}</p>
              </div>
              <img src={g.image} alt="" loading="lazy" />
              <ArrowUpRight size={22} strokeWidth={1} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomInvitation() {
  return (
    <section className="room-invitation" data-testid="build-invite">
      <img
        src={EDITORIAL_IMAGES.theatre}
        alt="Warm wood-lined room with space to gather"
        loading="lazy"
      />
      <div className="photo-shade" />
      <div className="shell">
        <Reveal>
          <p className="label-eyebrow">Your room. Reimagined.</p>
          <h2>
            Make space
            <br />
            for <em>better sound.</em>
          </h2>
          <Link to="/build-a-room" className="hero-cta" data-testid="build-invite-cta">
            Enter the room atelier <ArrowUpRight size={19} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <FadePage>
      <Hero />
      <div className="hero-footnote shell">
        <span>Natural materials. Considered acoustics.</span>
        <span>Absorption / Diffusion / Balance</span>
      </div>
      <Manifesto />
      <EditorialMarquee />
      <Collection />
      <Spaces />
      <RoomNotes />
      <RoomInvitation />
    </FadePage>
  );
}
