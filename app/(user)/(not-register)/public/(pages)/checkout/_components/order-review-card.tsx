"use client";

import Image from "next/image";
import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import { IMAGE } from "@/constant/image-config";
import { Lock, ShieldCheck } from "lucide-react";

type OrderItemData = {
  title: string;
  qty: number;
  price: string;
  imageSrc?: string;
};

const OrderReviewCard = () => {
  const items: OrderItemData[] = [
    {
      title: "Nitrile Exam Gloves",
      qty: 1,
      price: "$12.99",
      imageSrc: IMAGE.hand_gloves,
    },
    {
      title: "Digital Otoscope Pro",
      qty: 1,
      price: "$145.00",
      imageSrc: IMAGE.hand_gloves,
    },
    {
      title: "Kelly Forceps - Curved",
      qty: 2,
      price: "$37.50",
      imageSrc: IMAGE.hand_gloves,
    },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">
        Review Your Order
      </h2>

      <div className="mt-4 h-px bg-light-slate/20" />

      {/* Items */}
      <div className="mt-5 space-y-4">
        {items.map((it, idx) => (
          <OrderItem key={`${it.title}-${idx}`} {...it} />
        ))}
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      {/* Summary */}
      <div className="mt-4 space-y-2 text-sm">
        <Row label="Subtotal" value="$195.49" />
        <Row label="Shipping" value="Free" highlight />
        <Row label="Tax" value="$15.64" />
      </div>

      <div className="mt-6 h-px bg-light-slate/20" />

      {/* Total */}
      <div className="mt-5 flex items-end justify-between">
        <span className="font-semibold text-slate-900">Total</span>
        <span className="text-2xl font-semibold text-slate-900">$211.13</span>
      </div>

      {/* Pay Button */}
      <Button className="mt-5 w-full justify-center rounded-full py-3 text-base">
        <Lock size={18} />
        Pay $211.13
      </Button>

      <p className="mt-3 text-center text-xs text-slate-400">
        By clicking “Pay”, you agree to Texas Airway Institute&apos;s Terms of
        Service and Privacy Policy.
      </p>

      {/* Trust Row */}
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
          src={imageSrc ?? IMAGE.hand_gloves}
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
