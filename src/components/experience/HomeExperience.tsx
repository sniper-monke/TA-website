import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Headphones,
  Mic2,
  MonitorSpeaker,
  SlidersHorizontal,
} from "lucide-react";
import projects from "@/data/reference-projects.json";
import { trustedClients } from "@/data/site-content";
import { useCatalogue } from "@/hooks/use-catalogue";
import { BrandContours } from "./BrandContours";
import { KineticHero } from "./KineticHero";

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
      className="ta-layout-trust ta-shell"
      data-home-section="trusted-partners"
      aria-label="Trusted partners"
    >
      <div>
        <p className="ta-micro">Trusted partners</p>
        {!trustedClients.length && (
          <span className="ta-placeholder-note">Approved names & logos to follow</span>
        )}
      </div>
      <div className="ta-partner-list">
        {trustedClients.length
          ? trustedClients.map((name) => <span key={name}>{name}</span>)
          : Array.from({ length: 5 }, (_, i) => (
              <span className="ta-partner-placeholder" key={i}>
                Client logo {String(i + 1).padStart(2, "0")}
              </span>
            ))}
      </div>
    </section>
  );
}

function OurApproach() {
  return (
    <section
      className="ta-layout-approach ta-shell"
      id="our-approach"
      data-home-section="our-approach"
      aria-labelledby="approach-title"
    >
      <div className="ta-approach-copy">
        <p className="ta-micro ta-rust">Our approach</p>
        <h2 id="approach-title">
          Acoustics, materials
          <br />
          and <em>design.</em>
        </h2>
        <p>
          Good acoustics starts with understanding the room. We bring together absorption, diffusion
          and bass control to help you hear more clearly and feel more at ease.
        </p>
        <p>Thoughtful treatment. Honest materials. A finish that belongs in your space.</p>
        <Link to="/story" className="ta-text-link">
          Our philosophy <ArrowRight size={16} />
        </Link>
      </div>
      <div className="ta-approach-image">
        <img
          src="/images/timber-detail.webp"
          alt="Close-up of timber slats and acoustic backing"
          loading="lazy"
        />
        <span className="ta-micro">Absorb / Diffuse / Balance</span>
      </div>
    </section>
  );
}

function ProductCategories() {
  const { data, isError, refetch } = useCatalogue();
  return (
    <section
      className="ta-layout-categories ta-shell"
      data-home-section="product-categories"
      aria-labelledby="categories-title"
    >
      <div className="ta-layout-heading">
        <div>
          <p className="ta-micro ta-rust">Our range</p>
          <h2 id="categories-title">
            Acoustic solutions
            <br className="ta-mobile-break" /> & studio furniture.
          </h2>
        </div>
        <Link to="/products" className="ta-text-link">
          All products <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="ta-layout-category-grid">
        {categories.map((category) => {
          const family = data?.families.find((item) => item.slug === category.slug);
          return (
            <a
              href={`/products?family=${category.slug}`}
              key={category.slug}
              data-testid={`home-category-${category.slug}`}
            >
              <div className="ta-category-image">
                {family && <img src={family.image} alt={category.title} loading="lazy" />}
              </div>
              <div className="ta-category-caption">
                <h3>{category.title}</h3>
                <ArrowRight size={17} />
              </div>
              <p>{category.note}</p>
            </a>
          );
        })}
      </div>
      {isError && (
        <p role="alert">
          Category images could not be loaded.{" "}
          <button className="ta-text-link" onClick={() => void refetch()}>
            Try again
          </button>
        </p>
      )}
      <p className="ta-layout-content-note">
        {data?.products.some((product) => product.sample)
          ? "Preview catalogue / Reference photography / Specifications and pricing to be confirmed"
          : "Explore the collection to choose your product and finish."}
      </p>
    </section>
  );
}

function FeaturedProject() {
  const project = projects[0]!;
  return (
    <section
      className="ta-layout-featured"
      data-home-section="featured-project"
      aria-labelledby="featured-project-title"
    >
      <img
        src={project.gallery[0]}
        alt="An illustrative home theatre with timber acoustic treatment"
        loading="lazy"
      />
      <div className="ta-featured-shade" />
      <div className="ta-shell">
        <div className="ta-banner-copy">
          <p className="ta-micro ta-rust">Featured project / Home theatre</p>
          <h2 id="featured-project-title">
            The listening
            <br />
            <em>retreat.</em>
          </h2>
          <p>
            Clearer dialogue. More balanced bass. A cinema concept built around the way a room
            sounds.
          </p>
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="ta-text-link">
            View project <ArrowRight size={16} />
          </Link>
          <span className="ta-layout-content-note">
            Illustrative project / Reference photography
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectsAndSpaces() {
  return (
    <section
      className="ta-layout-projects-spaces ta-shell"
      data-home-section="projects-and-spaces"
      aria-label="Projects and spaces"
    >
      <div className="ta-more-projects">
        <div className="ta-layout-small-heading">
          <h2>More projects</h2>
          <Link to="/projects" className="ta-text-link">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="ta-more-projects-grid">
          {projects.slice(1, 3).map((project) => (
            <Link to="/projects/$slug" params={{ slug: project.slug }} key={project.slug}>
              <img src={project.gallery[0]} alt={project.title} loading="lazy" />
              <div>
                <h3>{project.title}</h3>
                <ArrowRight size={16} />
              </div>
              <span className="ta-layout-content-note">Illustrative project</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="ta-explore-spaces" id="explore-spaces">
        <div className="ta-layout-small-heading">
          <h2>Explore spaces</h2>
          <Link to="/build-a-room" className="ta-text-link">
            Build a room <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="ta-space-types">
          {homepageSpaces.map((space) => (
            <a href={space.href} key={space.label}>
              <space.icon size={29} strokeWidth={1.2} />
              <h3>{space.label}</h3>
              <ArrowRight size={15} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Consultation() {
  return (
    <section
      className="ta-layout-consultation"
      data-home-section="consultation"
      aria-labelledby="consultation-title"
    >
      <BrandContours />
      <div className="ta-shell">
        <div>
          <p className="ta-micro ta-rust">Let's talk acoustics</p>
          <h2 id="consultation-title">
            Build your
            <br className="ta-mobile-break" /> <em>acoustic space.</em>
          </h2>
          <p>Every room tells a different story. Our job is to help yours sound like it should.</p>
        </div>
        <Link to="/contact" className="ta-button">
          Book a consultation <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export function HomeExperience() {
  return (
    <div className="ta-home ta-home-layout">
      <KineticHero />
      <TrustedPartners />
      <OurApproach />
      <ProductCategories />
      <FeaturedProject />
      <ProjectsAndSpaces />
      <Consultation />
    </div>
  );
}
