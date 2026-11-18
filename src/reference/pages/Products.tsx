/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "@/reference/router";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { fetchFamilies, fetchProducts, formatPrice } from "@/reference/lib/api";
import { PageHero } from "@/reference/components/Chrome";
import ProductCard from "@/reference/components/ProductCard";
import { FadePage } from "@/reference/components/Reveal";
import { ReferenceSlider as Slider } from "@/reference/components/ReferenceSlider";
import { ErrorNotice } from "@/reference/components/Forms";
import { errorMessage } from "@/reference/lib/api";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bounds, setBounds] = useState([0, 100000]);
  const [range, setRange] = useState([0, 100000]);
  const family = params.get("family") || "all";
  const activeFilters =
    Number(family !== "all") + Number(range[0] !== bounds[0] || range[1] !== bounds[1]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([fetchProducts(), fetchFamilies()])
      .then(([p, f]) => {
        if (!active) return;
        setProducts(p);
        setFamilies(f);
        const prices = p.map((x) => x.price);
        const lo = prices.length ? Math.floor(Math.min(...prices) / 500) * 500 : 0;
        const hi = prices.length
          ? Math.max(lo + 500, Math.ceil(Math.max(...prices) / 500) * 500)
          : 500;
        setBounds([lo, hi]);
        setRange([lo, hi]);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const familyName = (slug) => families.find((f) => f.slug === slug)?.name || slug;

  const visible = useMemo(() => {
    let list = products.filter(
      (p) =>
        (family === "all" || p.family === family || p.families?.includes(family)) &&
        p.name.toLowerCase().includes(q.trim().toLowerCase()) &&
        p.price >= range[0] &&
        p.price <= range[1],
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else
      list = [...list].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.name.localeCompare(b.name),
      );
    return list;
  }, [products, family, q, range, sort]);

  const setFamily = (slug) => {
    if (slug === "all") params.delete("family");
    else params.set("family", slug);
    setParams(params, { replace: true });
  };

  const reset = () => {
    setQ("");
    setSort("featured");
    setRange(bounds);
    setFamily("all");
  };

  return (
    <FadePage>
      <PageHero
        eyebrow={
          products.some((p) => p.source === "shopify")
            ? "The collection"
            : "Catalogue · Shopify export"
        }
        title="All products"
      >
        Panels, slats, diffusers and more. Considered pieces for a room that sounds as good as it
        looks.
      </PageHero>

      <section className="mx-auto max-w-[1500px] px-5 pb-28 md:px-10" data-testid="catalogue">
        {error && (
          <div className="mb-8">
            <ErrorNotice id="catalogue-error">{error}</ErrorNotice>
            <button
              data-testid="catalogue-retry"
              className="action-button"
              onClick={() => setAttempt((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        )}
        <div className="ta-catalogue-toolbar">
          <div className="ta-catalogue-search">
            <Search
              size={16}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-timber-ink/40"
            />
            <input
              data-testid="search-input"
              type="search"
              aria-label="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full border-b border-timber-ink/15 bg-transparent py-3 pl-7 pr-11 text-sm font-light text-timber-ink outline-none transition-colors placeholder:text-timber-ink/35 focus:border-timber-orange"
            />
            {q && (
              <button
                className="ta-search-clear"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>
          <button
            className="ta-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="catalogue-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={16} /> Filters{" "}
            {activeFilters > 0 && <span>{activeFilters}</span>}
            <ChevronDown size={15} />
          </button>
          <div className="ta-catalogue-sort">
            <select
              data-testid="sort-select"
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </div>
        </div>
        <div id="catalogue-filters" className="ta-catalogue-filters" data-open={filtersOpen}>
          <div className="ta-catalogue-filter-heading">
            <p className="label-quiet">Refine your selection</p>
            <button className="ta-text-link" onClick={reset}>
              Reset filters
            </button>
          </div>
          <div className="ta-price-filter">
            <p className="label-quiet">Price range</p>
            <div className="ta-price-filter-control">
              <Slider
                data-testid="price-slider"
                min={bounds[0]}
                max={bounds[1]}
                step={500}
                value={range}
                onValueChange={setRange}
                className="flex-1"
              />
              <p
                className="whitespace-nowrap text-xs font-normal text-timber-ink/60"
                data-testid="price-range-label"
              >
                {formatPrice(range[0], products[0]?.currency)} —{" "}
                {formatPrice(range[1], products[0]?.currency)}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2" data-testid="family-chips">
            {[{ slug: "all", name: "All" }, ...families].map((f) => (
              <button
                key={f.slug}
                data-testid={`family-chip-${f.slug}`}
                onClick={() => setFamily(f.slug)}
                aria-pressed={family === f.slug}
                className={`rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  family === f.slug
                    ? "border-timber-orange bg-timber-orange text-timber-cream"
                    : "border-timber-ink/15 text-timber-ink/65 hover:border-timber-ink/40 hover:text-timber-ink"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <p className="label-quiet mt-10" data-testid="results-count" role="status">
          {loading
            ? "Loading…"
            : error
              ? "Collection temporarily unavailable"
              : `${visible.length} of ${products.length} products`}
        </p>

        {!loading && !error && visible.length === 0 && (
          <div className="mt-16 text-center" data-testid="empty-state">
            <p className="font-display text-3xl font-light text-timber-ink">
              Nothing in this range.
            </p>
            <p className="mt-3 text-sm text-timber-ink/60">
              Loosen the filters to see more of the collection.
            </p>
            <button
              data-testid="reset-filters-button"
              onClick={reset}
              className="mt-8 rounded-full bg-timber-ink px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-timber-cream transition-colors hover:bg-timber-orange"
            >
              Reset filters
            </button>
          </div>
        )}

        <div
          className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="product-grid"
          aria-busy={loading}
        >
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} familyName={familyName(p.family)} index={i} />
          ))}
        </div>
      </section>
    </FadePage>
  );
}
