import { useState } from "react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

const navigation = [
  ["/", "Home"],
  ["/products", "All Products"],
  ["/build-a-room", "Build a Room"],
  ["/projects", "Spaces"],
  ["/guides", "Room Guides"],
  ["/story", "Story"],
];

export function RingsMark({ size = 34, light = false }: { size?: number; light?: boolean }) {
  const stroke = light ? "#f8f4ee" : "#153a54";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="22" cy="26" r="19" stroke={stroke} strokeWidth="1.4" />
      <circle cx="22" cy="26" r="14" stroke={stroke} strokeWidth="1.2" opacity=".8" />
      <circle cx="22" cy="26" r="9.5" stroke={stroke} strokeWidth="1.1" opacity=".6" />
      <circle cx="22" cy="26" r="5.5" stroke={stroke} opacity=".45" />
      <circle cx="22" cy="26" r="2" fill="#bf673b" />
      <path d="M22 7 A19 19 0 0 1 41 26" stroke="#bf673b" strokeWidth="1.6" />
    </svg>
  );
}

export function ReferenceHeader() {
  const [open, setOpen] = useState(false);
  const { lines } = useCart();
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <header className="reference-header" data-testid="site-header">
      <div className="reference-header-inner">
        <a href="/" className="reference-logo">
          <RingsMark />
          <span>
            Timber
            <br />
            Acoustics
          </span>
        </a>
        <nav className="reference-nav" aria-label="Primary">
          {navigation.map(([to, label]) => (
            <a key={to} href={to}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <a href="/basket" className="header-basket" aria-label={`Enquiry basket, ${count} items`}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span>Enquiry</span>
            <span className="basket-badge">{count}</span>
          </a>
          <button
            className="reference-menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="reference-mobile-nav" aria-label="Mobile">
          {navigation.map(([to, label]) => (
            <a key={to} href={to}>
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function ReferenceFooter() {
  return (
    <footer className="reference-footer">
      <div className="shell reference-footer-grid">
        <div>
          <div className="reference-footer-brand">
            <RingsMark size={38} light />
            <span>Timber Acoustics</span>
          </div>
          <p>
            Wood acoustic treatment for studios, home theatres, listening rooms and workplaces.
            Create spaces that sound as good as they look.
          </p>
        </div>
        <div>
          <p className="reference-footer-label">Explore</p>
          {navigation.map(([to, label]) => (
            <a key={to} href={to}>
              {label}
            </a>
          ))}
        </div>
        <div>
          <p className="reference-footer-label">Designed in India</p>
          <em>Built for the world.</em>
          <p className="reference-footer-label">
            Sample catalogue — prices &amp; specs are indicative
          </p>
        </div>
      </div>
      <div className="shell reference-footer-bottom">
        <span>© {new Date().getFullYear()} Timber Acoustics</span>
        <a href="/admin">Team workspace ↗</a>
      </div>
    </footer>
  );
}
