/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "@/reference/router";
import { Search } from "lucide-react";
import { fetchFamilies, fetchProducts, formatPrice } from "@/reference/lib/api";
import { PageHero } from "@/reference/components/Chrome";
import ProductCard from "@/reference/components/ProductCard";
import { FadePage } from "@/reference/components/Reveal";
import { Slider } from "@/components/ui/slider";
import { ErrorNotice } from "@/reference/components/Forms";
import { errorMessage } from "@/reference/lib/api";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name Aâ€“Z" },
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
  const [bounds, setBounds] = useState([0, 100000]);
  const [range, setRange] = useState([0, 100000]);
  const family = params.get("family") || "all";

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
        (family === "all" || p.family === family) &&
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
      <PageHero eyebrow="Catalogue Â· Demo data" title="All products">
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
        <div className="grid gap-8 border-y border-timber-ink/10 py-8 lg:grid-cols-12 lg:items-center">
          <div className="relative lg:col-span-4">
            <Search
              size={16}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-timber-ink/40"
            />
            <input
              data-testid="search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="w-full border-b border-timber-ink/15 bg-transparent py-3 pl-7 text-sm font-light text-timber-ink outline-none transition-colors placeholder:text-timber-ink/35 focus:border-timber-orange"
            />
          </div>
          <div className="lg:col-span-5">
            <div className="flex items-center gap-6">
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
                {formatPrice(range[0])} â€” {formatPrice(range[1])}
              </p>
            </div>
          </div>
          <div className="lg:col-span-3 lg:text-right">
            <select
              data-testid="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-full border border-timber-ink/15 bg-transparent px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-timber-ink outline-none transition-colors focus:border-timber-orange lg:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
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

        <p className="label-quiet mt-10" data-testid="results-count">
          {loading
            ? "Loadingâ€¦"
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
        >
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} familyName={familyName(p.family)} index={i} />
          ))}
        </div>
      </section>
    </FadePage>
  );
}
