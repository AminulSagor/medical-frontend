"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AUTH_CHANGED_EVENT,
  getToken,
} from "@/utils/token/cookie_utils";
import {
  getWishlistProductIds,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi,
} from "@/service/user/wishlist.service";

interface WishlistContextValue {
  wishlistIds: Set<string>;
  totalItems: number;
  isLoading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setWishlistIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      const ids = await getWishlistProductIds();
      setWishlistIds(new Set(ids));
    } catch (error) {
      console.error("Failed to load wishlist", error);
      setWishlistIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  useEffect(() => {
    const handleAuthChanged = () => {
      refreshWishlist();
    };

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    };
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const token = getToken();

      if (!token) {
        if (typeof window !== "undefined") {
          window.location.href = "/public/auth/sign-in";
        }
        return;
      }

      const wasInWishlist = wishlistIds.has(productId);

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
        if (wasInWishlist) {
          await removeFromWishlistApi(productId);
        } else {
          await addToWishlistApi(productId);
        }
      } catch (error) {
        console.error("Failed to update wishlist", error);

        setWishlistIds((prev) => {
          const next = new Set(prev);

          if (wasInWishlist) {
            next.add(productId);
          } else {
            next.delete(productId);
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
        refreshWishlist,
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