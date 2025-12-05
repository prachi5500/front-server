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
  // When true, user wants to save this edited card as a reusable template
  saveAsTemplate?: boolean;
  // Optional name user gives when saving as a template
  templateName?: string | null;
  // Design payloads (positions, sizes, font overrides) so server can recreate / save template
  frontData?: any | null;
  backData?: any | null;
  // Uploaded image URLs (populated during checkout before sending to server)
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<CartItem>) => void;
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
  const update = (id: string, patch: Partial<CartItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const clear = () => setItems([]);
  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0), 0), [items]);
  const value = useMemo(() => ({ items, add, remove, update, clear, total }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
