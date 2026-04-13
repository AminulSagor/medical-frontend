"use client";

import { useEffect, useMemo, useState } from "react";
import OrderDetailsHeader from "./order-details-header";
import OrderDetailsOrderItems from "./order-details-order-items";
import OrderDetailsShippingDispatch from "./order-details-shipping-dispatch";
import OrderDetailsCustomerProfile from "./order-details-customer-profile";
import OrderDetailsEventTimeline from "./order-details-event-timeline";
import OrderDetailsCriticalActions from "./order-details-critical-actions";
import OrderDetailsLoadingShell from "./order-details-loading-shell";
import { mapOrderDetailsToViewModel } from "../_utils/order-details.mapper";
import { AdminOrderDetailsResponse } from "@/types/admin/orders/order-details.types";
import { getAdminOrderDetails } from "@/service/admin/orders/order-details.service";

type PaymentStatus = "paid" | "unpaid";
type FulfillmentStatus = "fulfilled" | "unfulfilled";

function pillBase() {
  return "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold";
}

function StatusPill({ payment }: { payment: PaymentStatus }) {
  if (payment === "paid") {
    return (
      <span
        className={[
          pillBase(),
          "border-[var(--primary)]/20 bg-[var(--primary-50)] text-[var(--primary)]",
        ].join(" ")}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
        PAID
      </span>
    );
  }

  return (
    <span
      className={[
        pillBase(),
        "border-amber-200 bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      UNPAID
    </span>
  );
}

function FulfillmentPill({ status }: { status: FulfillmentStatus }) {
  if (status === "fulfilled") {
    return (
      <span
        className={[
          pillBase(),
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        ].join(" ")}
      >
        FULFILLED
      </span>
    );
  }

  return (
    <span
      className={[
        pillBase(),
        "border-amber-200 bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      UNFULFILLED
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
      {message}
    </div>
  );
}

export default function OrderDetailsClient({ id }: { id: string }) {
  const [orderDetails, setOrderDetails] =
    useState<AdminOrderDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await getAdminOrderDetails(id);

        if (!isMounted) {
          return;
        }

        setOrderDetails(response);
      } catch (error) {
        console.error("Failed to load order details:", error);

        if (!isMounted) {
          return;
        }

        setHasError(true);
        setOrderDetails(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const order = useMemo(() => {
    if (!orderDetails) {
      return null;
    }

    return mapOrderDetailsToViewModel(orderDetails);
  }, [orderDetails]);

  if (isLoading) {
    return <OrderDetailsLoadingShell />;
  }

  if (hasError || !order) {
    return <EmptyState message="Failed to load order details." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <OrderDetailsHeader
          orderId={order.orderId}
          placedAt={order.placedAt}
          right={
            <>
              <StatusPill payment={order.paymentStatus} />
              <FulfillmentPill status={order.fulfillmentStatus} />
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <OrderDetailsOrderItems order={order} />
          <OrderDetailsShippingDispatch order={order} />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <OrderDetailsCustomerProfile order={order} />
          <OrderDetailsEventTimeline order={order} />
          <OrderDetailsCriticalActions orderId={order.id} />
        </div>
      </div>
    </div>
  );
}
