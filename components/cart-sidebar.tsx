"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import {
  DUMMY_CART_ITEMS,
  DUMMY_UPSELL,
} from "@/app/(user)/(not-register)/public/data/cart.data";
import type { CartItem } from "@/app/(user)/(not-register)/public/types/cart.type";

export default function CartSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsClient(true));
  }, []);

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
        <div className="px-6 pt-6 pb-4">
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
                  5 item
                </span>
              </div>
            </div>

            <button type="button" onClick={onClose} className={iconBtn()}>
              <X size={18} className="text-light-slate" />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-light-slate/10" />

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="space-y-6">
            {DUMMY_CART_ITEMS.map((it) => (
              <CartRow key={it.id} it={it} />
            ))}
          </div>

          <div className="mt-10">
            <div className="text-[11px] font-extrabold tracking-widest text-light-slate/70">
              FREQUENTLY BOUGHT TOGETHER
            </div>

            <div className="mt-4 rounded-2xl border border-light-slate/15 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-light-slate/10">
                  <Image
                    src={DUMMY_UPSELL.imageUrl}
                    alt={DUMMY_UPSELL.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-black">
                    {DUMMY_UPSELL.name}
                  </div>
                  <div className="text-xs font-semibold text-light-slate">
                    {money(DUMMY_UPSELL.price)}
                  </div>
                </div>

                <button
                  type="button"
                  className={[
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "border border-light-slate/20 bg-white",
                    "hover:bg-light-slate/5 active:scale-95 transition",
                  ].join(" ")}
                  aria-label="Add"
                >
                  <Plus size={18} className="text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-light-slate/10 bg-white px-6 pt-5 pb-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-light-slate">
              <span>Subtotal</span>
              <span className="font-bold text-black">$145.00</span>
            </div>

            <div className="flex items-center justify-between text-light-slate">
              <span>Taxes (Calculated at checkout)</span>
              <span className="font-bold text-light-slate">--</span>
            </div>

            <div className="h-px w-full bg-light-slate/10" />

            <div className="flex items-end justify-between">
              <span className="text-lg font-extrabold text-black">Total</span>
              <span className="text-lg font-extrabold text-black">$145.00</span>
            </div>
          </div>

          <button
            type="button"
            className={[
              "mt-5 w-full rounded-2xl bg-primary px-6 py-4",
              "text-white text-base font-extrabold",
              "hover:opacity-90 active:scale-[0.99] transition",
              "inline-flex items-center justify-center gap-2",
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
    document.body
  );
}

function CartRow({ it }: { it: CartItem }) {
  return (
    <div className="flex gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-light-slate/10">
        <Image
          src={it.imageUrl}
          alt={it.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-black">
              {it.name}
            </div>
            <div className="mt-1 text-xs font-semibold text-light-slate">
              Ref: {it.ref}
            </div>
          </div>

          <div className="text-sm font-extrabold text-black">
            {money(it.price)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <QtyPill />
          <button
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

function QtyPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-light-slate/15 bg-white px-2 py-1">
      <button type="button" className={iconBtn()} aria-label="Decrease">
        <Minus size={16} className="text-light-slate" />
      </button>

      <div className="w-10 text-center text-sm font-bold text-black">1</div>

      <button type="button" className={iconBtn()} aria-label="Increase">
        <Plus size={16} className="text-primary" />
      </button>
    </div>
  );
}

function iconBtn() {
  return [
    "inline-flex items-center justify-center",
    "h-9 w-9 rounded-full",
    " bg-white",
    "hover:bg-light-slate/5 active:scale-95 transition",
  ].join(" ");
}

function money(v: number) {
  return `$${v.toFixed(2)}`;
}