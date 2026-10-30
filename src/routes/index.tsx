import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { RingsMark } from "@/components/site/ReferenceChrome";
import products from "@/data/reference-products.json";
import projects from "@/data/reference-projects.json";

export const Route = createFileRoute("/")({ component: Home });
const principles = [
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
const guides = [
  ["home-theatre", "Home theatre", "Feel every scene.", "theatre"],
  ["studio", "Studio", "Hear what is there.", "studio"],
  ["office", "Office", "Make space to think.", "office"],
];
function Home() {
  const [active, setActive] = useState(0);
  return (
    <>
      <section className="cinematic-hero" data-testid="hero">
        <div className="hero-photo">
          <img
            src="/images/timber-hero.webp"
            alt="Sculptural yellow lounge chair against richly textured timber acoustic slats"
            fetchPriority="high"
          />
        </div>
        <div className="hero-vignette" />
        <div className="hero-inner shell">
          <div className="hero-topline">
            <p>TIMBER ACOUSTICS</p>
            <span>Designed in India. Felt everywhere.</span>
          </div>
          <h1>
            Less noise.
            <br />
            <em>More feeling.</em>
          </h1>
          <div className="hero-bottom">
            <div>
              <p>
                Beautiful spaces deserve beautiful sound.
                <br />
                Meet acoustic design with a natural soul.
              </p>
              <a href="/products" className="hero-cta">
                Discover the collection <ArrowUpRight size={19} />
              </a>
            </div>
            <a href="/build-a-room" className="hero-room-link">
              <span>Imagine your space</span>
              <span>
                Build a room <ArrowUpRight size={17} />
              </span>
            </a>
          </div>
        </div>
        <span className="hero-photo-note">Material study / Timber &amp; felt</span>
        <a className="hero-scroll" href="#sound-considered" aria-label="Explore our approach">
          <ArrowDown size={19} />
        </a>
      </section>
      <div className="hero-footnote shell">
        <span>Natural materials. Considered acoustics.</span>
        <span>Absorption / Diffusion / Balance</span>
      </div>
      <section id="sound-considered" className="manifesto shell">
        <div className="manifesto-intro">
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
            We bring timber, texture and acoustic intent together. Not to silence your space. To
            bring it into balance.
          </p>
          <a href="/story" className="text-link">
            The Timber philosophy <ArrowRight size={16} />
          </a>
        </div>
        <div className="material-study">
          <div className="material-image">
            <img
              src="/images/timber-detail.webp"
              alt="Close study of natural timber slats and acoustic felt"
            />
            <span>Wood. With a purpose.</span>
            <RingsMark size={58} light />
          </div>
          <div className="material-tabs" role="tablist" aria-label="Acoustic principles">
            {principles.map(([label], i) => (
              <button
                key={label}
                role="tab"
                aria-selected={active === i}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              >
                <span>0{i + 1}</span>
                {label}
                <Plus size={14} />
              </button>
            ))}
          </div>
          <div className="material-description" role="tabpanel">
            <h3>{principles[active]?.[1]}</h3>
            <p>{principles[active]?.[2]}</p>
          </div>
        </div>
      </section>
      <div className="reference-marquee">
        <div>
          {[...Array(2)].flatMap((_, n) =>
            ["Absorb", "Diffuse", "Trap", "Shape", "Tune"].map((word, i) => (
              <span key={`${n}-${word}`} className={i % 2 ? "outline" : ""}>
                {word}
                <RingsMark size={26} />
              </span>
            )),
          )}
        </div>
      </div>
      <section className="collection-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="label-eyebrow">02 / The collection</p>
              <h2>
                Good sound.
                <br />
                <em>Great company.</em>
              </h2>
            </div>
            <div>
              <p>Considered pieces. Endless possibilities.</p>
              <a href="/products" className="text-link">
                All products <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="collection-grid">
            {products.slice(0, 4).map((p, i) => (
              <div key={p.slug} className={`collection-piece piece-${i}`}>
                <a href={`/products/${p.slug}`} className="collection-link">
                  <div className="collection-photo">
                    <img src={p.gallery[0]} alt={p.name} loading="lazy" />
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
                    <span>₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <p className="fine-print" style={{ marginTop: 32 }}>
            Sample catalogue · Reference photography · Indicative prices
          </p>
        </div>
      </section>
      <section className="shell home-spaces">
        <div className="section-heading">
          <div>
            <p className="label-eyebrow">03 / Spaces with soul</p>
            <h2>
              Different rooms.
              <br />
              <em>One feeling.</em>
            </h2>
          </div>
          <a href="/projects" className="text-link">
            Explore the spaces <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="home-project-grid">
          {projects.slice(0, 2).map((p, i) => (
            <a key={p.slug} href={`/projects/${p.slug}`} className="project-tile">
              <div className="project-photo">
                <img
                  src={p.gallery[0]}
                  alt={`${p.title} — illustrative room photography`}
                  loading="lazy"
                />
                <span className="sample-tag">Illustrative project</span>
                <span className="round-arrow">
                  <ArrowUpRight size={23} />
                </span>
              </div>
              <div className="project-caption">
                <div>
                  <span className="label-eyebrow">
                    0{i + 1} / {p.room_type.replaceAll("-", " ")}
                  </span>
                  <h2>{p.title}</h2>
                </div>
                <span className="project-area">{p.area} m²</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="room-notes">
        <div className="shell room-notes-inner">
          <div>
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
            <a href="/guides" className="text-link">
              All room guides <ArrowRight size={16} />
            </a>
          </div>
          <div className="room-notes-links">
            {guides.map(([slug, title, phrase, image], i) => (
              <a key={slug} href={`/guides/${slug}`}>
                <span className="label-quiet">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{phrase}</p>
                </div>
                <img src={`/images/timber-${image}.webp`} alt="" loading="lazy" />
                <ArrowUpRight size={22} strokeWidth={1} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="room-invitation">
        <img
          src="/images/timber-theatre.webp"
          alt="Warm wood-lined room with space to gather"
          loading="lazy"
        />
        <div className="photo-shade" />
        <div className="shell">
          <div>
            <p className="label-eyebrow">Your room. Reimagined.</p>
            <h2>
              Make space
              <br />
              for <em>better sound.</em>
            </h2>
            <a href="/build-a-room" className="hero-cta">
              Enter the room atelier <ArrowUpRight size={19} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
