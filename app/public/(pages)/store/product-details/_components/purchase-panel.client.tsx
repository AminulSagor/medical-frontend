"use client";

import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Star,
  CreditCard,
  Heart,
} from "lucide-react";
import { ProductDetails } from "@/app/public/types/product.details";
import Card from "@/components/cards/card";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export default function PurchasePanelClient({
  product,
}: {
  product: ProductDetails;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const wishlisted = isInWishlist(product.id);

  const stars = useMemo(() => {
    const full = Math.round(product.rating.value);
    return Array.from({ length: 5 }).map((_, i) => i < full);
  }, [product.rating.value]);

  const handleBuyNow = async () => {
    if (isProcessingPayment) return;

    try {
      setIsProcessingPayment(true);

      const params = new URLSearchParams({
        mode: "buy-now",
        productId: product.id,
        quantity: String(qty),
      });

      router.push(`/public/checkout?${params.toString()}`);
    } catch (error: any) {
      console.error("Buy now error:", error);
      alert(error.message || "Failed to continue to checkout. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="whitespace-pre-line text-4xl font-bold leading-tight text-black">
        {product.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-light-slate">
        <span>SKU: {product.sku}</span>
        <span className="opacity-50">•</span>
        <span>Category: {product.categoryLabel}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {stars.map((on, idx) => (
            <Star
              key={idx}
              className={`h-4 w-4 ${on ? "text-primary" : "text-slate-200"}`}
              fill={on ? "currentColor" : "none"}
            />
          ))}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-primary">
            {product.rating.value.toFixed(1)}
          </span>{" "}
          <span className="text-light-slate">
            ({product.rating.reviewsCount} {product.rating.label ?? "Reviews"})
          </span>
        </div>
      </div>

      <Card className="mt-6">
        <div className="rounded-3xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {product.price.strikePrice ? (
                <div className="text-xl font-semibold text-light-slate line-through">
                  {money(product.price.strikePrice)}
                </div>
              ) : null}
              <div className="mt-1 text-5xl font-bold tracking-tight text-black">
                {money(product.price.offerPrice)}
              </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-2 text-sm text-light-slate">
              <div>{product.price.actualLabel}</div>
              <div>{product.price.offerLabel}</div>
            </div>
          </div>

          <div className="mt-5 rounded-full bg-primary/10 px-5 py-3 text-center text-xs font-semibold text-green">
            {product.stock.label}
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-black">Quantity</div>

            <div className="mt-3 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <div className="flex items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQty((p) => Math.max(1, p - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-light-slate/10"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 text-light-slate" />
                  </button>

                  <div className="text-base font-semibold text-black">
                    {qty}
                  </div>

                  <button
                    type="button"
                    onClick={() => setQty((p) => p + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-light-slate/10"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 text-light-slate" />
                  </button>
                </div>
              </div>

              <div className="col-span-7 space-y-3">
                <Button
                  className="h-14 w-full justify-center bg-primary text-white shadow-sm"
                  shape="pill"
                  onClick={handleBuyNow}
                  disabled={isProcessingPayment}
                >
                  <CreditCard className="h-5 w-5" />
                  {isProcessingPayment ? "Processing..." : "Buy Now"}
                </Button>

                <Button
                  className="h-12 w-full justify-center border border-primary bg-white text-primary shadow-sm"
                  shape="pill"
                  disabled={isAddingToCart}
                  onClick={async () => {
                    if (isAddingToCart) return;
                    try {
                      setIsAddingToCart(true);
                      await addItem(product.id, qty);
                    } catch (error) {
                      console.error("Failed to add to cart", error);
                    } finally {
                      setIsAddingToCart(false);
                    }
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-500 active:scale-95"
                >
                  <Heart
                    size={18}
                    className={wishlisted ? "fill-red-500 text-red-500" : ""}
                  />
                  {wishlisted ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-light-slate/10 p-5">
            <div className="flex items-center gap-3 text-sm font-semibold text-black">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                ≋
              </span>
              {product.bulkPricing.title}
            </div>

            <div className="mt-4 grid gap-3">
              {product.bulkPricing.tiers.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="text-light-slate">{t.minUnitsLabel}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-black">
                      {money(t.price)}
                    </div>
                    <div className="text-xs font-semibold text-green">
                      {t.discountLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-6 border-primary/30 bg-primary/5 p-0">
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            +
          </div>
          <div>
            <div className="text-base font-semibold text-black">
              {product.guarantee.title}
            </div>
            <div className="mt-1 text-sm leading-relaxed text-light-slate">
              {product.guarantee.description}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}