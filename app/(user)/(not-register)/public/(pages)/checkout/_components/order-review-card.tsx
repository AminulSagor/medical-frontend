"use client";

import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import { Lock } from "lucide-react";

const OrderReviewCard = () => {
  return (
    <Card shape="soft" className="bg-white border border-light-slate">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">
        Review Your Order
      </h2>

      <div className="space-y-5 mb-6">
        <OrderItem title="Nitrile Exam Gloves" qty={1} price="$12.99" />
        <OrderItem title="Digital Otoscope Pro" qty={1} price="$145.00" />
        <OrderItem title="Kelly Forceps - Curved" qty={2} price="$37.50" />
      </div>

      <div className="space-y-3 text-sm border-t border-light-slate pt-5">
        <Row label="Subtotal" value="$195.49" />
        <Row label="Shipping" value="Free" highlight />
        <Row label="Tax" value="$15.64" />
      </div>

      <div className="flex justify-between items-center mt-6 text-lg font-semibold">
        <span>Total</span>
        <span>$211.13</span>
      </div>

      <Button className="w-full mt-6" size="lg">
        <Lock size={18} />
        Pay $211.13
      </Button>

      <p className="text-xs text-slate-500 text-center mt-4">
        By clicking Pay, you agree to Terms of Service and Privacy Policy.
      </p>
    </Card>
  );
};

const OrderItem = ({
  title,
  qty,
  price,
}: {
  title: string;
  qty: number;
  price: string;
}) => (
  <div className="flex justify-between items-start">
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-sm text-slate-500">Qty: {qty}</p>
    </div>
    <span className="font-medium text-slate-800">{price}</span>
  </div>
);

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
    <span className={highlight ? "text-primary font-medium" : ""}>{value}</span>
  </div>
);

export default OrderReviewCard;
