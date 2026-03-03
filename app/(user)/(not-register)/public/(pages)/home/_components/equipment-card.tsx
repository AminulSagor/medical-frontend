"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Package } from "lucide-react";
import Card from "@/components/cards/card";
import { Product } from "@/app/(user)/(not-register)/public/types/equipment.types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function categoryToneClass(category: Product["category"]) {
  return "text-primary";
}

export default function ProductCard({
  product,
  onToggleWish,
  onAddToCart,
  wished = false,
}: {
  product: Product;
  wished?: boolean;
  onToggleWish?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}) {
  return (
    <Card
      shape="soft"
      className="relative p-0 overflow-hidden border border-light-slate/15"
    >
      <div>
        {/* wishlist */}
        <button
          type="button"
          onClick={() => onToggleWish?.(product.id)}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-light-slate/20 bg-white hover:bg-light-slate/10 active:scale-95 transition"
          aria-label="Add to wishlist"
        >
          <Heart
            size={16}
            className={wished ? "text-primary" : "text-light-slate"}
          />
        </button>

        {/* image circle */}
        <div className="flex items-center justify-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-light-slate/15">
            {product.imageSrc ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt || product.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <Package className="text-light-slate" size={22} />
            )}
          </div>
        </div>

        {/* category */}
        <p
          className={[
            "mt-6 text-[11px] font-extrabold tracking-[0.18em]",
            categoryToneClass(product.category),
          ].join(" ")}
        >
          {product.category}
        </p>

        {/* title */}
        <h3 className="mt-2 text-base font-semibold text-black">
          {product.title}
        </h3>

        {/* footer row */}
        <div className="mt-5 flex items-end justify-between">
          <div className="text-lg font-bold text-black">
            {money(product.price)}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product.id)}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white hover:opacity-90 active:scale-95 transition"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* clickable overlay */}
      <Link
        href={product.detailsHref}
        className="absolute inset-0"
        aria-label={`View ${product.title}`}
      />
    </Card>
  );
}
