import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { imageFallback } from "@/lib/image-fallback";
import { HomeAcousticStudy } from "./HomeAcousticStudy";
import { HomeArtists } from "./HomeArtists";
import { HomeHero } from "./HomeHero";
import { useHomeScroll } from "./use-home-scroll";
import {
  expertAdvice,
  homeClients,
  homePhoto,
  homeRange,
  homeReviews,
  homeSpaces,
  latestProducts,
  timberStore,
} from "./home-content";

function HomeImage({ image, alt = "" }: { image: string; alt?: string }) {
  return (
    <img src={homePhoto(image)} alt={alt} loading="lazy" decoding="async" onError={imageFallback} />
  );
}

function OurRange() {
  return (
    <section
      className="timber-home-chapter timber-home-range"
      id="our-range"
      aria-labelledby="home-range-title"
    >
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-range-title">
            Our <em>range.</em>
          </h2>
          <Link className="timber-home-button" to="/products">
            Shop all products
          </Link>
        </div>
        <div className="timber-home-range-grid">
          {homeRange.map((item) => {
            const card = (
              <>
                <HomeImage image={item.image} />
                <h3>
                  {item.name}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </h3>
              </>
            );
            return "slug" in item ? (
              <Link
                key={item.image}
                to="/products/$slug"
                params={{ slug: item.slug }}
                data-image={item.image}
                data-home-reveal=""
              >
                {card}
              </Link>
            ) : (
              <a
                key={item.image}
                href={`/products?family=${item.family}`}
                data-image={item.image}
                data-home-reveal=""
              >
                {card}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LatestAdditions() {
  return (
    <section className="timber-home-chapter timber-home-latest" aria-labelledby="home-latest-title">
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-latest-title">
            Latest <em>additions.</em>
          </h2>
        </div>
        <div className="timber-home-product-grid">
          {latestProducts.map((product) => (
            <Link
              key={product.slug}
              to="/products/$slug"
              params={{ slug: product.slug }}
              data-home-reveal=""
            >
              <div>
                <HomeImage image={product.image} />
              </div>
              <h3>
                {product.name}
                <ChevronRight size={20} aria-hidden="true" />
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spaces() {
  return (
    <section
      className="timber-home-chapter timber-home-spaces"
      id="spaces"
      aria-labelledby="home-spaces-title"
    >
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-spaces-title">
            Made for <em>your room.</em>
          </h2>
        </div>
        <div className="timber-home-space-grid">
          {homeSpaces.map((space) => (
            <a key={space.path} href={`${timberStore}/pages/${space.path}`} data-home-reveal="">
              <HomeImage image={space.image} />
              <h3>
                {space.name}
                <ArrowUpRight size={24} aria-hidden="true" />
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomerTrust() {
  return (
    <section className="timber-home-chapter timber-home-trust" aria-labelledby="home-trust-title">
      <div className="timber-home-shell">
        <div className="timber-home-chapter-heading" data-home-reveal="">
          <h2 id="home-trust-title">
            Brands that <em>trust us.</em>
          </h2>
        </div>
        <ul className="timber-home-logos">
          {homeClients.map((client) => (
            <li key={client.name} data-home-reveal="">
              <HomeImage image={client.image} alt={client.name} />
            </li>
          ))}
        </ul>
        <div className="timber-home-reviews" role="group" aria-label="Customer reviews">
          {homeReviews.map(({ author, quote }) => (
            <figure key={author} data-home-reveal="">
              <blockquote>
                <p>“{quote}”</p>
              </blockquote>
              <figcaption>{author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeExperience() {
  const page = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  useHomeScroll(page, reduced);

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(
      page.current?.querySelectorAll<HTMLElement>("[data-home-reveal]") ?? [],
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-home-reveal", "shown");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -3% 0px" },
    );
    for (const item of items) {
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      item.dataset["homeReveal"] = "pending";
      observer.observe(item);
    }
    return () => {
      observer.disconnect();
      for (const item of items) item.dataset["homeReveal"] = "";
    };
  }, [reduced]);

  return (
    <div className="timber-home" ref={page}>
      <HomeHero />
      <OurRange />
      <HomeAcousticStudy />
      <LatestAdditions />
      <Spaces />
      <HomeArtists reducedMotion={reduced} />
      <CustomerTrust />
      <section
        className="timber-home-chapter timber-home-contact"
        aria-labelledby="home-contact-title"
      >
        <div className="timber-home-shell" data-home-reveal="">
          <h2 id="home-contact-title">
            Let’s talk <em>sound.</em>
          </h2>
          <p>Tell the Timber Acoustics team about your room.</p>
          <a href={expertAdvice} className="timber-home-button">
            Get expert advice
          </a>
        </div>
      </section>
    </div>
  );
}
