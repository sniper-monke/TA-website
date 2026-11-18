import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BasketProvider } from "@/reference/context/BasketContext";
import { beginCheckout } from "@/lib/commerce";
import { ShoppingBagPage } from "./ShoppingBagPage";

vi.mock("@/lib/commerce", () => ({ beginCheckout: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/reference/components/Chrome", () => ({
  PageHero: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
const key = "timber-enquiry-basket-v1";
const product = {
  id: "panel",
  kind: "product",
  name: "Panel",
  unit_price: 1000,
  quantity: 2,
  variantId: "gid://shopify/ProductVariant/1",
  currency: "INR",
};
const scheme = {
  id: "room",
  kind: "scheme",
  name: "Studio scheme",
  unit_price: 0,
  quantity: 1,
  scheme: { roomType: "studio", finish: "walnut" },
};
const mount = (items: unknown[] = []) => {
  localStorage.setItem(key, JSON.stringify(items));
  return render(
    <BasketProvider>
      <ShoppingBagPage />
    </BasketProvider>,
  );
};
beforeEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Shopping bag checkout", () => {
  it("offers an empty-state recovery link and disables checkout", () => {
    mount();
    expect(screen.getByTestId("basket-empty")).toBeVisible();
    expect(screen.getByRole("link", { name: /Explore products/ })).toHaveAttribute(
      "href",
      "/products",
    );
    expect(screen.getByTestId("checkout-button")).toBeDisabled();
  });
  it("keeps preview products out of checkout", () => {
    const { variantId, ...preview } = product;
    mount([preview]);
    expect(screen.getByTestId("checkout-button")).toBeDisabled();
    expect(screen.getByText("Preview product")).toBeVisible();
  });
  it("keeps products in different currencies out of the same checkout", () => {
    mount([
      product,
      { ...product, id: "second", currency: "USD", variantId: "gid://shopify/ProductVariant/2" },
    ]);
    expect(screen.getByTestId("checkout-button")).toBeDisabled();
  });
  it("keeps room schemes quote-only and carries the shortlist to contact", () => {
    mount([scheme]);
    expect(screen.getByTestId("checkout-button")).toBeDisabled();
    expect(screen.getByRole("link", { name: "Revisit room" })).toHaveAttribute(
      "href",
      expect.stringContaining("room=studio"),
    );
    expect(screen.getByRole("link", { name: /Request a project quote/ })).toHaveAttribute(
      "href",
      "/contact?request=quote&basket=1",
    );
  });
  it("sends only live product IDs and quantities, reports failure and allows retry", async () => {
    vi.mocked(beginCheckout).mockRejectedValue(new Error("The shop is temporarily unavailable."));
    mount([product, scheme]);
    const button = screen.getByTestId("checkout-button");
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(await screen.findByRole("alert")).toHaveTextContent("temporarily unavailable");
    expect(beginCheckout).toHaveBeenCalledWith({
      data: { lines: [{ merchandiseId: product.variantId, quantity: 2 }] },
    });
    expect(button).toBeEnabled();
  });
});
