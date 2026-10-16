import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { families, products, formatPrice, type FamilySlug } from "@/data/products";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export function Catalogue({ family }: { family?: FamilySlug }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [finish, setFinish] = useState<"all" | "wood" | "fabric">("all");
  const [maxPrice, setMaxPrice] = useState(100000);

  const list = useMemo(() => {
    let l = products.filter((p) => (!family || p.family === family));
    if (q) l = l.filter((p) => (p.name + p.purpose).toLowerCase().includes(q.toLowerCase()));
    if (finish !== "all") l = l.filter((p) => (finish === "wood" ? p.finishes[0]?.id === "oak" : p.finishes[0]?.id === "charcoal"));
    l = l.filter((p) => p.price <= maxPrice);
    const s = [...l];
    if (sort === "price-asc") s.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") s.sort((a, b) => b.price - a.price);
    if (sort === "name") s.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") s.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return s;
  }, [family, q, sort, finish, maxPrice]);

  const active = [q && `“${q}”`, finish !== "all" && finish, maxPrice < 100000 && `≤ ${formatPrice(maxPrice)}`].filter(Boolean) as string[];
  const reset = () => { setQ(""); setFinish("all"); setMaxPrice(100000); setSort("featured"); };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10">
      <nav aria-label="Product families" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
        <FamilyPill to={undefined} active={!family} label="All" />
        {families.map((f) => <FamilyPill key={f.slug} to={f.slug} active={family === f.slug} label={f.name} />)}
      </nav>

      <div className="mt-4 grid gap-4 border-y py-5 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="flex flex-col gap-2"><span className="label-mono text-muted-foreground">Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Panel, diffuser, trap…" className="border bg-card px-4 py-3 outline-none focus:border-signal" />
        </label>
        <label className="flex flex-col gap-2"><span className="label-mono text-muted-foreground">Finish</span>
          <select value={finish} onChange={(e) => setFinish(e.target.value as typeof finish)} className="border bg-card px-4 py-3">
            <option value="all">All finishes</option><option value="wood">Timber</option><option value="fabric">Felt / fabric</option>
          </select>
        </label>
        <label className="flex flex-col gap-2"><span className="label-mono text-muted-foreground">Max price · {formatPrice(maxPrice)}</span>
          <input type="range" min={4000} max={100000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-3 accent-[var(--signal)]" />
        </label>
        <label className="flex flex-col gap-2"><span className="label-mono text-muted-foreground">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="border bg-card px-4 py-3">
            <option value="featured">Featured</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <div className="flex min-h-12 flex-wrap items-center gap-2 py-4" aria-live="polite">
        <span className="label-mono text-muted-foreground">{list.length} results</span>
        {active.map((a) => <span key={a} className="label-mono border border-signal px-2 py-1 text-signal">{a}</span>)}
        {active.length > 0 && <button onClick={reset} className="label-mono underline">Reset filters</button>}
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center border border-dashed py-24 text-center">
          <p className="font-display text-4xl">No match.</p>
          <p className="mt-2 text-muted-foreground">Try a broader search or clear your filters.</p>
          <button onClick={reset} className="label-mono mt-6 border px-5 py-3">Reset filters</button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {list.map((p) => (
            <li key={p.slug} className="bg-background">
              <Link to="/products/$slug" params={{ slug: p.slug }} className="group block p-3 md:p-5">
                <div className="aspect-square overflow-hidden bg-card"><img src={p.gallery[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <p className="label-mono mt-4 text-muted-foreground">{families.find((f) => f.slug === p.family)?.name}</p>
                <h3 className="mt-1 font-medium md:text-lg">{p.name}</h3>
                <p className="mt-1 font-mono text-sm">{formatPrice(p.price)} <span className="text-muted-foreground">demo</span></p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FamilyPill({ to, active, label }: { to?: FamilySlug | undefined; active: boolean; label: string }) {
  const cls = `label-mono shrink-0 border px-4 py-2 transition-colors ${active ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`;
  return to ? <Link to="/collections/$family" params={{ family: to }} className={cls}>{label}</Link> : <Link to="/products" className={cls}>{label}</Link>;
}
