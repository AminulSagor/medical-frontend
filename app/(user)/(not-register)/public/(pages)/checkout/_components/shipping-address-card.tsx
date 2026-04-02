"use client";

import Button from "@/components/buttons/button";
import Card from "@/components/cards/card";
import { Pencil } from "lucide-react";

const ShippingAddressCard = () => {
  return (
    <div className="bg-white border border-light-slate/10 rounded-2xl p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-light-slate/20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
            1
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Shipping Address
          </h2>
        </div>

        <Button
          size="sm"
          variant="secondary"
          shape="rounded"
          className="text-primary bg-transparent border-none hover:bg-primary/10"
        >
          <Pencil size={14} />
          Edit
        </Button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Full Name" value="Dr. Sarah Thompson" />
          <Field label="Address" value="4500 Medical Drive, Suite 200" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Field label="City" value="San Antonio" />
          <Field label="State" value="TX" />
          <Field label="Zip Code" value="78229" />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
      {label}
    </span>
    <div className="h-11 px-4 flex items-center bg-white border border-light-slate/20 rounded-xl text-sm text-slate-700">
      {value}
    </div>
  </div>
);

export default ShippingAddressCard;
