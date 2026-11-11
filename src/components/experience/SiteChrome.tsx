import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Plus, ShoppingBag, X } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { useCatalogue } from "@/hooks/use-catalogue";
import { spaceLinks } from "@/data/site-content";

const links = [
  { to: "/products", label: "Acoustic products", short: "Products" },
  { to: "/build-a-room", label: "Solutions / Build a room", short: "Solutions" },
  { to: "/projects", label: "Projects", short: "Projects" },
  { to: "/guides", label: "Acoustic knowledge", short: "Knowledge" },
  { to: "/story", label: "About Timber", short: "About" },
] as const;

export function SiteHeader() {
  const { count } = useBasket();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const catalogueMenu = useRef<HTMLDetailsElement>(null);
  const { data: catalogue } = useCatalogue();
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!catalogueMenu.current?.contains(event.target as Node))
        catalogueMenu.current?.removeAttribute("open");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && catalogueMenu.current?.open) {
        catalogueMenu.current.removeAttribute("open");
        catalogueMenu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
    catalogueMenu.current?.removeAttribute("open");
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const items = [
        toggle.current,
        ...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
      ].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", keyboard);
    };
  }, [open]);

  return (
    <header className="ta-header" data-scrolled={scrolled} data-testid="site-header">
      <div className="ta-header-inner">
        <Link
          to="/"
          className="ta-logo"
          aria-label="Timber Acoustics home"
          onClick={() => setOpen(false)}
        >
          <img src="/brand/timber-acoustics.svg" alt="Timber Acoustics" width="250" height="26" />
        </Link>
        <nav className="ta-desktop-nav" aria-label="Primary">
          <details className="ta-product-menu" ref={catalogueMenu}>
            <summary data-testid="product-menu-toggle">
              Products <ChevronDown size={13} />
            </summary>
            <div className="ta-mega-menu" data-testid="product-mega-menu">
              <div className="ta-mega-inner ta-shell ta-grouped-menu">
                <div>
                  <p className="ta-micro ta-rust">Acoustic treatment</p>
                  <a href="/products?family=absorption">
                    Absorption <ArrowUpRight size={14} />
                  </a>
                  <a href="/products?family=diffusion">
                    Diffusion <ArrowUpRight size={14} />
                  </a>
                  <a href="/products?family=bass-traps">
                    Bass management <ArrowUpRight size={14} />
                  </a>
                  <a href="/products?family=room-kits">
                    Room kits <ArrowUpRight size={14} />
                  </a>
                  <Link to="/products" className="ta-text-link">
                    All products <ArrowUpRight size={15} />
                  </Link>
                </div>
                <div>
                  <p className="ta-micro ta-rust">Studio furniture</p>
                  <a href="/products?family=racks-and-tables">
                    Studio desks & racks <ArrowUpRight size={14} />
                  </a>
                  <Link to="/build-a-room" className="ta-text-link">
                    Plan your setup <ArrowUpRight size={15} />
                  </Link>
                </div>
                <div>
                  <p className="ta-micro ta-rust">By space</p>
                  {spaceLinks.map((space) => (
                    <a key={space.label} href={space.href}>
                      {space.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </details>
          <Link to="/build-a-room" data-active={pathname.startsWith("/build-a-room")}>
            Solutions
          </Link>
          <Link to="/" hash="explore-spaces">
            Spaces
          </Link>
          {links.slice(2).map((item) => (
            <Link key={item.to} to={item.to} data-active={pathname.startsWith(item.to)}>
              {item.short}
            </Link>
          ))}
        </nav>
        <div className="ta-header-actions">
          <Link
            to="/basket"
            className="ta-basket"
            aria-label={`Shopping bag, ${count} items`}
            data-testid="nav-basket"
          >
            <ShoppingBag size={16} strokeWidth={1.4} />
            <span>Bag</span>
            <span className="ta-count" data-testid="nav-basket-count">
              {String(count).padStart(2, "0")}
            </span>
          </Link>
          <button
            ref={toggle}
            className="ta-menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="ta-mobile-menu"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-button"
          >
            {open ? <X size={19} /> : <Plus size={19} />}
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menu}
            id="ta-mobile-menu"
            className="ta-mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            data-testid="mobile-menu"
          >
            <div className="ta-mobile-label ta-micro">
              Explore Timber Acoustics <span>01—06</span>
            </div>
            {links.map((item, index) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <span className="ta-micro">0{index + 1}</span>
                <span>{item.label}</span>
                <ArrowUpRight size={22} strokeWidth={1} />
              </Link>
            ))}
            <div className="ta-mobile-categories" aria-label="Product categories">
              {catalogue?.families.map((family) => (
                <a key={family.slug} href={`/products?family=${encodeURIComponent(family.slug)}`}>
                  {family.name}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
            <div className="ta-mobile-space-links" aria-label="By space">
              <p className="ta-micro ta-rust">By space</p>
              {spaceLinks.map((space) => (
                <a href={space.href} key={space.label}>
                  {space.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
            <Link to="/contact" onClick={() => setOpen(false)}>
              <span className="ta-micro">06</span>
              <span>Ask the team</span>
              <ArrowUpRight size={18} />
            </Link>
            <p className="ta-micro ta-mobile-note">Acoustic treatment. Naturally considered.</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="ta-layout-footer" data-testid="site-footer">
      <div className="ta-layout-footer-grid ta-shell">
        <div className="ta-footer-brand">
          <Link to="/" aria-label="Timber Acoustics home">
            <img src="/brand/timber-acoustics.svg" alt="Timber Acoustics" width="250" height="26" />
          </Link>
          <p>
            Acoustic solutions for studios,
            <br />
            homes and creative spaces.
          </p>
          <span className="ta-layout-content-note">Sample catalogue / Illustrative projects</span>
        </div>
        <nav aria-label="Footer products">
          <h2>Products</h2>
          <a href="/products?family=absorption">Absorption</a>
          <a href="/products?family=diffusion">Diffusion</a>
          <a href="/products?family=bass-traps">Bass management</a>
          <a href="/products?family=racks-and-tables">Studio furniture & racks</a>
          <Link to="/products">All products</Link>
        </nav>
        <nav aria-label="Footer spaces">
          <h2>Solutions / Spaces</h2>
          {spaceLinks.map((space) => (
            <a key={space.label} href={space.href}>
              {space.label}
            </a>
          ))}
          <Link to="/build-a-room">Build a room</Link>
        </nav>
        <nav aria-label="Footer company">
          <h2>Company</h2>
          <Link to="/story">Our story</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/guides">Knowledge</Link>
          <Link to="/contact">Contact us</Link>
        </nav>
      </div>
      <div className="ta-layout-footer-base ta-shell">
        <p>&copy; {new Date().getFullYear()} Timber Acoustics. All rights reserved.</p>
        <span>Designed in India. Felt everywhere.</span>
        <Link to="/admin/login">
          Team workspace <ArrowUpRight size={12} />
        </Link>
      </div>
    </footer>
  );
}
