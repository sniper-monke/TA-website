/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { Link, useParams } from "@/reference/router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { GUIDES, schemeLink } from "@/reference/data/guides";
import { FadePage, Reveal, MaskedLine } from "@/reference/components/Reveal";
import { PageHero, NotFound } from "@/reference/components/Chrome";

export default function Guides() {
  return (
    <FadePage>
      <PageHero
        eyebrow="Field notes / Acoustic guides"
        title="Every room has"
        italic="a different rhythm."
      >
        Thoughtful starting points for the spaces we live, create and work in.
      </PageHero>
      <section className="shell guide-index" data-testid="guides-index">
        {GUIDES.map((g) => (
          <Reveal key={g.slug}>
            <Link
              to={`/guides/${g.slug}`}
              className="guide-index-item"
              data-testid={`guide-${g.slug}`}
            >
              <div className="image-reveal">
                <img src={g.image} alt={`${g.title} inspiration`} loading="lazy" />
              </div>
              <div className="guide-index-copy">
                <span className="label-eyebrow">{g.number} / Room notes</span>
                <h2>{g.title}</h2>
                <p>{g.phrase}</p>
                <ArrowUpRight size={24} strokeWidth={1} />
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </FadePage>
  );
}

export function GuideDetail() {
  const { slug } = useParams();
  const g = GUIDES.find((x) => x.slug === slug);
  if (!g) return <NotFound />;
  return (
    <FadePage>
      <section className="guide-hero" data-testid="guide-detail">
        <img src={g.image} alt={`${g.title} room inspiration`} />
        <div className="photo-shade" />
        <div className="shell guide-hero-copy">
          <Link to="/guides" className="light-link" data-testid="guide-back">
            ← All room guides
          </Link>
          <p className="label-eyebrow">
            Field notes {g.number} / {g.title}
          </p>
          <h1>
            <MaskedLine>{g.phrase}</MaskedLine>
          </h1>
          <p>{g.intro}</p>
        </div>
        <span className="photo-credit">Illustrative photography</span>
      </section>
      <section className="shell guide-body">
        <div className="guide-article">
          <div className="section-rule">
            <span>The objective</span>
            <span>{g.number} / 03</span>
          </div>
          <p className="guide-goal" data-testid="guide-objective">
            {g.goal}.
          </p>
          {g.sections.map(([title, body], i) => (
            <Reveal key={title}>
              <section className="guide-chapter" data-testid={`guide-chapter-${i}`}>
                <span className="label-eyebrow">0{i + 1}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            </Reveal>
          ))}
          <div className="guide-disclaimer" data-testid="guide-disclaimer">
            A starting point, not an acoustic specification. Treatment reduces reflections inside a
            room; it does not make a room soundproof. Exact coverage, fire ratings, mounting and
            low-frequency performance need project-specific advice.
          </div>
        </div>
        <aside className="guide-aside">
          <div className="guide-scheme">
            <p className="label-eyebrow">A place to start</p>
            <h2>{g.schemeName}</h2>
            <p className="text-sm leading-relaxed">
              {g.size}. A slatted visual scheme in the configurator—not a complete treatment
              prescription. Add specialist absorbers or bass control after assessment.
            </p>
            <Link to={schemeLink(g)} className="action-button" data-testid="guide-configure">
              Make this room yours <ArrowUpRight size={17} />
            </Link>
            <p className="fine-print">Indicative modules and pricing. Adapt to your space.</p>
          </div>
          <div className="guide-checklist">
            <p className="label-eyebrow">Before we talk</p>
            {g.checklist.map((x, i) => (
              <p key={x} data-testid={`guide-checklist-${i}`}>
                <Check size={15} />
                <span>{x}</span>
              </p>
            ))}
          </div>
          <Link
            to={`/products?${new URLSearchParams({ family: g.slug === "office" ? "absorption" : g.slug === "studio" ? "bass-traps" : "timberslat" })}`}
            className="text-link"
            data-testid="guide-products"
          >
            Explore relevant products <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
      <section className="shell next-guides">
        <p className="label-eyebrow">Another room, another rhythm</p>
        <div>
          {GUIDES.filter((x) => x.slug !== slug).map((x) => (
            <Link key={x.slug} to={`/guides/${x.slug}`} data-testid={`next-guide-${x.slug}`}>
              {x.title}
              <ArrowUpRight size={25} />
            </Link>
          ))}
        </div>
      </section>
    </FadePage>
  );
}
