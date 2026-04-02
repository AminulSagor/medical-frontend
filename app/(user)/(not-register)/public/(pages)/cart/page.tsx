"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Lock,
  Minus,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";
import Link from "next/link";

/* =========================
   Types +
========================= */
type CartItem = {
  id: string;
  title: string;
  sku: string;
  price: number;
  qty: number;
  imageUrl: string;
  inStockLabel: string;
};

const SEED: CartItem[] = [
  {
    id: "c1",
    title: "Nitrile Exam Gloves",
    sku: "NEG-200-BL",
    price: 12.99,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
    inStockLabel: "In Stock",
  },
  {
    id: "c2",
    title: "Digital Otoscope Pro",
    sku: "DOP-X500",
    price: 145.0,
    qty: 1,
    imageUrl: IMAGE.hand_gloves,
    inStockLabel: "In Stock",
  },
  {
    id: "c3",
    title: "Kelly Forceps - Curved",
    sku: "SURG-KF-55C",
    price: 18.75,
    qty: 2,
    imageUrl: IMAGE.hand_gloves,
    inStockLabel: "In Stock",
  },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(SEED);
  const [promo, setPromo] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.qty, 0);
  }, [items]);

  const estimatedTax = 15.64;
  const orderTotal = subtotal + estimatedTax;

  const itemCount = useMemo(() => items.length, [items.length]);

  const bumpQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="min-h-screen mt-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-light-slate shadow-sm transition-all hover:bg-light-slate/10 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-black">
            Your Shopping Cart ({itemCount} Items)
          </h1>
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Items table */}
          <div className="lg:col-span-8 overflow-hidden rounded-3xl shadow-sm border border-light-slate/10 bg-white pt-2">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-[11px] font-bold tracking-widest text-light-slate">
              <div className="col-span-7">PRODUCT DETAILS</div>
              <div className="col-span-2 text-right">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-1 text-right">TOTAL</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 gap-3 px-6 py-6">
                  {/* Product details */}
                  <div className="col-span-7 flex items-start gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-light-slate/10 ring-1 ring-slate-200">
                      <Image
                        src={it.imageUrl}
                        alt={it.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-black">
                        {it.title}
                      </div>

                      <div className="mt-1 text-xs text-light-slate">
                        SKU: {it.sku}
                      </div>

                      <div className="mt-2 inline-flex items-center gap-2 text-xs">
                        <span className="text-green-500">
                          {it.inStockLabel}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-6 text-xs">
                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          className="inline-flex items-center gap-2 text-red-500 hover:opacity-80"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 text-light-slate hover:text-black"
                        >
                          <Bookmark className="h-4 w-4" />
                          Save for Later
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center justify-end">
                    <div className="text-sm text-black">{money(it.price)}</div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2">
                      <button
                        type="button"
                        onClick={() => bumpQty(it.id, -1)}
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-light-slate/10 active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-light-slate" />
                      </button>

                      <div className="w-6 text-center text-sm font-bold text-black">
                        {it.qty}
                      </div>

                      <button
                        type="button"
                        onClick={() => bumpQty(it.id, 1)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-light-slate/10 active:scale-95"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4 text-light-slate" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 flex items-center justify-end">
                    <div className="text-sm font-bold text-black">
                      {money(it.price * it.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <Card className="lg:col-span-4">
            <div className="text-lg font-bold text-black">Order Summary</div>
            <div className="mt-4 border-t border-slate-100" />

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-light-slate">
                <span>Subtotal</span>
                <span className="font-bold text-black">{money(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-light-slate">
                <span>Estimated Shipping</span>
                <span className="text-xs italic text-light-slate">
                  Calculated in next step
                </span>
              </div>

              <div className="flex items-center justify-between text-light-slate">
                <span>Estimated Tax</span>
                <span className="font-bold text-black">
                  {money(estimatedTax)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-bold tracking-widest text-light-slate">
                PROMO CODE
              </div>

              <div className="mt-3 flex items-center gap-3">
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="Enter code"
                  className="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-black outline-none placeholder:text-light-slate focus:border-primary"
                />
                <Button variant="secondary" shape="pill" className="h-10 px-5">
                  Apply
                </Button>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-end justify-between">
                <div className="text-sm font-bold text-black">Order Total</div>
                <div className="text-2xl font-bold text-black">
                  {money(orderTotal)}
                </div>
              </div>

              <Link href={"/public/checkout"}>
                <Button className="mt-5 h-14 w-full bg-primary text-white shadow-sm">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-light-slate">
                <Lock className="h-4 w-4" />
                Secure Checkout
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                  VISA
                </span>
                <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                  MC
                </span>
                <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                  AMEX
                </span>
                <span className="rounded-md bg-light-slate/10 px-3 py-1 text-[10px] text-light-slate">
                  PAYPAL
                </span>
              </div>
            </div>
          </Card>

          {/* Bottom right shipping note */}
          <div className="lg:col-span-8 hidden lg:block" />

          <Card className="lg:col-span-4 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-bold text-black">
                  Free Shipping on orders over $500
                </div>
                <div className="mt-1 text-xs text-light-slate">
                  Add <span className="text-primary">$288.87</span> more to your
                  cart to qualify.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
