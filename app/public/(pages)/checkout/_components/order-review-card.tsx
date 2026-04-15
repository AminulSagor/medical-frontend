"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

type OrderItemData = {
  id: string;
  title: string;
  qty: number;
  price: string;
  imageSrc?: string | null;
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

const OrderReviewCard = ({ shippingAddress }: OrderReviewCardProps) => {
  const { items } = useCart();
  const [summary, setSummary] = useState<OrderSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      setSummary(null);
      return;
    }

    const fetchOrderSummary = async () => {
      setLoading(true);

      try {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        const validItems = items.filter((item) =>
          uuidRegex.test(item.productId),
        );

        if (validItems.length === 0) {
          setSummary(null);
          return;
        }

        const data = await getOrderSummary({
          items: validItems.map((item) => ({
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
  }, [items]);

  const handlePay = async () => {
    setCheckoutError(null);

    if (!summary?.orderSummaryId) {
      setCheckoutError("Order summary is not ready. Please wait a moment.");
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

      const origin = window.location.origin;

      const response = await createCheckoutSession({
        domainType: "product",
        orderSummaryId: summary.orderSummaryId,
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
      const apiMessage = error?.response?.data?.message;
      setCheckoutError(apiMessage || error?.message || "Failed to start checkout. Please try again.");
    } finally {
      setIsStartingCheckout(false);
    }
  };

  const orderItems: OrderItemData[] =
    summary?.items.map((item) => ({
      id: item.productId,
      title: item.name,
      qty: item.quantity,
      price: formatMoney(item.lineTotal),
      imageSrc: item.photo,
    })) ?? [];

  const subtotal = formatMoney(summary?.subtotal);
  const shippingNumber = Number(summary?.estimatedShipping ?? 0);
  const shipping = shippingNumber === 0 ? "Free" : formatMoney(shippingNumber);
  const tax = formatMoney(summary?.estimatedTax);
  const total = formatMoney(summary?.orderTotal);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">
        Review Your Order
      </h2>

      <div className="mt-4 h-px bg-light-slate/20" />

      <div className="mt-5">
        {loading ? (
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

      {checkoutError && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {checkoutError}
        </div>
      )}

      <Button
        disabled={
          loading || isStartingCheckout || orderItems.length === 0 || !summary
        }
        onClick={handlePay}
        className="mt-5 w-full justify-center rounded-full py-3 text-base"
      >
        <Lock size={18} />
        {isStartingCheckout ? "Redirecting..." : `Pay ${total}`}
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

const OrderItem = ({ title, qty, price, imageSrc }: OrderItemData) => {
  return (
    <div className="flex items-start gap-3">
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
