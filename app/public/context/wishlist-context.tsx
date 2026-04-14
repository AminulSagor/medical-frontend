"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getToken } from "@/utils/token/cookie_utils";
import {
  getWishlistProductIds,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from "@/service/user/wishlist.service";

interface WishlistContextValue {
  /** Set of product IDs in the wishlist */
  wishlistIds: Set<string>;
  /** Total count */
  totalItems: number;
  /** True while loading */
  isLoading: boolean;
  /** Toggle a product — adds if not in wishlist, removes if already in */
  toggleWishlist: (productId: string) => Promise<void>;
  /** Check if a product is in the wishlist */
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchIds = async () => {
      try {
        setIsLoading(true);
        const ids = await getWishlistProductIds();
        setWishlistIds(new Set(ids));
      } catch (error) {
        console.error("Failed to load wishlist", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIds();
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const token = getToken();
      if (!token) {
        // Redirect to sign-in or show toast
        if (typeof window !== "undefined") {
          window.location.href = "/public/auth/sign-in";
        }
        return;
      }

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });

      try {
        if (wishlistIds.has(productId)) {
          await removeFromWishlistApi(productId);
        } else {
          await addToWishlistApi(productId);
        }
      } catch (error) {
        console.error("Failed to update wishlist", error);
        // Revert on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return next;
        });
      }
    },
    [wishlistIds],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        totalItems: wishlistIds.size,
        isLoading,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }

  return ctx;
}
