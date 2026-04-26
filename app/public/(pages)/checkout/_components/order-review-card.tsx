"use client";

import { Loader2, Lock } from "lucide-react";
import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import type { UpdateShippingAddressPayload } from "@/app/public/types/shipping-address.types";
import { useOrderReview } from "@/app/public/(pages)/checkout/_hooks/use-order-review";
import OrderReviewItem from "./order-review-item";
import OrderSummaryRow from "./order-summary-row";
import OrderTrustItem from "./order-trust-item";

type OrderReviewCardProps = {
  shippingAddress: UpdateShippingAddressPayload;
};

const OrderReviewCard = ({ shippingAddress }: OrderReviewCardProps) => {
  const {
    summary,
    loading,
    isStartingCheckout,
    checkoutError,
    orderItems,
    shippingNumber,
    shipping,
    subtotal,
    tax,
    total,
    hasInvalidQuantity,
    stockValidationMessage,
    handlePay,
  } = useOrderReview(shippingAddress);

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
            {orderItems.map((item) => (
              <OrderReviewItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-sm text-slate-500">No items to review.</div>
        )}
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      <div className="mt-4 space-y-2 text-sm">
        <OrderSummaryRow label="Subtotal" value={subtotal} />
        <OrderSummaryRow
          label="Shipping"
          value={shipping}
          highlight={shippingNumber === 0}
        />
        <OrderSummaryRow label="Tax" value={tax} />
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      <div className="mt-5 flex items-end justify-between gap-3">
        <span className="font-semibold text-slate-900">Total</span>
        <span className="text-2xl font-semibold text-slate-900">{total}</span>
      </div>

      {stockValidationMessage ? (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          {stockValidationMessage}
        </div>
      ) : null}

      {checkoutError ? (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {checkoutError}
        </div>
      ) : null}

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

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-light-slate/20 pt-4 text-[10px] font-semibold tracking-widest text-slate-400">
        <OrderTrustItem label="SSL SECURE" />
        <OrderTrustItem label="MCAFEE" />
        <OrderTrustItem label="ENCRYPTED" />
      </div>
    </Card>
  );
};

export default OrderReviewCard;