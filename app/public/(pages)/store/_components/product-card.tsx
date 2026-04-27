"use client";

import { useEffect, useState } from "react";
import { PublicProduct } from "@/types/public/product/public-product.types";
import Button from "@/components/buttons/button";
import Link from "next/link";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { ShoppingCart, Heart, ImageOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { IMAGE } from "@/constant/image-config";

interface Props {
  product: PublicProduct;
}

function money(v: string | null | undefined) {
  if (!v) return "$0.00";
  const num = parseFloat(v);
  if (isNaN(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-primary">
      {text}
    </span>
  );
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wishlisted = isInWishlist(product.id);

  const hasBooleanStock = typeof product.inStock === "boolean";
  const stockQuantity = product.stockQuantity;
  const hasValidStockQuantity =
    typeof stockQuantity === "number" && !Number.isNaN(stockQuantity);

  const isInactive = product.isActive === false;

  const isOut = hasBooleanStock
    ? !product.inStock && !product.backorder
    : hasValidStockQuantity
      ? stockQuantity <= 0 && !product.backorder
      : false;

  const isBackorderAvailable =
    !isInactive &&
    product.backorder &&
    ((hasBooleanStock && !product.inStock) ||
      (hasValidStockQuantity && stockQuantity <= 0));

  const isLowStock =
    !isInactive &&
    hasValidStockQuantity &&
    stockQuantity > 0 &&
    stockQuantity <= 10;

  const stockLabel = (() => {
    if (isInactive) return "Currently unavailable";
    if (isOut) return "Out of stock";
    if (isBackorderAvailable) return "Available on backorder";
    if (isLowStock) return `Only ${stockQuantity} left`;
    return "In stock";
  })();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart || isOut || isInactive) return;

    try {
      setIsAddingToCart(true);
      await addItem(product.id, 1);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add product to cart", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  const imageSrc = product.thumbnail || product.images?.[0] || "";
  const description =
    product.clinicalDescription?.trim() || product.sku?.trim() || "";

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc, product.id]);

  // Button show condition: hovered AND (not inactive AND not out of stock)
  const showAddToCartButton = isHovered && !isInactive && !isOut;
  // Show out of stock button on hover when product is inactive OR out of stock
  const showOutOfStockButton = isHovered && (isInactive || isOut);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-light-slate/10 bg-white shadow-sm transition-shadow hover:shadow-md md:rounded-2xl"
    >
      <Link
        href={`/public/store/product-details/${product.id}`}
        className="flex h-full flex-col"
      >
        <div className="relative block w-full overflow-hidden">
          <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-light-slate/5 to-light-slate/10 md:aspect-video">
            {imageSrc && !imageFailed ? (
              <img
                src={imageSrc || IMAGE.fallbackImage}
                alt={product.name || "Product image"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-2 text-light-slate/40">
                  <ImageOff className="h-10 w-10 md:h-12 md:w-12" />
                  <span className="text-xs font-medium">Image unavailable</span>
                </div>
              </div>
            )}
          </div>

          <div className="absolute left-3 top-3 flex flex-col gap-2 md:left-4 md:top-4">
            {product.tags && product.tags.length > 0 && (
              <>
                {product.tags[0].toLowerCase() === "bestseller" ? (
                  <Badge text="BEST SELLER" />
                ) : (
                  <Badge text={product.tags[0]} />
                )}
                {product.tags[1] && <Badge text={product.tags[1]} />}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 md:right-4 md:top-4"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={
                wishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-slate-400 transition-colors hover:text-red-400"
              }
            />
          </button>

          {isOut && !isHovered ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-lg bg-white px-4 py-2 text-xs font-extrabold tracking-widest text-red-600 md:text-sm">
                OUT OF STOCK
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-grow flex-col p-4 md:p-6">
          {/* Fixed height section for consistent card sizing */}
          <div className="flex flex-1 flex-col">
            {/* Brand/Tag - Fixed height */}
            <div className="mb-2 h-4">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-primary/70 md:text-[10px]">
                {product.tags?.[0] || product.brand || "Equipment"}
              </div>
            </div>

            {/* Title - Fixed height with 2 lines max */}
            <div className="mb-2 h-12 md:h-14">
              <h3 className="line-clamp-2 text-base font-bold text-slate-900 md:text-lg">
                {product.name || "Unnamed Product"}
              </h3>
            </div>

            {/* Description - Fixed height with 2 lines max */}
            <div className="mb-3 h-10 md:h-12">
              {description ? (
                <p className="line-clamp-2 text-xs leading-relaxed text-light-slate md:text-sm">
                  {product.clinicalDescription?.trim()
                    ? product.clinicalDescription
                    : `SKU: ${product.sku}`}
                </p>
              ) : (
                <div aria-hidden="true" className="h-full w-full" />
              )}
            </div>

            {/* Price and Stock Section - Fixed height */}
            <div className="mb-4 h-16 border-t border-light-slate/10 pt-2">
              <div className="flex items-center gap-2">
                <div className="text-lg font-extrabold text-slate-900 md:text-xl">
                  {money(product.offerPrice || product.actualPrice)}
                </div>

                {product.offerPrice &&
                product.actualPrice !== product.offerPrice ? (
                  <div className="text-xs text-light-slate line-through md:text-sm">
                    {money(product.actualPrice)}
                  </div>
                ) : null}
              </div>

              <p
                className={`mt-1 text-xs ${
                  isInactive
                    ? "text-slate-500"
                    : isOut
                      ? "text-red-600"
                      : isLowStock
                        ? "text-orange-600"
                        : isBackorderAvailable
                          ? "text-sky-600"
                          : "text-green-600"
                }`}
              >
                {stockLabel}
              </p>
            </div>
          </div>

          {/* Button Section - NO empty space initially, appears on hover from bottom */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {showAddToCartButton && (
                <motion.div
                  key="add-to-cart"
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 20, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 md:py-3 md:text-sm"
                  >
                    <ShoppingCart size={16} />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </motion.div>
              )}

              {showOutOfStockButton && (
                <motion.div
                  key="out-of-stock"
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 20, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    {isInactive ? "Currently unavailable" : "Out of Stock"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
