import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Pause, Play, Youtube } from "lucide-react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion";
import { expertAdvice, timberStore } from "./home-content";

const announcements = [
  {
    text: "5% off at our live store · TIMBER5",
    href: `${timberStore}/collections/all-products`,
  },
  { text: "Shipping to UAE & Gulf countries · Get a quote", href: expertAdvice },
];

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/timberacoustics", Icon: Instagram },
  { name: "YouTube", href: "https://www.youtube.com/@timberacoustics", Icon: Youtube },
  { name: "Facebook", href: "https://www.facebook.com/timberacoustics", Icon: Facebook },
];

export function HomeMarquee() {
  const reduced = useReducedMotionPreference();
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const announcement = announcements[slide] ?? announcements[0]!;

  useEffect(() => {
    if (!playing || reduced || hovered || focused) return;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % announcements.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [playing, reduced, hovered, focused]);

  return (
    <div className="timber-home timber-home-marquee">
      <nav className="timber-home-socials" aria-label="Social media">
        {socials.map(({ name, href, Icon }) => (
          <a key={name} href={href} aria-label={name}>
            <Icon size={17} aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div
        className="timber-home-promotion"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-live={reduced || !playing ? "polite" : "off"}
      >
        <a href={announcement.href}>
          <span key={slide}>{announcement.text}</span>
        </a>
      </div>
      <div className="timber-home-promo-controls">
        <button
          type="button"
          onClick={() => setSlide((slide + 1) % announcements.length)}
          aria-label="Next announcement"
        >
          <span aria-hidden="true">
            {slide + 1}/{announcements.length}
          </span>
        </button>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? "Pause announcements" : "Play announcements"}
          >
            {playing ? (
              <Pause size={15} aria-hidden="true" />
            ) : (
              <Play size={15} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function HomeFooter() {
  return (
    <footer className="timber-home timber-home-footer">
      <div className="timber-home-shell timber-home-footer-inner">
        <Link to="/" className="timber-home-logo" aria-label="Timber Acoustics home">
          <img src="/brand/timber-acoustics.svg" alt="" width="250" height="26" />
        </Link>
        <nav aria-label="Footer navigation">
          <a href={`${timberStore}/pages/about-us`}>About</a>
          <a href={`${timberStore}/blogs/news`}>Knowledge Centre</a>
          <a href={`${timberStore}/pages/faq`}>FAQ</a>
          <a href={`${timberStore}/policies/shipping-policy`}>Shipping</a>
          <a href={`${timberStore}/policies/privacy-policy`}>Privacy</a>
        </nav>
        <p>© {new Date().getFullYear()} Timber Acoustics</p>
      </div>
    </footer>
  );
}
