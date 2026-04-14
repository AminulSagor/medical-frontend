"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem } from "@/types/public/cart/cart.types";
import { getToken } from "@/utils/token/cookie_utils";
import {
  addToBackendCart,
  getCartList,
  removeBackendCartItem,
  updateBackendCartItem,
} from "@/service/public/cart-server.service";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  syncItems: (newItems: { productId: string; quantity: number }[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shafa_cart";

function mapItemsToCartState(
  items: { productId: string; quantity: number }[],
): CartItem[] {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const syncItems = useCallback(
    (newItems: { productId: string; quantity: number }[]) => {
      setItems((prev) => {
        if (prev.length !== newItems.length) {
          return mapItemsToCartState(newItems);
        }

        const sortedPrev = [...prev].sort((a, b) =>
          a.productId.localeCompare(b.productId),
        );
        const sortedNew = [...newItems].sort((a, b) =>
          a.productId.localeCompare(b.productId),
        );

        const isDifferent = sortedPrev.some(
          (item, index) =>
            item.productId !== sortedNew[index].productId ||
            item.quantity !== sortedNew[index].quantity,
        );

        return isDifferent ? mapItemsToCartState(newItems) : prev;
      });
    },
    [],
  );

  useEffect(() => {
    const initializeCart = async () => {
      const token = getToken();

      if (token) {
        try {
          const data = await getCartList();
          syncItems(
            data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          );
          return;
        } catch (error) {
          console.error("Failed to load backend cart", error);
          setItems([]);
          return;
        }
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch {
        setItems([]);
      }
    };

    initializeCart();
  }, [syncItems]);

  useEffect(() => {
    if (getToken()) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      //
    }
  }, [items]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const token = getToken();

      if (token) {
        try {
          const data = await addToBackendCart({
            productId,
            quantity,
          });

          syncItems(
            data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          );
          return;
        } catch (error) {
          console.error("Failed to add item to backend cart", error);
        }
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.productId === productId);

        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [...prev, { productId, quantity }];
      });
    },
    [syncItems],
  );

  const removeItem = useCallback(
    (productId: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((item) => item.productId !== productId));

      // Sync to backend if logged in
      const token = getToken();
      if (token) {
        removeBackendCartItem(productId).catch((err) => {
          console.error("Failed to remove item from backend cart", err);
        });
      }
    },
    [],
  );

  const updateQty = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        // Remove instead
        setItems((prev) =>
          prev.filter((item) => item.productId !== productId),
        );

        const token = getToken();
        if (token) {
          removeBackendCartItem(productId).catch((err) => {
            console.error("Failed to remove item from backend cart", err);
          });
        }
        return;
      }

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );

      // Sync to backend if logged in
      const token = getToken();
      if (token) {
        updateBackendCartItem(productId, quantity).catch((err) => {
          console.error("Failed to update cart item on backend", err);
        });
      }
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      //
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        syncItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return ctx;
}
