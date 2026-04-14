"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderDetailsHeader from "./_components/order-details-header";
import ShipmentItemsCard from "./_components/shipment-items-card";
import OrderSummaryCard from "./_components/order-summary-card";
import NeedHelpCard from "./_components/need-help-card";
import { getUserOrderDetails } from "@/service/user/order-details.service";
import { reorderBackendCart } from "@/service/public/cart-server.service";
import { useCart } from "@/app/public/context/cart-context";
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

  if (normalized === "ordered" || normalized === "unfulfilled") {
    return "Ordered";
  }

  if (normalized === "processing") {
    return "Processing";
  }

  if (normalized === "shipped") {
    return "Shipped";
  }

  if (normalized === "delivered" || normalized === "received") {
    return "Delivered";
  }

  return "Ordered";
}

function buildMeta(attributes: Record<string, string> | null) {
  if (!attributes) return [];

  return Object.entries(attributes).map(
    ([key, value]) =>
      `${key.charAt(0).toUpperCase() + key.slice(1)}: ${String(value)}`,
  );
}

function OrderDetailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { syncItems } = useCart();

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

  const activeStep = mapActiveStep(
    currentTimelineStep?.label || currentTimelineStep?.key,
  );

  const timelineSteps = useMemo(() => {
    return (orderDetails?.timeline.steps || []).map((step) => ({
      key: mapActiveStep(step.key || step.label),
      date: step.date,
    }));
  }, [orderDetails]);

  const handleDownloadInvoice = () => {
    if (!orderDetails?.id) return;

    const invoiceUrl = `/dashboard/user/order-invoice/${orderDetails.id}/invoice`;
    const anchor = document.createElement("a");
    anchor.href = invoiceUrl;
    anchor.download = `invoice-${orderDetails.orderNumber || orderDetails.id}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleReorder = async () => {
    if (!orderDetails?.id) return;

    try {
      const data = await reorderBackendCart({
        orderId: orderDetails.id,
      });

      syncItems(
        data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      );

      router.push("/public/cart");
    } catch (error) {
      console.error("Failed to reorder cart", error);
    }
  };

  const handleContactSupport = () => {
    const orderNo = orderDetails?.orderNumber;

    if (!orderNo) {
      router.push("/public/contact-us");
      return;
    }

    router.push(
      `/public/contact-us?source=order_details&orderNo=${encodeURIComponent(orderNo)}`,
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <OrderDetailsHeader
        backHref="/dashboard/user/order-history"
        orderNo={orderDetails?.orderNumber}
        placedOn={orderDetails?.placedDate}
        statusLabel={orderDetails?.shipmentStatus.statusLabel}
        carrier={orderDetails?.shipmentStatus.carrier}
        trackingNo={orderDetails?.shipmentStatus.trackingNumber}
        etaLabel={orderDetails?.shipmentStatus.estimatedDelivery}
        activeStep={activeStep}
        timelineSteps={timelineSteps}
        showReorder={activeStep === "Delivered"}
        onDownloadInvoice={handleDownloadInvoice}
        onReorder={handleReorder}
      />

      <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[1fr_360px]">
        <ShipmentItemsCard
          items={items}
          orderNoBadge={`Order No: #${orderDetails?.orderNumber || "—"}`}
        />

        <div className="space-y-6">
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

          <NeedHelpCard onContactSupport={handleContactSupport} />
        </div>
      </div>
    </main>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={null}>
      <OrderDetailsPageContent />
    </Suspense>
  );
}
