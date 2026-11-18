import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
  variantId?: string;
  currency?: string;
};
type BasketItem = BasketEntry & { id: string; quantity: number };
type BasketState = {
  items: BasketItem[];
  count: number;
  total: number;
  add: (entry: BasketEntry, quantity?: number) => void;
  quantity: (id: string, value: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const BasketContext = createContext<BasketState | null>(null);
const KEY = "timber-enquiry-basket-v1";
const savedItem = z.object({
  id: z.string().min(1),
  kind: z.enum(["product", "scheme"]),
  name: z.string().min(1),
  unit_price: z.number().finite().nonnegative(),
  quantity: z.number().int().min(1).max(99),
  slug: z.string().optional(),
  finish: z.string().optional(),
  size: z.string().optional(),
  scheme: z.record(z.string()).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  variantId: z
    .string()
    .regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/)
    .optional(),
  currency: z
    .string()
    .regex(/^[A-Z]{3}$/)
    .optional(),
});
const identity = (item: BasketEntry) =>
  JSON.stringify([item.kind, item.slug, item.finish, item.size, item.scheme, item.variantId]);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved))
        setItems(saved.filter((x): x is BasketItem => savedItem.safeParse(x).success).slice(0, 30));
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
  const add = (item: BasketEntry, amount = 1) => {
    if (!Number.isInteger(amount) || amount < 1 || amount > 99) {
      toast.error("Choose a quantity from 1 to 99.");
      return;
    }
    const key = identity(item);
    const existing = items.find((x) => identity(x) === key);
    if ((!existing && items.length >= 30) || (existing?.quantity ?? 0) + amount > 99) {
      toast.error("Your basket has reached its limit.");
      return;
    }
    setItems((prev) => {
      const match = prev.find((x) => identity(x) === key);
      if ((!match && prev.length >= 30) || (match?.quantity ?? 0) + amount > 99) return prev;
      return match
        ? prev.map((x) =>
            x.id === match.id ? { ...x, quantity: Math.min(99, x.quantity + amount) } : x,
          )
        : [...prev, { ...item, id: crypto.randomUUID(), quantity: amount }];
    });
    toast.success(
      `${item.name} added to your ${item.kind === "product" ? "bag" : "room shortlist"}`,
      { id: "basket-added" },
    );
  };
  const quantity = (id: string, value: number) => {
    if (!Number.isInteger(value)) return;
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, quantity: Math.max(1, Math.min(99, value || 1)) } : x,
      ),
    );
  };
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
