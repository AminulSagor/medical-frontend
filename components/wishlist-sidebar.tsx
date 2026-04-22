"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Heart, ShoppingCart } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/service/user/wishlist.service";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { useCart } from "@/app/public/context/cart-context";
import type { WishlistData } from "@/types/public/wishlist/wishlist.types";
import NetworkImageFallback from "@/utils/network-image-fallback";

export default function WishlistSidebar({
  open,
  onClose,
  onOpenCart,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCart: () => void;
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
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
      await toggleWishlist(productId);
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId, 1);
      onClose();
      onOpenCart();
    } catch (err) {
      console.error("Failed to add wishlist item to cart", err);
    }
  };

  const handleOpenDetails = (productId: string) => {
    onClose();
    router.push(`/public/store/product-details/${productId}`);
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
        <div className="px-6 pb-4 pt-6">
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
                "transition hover:bg-light-slate/10 active:scale-95",
              ].join(" ")}
              aria-label="Close"
            >
              <X size={18} className="text-light-slate" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-light-slate/10" />

        <div className="relative flex-1 overflow-auto px-6 py-5">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500/20 border-t-red-500" />
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
              {wishlistItems.map((product) => {
                const isOutOfStock =
                  product.inStock === false ||
                  Number(product.stockQuantity || 0) <= 0;

                const isInactive =
                  typeof product.productStatus === "boolean"
                    ? !product.productStatus
                    : product.isActive !== undefined
                      ? !product.isActive
                      : false;

                const availabilityLabel = isInactive
                  ? "Currently unavailable"
                  : isOutOfStock
                    ? "Out of stock"
                    : "In stock";

                return (
                  <div
                    key={product.wishlistItemId}
                    className="flex gap-4 border-b border-light-slate/10 pb-4"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(product.productId)}
                      className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-light-slate/10"
                      aria-label={`Open details for ${product.name}`}
                    >
                      <NetworkImageFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
                        iconClassName="h-6 w-6"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(product.productId)}
                        className="block max-w-full text-left"
                      >
                        <h3 className="truncate text-sm font-bold text-black transition-colors hover:text-primary">
                          {product.name}
                        </h3>
                      </button>

                      <p className="mt-1 line-clamp-2 text-xs text-light-slate">
                        SKU: {product.sku}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
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

                      <p
                        className={`mt-1 text-xs font-medium ${isInactive
                            ? "text-slate-500"
                            : isOutOfStock
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                      >
                        {availabilityLabel}
                      </p>

                      <div className="mt-3 flex gap-2">
                        {isInactive ? (
                          <button
                            type="button"
                            disabled
                            className="cursor-not-allowed flex h-8 flex-1 items-center justify-center rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-400"
                            aria-label="Currently unavailable"
                            title="Currently unavailable"
                          >
                            <span className="truncate">Currently unavailable</span>
                          </button>
                        ) : isOutOfStock ? (
                          <button
                            type="button"
                            disabled
                            className="cursor-not-allowed flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 px-2 text-xs font-bold text-slate-400"
                            aria-label="Out of stock"
                            title="Out of stock"
                          >
                            <ShoppingCart size={14} />
                            <span className="truncate">Out of Stock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product.productId)}
                            className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 px-2 text-xs font-bold text-primary transition hover:bg-blue-100 active:scale-95"
                            aria-label="Add to cart"
                            title="Cart"
                          >
                            <ShoppingCart size={14} />
                            <span className="truncate">Cart</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveFromWishlist(product.productId)
                          }
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            "bg-red-50 text-red-500",
                            "transition hover:bg-red-100 active:scale-95",
                          ].join(" ")}
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                "text-sm font-extrabold text-light-slate",
                "transition hover:bg-light-slate/20 active:scale-[0.99]",
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