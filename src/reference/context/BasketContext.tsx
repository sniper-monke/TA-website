/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const BasketContext = createContext(null);
const KEY = "timber-enquiry-basket-v1";
const identity = (item) =>
  JSON.stringify([item.kind, item.slug, item.finish, item.size, item.scheme]);

export const BasketProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved))
        setItems(
          saved
            .filter(
              (x) =>
                x &&
                ["product", "scheme"].includes(x.kind) &&
                x.id &&
                Number.isInteger(x.quantity) &&
                x.quantity > 0 &&
                x.quantity <= 99 &&
                Number.isFinite(x.unit_price),
            )
            .slice(0, 30),
        );
    } catch {
      /* Browser storage may be unavailable. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {
        /* Browser storage may be disabled. */
      }
    }
  }, [items, loaded]);
  const add = (item) => {
    const key = identity(item);
    const existing = items.find((x) => identity(x) === key);
    if ((!existing && items.length >= 30) || existing?.quantity >= 99) {
      toast.error("Your basket has reached its limit.");
      return;
    }
    setItems((prev) => {
      const match = prev.find((x) => identity(x) === key);
      return match
        ? prev.map((x) =>
            x.id === match.id ? { ...x, quantity: Math.min(99, x.quantity + 1) } : x,
          )
        : [...prev, { ...item, id: crypto.randomUUID(), quantity: 1 }];
    });
    toast.success(`${item.name} added to your enquiry`, { id: "basket-added" });
  };
  const quantity = (id, value) =>
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, quantity: Math.max(1, Math.min(99, value || 1)) } : x,
      ),
    );
  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  return (
    <BasketContext.Provider
      value={{
        items,
        add,
        quantity,
        remove,
        clear,
        count: items.reduce((n, x) => n + x.quantity, 0),
        total: items.reduce((n, x) => n + x.quantity * x.unit_price, 0),
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};
export const useBasket = () => useContext(BasketContext);
