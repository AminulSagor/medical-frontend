"use client";

import { PublicProduct } from "@/types/public/product/public-product.types";
import Button from "@/components/buttons/button";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/public/context/cart-context";
import { ShoppingCart } from "lucide-react";

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
  const isOut = product.stockQuantity <= 0;

  // Debug logging to see what data is being received
  if (!product.name && process.env.NODE_ENV === 'development') {
    console.warn('ProductCard: Missing product name', { productId: product.id, product });
  }
  if (!product.actualPrice && !product.offerPrice && process.env.NODE_ENV === 'development') {
    console.warn('ProductCard: Missing price data', { productId: product.id, product });
  }

  return (
    <div className="group rounded-xl md:rounded-2xl border border-light-slate/10 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image Section */}
      <Link
        href={`/public/store/product-details/${product.id}`}
        className="relative block flex-shrink-0"
      >
        <div className="relative w-full aspect-square md:aspect-video bg-gradient-to-br from-light-slate/5 to-light-slate/10 overflow-hidden">
          <Image
            src={product.thumbnail || product.images?.[0] || "/photos/store_product.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </div>

        {/* Badges */}
        <div className="absolute left-3 md:left-4 top-3 md:top-4 flex flex-col gap-2">
          {product.tags && product.tags.length > 0 && (
            <>
              {product.tags[0].toLowerCase() === 'bestseller' ? (
                <Badge text="BEST SELLER" />
              ) : (
                <Badge text={product.tags[0]} />
              )}
              {product.tags[1] && (
                <Badge text={product.tags[1]} />
              )}
            </>
          )}
        </div>

        {/* Out of Stock */}
        {isOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-lg bg-white px-4 py-2 text-xs md:text-sm font-extrabold tracking-widest text-red-600">
              OUT OF STOCK
            </span>
          </div>
        ) : null}
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4 md:p-6">
        {/* Category Badge */}
        <div className="text-[9px] md:text-[10px] font-extrabold tracking-wider text-primary/70 uppercase mb-2">
          {product.tags?.[0] || product.brand || 'Equipment'}
        </div>

        {/* Product Name - Make it prominent */}
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2 line-clamp-2">
          {product.name || 'Unnamed Product'}
        </h3>

        {/* Description or SKU */}
        {product.clinicalDescription && product.clinicalDescription.trim() ? (
          <p className="text-xs md:text-sm leading-relaxed text-light-slate line-clamp-2 mb-3 flex-grow">
            {product.clinicalDescription}
          </p>
        ) : product.sku ? (
          <p className="text-xs md:text-sm text-light-slate mb-3 flex-grow">
            SKU: {product.sku}
          </p>
        ) : null}

        {/* Price Section - Make it prominent */}
        <div className="mb-4 pt-2 border-t border-light-slate/10">
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl font-extrabold text-slate-900">
              {money(product.offerPrice || product.actualPrice)}
            </div>
            {product.offerPrice && product.actualPrice !== product.offerPrice ? (
              <div className="text-xs md:text-sm text-light-slate line-through">
                {money(product.actualPrice)}
              </div>
            ) : null}
          </div>
          {product.stockQuantity > 0 && product.stockQuantity <= 10 ? (
            <p className="text-xs text-orange-600 mt-1">Only {product.stockQuantity} left</p>
          ) : null}
        </div>

        {/* Add to Cart Button */}
        {isOut ? (
          <Button variant="secondary" size="sm" className="w-full">
            Out of Stock
          </Button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id, 1);
            }}
            className="w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white transition flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
