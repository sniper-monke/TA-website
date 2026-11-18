import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BasketProvider, useBasket } from "@/reference/context/BasketContext";
import Configurator from "./Configurator";

const mocks = vi.hoisted(() => ({ search: "" }));
vi.mock("@/reference/router", () => ({
  useSearchParams: () => [new URLSearchParams(mocks.search)],
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("@/reference/components/Reveal", () => ({
  FadePage: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Reveal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
function Probe() {
  return <output data-testid="items">{JSON.stringify(useBasket().items)}</output>;
}
const mount = () =>
  render(
    <BasketProvider>
      <Configurator />
      <Probe />
    </BasketProvider>,
  );
beforeEach(() => {
  localStorage.clear();
  mocks.search = "";
  vi.stubGlobal("crypto", { randomUUID: () => "scheme-1" });
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("Room shortlist", () => {
  it("saves a quote-only room without requiring a retired demo product or inventing a price", () => {
    mocks.search = "room=studio&finish=walnut&coverage=2&walls=rear";
    mount();
    expect(screen.getByTestId("cfg-total-price")).toHaveTextContent("By quotation");
    expect(screen.getByTestId("cfg-add-basket")).toBeEnabled();
    fireEvent.click(screen.getByTestId("cfg-add-basket"));
    const saved = JSON.parse(screen.getByTestId("items").textContent!);
    expect(saved).toEqual([
      expect.objectContaining({
        kind: "scheme",
        unit_price: 0,
        quantity: 1,
        scheme: expect.objectContaining({
          roomType: "studio",
          finish: "walnut",
          coverage: "2",
          walls: "rear",
        }),
      }),
    ]);
  });
  it("handles invalid URL options and blocks unsupported concept combinations", () => {
    mocks.search = "room=missing&finish=missing&coverage=100";
    mount();
    expect(screen.getByTestId("cfg-room-label")).toHaveTextContent("Home Theatre");
    fireEvent.click(screen.getByTestId("cfg-finish-ebony"));
    fireEvent.click(screen.getByTestId("cfg-felt-bone"));
    expect(screen.getByTestId("cfg-add-basket")).toBeDisabled();
    expect(screen.getByTestId("cfg-error")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("cfg-felt-charcoal"));
    expect(screen.getByTestId("cfg-add-basket")).toBeEnabled();
  });
});
