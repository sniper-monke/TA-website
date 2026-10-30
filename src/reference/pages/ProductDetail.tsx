/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useParams } from "@/reference/router";
import { ArrowLeft, ArrowUpRight, Plus, ShoppingBag } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { mediaUrl } from "@/reference/lib/api";
import { errorMessage } from "@/reference/lib/api";
import { ErrorNotice } from "@/reference/components/Forms";
import { fetchFamilies, fetchProduct, fetchProducts, formatPrice } from "@/reference/lib/api";
import { FadePage, Reveal } from "@/reference/components/Reveal";
import ProductCard from "@/reference/components/ProductCard";

function Detail({ product: p, families, related }) {
  const { add } = useBasket();
  const fam = families.find((f) => f.slug === p.family);
  const [img, setImg] = useState(0);
  const [finish, setFinish] = useState(p.finishes[0]);
  const [size, setSize] = useState(p.sizes[0]);

  const filter =
    finish.id === "ebony"
      ? "brightness(.62) saturate(.65)"
      : finish.id === "oak"
        ? "brightness(1.12) saturate(.88)"
        : undefined;

  const specs = [
    ["Dimensions", p.dims],
    ["Material", p.material],
    ...(p.nrc ? [["NRC (demo)", p.nrc.toFixed(2)]] : []),
    ["Principle", fam?.principle || "â€”"],
  ];

  return (
    <>
      <section
        className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36"
        data-testid="product-detail"
      >
        <nav aria-label="Breadcrumb" className="label-quiet flex items-center gap-2">
          <Link
            to="/products"
            data-testid="breadcrumb-products"
            className="inline-flex items-center gap-2 transition-colors hover:text-timber-orange"
          >
            <ArrowLeft size={13} /> Products
          </Link>
          <span className="text-timber-ink/25">/</span>
          <span>{fam?.name}</span>
        </nav>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="min-w-0">
            <div className="relative overflow-hidden rounded-md bg-timber-sand shadow-[0_24px_70px_rgba(21,58,84,0.1)]">
              <img
                src={mediaUrl(p.gallery[img])}
                alt={`${p.name} â€” view ${img + 1}`}
                className="aspect-[4/3] w-full object-contain transition-[filter] duration-700"
                style={{ filter }}
                data-testid="product-main-image"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_40%,rgba(21,58,84,0.18)_100%)]" />
              <span className="label-quiet absolute left-4 top-4 rounded-full bg-timber-cream/85 px-3 py-1.5 backdrop-blur">
                {p.sample ? "Reference imagery" : "Collection"}
              </span>
            </div>
            <div
              className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4"
              data-testid="product-thumbnails"
            >
              {p.gallery.map((g, i) => (
                <button
                  key={i}
                  data-testid={`product-thumb-${i}`}
                  onClick={() => setImg(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={img === i}
                  className={`aspect-[6/5] w-full overflow-hidden rounded-sm border-2 transition-colors duration-300 ${
                    img === i
                      ? "border-timber-orange"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={mediaUrl(g)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <p className="label-eyebrow">{fam?.name}</p>
            <h1
              className="mt-3 font-display text-4xl font-light tracking-tight text-timber-ink sm:text-5xl"
              data-testid="product-name"
            >
              {p.name}
            </h1>
            <p className="mt-5 max-w-md text-base font-light leading-relaxed text-timber-ink/70">
              {p.purpose}
            </p>
            <p
              className="mt-7 font-display text-3xl font-light text-timber-ink"
              data-testid="product-price"
            >
              {formatPrice(p.price)}{" "}
              <span className="label-eyebrow align-middle">
                {p.sample ? "Sample price" : "Indicative price"}
              </span>
            </p>

            <fieldset className="mt-10">
              <legend className="label-quiet">Finish â€” {finish.name}</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {p.finishes.map((f) => (
                  <button
                    key={f.id}
                    data-testid={`finish-${f.id}`}
                    onClick={() => setFinish(f)}
                    aria-label={f.name}
                    aria-pressed={finish.id === f.id}
                    className={`rounded-full border-2 p-1 transition-colors duration-300 ${
                      finish.id === f.id
                        ? "border-timber-orange"
                        : "border-timber-ink/15 hover:border-timber-ink/40"
                    }`}
                  >
                    <span className="block h-9 w-9 rounded-full" style={{ background: f.swatch }} />
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="label-quiet">Size</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    data-testid={`size-${s.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      size === s
                        ? "border-timber-ink bg-timber-ink text-timber-cream"
                        : "border-timber-ink/15 text-timber-ink/70 hover:border-timber-ink/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              data-testid="product-add-basket"
              className="action-button w-full mt-8"
              onClick={() =>
                add({
                  kind: "product",
                  slug: p.slug,
                  name: p.name,
                  finish: finish.id,
                  size,
                  description: `${finish.name} Â· ${size}`,
                  unit_price: p.price,
                  image: p.gallery[0],
                })
              }
            >
              <Plus size={17} />
              Add to enquiry
            </button>
            <Link to="/basket" className="text-link mt-4" data-testid="product-view-basket">
              <ShoppingBag size={15} />
              View enquiry basket
            </Link>
            <Link
              to={`/build-a-room?${new URLSearchParams(["oak", "walnut", "ebony"].includes(finish.id) ? { finish: finish.id } : ["charcoal", "rust", "bone"].includes(finish.id) ? { felt: finish.id } : {}).toString()}`}
              data-testid="product-configure-cta"
              className="group mt-10 flex items-center justify-between rounded-full bg-timber-orange px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-timber-cream transition-colors duration-300 hover:bg-timber-ink"
            >
              {["oak", "walnut", "ebony", "charcoal", "rust", "bone"].includes(finish.id)
                ? "See this finish in a room"
                : "Explore a room scheme"}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <dl className="mt-12 border-t border-timber-ink/10">
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-timber-ink/10 py-4 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]"
                  data-testid={`product-spec-${k.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                >
                  <dt className="label-quiet pt-0.5">{k}</dt>
                  <dd className="font-light text-timber-ink/85">{v}</dd>
                </div>
              ))}
            </dl>
            <details className="group border-b border-timber-ink/10 py-4">
              <summary
                data-testid="product-installation-toggle"
                className="label-quiet cursor-pointer list-none transition-colors hover:text-timber-ink"
              >
                Installation
                <span className="float-right transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm font-light text-timber-ink/60">
                {p.installation}. Placement guidance comes from Timber's team.
              </p>
            </details>
            <details className="group border-b border-timber-ink/10 py-4">
              <summary
                data-testid="product-data-toggle"
                className="label-quiet cursor-pointer list-none transition-colors hover:text-timber-ink"
              >
                About the data
                <span className="float-right transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm font-light text-timber-ink/60">
                {p.sample
                  ? "Specifications and prices shown are sample catalogue data, not verified Timber specifications."
                  : "Confirm final specifications, pricing and installation requirements with the Timber team before ordering."}
              </p>
            </details>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="mx-auto max-w-[1500px] px-5 py-24 md:px-10"
          data-testid="related-products"
        >
          <Reveal>
            <h2 className="font-display text-3xl font-light tracking-tight text-timber-ink">
              Related
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <ProductCard
                key={r.slug}
                product={r}
                familyName={families.find((f) => f.slug === r.family)?.name || r.family}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [families, setFamilies] = useState([]);
  const [all, setAll] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [supportingError, setSupportingError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    setLoadError("");
    setSupportingError(false);
    Promise.allSettled([fetchProduct(slug), fetchFamilies(), fetchProducts()]).then(([p, f, a]) => {
      if (!active) return;
      if (p.status === "fulfilled") setProduct(p.value);
      else if (p.reason.response?.status === 404) setNotFound(true);
      else setLoadError(errorMessage(p.reason));
      setFamilies(f.status === "fulfilled" ? f.value : []);
      setAll(a.status === "fulfilled" ? a.value : []);
      setSupportingError(f.status === "rejected" || a.status === "rejected");
    });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  if (loadError)
    return (
      <FadePage>
        <section className="shell pt-40 pb-32">
          <ErrorNotice id="product-load-error">{loadError}</ErrorNotice>
          <button
            className="action-button"
            data-testid="product-load-retry"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        </section>
      </FadePage>
    );

  if (notFound) {
    return (
      <FadePage>
        <div
          className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center"
          data-testid="product-not-found"
        >
          <div>
            <p className="label-eyebrow">Not found</p>
            <h1 className="mt-4 font-display text-4xl font-light text-timber-ink">
              Product not found
            </h1>
            <Link
              to="/products"
              data-testid="back-to-catalogue"
              className="mt-8 inline-block rounded-full bg-timber-ink px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-timber-cream transition-colors hover:bg-timber-orange"
            >
              Back to catalogue
            </Link>
          </div>
        </div>
      </FadePage>
    );
  }

  if (!product) {
    return (
      <FadePage>
        <div className="grid min-h-[70vh] place-items-center pt-24" data-testid="product-loading">
          <p className="label-quiet">Loading productâ€¦</p>
        </div>
      </FadePage>
    );
  }

  const related = all
    .filter((r) => r.family === product.family && r.slug !== product.slug)
    .concat(all.filter((r) => r.featured && r.family !== product.family))
    .slice(0, 4);

  return (
    <FadePage>
      {supportingError && (
        <div className="shell pt-28">
          <ErrorNotice id="product-supporting-error">
            Some collection details could not be loaded. Your product selection is still available.
          </ErrorNotice>
          <button
            className="text-link"
            data-testid="product-supporting-retry"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Reload collection details
          </button>
        </div>
      )}
      <Detail key={product.slug} product={product} families={families} related={related} />
    </FadePage>
  );
}
