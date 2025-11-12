import React, { createContext, useContext, useMemo, useState } from "react";
import { BusinessCardData } from "@/components/BusinessCardForm";

export type CartItem = {
  id: string; // template id (classic id or sb:<id>)
  kind: "classic" | "server";
  data: BusinessCardData;
  selectedFont: string;
  fontSize: number;
  textColor: string;
  accentColor: string;
  price: number;
  serverMeta?: {
    name?: string;
    background_url?: string | null;
    back_background_url?: string | null;
    config?: any;
  };
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: CartItem) => {
    setItems((prev) => (prev.find((x) => x.id === item.id) ? prev : [...prev, item]));
  };
  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0), 0), [items]);

  const value = useMemo(() => ({ items, add, remove, clear, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
