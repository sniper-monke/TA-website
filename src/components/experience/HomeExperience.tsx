import { Link } from "@tanstack/react-router";
import { Headphones, Mic2, MonitorSpeaker, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import families from "@/data/reference-families.json";
import projects from "@/data/reference-projects.json";
import { trustedClients } from "@/data/site-content";
import { useCatalogue } from "@/hooks/use-catalogue";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { BrandContours } from "./BrandContours";
import { KineticHero, ListeningStudy } from "./KineticHero";

const categories = [
  { slug: "absorption", title: "Absorption", note: "Soften echo. Bring speech into focus." },
  { slug: "diffusion", title: "Diffusion", note: "Scatter reflections. Keep the room alive." },
  {
    slug: "bass-traps",
    title: "Bass management",
    note: "Give lingering low frequencies less room.",
  },
  {
    slug: "racks-and-tables",
    title: "Studio furniture & racks",
    note: "A considered place for your studio setup.",
  },
];

const homepageSpaces = [
  { label: "Recording studio", href: "/guides/studio", icon: SlidersHorizontal },
  { label: "Home studio", href: "/build-a-room?room=studio", icon: MonitorSpeaker },
  { label: "Podcast studio", href: "/contact", icon: Mic2 },
  { label: "Listening room", href: "/build-a-room?room=listening-room", icon: Headphones },
];

function TrustedPartners() {
  return (
    <section
      className="ta-v2-trust"
      data-home-section="trusted-partners"
      aria-label="Trusted partners"
    >
      <div className="ta-v2-shell">
        <div>
          <p className="ta-v2-label">Trusted partners</p>
          {!trustedClients.length && <p>Approved names &amp; logos to follow</p>}
        </div>
        <ul>
          {trustedClients.length
            ? trustedClients.map((name) => <li key={name}>{name}</li>)
            : Array.from({ length: 5 }, (_, index) => (
                <li key={index}>Client logo {String(index + 1).padStart(2, "0")}</li>
              ))}
        </ul>
      </div>
    </section>
  );
}

function OurApproach() {
  return (
    <section
      className="ta-v2-approach ta-v2-shell"
      id="our-approach"
      data-home-section="our-approach"
      aria-labelledby="approach-title"
    >
      <div className="ta-v2-approach-copy">
        <p className="ta-v2-label ta-v2-accent">Our approach</p>
        <h2 id="approach-title" data-home-reveal="copy">
          Acoustics, materials and <em>design.</em>
        </h2>
        <div className="ta-v2-approach-description" data-home-reveal="copy">
          <p>
            Good acoustics starts with understanding the room. We bring together absorption,
            diffusion and bass control to help you hear more clearly and feel more at ease.
          </p>
          <p>Thoughtful treatment. Honest materials. A finish that belongs in your space.</p>
          <Link to="/story" className="ta-v2-link">
            Our philosophy
          </Link>
        </div>
      </div>
      <figure className="ta-v2-approach-figure" data-home-reveal="photo">
        <img
          src="/images/timber-detail.webp"
          alt="Close-up of timber slats and acoustic backing"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="ta-v2-label">Absorb / Diffuse / Balance</figcaption>
      </figure>
    </section>
  );
}

function ProductCategories() {
  const { data, isError, refetch } = useCatalogue();
  const [preview, setPreview] = useState(categories[0]!);
  const availableFamilies = data?.families ?? families;

  return (
    <section
      className="ta-v2-range"
      data-home-section="product-categories"
      aria-labelledby="categories-title"
    >
      <div className="ta-v2-shell">
        <div className="ta-v2-heading" data-home-reveal="copy">
          <div>
            <p className="ta-v2-label ta-v2-accent">Our range</p>
            <h2 id="categories-title">
              Acoustic solutions <em>&amp; studio furniture.</em>
            </h2>
          </div>
          <Link to="/products" className="ta-v2-link">
            All products
          </Link>
        </div>
        <div className="ta-v2-category-index">
          <div className="ta-v2-category-preview" aria-hidden="true" data-preview={preview.slug}>
            {categories.map(({ slug }) => {
              const image = availableFamilies.find((family) => family.slug === slug)?.image;
              return (
                image && (
                  <img
                    key={slug}
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    data-active={preview.slug === slug}
                  />
                )
              );
            })}
            <span className="ta-v2-label">{preview.title}</span>
          </div>
          <div className="ta-v2-category-list">
            {categories.map((category) => {
              const family = availableFamilies.find((item) => item.slug === category.slug);
              return (
                <a
                  href={`/products?family=${category.slug}`}
                  key={category.slug}
                  data-testid={`home-category-${category.slug}`}
                  data-previewing={preview.slug === category.slug}
                  onPointerEnter={() => setPreview(category)}
                  onFocus={() => setPreview(category)}
                >
                  <div className="ta-v2-category-image">
                    {family && <img src={family.image} alt="" loading="lazy" decoding="async" />}
                  </div>
                  <div className="ta-v2-category-copy">
                    <h3>{category.title}</h3>
                    <p>{category.note}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        {isError && (
          <p role="alert">
            Category images could not be loaded.{" "}
            <button type="button" className="ta-v2-link" onClick={() => void refetch()}>
              Try again
            </button>
          </p>
        )}
        <p className="ta-v2-note">
          {data?.products.some((product) => product.sample)
            ? "Preview catalogue / Reference photography / Specifications and pricing to be confirmed"
            : "Explore the collection to choose your product and finish."}
        </p>
      </div>
    </section>
  );
}

function FeaturedProject() {
  const project = projects[0]!;
  return (
    <section
      className="ta-v2-feature"
      data-home-section="featured-project"
      aria-labelledby="featured-project-title"
    >
      <div className="ta-v2-feature-image" data-home-reveal="photo">
        <img
          src={project.gallery[0]}
          alt="An illustrative home theatre with timber acoustic treatment"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="ta-v2-shell ta-v2-feature-frame">
        <div className="ta-v2-feature-copy" data-home-reveal="copy">
          <p className="ta-v2-label">Featured project / Home theatre</p>
          <h2 id="featured-project-title">
            The listening <em>retreat.</em>
          </h2>
          <p>
            Clearer dialogue. More balanced bass. A cinema concept built around the way a room
            sounds.
          </p>
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="ta-v2-link">
            View project
          </Link>
        </div>
        <span className="ta-v2-note">Illustrative project / Reference photography</span>
      </div>
    </section>
  );
}

function ProjectsAndSpaces() {
  return (
    <section
      className="ta-v2-shell ta-v2-projects-spaces"
      data-home-section="projects-and-spaces"
      aria-label="Projects and spaces"
    >
      <div className="ta-v2-projects">
        <div className="ta-v2-subheading" data-home-reveal="copy">
          <h2>More projects</h2>
          <Link to="/projects" className="ta-v2-link">
            View all
          </Link>
        </div>
        <div className="ta-v2-project-grid">
          {projects.slice(1, 3).map((project) => (
            <Link to="/projects/$slug" params={{ slug: project.slug }} key={project.slug}>
              <div className="ta-v2-project-image" data-home-reveal="photo">
                <img src={project.gallery[0]} alt="" loading="lazy" decoding="async" />
              </div>
              <h3>{project.title}</h3>
              <span className="ta-v2-note">Illustrative project</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="ta-v2-spaces" id="explore-spaces">
        <div className="ta-v2-subheading">
          <h2>Explore spaces</h2>
          <Link to="/build-a-room" className="ta-v2-link">
            Build a room
          </Link>
        </div>
        <ul className="ta-v2-space-list" data-home-reveal="copy">
          {homepageSpaces.map((space) => (
            <li key={space.label}>
              <a href={space.href}>
                <space.icon size={24} strokeWidth={1.5} aria-hidden="true" />
                {space.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Consultation() {
  return (
    <section
      className="ta-v2-consultation"
      data-home-section="consultation"
      aria-labelledby="consultation-title"
    >
      <BrandContours className="ta-v2-consultation-contours" />
      <div className="ta-v2-shell">
        <div data-home-reveal="copy">
          <p className="ta-v2-label">Let's talk acoustics</p>
          <h2 id="consultation-title">
            Build your <em>acoustic space.</em>
          </h2>
          <p>Every room tells a different story. Our job is to help yours sound like it should.</p>
        </div>
        <Link to="/contact" className="ta-v2-button">
          Book a consultation
        </Link>
      </div>
    </section>
  );
}

export function HomeExperience() {
  const home = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === "undefined" || !home.current) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (!isIntersecting) continue;
          observer.unobserve(target);
          if (typeof target.animate !== "function" || target.contains(document.activeElement))
            continue;
          const photo = target.getAttribute("data-home-reveal") === "photo";
          const animation = target.animate(
            photo
              ? [
                  { clipPath: "inset(7% 0 0)", transform: "scale(0.985)" },
                  { clipPath: "inset(0)", transform: "scale(1)" },
                ]
              : [
                  { opacity: 0.62, transform: "translateY(16px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
            { duration: photo ? 820 : 660, easing: "cubic-bezier(.22,1,.36,1)" },
          );
          animations.add(animation);
          animation.addEventListener("finish", () => animations.delete(animation), { once: true });
        }
      },
      { threshold: 0.12 },
    );
    home.current
      .querySelectorAll("[data-home-reveal]")
      .forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [reduced]);

  return (
    <div className="ta-design-v2" ref={home}>
      <KineticHero />
      <OurApproach />
      <ListeningStudy />
      <ProductCategories />
      <FeaturedProject />
      <ProjectsAndSpaces />
      <TrustedPartners />
      <Consultation />
    </div>
  );
}
