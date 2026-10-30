/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useParams } from "@/reference/router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { api, errorMessage, mediaUrl, formatPrice } from "@/reference/lib/api";
import { PageHero, NotFound } from "@/reference/components/Chrome";
import { FadePage, Reveal } from "@/reference/components/Reveal";
import { ErrorNotice } from "@/reference/components/Forms";

const ROOM_LABELS = {
  "home-theatre": "Home theatre",
  studio: "Studio",
  office: "Office",
  "listening-room": "Listening room",
};

export const ProjectTile = ({ project: p, index = 0 }) => (
  <Link to={`/projects/${p.slug}`} className="project-tile" data-testid={`project-${p.slug}`}>
    <div className="project-photo image-reveal">
      <img
        src={mediaUrl(p.gallery[0])}
        alt={p.sample ? `${p.title} — illustrative room photography` : p.title}
        loading="lazy"
      />
      {p.sample && (
        <span className="sample-tag" data-testid={`project-sample-${p.slug}`}>
          Illustrative project
        </span>
      )}
      <span className="round-arrow">
        <ArrowUpRight size={23} strokeWidth={1} />
      </span>
    </div>
    <div className="project-caption">
      <div>
        <span className="label-eyebrow">
          0{index + 1} / {ROOM_LABELS[p.room_type]}
        </span>
        <h2>{p.title}</h2>
      </div>
      <span className="project-area" data-testid={`project-area-${p.slug}`}>
        {p.area} m²
      </span>
    </div>
  </Link>
);

export default function Projects() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    api
      .get("/projects")
      .then((r) => setProjects(r.data))
      .catch((e) => setError(errorMessage(e)));
  }, []);
  const visible = projects?.filter((p) => filter === "all" || p.room_type === filter);
  return (
    <FadePage>
      <PageHero eyebrow="Spaces / Project gallery" title="Sound, given" italic="a sense of place.">
        Rooms with a point of view. Materials with a purpose.
      </PageHero>
      <section className="shell projects-index" data-testid="projects-index">
        {projects?.some((p) => p.sample) && (
          <p className="content-note" data-testid="projects-sample-notice">
            A preview of what’s possible. Entries marked illustrative use sample room details and
            reference photography—not completed Timber installations.
          </p>
        )}
        <div className="filter-line">
          {[["all", "All spaces"], ...Object.entries(ROOM_LABELS)].map(([id, name]) => (
            <button
              key={id}
              className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              data-testid={`project-filter-${id}`}
            >
              {name}
            </button>
          ))}
        </div>
        <ErrorNotice id="projects-error">{error}</ErrorNotice>
        {!projects && !error && <p data-testid="projects-loading">Gathering the spaces…</p>}
        <div className="project-grid">
          {visible?.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07}>
              <ProjectTile project={p} index={i} />
            </Reveal>
          ))}
        </div>
        {visible?.length === 0 && (
          <p className="py-20" data-testid="projects-empty">
            No projects in this collection yet.
          </p>
        )}
      </section>
    </FadePage>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    setP(null);
    setMissing(false);
    setError("");
    api
      .get(`/projects/${slug}`)
      .then((r) => setP(r.data))
      .catch((e) => (e.response?.status === 404 ? setMissing(true) : setError(errorMessage(e))));
    api
      .get("/products")
      .then((r) => setProducts(r.data))
      .catch(() => {});
  }, [slug]);
  if (missing) return <NotFound />;
  if (!p)
    return (
      <section className="shell pt-40 pb-32">
        <ErrorNotice>{error}</ErrorNotice>
        {!error && <p data-testid="project-loading">Opening the space…</p>}
      </section>
    );
  return (
    <FadePage>
      <section className="project-detail-hero">
        <img src={mediaUrl(p.gallery[0])} alt={p.title} />
        <div className="photo-shade" />
        <div className="shell">
          <Link to="/projects" className="light-link" data-testid="project-back">
            ← All spaces
          </Link>
          <p className="label-eyebrow">
            {ROOM_LABELS[p.room_type]} / {p.sample ? "Illustrative project" : p.location}
          </p>
          <h1 data-testid="project-title">{p.title}</h1>
        </div>
      </section>
      <section className="shell project-story">
        <div className="project-facts" data-testid="project-facts">
          <div>
            <span>Room size</span>
            <strong>{p.area} m²</strong>
          </div>
          <div>
            <span>Dimensions</span>
            <strong>{p.dimensions}</strong>
          </div>
          <div>
            <span>Setting</span>
            <strong>{p.location || ROOM_LABELS[p.room_type]}</strong>
          </div>
        </div>
        {p.sample && (
          <p className="content-note" data-testid="project-detail-sample">
            Illustrative project · Reference photos and sample dimensions. This is not a completed
            installation or a claim of measured performance.
          </p>
        )}
        <p className="project-summary" data-testid="project-summary">
          {p.summary}
        </p>
        <div className="project-story-grid">
          {[
            ["The brief", p.challenge],
            ["The approach", p.approach],
            [p.sample ? "The intention" : "The result", p.outcome],
          ].map(([title, body], i) => (
            <Reveal key={title}>
              <span className="label-eyebrow">0{i + 1}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
        <div className="project-photo-pair">
          {p.gallery.slice(1).map((img, i) => (
            <img
              key={img + i}
              src={mediaUrl(img)}
              loading="lazy"
              alt={`${p.title} detail ${i + 1}`}
            />
          ))}
        </div>
        <div className="section-rule">
          <span>{p.sample ? "Suggested collection" : "Products used"}</span>
          <span>Timber Acoustics</span>
        </div>
        <div className="project-products">
          {products
            .filter((x) => p.products.includes(x.slug))
            .map((x) => (
              <Link
                to={`/products/${x.slug}`}
                key={x.slug}
                data-testid={`project-product-${x.slug}`}
              >
                <img src={mediaUrl(x.gallery[0])} alt={x.name} loading="lazy" />
                <div>
                  <h3>{x.name}</h3>
                  <span>{formatPrice(x.price)}</span>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            ))}
        </div>
        <Link
          className="action-button"
          to={`/build-a-room?room=${p.room_type}`}
          data-testid="project-configure"
        >
          Explore a room like this <ArrowRight size={16} />
        </Link>
      </section>
    </FadePage>
  );
}
