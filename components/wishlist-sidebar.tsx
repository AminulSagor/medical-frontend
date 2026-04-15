"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Trash2, Heart, ShoppingCart } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/service/user/wishlist.service";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { useCart } from "@/app/public/context/cart-context";
import type { WishlistData } from "@/types/public/wishlist/wishlist.types";

export default function WishlistSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistData["items"]>([]);
  const [loading, setLoading] = useState(false);
  const { toggleWishlist, totalItems: wishlistCount } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    queueMicrotask(() => setIsClient(true));
  }, []);

  useEffect(() => {
    if (!open) return;

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await getWishlist();
        setWishlistItems(data.items || []);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!isClient) return null;

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      await toggleWishlist(productId);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleAddToCart = (productId: string) => {
    addItem(productId, 1);
  };

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-[1000]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "absolute right-0 top-0 h-full w-[420px] max-w-[92vw]",
          "bg-white shadow-2xl",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          "flex flex-col",
        ].join(" ")}
      >
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10">
                <Heart size={18} className="text-red-500" />
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-base font-extrabold text-black">
                  Wishlist
                </h2>

                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
                  {wishlistCount} item{wishlistCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full",
                "hover:bg-light-slate/10 active:scale-95 transition",
              ].join(" ")}
              aria-label="Close"
            >
              <X size={18} className="text-light-slate" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-light-slate/10" />

        <div className="flex-1 overflow-auto px-6 py-5 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <Heart className="mb-4 h-12 w-12 text-light-slate" />
              <div className="text-lg font-bold text-black">
                Your wishlist is empty
              </div>
              <div className="mt-2 text-sm text-light-slate">
                Add items to your wishlist to save for later.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((product) => (
                <div key={product.wishlistItemId} className="flex gap-4 pb-4 border-b border-light-slate/10">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-light-slate/10 flex-shrink-0">
                    <Image
                      src={product.imageUrl || "/photos/store_product.png"}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-black truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-light-slate mt-1 line-clamp-2">
                      SKU: {product.sku}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {product.offerPrice && (
                          <>
                            <span className="text-sm font-bold text-black">
                              ${parseFloat(product.offerPrice).toFixed(2)}
                            </span>
                            {product.actualPrice &&
                              product.actualPrice !== product.offerPrice && (
                                <span className="text-xs text-light-slate line-through">
                                  ${parseFloat(product.actualPrice).toFixed(2)}
                                </span>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product.productId)}
                        className={[
                          "flex-1 flex items-center justify-center gap-1 h-8 rounded-lg",
                          "bg-blue-50 text-primary text-xs font-bold",
                          "hover:bg-blue-100 active:scale-95 transition",
                        ].join(" ")}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart size={14} />
                        Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromWishlist(product.productId)}
                        className={[
                          "flex items-center justify-center h-8 w-8 rounded-lg",
                          "bg-red-50 text-red-500",
                          "hover:bg-red-100 active:scale-95 transition",
                        ].join(" ")}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="border-t border-light-slate/10 bg-white px-6 py-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/public/store");
              }}
              className={[
                "w-full rounded-2xl bg-light-slate/10 px-6 py-3",
                "text-light-slate text-sm font-extrabold",
                "hover:bg-light-slate/20 active:scale-[0.99] transition",
              ].join(" ")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
