import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

type BasketEntry = {
  kind: "product" | "scheme";
  name: string;
  unit_price: number;
  slug?: string;
  finish?: string;
  size?: string;
  scheme?: Record<string, string>;
  description?: string;
  image?: string;
};
type BasketItem = BasketEntry & { id: string; quantity: number };
type BasketState = {
  items: BasketItem[];
  count: number;
  total: number;
  add: (entry: BasketEntry) => void;
  quantity: (id: string, value: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const BasketContext = createContext<BasketState | null>(null);
const KEY = "timber-enquiry-basket-v1";
const identity = (item: BasketEntry) =>
  JSON.stringify([item.kind, item.slug, item.finish, item.size, item.scheme]);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);
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
  const add = (item: BasketEntry) => {
    const key = identity(item);
    const existing = items.find((x) => identity(x) === key);
    if ((!existing && items.length >= 30) || (existing?.quantity ?? 0) >= 99) {
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
  const quantity = (id: string, value: number) =>
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, quantity: Math.max(1, Math.min(99, value || 1)) } : x,
      ),
    );
  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
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
export function useBasket() {
  const basket = useContext(BasketContext);
  if (!basket) throw new Error("useBasket must be used within BasketProvider");
  return basket;
}
