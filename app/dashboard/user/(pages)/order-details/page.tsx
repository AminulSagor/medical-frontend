"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrderDetailsHeader from "./_components/order-details-header";
import ShipmentItemsCard from "./_components/shipment-items-card";
import OrderSummaryCard from "./_components/order-summary-card";
import { getUserOrderDetails } from "@/service/user/order-details.service";
import type { UserOrderDetailsData } from "@/types/user/order/order-details.types";

type StepKey = "Ordered" | "Processing" | "Shipped" | "Delivered";

function money(value: string | number | null | undefined) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(parsed)) return "$0.00";

  return `$${parsed.toFixed(2)}`;
}

function mapActiveStep(value?: string): StepKey {
  const normalized = value?.toLowerCase();

  if (normalized === "ordered") return "Ordered";
  if (normalized === "processing") return "Processing";
  if (normalized === "shipped") return "Shipped";
  if (normalized === "delivered") return "Delivered";

  return "Ordered";
}

function buildMeta(attributes: Record<string, string> | null) {
  if (!attributes) return [];

  return Object.entries(attributes).map(
    ([key, value]) =>
      `${key.charAt(0).toUpperCase() + key.slice(1)}: ${String(value)}`,
  );
}

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [orderDetails, setOrderDetails] = useState<UserOrderDetailsData | null>(
    null,
  );

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const data = await getUserOrderDetails(orderId);
        setOrderDetails(data);
      } catch (error) {
        console.error("Failed to load order details", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const items = useMemo(
    () =>
      (orderDetails?.items || []).map((item) => ({
        title: item.name,
        sku: item.sku,
        price: money(item.price),
        qty: item.quantity,
        meta: buildMeta(item.attributes),
        imageSrc: item.imageUrl || "/photos/image.png",
      })),
    [orderDetails],
  );

  const currentTimelineStep =
    orderDetails?.timeline.steps?.[orderDetails.timeline.currentStepIndex];

  const handleDownloadInvoice = () => {
    const url = orderDetails?.actions.downloadInvoice;
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTrackPackage = () => {
    const url = orderDetails?.actions.trackPackage;
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <OrderDetailsHeader
        backHref="/order-history"
        orderNo={orderDetails?.orderNumber}
        placedOn={orderDetails?.placedDate}
        statusLabel={orderDetails?.shipmentStatus.statusLabel}
        carrier={orderDetails?.shipmentStatus.carrier}
        trackingNo={orderDetails?.shipmentStatus.trackingNumber}
        etaLabel={orderDetails?.shipmentStatus.estimatedDelivery}
        activeStep={mapActiveStep(
          currentTimelineStep?.label || currentTimelineStep?.key,
        )}
        onDownloadInvoice={handleDownloadInvoice}
        onTrackPackage={handleTrackPackage}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] items-start">
        <ShipmentItemsCard
          items={items}
          orderNoBadge={`Order No: #${orderDetails?.orderNumber || "—"}`}
        />

        <OrderSummaryCard
          shipTo={{
            name: orderDetails?.shipping.fullName || "—",
            lines: [
              orderDetails?.shipping.addressLine1 || "—",
              orderDetails?.shipping.addressLine2 || "",
              orderDetails?.shipping.cityStateZip || "",
            ].filter(Boolean),
          }}
          payment={{
            label:
              orderDetails?.payment.brand && orderDetails?.payment.last4
                ? `${orderDetails.payment.brand} ending in ${orderDetails.payment.last4}`
                : "Card payment",
          }}
          totals={{
            subtotalLabel: `Subtotal (${orderDetails?.items.length || 0} item${
              (orderDetails?.items.length || 0) !== 1 ? "s" : ""
            })`,
            subtotal: money(orderDetails?.payment.subtotal),
            shipping: money(orderDetails?.payment.shipping),
            tax: money(orderDetails?.payment.tax),
            grandTotal: money(orderDetails?.payment.grandTotal),
          }}
        />
      </div>
    </main>
  );
}
