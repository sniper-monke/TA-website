import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteChrome";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: ({ select }: { select: (location: { pathname: string }) => string }) =>
    select({ pathname: "/products" }),
}));
vi.mock("@/reference/context/BasketContext", () => ({ useBasket: () => ({ count: 3 }) }));
vi.mock("@/hooks/use-catalogue", () => ({
  useCatalogue: () => ({ data: { families: [{ slug: "diffusion", name: "Diffusion" }] } }),
}));
afterEach(cleanup);

describe("Mobile navigation", () => {
  it("opens an accessible modal, locks scrolling and restores focus on Escape", async () => {
    render(<SiteHeader />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Explore Timber Acoustics" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.body).toHaveAttribute("data-scroll-locked", "1");
    expect(within(dialog).getByRole("link", { name: "Your bag 3" })).toHaveAttribute(
      "href",
      "/basket",
    );
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body).not.toHaveAttribute("data-scroll-locked");
  });

  it("closes when a visitor chooses a category and exposes the active page", async () => {
    render(<SiteHeader />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(menu).getByRole("link", { name: "01 Acoustic products" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const category = within(menu).getByRole("link", { name: "Diffusion" });
    category.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(category);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
