import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BasketProvider, useBasket } from "./BasketContext";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const key = "timber-enquiry-basket-v1";
const entry = { kind: "product" as const, name: "Panel", slug: "panel", unit_price: 100 };

function Probe() {
  const basket = useBasket();
  return (
    <>
      <output data-testid="items">{JSON.stringify(basket.items)}</output>
      <output data-testid="count">{basket.count}</output>
      <button onClick={() => basket.add(entry, 2)}>Add</button>
      <button
        onClick={() => {
          for (let i = 0; i < 35; i++) basket.add({ ...entry, slug: `panel-${i}` });
        }}
      >
        Add many
      </button>
      <button onClick={() => basket.quantity(basket.items[0]!.id, 1.5)}>Fraction</button>
      <button onClick={() => basket.quantity(basket.items[0]!.id, 99)}>Maximum</button>
      <button onClick={() => basket.remove(basket.items[0]!.id)}>Remove</button>
    </>
  );
}
const items = () => JSON.parse(screen.getByTestId("items").textContent || "[]");
const mount = () =>
  render(
    <BasketProvider>
      <Probe />
    </BasketProvider>,
  );

beforeEach(() => {
  localStorage.clear();
  let id = 0;
  vi.stubGlobal("crypto", { randomUUID: () => `line-${++id}` });
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Persistent basket", () => {
  it("restores valid selections and discards corrupt records that could crash the bag", () => {
    const valid = { ...entry, id: "saved", quantity: 2, currency: "INR" };
    localStorage.setItem(
      key,
      JSON.stringify([
        valid,
        { ...valid, name: {} },
        { ...valid, currency: "invalid" },
        { ...valid, unit_price: -1 },
        { ...valid, quantity: 1.5 },
        { ...valid, variantId: "csv:not-purchasable" },
      ]),
    );
    mount();
    expect(items()).toEqual([valid]);
    expect(screen.getByTestId("count")).toHaveTextContent("2");
  });
  it("persists additions, merges matching selections, limits integer quantities and removes items", () => {
    mount();
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Add"));
    expect(items()).toHaveLength(1);
    expect(items()[0].quantity).toBe(4);
    fireEvent.click(screen.getByText("Fraction"));
    expect(items()[0].quantity).toBe(4);
    fireEvent.click(screen.getByText("Maximum"));
    fireEvent.click(screen.getByText("Add"));
    expect(items()[0].quantity).toBe(99);
    expect(JSON.parse(localStorage.getItem(key)!)[0].quantity).toBe(99);
    fireEvent.click(screen.getByText("Remove"));
    expect(items()).toEqual([]);
  });
  it("enforces the line limit even when additions happen in the same render", () => {
    mount();
    fireEvent.click(screen.getByText("Add many"));
    expect(items()).toHaveLength(30);
  });
  it("works when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    mount();
    fireEvent.click(screen.getByText("Add"));
    expect(items()[0].quantity).toBe(2);
  });
});
