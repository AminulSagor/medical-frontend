"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Button from "@/components/buttons/button";
import {
  CartCalculateRequest,
  CartCalculateResponse,
} from "@/types/public/cart/cart.types";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { calculateCart } from "@/service/public/cart.service";
import { reorderBackendCart } from "@/service/public/cart-server.service";
import { getProductDetails } from "@/service/public/product.service";
import CartItemRow from "./cart-item-row";
import CartOrderSummaryCard from "./cart-order-summary-card";
import CartShippingInfoCard from "./cart-shipping-info-card";

export function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reorderFrom = searchParams.get("reorderFrom");

  const {
    items,
    updateQty,
    removeItem,
    totalItems,
    syncItems,
    pruneItems,
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [calculatedData, setCalculatedData] =
    useState<CartCalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const hasCalculatedOnceRef = useRef(false);

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
      hasCalculatedOnceRef.current = false;
      return;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const validItems = items.filter((i) => uuidRegex.test(i.productId));

    if (validItems.length === 0) {
      setCalculatedData(null);
      hasCalculatedOnceRef.current = false;
      return;
    }

    const timeout = setTimeout(async () => {
      if (!hasCalculatedOnceRef.current) {
        setLoading(true);
      }

      try {
        const payload: CartCalculateRequest = {
          items: validItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        };

        const data = await calculateCart(payload);

        const validatedItems = await Promise.all(
          data.items.map(async (item) => {
            try {
              await getProductDetails(item.productId);
              return item;
            } catch {
              return null;
            }
          }),
        );

        const existingItems = validatedItems.filter(
          (item): item is typeof data.items[number] => item !== null,
        );

        const availableItems = existingItems.filter((item) => {
          const hasStock =
            typeof item.availableQuantity === "number"
              ? item.availableQuantity > 0
              : true;

          return item.inStock && hasStock;
        });

        const unavailableProductIds = existingItems
          .filter(
            (item) =>
              !availableItems.some((a) => a.productId === item.productId),
          )
          .map((item) => item.productId);

        const newData: CartCalculateResponse = {
          ...data,
          items: availableItems,
        };

        setCalculatedData(newData);
        hasCalculatedOnceRef.current = true;

        const normalizedItems = availableItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }));

        const hasMismatch =
          normalizedItems.length !== validItems.length ||
          normalizedItems.some((item) => {
            const current = validItems.find(
              (v) => v.productId === item.productId,
            );
            return !current || current.quantity !== item.quantity;
          });

        if (hasMismatch) {
          syncItems(normalizedItems);
        }

        if (unavailableProductIds.length > 0) {
          await pruneItems(unavailableProductIds);
        }
      } catch (err) {
        console.error("Failed to calculate cart", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [items, pruneItems, syncItems]);

  const hasInvalidQuantity = useMemo(() => {
    if (!calculatedData?.items?.length) return false;

    return calculatedData.items.some((item) => {
      const cartItem = items.find((i) => i.productId === item.productId);
      if (!cartItem) return false;

      return (
        typeof item.availableQuantity === "number" &&
        cartItem.quantity > item.availableQuantity
      );
    });
  }, [calculatedData, items]);

  return (
    <div className="mt-24 min-h-screen">
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
            <div className="overflow-hidden rounded-3xl border border-light-slate/10 bg-white pt-2 shadow-sm lg:col-span-8">
              <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-[11px] font-bold tracking-widest text-light-slate">
                <div className="col-span-7">PRODUCT DETAILS</div>
                <div className="col-span-2 text-right">PRICE</div>
                <div className="col-span-2 text-center">QUANTITY</div>
                <div className="col-span-1 text-right">TOTAL</div>
              </div>

              <div className="relative min-h-[200px] divide-y divide-slate-100">
                {loading && !calculatedData && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}

                {loading && calculatedData && (
                  <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}

                {items.map((cartItem) => {
                  const it = calculatedData?.items.find(
                    (i) => i.productId === cartItem.productId,
                  );

                  if (!it) return null;

                  return (
                    <CartItemRow
                      key={cartItem.productId}
                      item={it}
                      quantity={cartItem.quantity}
                      onRemove={() => removeItem(it.productId)}
                      onSaveForLater={() => {
                        toggleWishlist(it.productId);
                        removeItem(it.productId);
                      }}
                      onDecrease={() =>
                        updateQty(cartItem.productId, cartItem.quantity - 1)
                      }
                      onIncrease={() =>
                        updateQty(cartItem.productId, cartItem.quantity + 1)
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <CartOrderSummaryCard
                calculatedData={calculatedData}
                hasInvalidQuantity={hasInvalidQuantity}
              />
              <CartShippingInfoCard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}