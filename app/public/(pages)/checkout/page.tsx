"use client";

import { Suspense, useState } from "react";
import CheckOutHeader from "@/app/public/(pages)/checkout/_components/checkout-header";
import OrderReviewCard from "@/app/public/(pages)/checkout/_components/order-review-card";
import ShippingAddressCard from "@/app/public/(pages)/checkout/_components/shipping-address-card";
import type { UpdateShippingAddressPayload } from "@/app/public/types/shipping-address.types";

const Page = () => {
  const [shippingAddress, setShippingAddress] =
    useState<UpdateShippingAddressPayload>({
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
    });

  return (
    <div className="mx-auto mt-24 max-w-7xl space-y-4 px-4 py-10">
      <CheckOutHeader />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="min-w-0 space-y-8 lg:col-span-2">
          <ShippingAddressCard
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
          />
        </div>

        <div className="min-w-0">
          <Suspense fallback={null}>
            <OrderReviewCard shippingAddress={shippingAddress} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;