/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "@/reference/router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { RingsMark } from "@/reference/components/WoodRings";

const NAV = [
  { to: "/", label: "Home", testid: "nav-home" },
  { to: "/products", label: "All Products", testid: "nav-products" },
  { to: "/build-a-room", label: "Build a Room", testid: "nav-build-a-room" },
  { to: "/projects", label: "Spaces", testid: "nav-projects" },
  { to: "/guides", label: "Room Guides", testid: "nav-guides" },
  { to: "/story", label: "Story", testid: "nav-story" },
];

export const Logo = ({ compact = false }) => (
  <Link to="/" data-testid="logo-link" className="site-logo group flex items-center gap-3">
    <RingsMark
      size={compact ? 28 : 34}
      className="transition-transform duration-700 group-hover:rotate-45"
    />
    <span className="font-display text-[13px] font-medium uppercase leading-[1.15] tracking-[0.3em] text-timber-ink">
      Timber
      <br />
      Acoustics
    </span>
  </Link>
);

export const Header = () => {
  const { count } = useBasket();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-timber-cream/75 shadow-[0_8px_32px_rgba(21,58,84,0.06)] backdrop-blur-xl"
          : "bg-timber-cream/95"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 md:px-10">
        <Logo compact={scrolled} />
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={n.testid}
              className={({ isActive }) =>
                `link-underline pb-1 text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive
                    ? "font-medium text-timber-orange"
                    : "text-timber-ink/70 hover:text-timber-ink"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-tools">
          <Link
            to="/basket"
            aria-label={`Enquiry basket, ${count} items`}
            className="header-basket"
            data-testid="nav-basket"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">Enquiry</span>
            <span className="basket-badge" data-testid="nav-basket-count">
              {count}
            </span>
          </Link>
          <button
            data-testid="mobile-menu-button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-timber-ink/15 text-timber-ink xl:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-timber-ink/10 bg-timber-cream/95 px-6 pb-8 pt-4 backdrop-blur-xl xl:hidden"
            aria-label="Mobile"
          >
            {NAV.map((n, i) => (
              <motion.div
                key={n.to}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4 }}
              >
                <NavLink
                  to={n.to}
                  data-testid={`mobile-${n.testid}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-timber-ink/8 py-4 font-display text-2xl font-light ${
                      isActive ? "text-timber-orange" : "text-timber-ink"
                    }`
                  }
                >
                  {n.label}
                  <ArrowUpRight size={18} className="opacity-40" />
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => (
  <footer
    data-testid="site-footer"
    className="relative overflow-hidden bg-timber-ink text-timber-cream"
  >
    <div className="grain mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-20">
      <div className="relative z-10 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <RingsMark size={38} stroke="#F8F4EE" accent="#BF673B" />
            <span className="font-display text-sm font-medium uppercase tracking-[0.3em]">
              Timber Acoustics
            </span>
          </div>
          <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-timber-cream/60">
            Wood acoustic treatment for studios, home theatres, listening rooms and workplaces.
            Create spaces that sound as good as they look.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="label-quiet !text-timber-cream/40">Explore</p>
          <ul className="mt-5 space-y-3 text-sm font-light">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  data-testid={`footer-${n.testid}`}
                  className="text-timber-cream/75 transition-colors hover:text-timber-orange"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="label-quiet !text-timber-cream/40">Designed in India</p>
          <p className="mt-5 font-serif text-2xl italic text-timber-cream/85">
            Built for the world.
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-timber-cream/35">
            Sample catalogue â€” prices &amp; specs are indicative
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-16 flex flex-col gap-3 border-t border-timber-cream/10 pt-6 text-[11px] uppercase tracking-[0.2em] text-timber-cream/40 md:flex-row md:items-center md:justify-between">
        <span>Â© {new Date().getFullYear()} Timber Acoustics</span>
        <Link to="/admin" data-testid="footer-admin" className="hover:text-timber-cream">
          Team workspace â†—
        </Link>
      </div>
    </div>
  </footer>
);

export const PageHero = ({ eyebrow, title, italic, children }) => (
  <section className="grain relative overflow-hidden px-5 pb-14 pt-36 md:px-10 md:pb-20 md:pt-44">
    <div className="relative z-10 mx-auto max-w-[1500px]">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="label-eyebrow"
        data-testid="page-hero-eyebrow"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight text-timber-ink sm:text-5xl lg:text-6xl"
        data-testid="page-hero-title"
      >
        {title}
        {italic && (
          <>
            {" "}
            <span className="font-serif italic text-timber-orange">{italic}</span>
          </>
        )}
      </motion.h1>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-base font-light leading-relaxed text-timber-ink/70"
        >
          {children}
        </motion.div>
      )}
    </div>
  </section>
);

export const NotFound = () => (
  <div
    className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center"
    data-testid="not-found"
  >
    <div>
      <p className="label-eyebrow">404</p>
      <h1 className="mt-4 font-display text-5xl font-light">This room is untreated.</h1>
      <Link
        to="/"
        data-testid="not-found-home-link"
        className="mt-8 inline-block rounded-full bg-timber-ink px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-timber-cream transition-colors hover:bg-timber-orange"
      >
        Back home
      </Link>
    </div>
  </div>
);
