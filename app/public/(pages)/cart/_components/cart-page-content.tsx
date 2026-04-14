"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Lock,
  Minus,
  Plus,
  Trash2,
  Truck,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";

import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { calculateCart } from "@/service/public/cart.service";
import { reorderBackendCart } from "@/service/public/cart-server.service";
import type {
  CartCalculateRequest,
  CartCalculateResponse,
} from "@/types/public/cart/cart.types";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reorderFrom = searchParams.get("reorderFrom");

  const { items, updateQty, removeItem, totalItems, syncItems } = useCart();
  const { toggleWishlist } = useWishlist();
  const [promo, setPromo] = useState("");

  const [calculatedData, setCalculatedData] =
    useState<CartCalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reorderFrom) return;

    const applyReorder = async () => {
      setLoading(true);

      try {
        const data = await reorderBackendCart({
          orderId: reorderFrom,
        });

        syncItems(
          data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        );

        router.replace("/public/cart");
      } catch (error) {
        console.error("Failed to reorder cart", error);
      } finally {
        setLoading(false);
      }
    };

    applyReorder();
  }, [reorderFrom, router, syncItems]);

  useEffect(() => {
    if (items.length === 0) {
      setCalculatedData(null);
      return;
    }

    const fetchCalculation = async () => {
      setLoading(true);
      try {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const validItems = items.filter((i) => uuidRegex.test(i.productId));

        if (validItems.length === 0) {
          setCalculatedData(null);
          return;
        }

        const payload: CartCalculateRequest = {
          items: validItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        };
        const data = await calculateCart(payload);
        setCalculatedData(data);
        syncItems(
          data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        );
      } catch (err) {
        console.error("Failed to calculate cart", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculation();
  }, [items, syncItems]);

  return (
    <div className="min-h-screen mt-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/public/store"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-light-slate shadow-sm transition-all hover:bg-light-slate/10 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-black">
            Your Shopping Cart ({totalItems} Items)
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-light-slate/10 bg-white py-24 text-center shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-light-slate/10">
              <ShoppingBag className="h-10 w-10 text-light-slate" />
            </div>
            <h2 className="text-2xl font-bold text-black">
              Your cart is empty
            </h2>
            <p className="mt-2 text-light-slate">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link href="/public/store">
              <Button className="mt-8 bg-primary px-8 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 overflow-hidden rounded-3xl shadow-sm border border-light-slate/10 bg-white pt-2">
              <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-[11px] font-bold tracking-widest text-light-slate">
                <div className="col-span-7">PRODUCT DETAILS</div>
                <div className="col-span-2 text-right">PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-1 text-right">TOTAL</div>
              </div>

              <div className="divide-y divide-slate-100 relative min-h-[200px]">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
                {calculatedData?.items.map((it) => (
                  <div
                    key={it.productId}
                    className="grid grid-cols-12 gap-3 px-6 py-6"
                  >
                    <div className="col-span-7 flex items-start gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-light-slate/10 ring-1 ring-slate-200">
                        <Image
                          src={it.photo || "/photos/store_product.png"}
                          alt={it.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-black">
                          {it.name}
                        </div>

                        <div className="mt-1 text-xs text-light-slate">
                          SKU: {it.sku}
                        </div>

                        <div className="mt-2 inline-flex items-center gap-2 text-xs">
                          <span
                            className={
                              it.inStock ? "text-green-500" : "text-orange-500"
                            }
                          >
                            {it.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-6 text-xs">
                          <button
                            type="button"
                            onClick={() => removeItem(it.productId)}
                            className="inline-flex items-center gap-2 text-red-500 hover:opacity-80"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              toggleWishlist(it.productId);
                              removeItem(it.productId);
                            }}
                            className="inline-flex items-center gap-2 text-light-slate hover:text-red-400"
                          >
                            <Heart className="h-4 w-4" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-end">
                      <div className="text-sm text-black">
                        {money(Number(it.price))}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(it.productId, it.quantity - 1)
                          }
                          disabled={it.quantity <= 1}
                          className={[
                            "inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-light-slate/10 transition-all",
                            it.quantity <= 1
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : "active:scale-95",
                          ].join(" ")}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4 text-light-slate" />
                        </button>

                        <div className="w-6 text-center text-sm font-bold text-black">
                          {it.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateQty(it.productId, it.quantity + 1)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-light-slate/10 active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4 text-light-slate" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center justify-end">
                      <div className="text-sm font-bold text-black">
                        {money(Number(it.itemTotal))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card>
                <div className="text-lg font-bold text-black">
                  Order Summary
                </div>
                <div className="mt-4 border-t border-slate-100" />

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-light-slate">
                    <span>Subtotal</span>
                    <span className="font-bold text-black">
                      {money(
                        Number(calculatedData?.orderSummary?.subtotal || 0),
                      )}
                    </span>
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
                      {money(
                        Number(calculatedData?.orderSummary?.estimatedTax || 0),
                      )}
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
                    <Button
                      variant="secondary"
                      shape="pill"
                      className="h-10 px-5"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-end justify-between">
                    <div className="text-sm font-bold text-black">
                      Order Total
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {money(
                        Number(calculatedData?.orderSummary?.orderTotal || 0),
                      )}
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

              <Card className="border-primary/20 bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-black">
                      Free Shipping on orders over $500
                    </div>
                    <div className="mt-1 text-xs text-light-slate">
                      Add <span className="text-primary">$288.87</span> more to
                      your cart to qualify.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
