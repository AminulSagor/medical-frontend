"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UpdateShippingAddressPayload } from "@/app/public/types/shipping-address.types";
import Button from "@/components/buttons/button";
import { Pencil } from "lucide-react";

type ShippingAddressCardProps = {
  shippingAddress: UpdateShippingAddressPayload;
  setShippingAddress: Dispatch<SetStateAction<UpdateShippingAddressPayload>>;
};

const ShippingAddressCard = ({
  shippingAddress,
  setShippingAddress,
}: ShippingAddressCardProps) => {
  const updateField = (
    key: keyof UpdateShippingAddressPayload,
    value: string,
  ) => {
    setShippingAddress((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-light-slate/10 bg-white p-0">
      <div className="flex items-center justify-between border-b border-light-slate/20 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            1
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Shipping Address
          </h2>
        </div>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          shape="rounded"
          className="border-none bg-transparent text-primary hover:bg-primary/10"
        >
          <Pencil size={14} />
          Edit
        </Button>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-6">
          <Field
            label="Full Name"
            value={shippingAddress.fullName}
            onChange={(value) => updateField("fullName", value)}
            placeholder="Enter full name"
          />
          <Field
            label="Address Line 1"
            value={shippingAddress.addressLine1}
            onChange={(value) => updateField("addressLine1", value)}
            placeholder="Enter address"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Field
            label="Address Line 2"
            value={shippingAddress.addressLine2 ?? ""}
            onChange={(value) => updateField("addressLine2", value)}
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Field
            label="City"
            value={shippingAddress.city}
            onChange={(value) => updateField("city", value)}
            placeholder="Enter city"
          />
          <Field
            label="State"
            value={shippingAddress.state}
            onChange={(value) => updateField("state", value)}
            placeholder="Enter state"
          />
          <Field
            label="Zip Code"
            value={shippingAddress.zipCode}
            onChange={(value) => updateField("zipCode", value)}
            placeholder="Enter zip code"
          />
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </span>

    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 rounded-xl border border-light-slate/20 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-primary"
    />
  </div>
);

export default ShippingAddressCard;
