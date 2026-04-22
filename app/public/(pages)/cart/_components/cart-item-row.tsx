"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import type { CartResponseItem } from "@/types/public/cart/cart.types";
import { money } from "./cart-page-content";

interface CartItemRowProps {
    item: CartResponseItem;
    quantity: number;
    onRemove: () => void;
    onSaveForLater: () => void;
    onDecrease: () => void;
    onIncrease: () => void;
}

export default function CartItemRow({
    item,
    quantity,
    onRemove,
    onSaveForLater,
    onDecrease,
    onIncrease,
}: CartItemRowProps) {
    const productDetailsHref = `/public/store/product-details/${item.productId}`;

    const maxAvailableQuantity =
        typeof item.availableQuantity === "number" &&
            !Number.isNaN(item.availableQuantity)
            ? item.availableQuantity
            : Number.POSITIVE_INFINITY;

    const hasReachedMaxQuantity =
        Number.isFinite(maxAvailableQuantity) && quantity >= maxAvailableQuantity;

    return (
        <div className="grid grid-cols-12 gap-3 px-6 py-6">
            <div className="col-span-7 flex items-start gap-4">
                <Link
                    href={productDetailsHref}
                    className="relative block h-16 w-16 overflow-hidden rounded-2xl bg-light-slate/10 ring-1 ring-slate-200 transition-opacity hover:opacity-90"
                >
                    <Image
                        src={item.photo || "/photos/store_product.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                </Link>

                <div className="min-w-0">
                    <Link
                        href={productDetailsHref}
                        className="block truncate text-sm font-bold text-black transition-colors hover:text-primary"
                    >
                        {item.name}
                    </Link>

                    <div className="mt-1 text-xs text-light-slate">SKU: {item.sku}</div>

                    <div className="mt-2 inline-flex items-center gap-2 text-xs">
                        <span className="text-green-500">In Stock</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-6 text-xs">
                        <button
                            type="button"
                            onClick={onRemove}
                            className="inline-flex items-center gap-2 text-red-500 hover:opacity-80"
                        >
                            <Trash2 className="h-4 w-4" />
                            Remove
                        </button>

                        <button
                            type="button"
                            onClick={onSaveForLater}
                            className="inline-flex items-center gap-2 text-light-slate hover:text-red-400"
                        >
                            <Heart className="h-4 w-4" />
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-span-2 flex items-center justify-end">
                <div className="text-sm text-black">{money(Number(item.price))}</div>
            </div>

            <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2">
                    <button
                        type="button"
                        onClick={onDecrease}
                        disabled={quantity <= 1}
                        className={[
                            "inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-light-slate/10 transition-all",
                            quantity <= 1
                                ? "pointer-events-none cursor-not-allowed opacity-50"
                                : "active:scale-95",
                        ].join(" ")}
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-4 w-4 text-light-slate" />
                    </button>

                    <div className="w-6 text-center text-sm font-bold text-black">
                        {quantity}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (hasReachedMaxQuantity) return;
                            onIncrease();
                        }}
                        disabled={hasReachedMaxQuantity}
                        className={[
                            "inline-flex h-8 w-8 items-center justify-center rounded-full transition-all",
                            hasReachedMaxQuantity
                                ? "cursor-not-allowed opacity-50"
                                : "hover:bg-light-slate/10 active:scale-95",
                        ].join(" ")}
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-4 w-4 text-light-slate" />
                    </button>
                </div>

                {Number.isFinite(maxAvailableQuantity) &&
                    quantity > maxAvailableQuantity ? (
                    <p className="mt-1 text-[10px] text-red-500">
                        Only {maxAvailableQuantity} available
                    </p>
                ) : null}
            </div>

            <div className="col-span-1 flex items-center justify-end">
                <div className="text-sm font-bold text-black">
                    {money(Number(item.itemTotal))}
                </div>
            </div>
        </div>
    );
}