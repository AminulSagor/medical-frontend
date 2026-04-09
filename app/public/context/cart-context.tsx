"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem } from "@/types/public/cart/cart.types";

/* ─── Shape ─────────────────────────────────── */
interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncItems: (newItems: { productId: string; quantity: number }[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "shafa_cart";

/* ─── Provider ──────────────────────────────── */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const syncItems = useCallback((newItems: { productId: string; quantity: number }[]) => {
    setItems((prev) => {
      // Deep compare to prevent infinite loops if they are essentially the same
      if (prev.length !== newItems.length) return newItems;
      const sortedPrev = [...prev].sort((a, b) => a.productId.localeCompare(b.productId));
      const sortedNew = [...newItems].sort((a, b) => a.productId.localeCompare(b.productId));
      
      const isDifferent = sortedPrev.some((p, i) => 
        p.productId !== sortedNew[i].productId || p.quantity !== sortedNew[i].quantity
      );
      
      return isDifferent ? newItems : prev;
    });
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, addItem, removeItem, updateQty, clearCart, syncItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────── */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
