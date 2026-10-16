import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/products";

const nav = [
  { to: "/products", label: "Products" },
  { to: "/configurator", label: "Configure" },
  { to: "/projects", label: "Projects" },
  { to: "/story", label: "Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { lines, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled || menu ? "bg-background/85 backdrop-blur-md border-b" : ""}`}>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenu(false)}>
          <span aria-hidden className="grid h-6 w-6 grid-cols-3 gap-[2px]">
            {Array.from({ length: 9 }).map((_, i) => <span key={i} className={i === 4 ? "bg-signal" : "bg-foreground"} />)}
          </span>
          <span className="font-display text-lg">Timber<span className="text-muted-foreground"> Acoustics</span></span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="label-mono text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "!text-foreground" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="label-mono border px-3 py-2 transition-colors hover:border-foreground">
            Cart <span className="text-signal">[{String(count).padStart(2, "0")}]</span>
          </button>
          <button className="label-mono border px-3 py-2 md:hidden" aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button>
        </div>
      </div>
      {menu && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t px-5 pb-8 pt-4 md:hidden">
          {nav.map((n, i) => (
            <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="flex items-baseline justify-between border-b py-4">
              <span className="font-display text-4xl">{n.label}</span>
              <span className="label-mono text-muted-foreground">0{i + 1}</span>
            </Link>
          ))}
        </nav>
      )}
      <CartDrawer />
    </header>
  );
}

function CartDrawer() {
  const { lines, open, setOpen, remove } = useCart();
  if (!open) return null;
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Demo cart">
      <button aria-label="Close cart" className="absolute inset-0 bg-background/70" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l bg-card p-6 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl">Cart</h2>
          <button onClick={() => setOpen(false)} className="label-mono border px-3 py-2">Close</button>
        </div>
        <p className="label-mono mt-2 text-signal">Demo cart — no checkout</p>
        <ul className="mt-6 flex-1 divide-y overflow-auto">
          {lines.length === 0 && <li className="py-10 text-muted-foreground">Nothing here yet.</li>}
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-4 py-4">
              <div>
                <p className="font-medium">{l.title} <span className="text-muted-foreground">× {l.qty}</span></p>
                <p className="text-sm text-muted-foreground">{l.detail}</p>
                <button className="label-mono mt-2 text-muted-foreground underline" onClick={() => remove(l.id)}>Remove</button>
              </div>
              <p className="font-mono text-sm">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t pt-4">
          <div className="flex justify-between font-mono"><span>Subtotal (demo)</span><span>{formatPrice(total)}</span></div>
          <button disabled className="mt-4 w-full bg-muted py-4 label-mono text-muted-foreground">Checkout disabled in prototype</button>
        </div>
      </aside>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="font-display text-5xl md:text-7xl">Make room<br />for sound.</p>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">Wood acoustic treatment for studios, home theatres, hi-fi rooms and commercial spaces. Designed in India.</p>
        </div>
        <div>
          <p className="label-mono text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2">
            <li><Link to="/products" className="hover:text-signal">All products</Link></li>
            <li><Link to="/configurator" className="hover:text-signal">Configurator</Link></li>
            <li><Link to="/projects" className="hover:text-signal">Projects</Link></li>
            <li><Link to="/story" className="hover:text-signal">Our story</Link></li>
          </ul>
        </div>
        <div>
          <p className="label-mono text-muted-foreground">Contact</p>
          <ul className="mt-4 space-y-2">
            <li><Link to="/contact" className="hover:text-signal">Professional enquiries</Link></li>
            <li><a href="https://www.instagram.com/timberacoustics" className="hover:text-signal">Instagram</a></li>
            <li><a href="https://www.youtube.com/@timberacoustics" className="hover:text-signal">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] justify-between border-t px-5 py-4 md:px-10">
        <span className="label-mono text-muted-foreground">© Timber Acoustics</span>
        <span className="label-mono text-muted-foreground">Design prototype · demo data</span>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="grid-lines border-b px-5 pb-14 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <p className="label-mono text-signal">{eyebrow}</p>
        <h1 className="font-display mt-4 text-[clamp(3rem,10vw,9rem)]">{title}</h1>
        {children && <div className="mt-6 max-w-xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}
