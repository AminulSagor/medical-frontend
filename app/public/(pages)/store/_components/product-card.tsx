"use client";

import { useState } from "react";
import { PublicProduct } from "@/types/public/product/public-product.types";
import Button from "@/components/buttons/button";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { ShoppingCart, Heart } from "lucide-react";

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

  const wishlisted = isInWishlist(product.id);

  const hasBooleanStock = typeof product.inStock === "boolean";
  const stockQuantity = product.stockQuantity;
  const hasValidStockQuantity =
    typeof stockQuantity === "number" && !Number.isNaN(stockQuantity);

  const isOut = hasBooleanStock
    ? !product.inStock && !product.backorder
    : hasValidStockQuantity
      ? stockQuantity <= 0 && !product.backorder
      : false;

  const isBackorderAvailable =
    product.backorder &&
    ((hasBooleanStock && !product.inStock) ||
      (hasValidStockQuantity && stockQuantity <= 0));

  const isLowStock =
    hasValidStockQuantity && stockQuantity > 0 && stockQuantity <= 10;

  const stockLabel = (() => {
    if (isOut) {
      return "Out of stock";
    }

    if (isBackorderAvailable) {
      return "Available on backorder";
    }

    if (isLowStock) {
      return `Only ${stockQuantity} left`;
    }

    return "In stock";
  })();

  if (!product.name && process.env.NODE_ENV === "development") {
    console.warn("ProductCard: Missing product name", {
      productId: product.id,
      product,
    });
  }

  if (
    !product.actualPrice &&
    !product.offerPrice &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn("ProductCard: Missing price data", {
      productId: product.id,
      product,
    });
  }

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isAddingToCart || isOut) return;

    try {
      setIsAddingToCart(true);
      await addItem(product.id, 1);
    } catch (error) {
      console.error("Failed to add product to cart", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-light-slate/10 bg-white shadow-sm transition-shadow hover:shadow-md md:rounded-2xl">
      <Link
        href={`/public/store/product-details/${product.id}`}
        className="relative block flex-shrink-0"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-light-slate/5 to-light-slate/10 md:aspect-video">
          <Image
            src={
              product.thumbnail ||
              product.images?.[0] ||
              "/photos/store_product.png"
            }
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
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
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:scale-110 active:scale-95 md:right-4 md:top-4"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-slate-400 hover:text-red-400"
            }
          />
        </button>

        {isOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-4 py-2 text-xs font-extrabold tracking-widest text-red-600 md:text-sm">
              OUT OF STOCK
            </span>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-grow flex-col p-4 md:p-6">
        <div className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-primary/70 md:text-[10px]">
          {product.tags?.[0] || product.brand || "Equipment"}
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-bold text-slate-900 md:text-lg">
          {product.name || "Unnamed Product"}
        </h3>

        {product.clinicalDescription && product.clinicalDescription.trim() ? (
          <p className="mb-3 flex-grow line-clamp-2 text-xs leading-relaxed text-light-slate md:text-sm">
            {product.clinicalDescription}
          </p>
        ) : product.sku ? (
          <p className="mb-3 flex-grow text-xs text-light-slate md:text-sm">
            SKU: {product.sku}
          </p>
        ) : null}

        <div className="mb-4 border-t border-light-slate/10 pt-2">
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
            className={`mt-1 text-xs ${isOut
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

        {isOut ? (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            Out of Stock
          </Button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 md:py-3 md:text-sm"
          >
            <ShoppingCart size={16} />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}