import { Link } from "@tanstack/react-router";
export { SiteHeader as Header, SiteFooter as Footer } from "@/components/experience/SiteChrome";
export { PageIntro as PageHero } from "@/components/experience/PageIntro";

export function NotFound() {
  return (
    <section className="ta-not-found ta-shell" data-testid="not-found">
      <p className="ta-micro ta-rust">404 / A little off course</p>
      <h1>This room is untreated.</h1>
      <Link to="/" className="ta-button" data-testid="not-found-home-link">
        Back home
      </Link>
    </section>
  );
}
