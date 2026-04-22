"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { useCart } from "@/app/public/context/cart-context";
import { calculateCart } from "@/service/public/cart.service";
import { getProductDetails } from "@/service/public/product.service";
import type {
  CartCalculateRequest,
  CartCalculateResponse,
  CartResponseItem,
} from "@/types/public/cart/cart.types";
import { Loader2 } from "lucide-react";
import NetworkImageFallback from "@/utils/network-image-fallback";

export default function CartSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { items, updateQty, removeItem, totalItems, syncItems, pruneItems } =
    useCart();
  const [calculatedData, setCalculatedData] =
    useState<CartCalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const hasCalculatedOnceRef = useRef(false);

  useEffect(() => {
    queueMicrotask(() => setIsClient(true));
  }, []);

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
              !availableItems.some(
                (available) => available.productId === item.productId,
              ),
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
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <ShoppingBag size={18} className="text-primary" />
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-base font-extrabold text-black">
                  Your Cart
                </h2>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <button type="button" onClick={onClose} className={iconBtn()}>
              <X size={18} className="text-light-slate" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-light-slate/10" />

        <div className="relative flex-1 overflow-auto px-6 py-5">
          {loading && !calculatedData && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center opacity-70">
              <ShoppingBag className="mb-4 h-12 w-12 text-light-slate" />
              <div className="text-lg font-bold text-black">
                Your cart is empty
              </div>
              <div className="mt-2 text-sm text-light-slate">
                Add items to proceed to checkout.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {loading && calculatedData && (
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}

              {items.map((cartItem) => {
                const it = calculatedData?.items.find(
                  (i) => i.productId === cartItem.productId,
                );

                if (!it) return null;

                return (
                  <CartRow
                    key={cartItem.productId}
                    it={it}
                    quantity={cartItem.quantity}
                    onRemove={() => removeItem(it.productId)}
                    onUpdateQty={(q) => updateQty(it.productId, q)}
                    onOpenDetails={() => {
                      onClose();
                      router.push(`/public/store/product-details/${it.productId}`);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-light-slate/10 bg-white px-6 pb-6 pt-5">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-light-slate">
              <span>Subtotal</span>
              <span className="font-bold text-black">
                {money(Number(calculatedData?.orderSummary?.subtotal || 0))}
              </span>
            </div>

            <div className="flex items-center justify-between text-light-slate">
              <span>Taxes (Calculated at checkout)</span>
              <span className="font-bold text-light-slate">
                {money(Number(calculatedData?.orderSummary?.estimatedTax || 0))}
              </span>
            </div>

            <div className="h-px w-full bg-light-slate/10" />

            <div className="flex items-end justify-between">
              <span className="text-lg font-extrabold text-black">Total</span>
              <span className="text-lg font-extrabold text-black">
                {money(Number(calculatedData?.orderSummary?.orderTotal || 0))}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              router.push("/public/cart");
            }}
            className={[
              "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-extrabold text-white",
              "transition hover:opacity-90 active:scale-[0.99]",
              items.length === 0
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "",
            ].join(" ")}
          >
            Checkout Now
            <ArrowRight size={18} />
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-light-slate">
            <Lock size={14} />
            Secure Encrypted Transaction
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function CartRow({
  it,
  quantity,
  onRemove,
  onUpdateQty,
  onOpenDetails,
}: {
  it: CartResponseItem;
  quantity: number;
  onRemove: () => void;
  onUpdateQty: (q: number) => void;
  onOpenDetails: () => void;
}) {
  const maxAvailableQuantity =
    typeof it.availableQuantity === "number" &&
      !Number.isNaN(it.availableQuantity)
      ? it.availableQuantity
      : Number.POSITIVE_INFINITY;

  const hasReachedMaxQuantity =
    Number.isFinite(maxAvailableQuantity) && quantity >= maxAvailableQuantity;

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onOpenDetails}
        className="relative h-20 w-20 overflow-hidden rounded-2xl bg-light-slate/10"
        aria-label={`Open details for ${it.name}`}
      >
        <NetworkImageFallback
          src={it.photo || ""}
          alt={it.name}
          className="h-full w-full object-cover"
          fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
          iconClassName="h-6 w-6"
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={onOpenDetails}
              className="block max-w-full text-left"
            >
              <div className="truncate text-sm font-bold text-black transition-colors hover:text-primary">
                {it.name}
              </div>
            </button>

            <div className="mt-1 text-xs font-semibold text-light-slate">
              Ref: {it.sku}
            </div>
          </div>

          <div className="text-sm font-extrabold text-black">
            {money(Number(it.itemTotal))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 rounded-full border border-light-slate/15 bg-white px-2 py-1">
              <button
                onClick={() => onUpdateQty(quantity - 1)}
                disabled={quantity <= 1}
                type="button"
                className={[
                  iconBtn(),
                  quantity <= 1
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "",
                ].join(" ")}
                aria-label="Decrease"
              >
                <Minus size={16} className="text-light-slate" />
              </button>

              <div className="w-10 text-center text-sm font-bold text-black">
                {quantity}
              </div>

              <button
                onClick={() => {
                  if (hasReachedMaxQuantity) return;
                  onUpdateQty(quantity + 1);
                }}
                disabled={hasReachedMaxQuantity}
                type="button"
                className={[
                  iconBtn(),
                  hasReachedMaxQuantity
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "",
                ].join(" ")}
                aria-label="Increase"
              >
                <Plus size={16} className="text-primary" />
              </button>
            </div>

            {hasReachedMaxQuantity ? (
              <p className="mt-1 text-[10px] text-red-500">
                Max available quantity reached
              </p>
            ) : null}
          </div>

          <button
            onClick={onRemove}
            type="button"
            className="text-xs font-semibold text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function iconBtn() {
  return [
    "inline-flex items-center justify-center",
    "h-9 w-9 rounded-full",
    "bg-white",
    "transition hover:bg-light-slate/5 active:scale-95",
  ].join(" ");
}

function money(v: number) {
  return `$${v.toFixed(2)}`;
}