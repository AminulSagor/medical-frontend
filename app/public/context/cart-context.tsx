"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CartItem } from "@/types/public/cart/cart.types";
import {
  AUTH_CHANGED_EVENT,
  getToken,
} from "@/utils/token/cookie_utils";
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
  refreshCart: () => Promise<void>;
  pruneItems: (productIds: string[]) => Promise<void>;
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

function safeReadStoredCart(): { productId: string; quantity: number }[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is { productId: string; quantity: number } =>
        !!item &&
        typeof item === "object" &&
        typeof (item as { productId?: unknown }).productId === "string" &&
        typeof (item as { quantity?: unknown }).quantity === "number" &&
        (item as { quantity: number }).quantity > 0,
    );
  } catch {
    return [];
  }
}

function writeStoredCart(items: { productId: string; quantity: number }[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    //
  }
}

function mergeCartListsPreferLargerQuantity(
  primary: { productId: string; quantity: number }[],
  secondary: { productId: string; quantity: number }[],
) {
  const merged = new Map<string, number>();

  secondary.forEach((item) => {
    merged.set(item.productId, item.quantity);
  });

  primary.forEach((item) => {
    const existingQty = merged.get(item.productId) ?? 0;
    merged.set(item.productId, Math.max(existingQty, item.quantity));
  });

  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

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

  const refreshCart = useCallback(async () => {
    const token = getToken();
    const localItems = safeReadStoredCart();

    if (token) {
      try {
        const data = await getCartList();

        const backendItems = data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        const mergedItems = mergeCartListsPreferLargerQuantity(
          localItems,
          backendItems,
        );

        syncItems(mergedItems);
        writeStoredCart(mergedItems);
        return;
      } catch (error) {
        console.error("Failed to load backend cart", error);

        if (localItems.length > 0) {
          syncItems(localItems);
          return;
        }

        setItems([]);
        return;
      }
    }

    if (localItems.length > 0) {
      syncItems(localItems);
      return;
    }

    setItems([]);
  }, [syncItems]);

  const mergeGuestCartToBackend = useCallback(async () => {
    const token = getToken();
    if (!token) {
      await refreshCart();
      return;
    }

    try {
      const [backendData, storedCart] = await Promise.all([
        getCartList().catch(() => ({ items: [] })),
        Promise.resolve(safeReadStoredCart()),
      ]);

      const backendItems = Array.isArray(backendData?.items)
        ? backendData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
        : [];

      const mergedItems = mergeCartListsPreferLargerQuantity(
        storedCart,
        backendItems,
      );

      syncItems(mergedItems);
      writeStoredCart(mergedItems);

      const backendQuantityMap = new Map<string, number>();
      backendItems.forEach((item) => {
        backendQuantityMap.set(item.productId, item.quantity);
      });

      const addOperations = mergedItems
        .map((item) => {
          const backendQty = backendQuantityMap.get(item.productId) ?? 0;
          const missingQty = item.quantity - backendQty;

          if (missingQty <= 0) return null;

          return addToBackendCart({
            productId: item.productId,
            quantity: missingQty,
          });
        })
        .filter(Boolean);

      if (addOperations.length > 0) {
        await Promise.allSettled(addOperations);
      }
    } catch (error) {
      console.error("Failed to merge guest cart", error);
      await refreshCart();
    }
  }, [refreshCart, syncItems]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    const handleAuthChanged = async () => {
      await mergeGuestCartToBackend();
    };

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, [mergeGuestCartToBackend]);

  useEffect(() => {
    writeStoredCart(
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );
  }, [items]);

  useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  const pruneItems = useCallback(async (productIds: string[]) => {
    if (productIds.length === 0) return;

    const uniqueProductIds = [...new Set(productIds)];

    uniqueProductIds.forEach((productId) => {
      const existingTimer = debounceTimersRef.current.get(productId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimersRef.current.delete(productId);
      }
    });

    setItems((prev) =>
      prev.filter((item) => !uniqueProductIds.includes(item.productId)),
    );

    const token = getToken();
    if (!token) return;

    await Promise.allSettled(
      uniqueProductIds.map((productId) => removeBackendCartItem(productId)),
    );
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const token = getToken();

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

      if (!token) return;

      try {
        await addToBackendCart({
          productId,
          quantity,
        });
      } catch (error) {
        console.error("Failed to add item to backend cart", error);
      }
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    const existingTimer = debounceTimersRef.current.get(productId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      debounceTimersRef.current.delete(productId);
    }

    setItems((prev) => prev.filter((item) => item.productId !== productId));

    const token = getToken();
    if (token) {
      removeBackendCartItem(productId).catch((err) => {
        console.error("Failed to remove item from backend cart", err);
      });
    }
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    const token = getToken();

    if (quantity <= 0) {
      const existingTimer = debounceTimersRef.current.get(productId);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimersRef.current.delete(productId);
      }

      setItems((prev) => prev.filter((item) => item.productId !== productId));

      if (token) {
        removeBackendCartItem(productId).catch((err) => {
          console.error("Failed to remove item from backend cart", err);
        });
      }
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );

    if (!token) return;

    const existingTimer = debounceTimersRef.current.get(productId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      updateBackendCartItem(productId, quantity).catch((err) => {
        console.error("Failed to update cart item on backend", err);
      });

      debounceTimersRef.current.delete(productId);
    }, 500);

    debounceTimersRef.current.set(productId, timer);
  }, []);

  const clearCart = useCallback(() => {
    debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
    debounceTimersRef.current.clear();

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
        refreshCart,
        pruneItems,
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