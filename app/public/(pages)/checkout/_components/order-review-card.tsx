"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import { IMAGE } from "@/constant/image-config";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useCart } from "@/app/public/context/cart-context";
import { OrderSummaryResponse } from "@/app/public/types/order-summary.types";
import { getOrderSummary } from "@/service/user/order-summary.service";
import {
  createCheckoutSession,
  getCheckoutRedirectUrl,
} from "@/service/user/checkout-session.service";
import { UpdateShippingAddressPayload } from "@/app/public/types/shipping-address.types";
import { getProductDetails } from "@/service/public/product.service";

type OrderItemData = {
  id: string;
  title: string;
  qty: number;
  price: string;
  imageSrc?: string | null;
  availableQuantity?: number;
};

function formatMoney(value: string | number | null | undefined) {
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(numericValue)) return "$0.00";

  return `$${numericValue.toFixed(2)}`;
}

type OrderReviewCardProps = {
  shippingAddress: UpdateShippingAddressPayload;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const OrderReviewCard = ({ shippingAddress }: OrderReviewCardProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items } = useCart();
  const [summary, setSummary] = useState<OrderSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [fallbackOrderItems, setFallbackOrderItems] = useState<OrderItemData[]>(
    [],
  );

  const checkoutMode = searchParams.get("mode");
  const buyNowProductId = searchParams.get("productId");
  const buyNowQuantity = Number(searchParams.get("quantity") || "1");

  const checkoutItems = useMemo(() => {
    if (
      checkoutMode === "buy-now" &&
      buyNowProductId &&
      UUID_REGEX.test(buyNowProductId)
    ) {
      return [
        {
          productId: buyNowProductId,
          quantity:
            Number.isFinite(buyNowQuantity) && buyNowQuantity > 0
              ? buyNowQuantity
              : 1,
        },
      ];
    }

    return items.filter((item) => UUID_REGEX.test(item.productId));
  }, [buyNowProductId, buyNowQuantity, checkoutMode, items]);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      setFallbackOrderItems([]);
      return;
    }

    const fetchFallbackOrderItems = async () => {
      try {
        const results = await Promise.allSettled(
          checkoutItems.map(async (item): Promise<OrderItemData> => {
            const data = await getProductDetails(item.productId);

            const unitPrice =
              Number.parseFloat(
                String(
                  (data as any).offerPrice || (data as any).actualPrice || "0",
                ),
              ) || 0;

            return {
              id: item.productId,
              title: String((data as any).name || (data as any).title || "Product"),
              qty: item.quantity,
              price: formatMoney(unitPrice * item.quantity),
              imageSrc:
                (Array.isArray((data as any).images) &&
                  typeof (data as any).images[0] === "string"
                  ? (data as any).images[0]
                  : null) || "/photos/store_product.png",
              availableQuantity:
                typeof (data as any).stockQuantity === "number"
                  ? (data as any).stockQuantity
                  : undefined,
            };
          }),
        );

        const nextItems: OrderItemData[] = [];

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            nextItems.push(result.value);
          }
        });

        setFallbackOrderItems(nextItems);
      } catch (error) {
        console.error("Failed to fetch fallback checkout products", error);
        setFallbackOrderItems([]);
      }
    };

    fetchFallbackOrderItems();
  }, [checkoutItems]);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      setSummary(null);
      return;
    }

    const fetchOrderSummary = async () => {
      setLoading(true);

      try {
        const data = await getOrderSummary({
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        });

        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch order summary", error);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, [checkoutItems]);

  const orderItems: OrderItemData[] = useMemo(() => {
    const fallbackMap = new Map(
      fallbackOrderItems.map((item) => [item.id, item] as const),
    );

    return checkoutItems.map((checkoutItem) => {
      const summaryItem = summary?.items?.find(
        (item) => item.productId === checkoutItem.productId,
      );
      const fallbackItem = fallbackMap.get(checkoutItem.productId);

      const unitPriceFromSummary = summaryItem
        ? Number.parseFloat(summaryItem.unitPrice || "0")
        : null;

      return {
        id: checkoutItem.productId,
        title:
          summaryItem?.name ||
          fallbackItem?.title ||
          "Product",
        qty: checkoutItem.quantity,
        price: summaryItem
          ? formatMoney((unitPriceFromSummary || 0) * checkoutItem.quantity)
          : fallbackItem?.price || "$0.00",
        imageSrc: summaryItem?.photo || fallbackItem?.imageSrc,
        availableQuantity:
          typeof summaryItem?.availableQuantity === "number"
            ? summaryItem.availableQuantity
            : fallbackItem?.availableQuantity,
      };
    });
  }, [checkoutItems, summary, fallbackOrderItems]);

  const invalidStockItems = useMemo(() => {
    return orderItems.filter((item) => {
      if (typeof item.availableQuantity !== "number") return false;
      return item.qty > item.availableQuantity;
    });
  }, [orderItems]);

  const hasInvalidQuantity = invalidStockItems.length > 0;

  const stockValidationMessage = useMemo(() => {
    if (!hasInvalidQuantity) return null;

    if (invalidStockItems.length === 1) {
      const item = invalidStockItems[0];
      return `${item.title}: only ${item.availableQuantity} available, but ${item.qty} selected.`;
    }

    return "Some items exceed available stock. Please update the quantities before payment.";
  }, [hasInvalidQuantity, invalidStockItems]);

  const subtotal = useMemo(() => {
    return formatMoney(
      orderItems.reduce((sum, item) => {
        const numericValue = Number.parseFloat(item.price.replace("$", "")) || 0;
        return sum + numericValue;
      }, 0),
    );
  }, [orderItems]);

  const shippingNumber = Number(summary?.estimatedShipping ?? 0);
  const shipping = shippingNumber === 0 ? "Free" : formatMoney(shippingNumber);
  const tax = summary?.estimatedTax
    ? formatMoney(summary.estimatedTax)
    : "$0.00";

  const total = useMemo(() => {
    const subtotalNumber = Number.parseFloat(subtotal.replace("$", "")) || 0;
    const taxNumber = Number.parseFloat(
      String(summary?.estimatedTax ?? "0"),
    ) || 0;
    const shippingValue = Number(summary?.estimatedShipping ?? 0) || 0;

    return formatMoney(subtotalNumber + taxNumber + shippingValue);
  }, [subtotal, summary]);

  const handlePay = async () => {
    setCheckoutError(null);

    if (!summary?.orderSummaryId) {
      setCheckoutError("Order summary is not ready. Please wait a moment.");
      return;
    }

    if (hasInvalidQuantity) {
      setCheckoutError(
        stockValidationMessage ||
        "Some items exceed available stock. Please update the quantities before payment.",
      );
      return;
    }

    if (
      !shippingAddress.fullName?.trim() ||
      !shippingAddress.addressLine1?.trim() ||
      !shippingAddress.city?.trim() ||
      !shippingAddress.state?.trim() ||
      !shippingAddress.zipCode?.trim()
    ) {
      setCheckoutError("Please complete all required shipping address fields.");
      return;
    }

    try {
      setIsStartingCheckout(true);

      const latestSummary = await getOrderSummary({
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const latestOrderItems: OrderItemData[] = checkoutItems.map(
        (checkoutItem) => {
          const latestItem = latestSummary.items.find(
            (item) => item.productId === checkoutItem.productId,
          );
          const fallbackItem = fallbackOrderItems.find(
            (item) => item.id === checkoutItem.productId,
          );
          const unitPriceFromSummary = latestItem
            ? Number.parseFloat(latestItem.unitPrice || "0")
            : null;

          return {
            id: checkoutItem.productId,
            title: latestItem?.name || fallbackItem?.title || "Product",
            qty: checkoutItem.quantity,
            price: latestItem
              ? formatMoney((unitPriceFromSummary || 0) * checkoutItem.quantity)
              : fallbackItem?.price || "$0.00",
            imageSrc: latestItem?.photo || fallbackItem?.imageSrc,
            availableQuantity:
              typeof latestItem?.availableQuantity === "number"
                ? latestItem.availableQuantity
                : fallbackItem?.availableQuantity,
          };
        },
      );

      const latestInvalidItems = latestOrderItems.filter((item) => {
        if (typeof item.availableQuantity !== "number") return false;
        return item.qty > item.availableQuantity;
      });

      if (latestInvalidItems.length > 0) {
        const latestMessage =
          latestInvalidItems.length === 1
            ? `${latestInvalidItems[0].title}: only ${latestInvalidItems[0].availableQuantity} available, but ${latestInvalidItems[0].qty} selected.`
            : "Some items exceed available stock. Please update the quantities before payment.";

        setCheckoutError(latestMessage);
        setSummary(latestSummary);
        setIsStartingCheckout(false);
        return;
      }

      setSummary(latestSummary);

      const origin = window.location.origin;

      const response = await createCheckoutSession({
        domainType: "product",
        orderSummaryId: latestSummary.orderSummaryId,
        successUrl: `${origin}/public/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/public/checkout`,
        shippingAddress: {
          fullName: shippingAddress.fullName.trim(),
          addressLine1: shippingAddress.addressLine1.trim(),
          addressLine2: shippingAddress.addressLine2?.trim() || undefined,
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          zipCode: shippingAddress.zipCode.trim(),
        },
      });

      const redirectUrl = getCheckoutRedirectUrl(response);

      if (!redirectUrl) {
        throw new Error("No checkout url returned from API");
      }

      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error("Failed to start checkout session", error);

      if (error?.response?.status === 401 && typeof window !== "undefined") {
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/public/auth/sign-in?redirect=${encodeURIComponent(
          redirect,
        )}`;
        return;
      }

      const apiMessage = error?.response?.data?.message;
      setCheckoutError(
        apiMessage ||
        error?.message ||
        "Failed to start checkout. Please try again.",
      );
    } finally {
      setIsStartingCheckout(false);
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">
        Review Your Order
      </h2>

      <div className="mt-4 h-px bg-light-slate/20" />

      <div className="mt-5">
        {loading && orderItems.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : orderItems.length > 0 ? (
          <div className="space-y-4">
            {orderItems.map((it) => (
              <OrderItem key={it.id} {...it} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-slate-500">No items to review.</div>
        )}
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      <div className="mt-4 space-y-2 text-sm">
        <Row label="Subtotal" value={subtotal} />
        <Row
          label="Shipping"
          value={shipping}
          highlight={shippingNumber === 0}
        />
        <Row label="Tax" value={tax} />
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      <div className="mt-5 flex items-end justify-between">
        <span className="font-semibold text-slate-900">Total</span>
        <span className="text-2xl font-semibold text-slate-900">{total}</span>
      </div>

      {stockValidationMessage && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          {stockValidationMessage}
        </div>
      )}

      {checkoutError && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {checkoutError}
        </div>
      )}

      <Button
        disabled={
          loading ||
          isStartingCheckout ||
          orderItems.length === 0 ||
          !summary ||
          hasInvalidQuantity
        }
        onClick={handlePay}
        className={[
          "mt-5 w-full justify-center rounded-full py-3 text-base",
          hasInvalidQuantity ? "cursor-not-allowed opacity-60" : "",
        ].join(" ")}
      >
        <Lock size={18} />
        {isStartingCheckout
          ? "Redirecting..."
          : hasInvalidQuantity
            ? "Fix cart before payment"
            : `Pay ${total}`}
      </Button>

      <p className="mt-3 text-center text-xs text-slate-400">
        By clicking “Pay”, you agree to Texas Airway Institute&apos;s Terms of
        Service and Privacy Policy.
      </p>

      <div className="mt-6 flex items-center justify-center gap-6 border-t border-light-slate/20 pt-4 text-[10px] font-semibold tracking-widest text-slate-400">
        <TrustItem label="SSL SECURE" />
        <TrustItem label="MCAFEE" />
        <TrustItem label="ENCRYPTED" />
      </div>
    </Card>
  );
};

const OrderItem = ({
  id,
  title,
  qty,
  price,
  imageSrc,
  availableQuantity,
}: OrderItemData) => {
  const router = useRouter();
  const hasAvailabilityInfo =
    typeof availableQuantity === "number" && !Number.isNaN(availableQuantity);
  const exceedsStock = hasAvailabilityInfo && qty > (availableQuantity ?? 0);

  return (
    <div
      className="flex cursor-pointer items-start gap-3"
      onClick={() => router.push(`/public/store/product-details/${id}`)}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-light-slate">
        <Image
          src={imageSrc || IMAGE.hand_gloves}
          alt={title}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">Qty: {qty}</p>
        {hasAvailabilityInfo && exceedsStock ? (
          <p className="text-xs text-red-500">
            Only {availableQuantity} available, but {qty} selected
          </p>
        ) : null}
        <p className="text-sm font-semibold text-slate-900">{price}</p>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between">
    <span className="text-slate-600">{label}</span>
    <span className={highlight ? "font-medium text-primary" : "text-slate-900"}>
      {value}
    </span>
  </div>
);

const TrustItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5">
    <ShieldCheck className="h-3.5 w-3.5" />
    <span>{label}</span>
  </div>
);

export default OrderReviewCard;