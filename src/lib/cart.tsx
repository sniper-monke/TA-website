import { createContext, useContext, useState, type ReactNode } from "react";

// Demo cart — local state only. Swap for Shopify Storefront cart later.
export interface CartLine { id: string; title: string; detail: string; price: number; qty: number }
interface Cart { lines: CartLine[]; open: boolean; setOpen: (o: boolean) => void; add: (l: Omit<CartLine, "qty">) => void; remove: (id: string) => void }

const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const add: Cart["add"] = (l) => {
    setLines((cur) => {
      const ex = cur.find((c) => c.id === l.id);
      return ex ? cur.map((c) => (c.id === l.id ? { ...c, qty: c.qty + 1 } : c)) : [...cur, { ...l, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (id: string) => setLines((cur) => cur.filter((c) => c.id !== id));
  return <Ctx.Provider value={{ lines, open, setOpen, add, remove }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
