import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Plus, ShoppingBag, X } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { BrandContours } from "./BrandContours";

const links = [
  { to: "/products", label: "The collection", short: "Products" },
  { to: "/build-a-room", label: "Build a room", short: "Build a room" },
  { to: "/projects", label: "Spaces", short: "Spaces" },
  { to: "/guides", label: "Field notes", short: "Field notes" },
  { to: "/story", label: "Our story", short: "Story" },
] as const;

export function SiteHeader() {
  const { count } = useBasket();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
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
          {links.map((item) => (
            <Link key={item.to} to={item.to} data-active={pathname.startsWith(item.to)}>
              {item.short}
            </Link>
          ))}
        </nav>
        <div className="ta-header-actions">
          <Link
            to="/basket"
            className="ta-basket"
            aria-label={`Enquiry basket, ${count} items`}
            data-testid="nav-basket"
          >
            <ShoppingBag size={16} strokeWidth={1.4} />
            <span>Enquiry</span>
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
              Explore Timber Acoustics <span>01—05</span>
            </div>
            {links.map((item, index) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <span className="ta-micro">0{index + 1}</span>
                <span>{item.label}</span>
                <ArrowUpRight size={22} strokeWidth={1} />
              </Link>
            ))}
            <p className="ta-micro ta-mobile-note">Natural materials. Considered acoustics.</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="ta-footer" data-testid="site-footer">
      <div className="ta-footer-top ta-shell">
        <div className="ta-footer-heading">
          <p className="ta-micro">A quieter kind of conversation</p>
          <h2>
            Good sound.
            <br />
            <span>Starts here.</span>
          </h2>
          <Link to="/build-a-room" className="ta-button ta-button-light">
            Imagine your space <ArrowUpRight size={17} />
          </Link>
        </div>
        <BrandContours className="ta-footer-rings" />
        <div className="ta-footer-links">
          <p className="ta-micro">
            Find your way <ArrowDown size={13} />
          </p>
          {links.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </div>
      <div className="ta-footer-base ta-shell">
        <Link to="/" aria-label="Timber Acoustics home">
          <img
            src="/brand/timber-acoustics-light.svg"
            alt="Timber Acoustics"
            width="250"
            height="26"
          />
        </Link>
        <p>Designed in India. Felt everywhere.</p>
        <span className="ta-micro">© {new Date().getFullYear()}</span>
      </div>
      <div className="ta-footer-fine ta-shell">
        <span>Sample catalogue · Indicative pricing · Illustrative spaces</span>
        <Link to="/admin/login">
          Team workspace <ArrowUpRight size={12} />
        </Link>
      </div>
    </footer>
  );
}
