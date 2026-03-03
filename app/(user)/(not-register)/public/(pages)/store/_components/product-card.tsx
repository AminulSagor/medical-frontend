"use client";

import { Product } from "@/app/(user)/(not-register)/public/types/store.product";
import Button from "@/components/buttons/button";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
  onAdd?: (p: Product) => void;
  onNotify?: (p: Product) => void;
}

function money(v: number) {
  return `$${v.toFixed(2)}`;
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-widest text-primary">
      {text}
    </span>
  );
}

export default function ProductCard({ product, onAdd, onNotify }: Props) {
  const isOut = product.stock === "out_of_stock";

  return (
    <Link
      href={"/public/store/product-details/1234"}
      className="rounded-2xl border border-light-slate/10 shadow-sm overflow-hidden"
    >
      <div className="relative">
        <div className="relative h-52 w-full bg-light-slate/10 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>

        <div className="absolute left-4 top-4 flex gap-2">
          {product.badge ? <Badge text={product.badge} /> : null}
        </div>

        {isOut ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold tracking-widest text-light-slate border border-light-slate/20">
              OUT OF STOCK
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-6">
        <div className="text-[10px] font-extrabold tracking-widest text-light-slate uppercase">
          {product.category}
        </div>

        <div className="mt-2 text-lg font-semibold text-black">
          {product.name}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-light-slate">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-end gap-2">
            <div className="text-lg font-extrabold text-black">
              {money(product.price)}
            </div>

            {product.oldPrice && isOut ? (
              <div className="text-sm font-semibold text-light-slate line-through">
                {money(product.oldPrice)}
              </div>
            ) : null}
          </div>

          {isOut ? (
            <Button variant="secondary" size="sm">
              Notify Me
            </Button>
          ) : (
            <Button size="sm">Add to Cart</Button>
          )}
        </div>
      </div>
    </Link>
  );
}
