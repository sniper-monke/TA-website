import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, getFamily, products, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.product.name} — Timber Acoustics`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.product.purpose }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.product.purpose }] };
  },
  notFoundComponent: () => (
    <div className="px-5 pb-20 pt-40 text-center"><p className="font-display text-5xl">Product not found</p><Link to="/products" className="label-mono mt-6 inline-block underline">Back to catalogue</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const fam = getFamily(p.family)!;
  const [img, setImg] = useState(0);
  const [finish, setFinish] = useState(p.finishes[0]!);
  const [size, setSize] = useState(p.sizes[0]!);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const related = products.filter((r) => r.family === p.family && r.slug !== p.slug).concat(products.filter((r) => r.featured && r.family !== p.family)).slice(0, 4);

  const specs: [string, string][] = [["Dimensions", p.dims], ["Material", p.material], ...(p.nrc ? [["NRC (demo)", p.nrc.toFixed(2)] as [string, string]] : []), ["Principle", fam.principle]];

  return (
    <div className="pt-16">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden bg-card">
            <img src={p.gallery[img]} alt={`${p.name} — view ${img + 1}`} className="h-full w-full object-cover" style={{ filter: finish.id === "ebony" ? "brightness(.6) saturate(.6)" : finish.id === "oak" ? "brightness(1.15) saturate(.85)" : undefined }} />
            <span className="label-mono absolute left-4 top-4 bg-background/80 px-2 py-1">Concept imagery</span>
          </div>
          <div className="mt-3 flex gap-3">
            {p.gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`} aria-pressed={img === i} className={`h-20 w-24 overflow-hidden border-2 ${img === i ? "border-signal" : "border-transparent"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="label-mono text-muted-foreground"><Link to="/products" className="hover:text-foreground">Products</Link> / <Link to="/collections/$family" params={{ family: fam.slug }} className="hover:text-foreground">{fam.name}</Link></nav>
          <h1 className="font-display mt-4 text-[clamp(2.6rem,5vw,4.5rem)]">{p.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{p.purpose}</p>
          <p className="mt-6 font-mono text-2xl">{formatPrice(p.price * qty)} <span className="label-mono text-signal">Demo price</span></p>

          <fieldset className="mt-8"><legend className="label-mono text-muted-foreground">Finish — {finish.name}</legend>
            <div className="mt-3 flex gap-3">{p.finishes.map((f) => (
              <button key={f.id} onClick={() => setFinish(f)} aria-pressed={finish.id === f.id} aria-label={f.name} className={`h-12 w-12 border-2 p-1 ${finish.id === f.id ? "border-signal" : "border-border"}`}><span className="block h-full w-full" style={{ background: f.swatch }} /></button>
            ))}</div>
          </fieldset>
          <fieldset className="mt-6"><legend className="label-mono text-muted-foreground">Size</legend>
            <div className="mt-3 flex flex-wrap gap-2">{p.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`label-mono border px-4 py-3 ${size === s ? "border-foreground bg-foreground text-background" : ""}`}>{s}</button>
            ))}</div>
          </fieldset>
          <div className="mt-8 flex gap-3">
            <div className="flex items-center border"><button className="px-4 py-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button><span className="w-8 text-center font-mono" aria-live="polite">{qty}</span><button className="px-4 py-3" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button></div>
            <button onClick={() => { for (let i = 0; i < qty; i++) add({ id: `${p.slug}-${finish.id}-${size}`, title: p.name, detail: `${finish.name} · ${size}`, price: p.price }); }} className="label-mono flex-1 bg-signal py-4 text-accent-foreground transition-colors hover:bg-foreground">Add to demo cart</button>
          </div>

          <dl className="mt-10 border-t">{specs.map(([k, v]) => (<div key={k} className="grid grid-cols-[9rem_1fr] border-b py-3 text-sm"><dt className="label-mono text-muted-foreground">{k}</dt><dd>{v}</dd></div>))}</dl>
          <details className="group border-b py-4"><summary className="label-mono cursor-pointer list-none">Installation <span className="float-right group-open:rotate-45 transition-transform">+</span></summary><p className="mt-3 text-sm text-muted-foreground">{p.installation}. Placement guidance will come from Timber's team.</p></details>
          <details className="group border-b py-4"><summary className="label-mono cursor-pointer list-none">About the data <span className="float-right group-open:rotate-45 transition-transform">+</span></summary><p className="mt-3 text-sm text-muted-foreground">All specifications and prices shown are placeholders for the prototype and not verified Timber data.</p></details>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <h2 className="font-display text-4xl">Related</h2>
        <ul className="mt-8 grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
          {related.map((r) => (
            <li key={r.slug} className="bg-background"><Link to="/products/$slug" params={{ slug: r.slug }} className="group block p-4"><div className="aspect-square overflow-hidden bg-card"><img src={r.gallery[0]} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div><p className="mt-3">{r.name}</p><p className="font-mono text-sm text-muted-foreground">{formatPrice(r.price)}</p></Link></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
