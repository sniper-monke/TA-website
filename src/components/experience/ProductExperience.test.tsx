import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import products from "@/data/reference-products.json";
import { BasketProvider, useBasket } from "@/reference/context/BasketContext";
import type { StoreProduct } from "@/lib/storefront";
import { ProductExperience } from "./ProductExperience";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...props
  }: {
    to: string;
    params?: { slug: string };
    children: ReactNode;
  }) => (
    <a href={params ? to.replace("$slug", params.slug) : to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

let id = 0;
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("crypto", { randomUUID: () => `basket-${++id}` });
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

function BasketProbe() {
  const { items } = useBasket();
  return <output data-testid="saved-selections">{JSON.stringify(items)}</output>;
}
function mount(props: ComponentProps<typeof ProductExperience>) {
  return render(
    <BasketProvider>
      <ProductExperience {...props} />
      <BasketProbe />
    </BasketProvider>,
  );
}
const selections = () => JSON.parse(screen.getByTestId("saved-selections").textContent || "[]");
const live: StoreProduct = {
  slug: "live-panel",
  name: "Live panel",
  family: "absorption",
  families: ["absorption"],
  purpose: "Product description from the shop.",
  price: 1000,
  currency: "INR",
  gallery: ["/panel.jpg"],
  dims: "600 mm",
  material: "Fabric",
  installation: "Use the supplied mounting guide.",
  featured: false,
  sample: false,
  source: "shopify",
  options: [
    { name: "Finish", values: ["Sand", "Charcoal"] },
    { name: "Thickness", values: ["50 mm", "100 mm"] },
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "Sand / 50 mm",
      availableForSale: true,
      price: { amount: "1000", currencyCode: "INR" },
      selectedOptions: [
        { name: "Finish", value: "Sand" },
        { name: "Thickness", value: "50 mm" },
      ],
      image: null,
    },
    {
      id: "gid://shopify/ProductVariant/2",
      title: "Charcoal / 100 mm",
      availableForSale: true,
      price: { amount: "2000", currencyCode: "INR" },
      selectedOptions: [
        { name: "Finish", value: "Charcoal" },
        { name: "Thickness", value: "100 mm" },
      ],
      image: { url: "/charcoal.jpg", altText: "Charcoal panel" },
    },
  ],
  specifications: [],
  downloads: [],
};

describe("Product selections", () => {
  it("saves the chosen preview finish, size and quantity together", () => {
    mount({ product: products[0]! });
    fireEvent.click(screen.getByRole("button", { name: "Walnut" }));
    fireEvent.click(screen.getByRole("button", { name: "1200 mm" }));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByTestId("product-add-basket"));
    expect(selections()).toEqual([
      expect.objectContaining({ finish: "walnut", size: "1200 mm", quantity: 3 }),
    ]);
    fireEvent.click(screen.getByTestId("product-add-basket"));
    expect(selections()[0].quantity).toBe(6);
    expect(screen.getByTestId("product-price")).toHaveTextContent("14,900");
    expect(screen.getByText(/purchasing is unavailable/)).toBeInTheDocument();
  });
  it("blocks unavailable option combinations, then uses the real variant price, image and ID", () => {
    mount({ product: live });
    fireEvent.click(screen.getByRole("button", { name: "Charcoal" }));
    expect(screen.getByTestId("product-add-basket")).toBeDisabled();
    expect(screen.getByTestId("product-add-basket")).toHaveTextContent("Combination unavailable");
    fireEvent.click(screen.getByRole("button", { name: "100 mm" }));
    expect(screen.getByTestId("product-add-basket")).toBeEnabled();
    expect(screen.getByTestId("product-price")).toHaveTextContent("2,000");
    expect(screen.getByTestId("product-main-image")).toHaveAttribute("src", "/charcoal.jpg");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByTestId("product-add-basket"));
    expect(selections()).toEqual([
      expect.objectContaining({
        variantId: "gid://shopify/ProductVariant/2",
        unit_price: 2000,
        quantity: 2,
        description: "Charcoal / 100 mm",
      }),
    ]);
  });
  it("blocks sold-out variants and additions exceeding the basket line limit", () => {
    const soldOut = {
      ...live,
      variants: live.variants.map((variant) => ({ ...variant, availableForSale: false })),
    };
    const view = mount({ product: soldOut });
    expect(screen.getByTestId("product-add-basket")).toBeDisabled();
    expect(screen.getByTestId("product-add-basket")).toHaveTextContent("Sold out");
    view.unmount();
    mount({ product: products[0]! });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), {
      target: { value: "99" },
    });
    fireEvent.click(screen.getByTestId("product-add-basket"));
    fireEvent.change(screen.getByRole("spinbutton", { name: "Quantity" }), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByTestId("product-add-basket"));
    expect(selections()[0].quantity).toBe(99);
  });
});
