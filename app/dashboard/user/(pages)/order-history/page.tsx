"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, CreditCard, DollarSign, ShoppingBag } from "lucide-react";
import MetricsCards from "./_components/metrics-cards";
import PastOrdersTable from "./_components/past-orders-table";
import { getUserOrderHistory } from "@/service/user/order-history.service";
import { getUserOrderMetrics } from "@/service/user/order-metrics.service";
import type {
  UserOrderHistoryItem,
  UserOrderHistoryResponse,
  UserOrderMetricsResponse,
} from "@/types/user/order/order-history.types";

function money(value: string | number | null | undefined) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(value ?? "0");

  if (Number.isNaN(parsed)) return "$0.00";

  return `$${parsed.toFixed(2)}`;
}

function getTrendDirection(trend: string): "up" | "down" | "flat" {
  const normalized = trend.trim();

  if (normalized.startsWith("+")) return "up";
  if (normalized.startsWith("-")) return "down";

  return "flat";
}

function mapStatus(status: string): "Processing" | "Shipped" | "Delivered" {
  const normalized = status.toLowerCase();

  if (normalized === "shipped") return "Shipped";
  if (normalized === "delivered") return "Delivered";

  return "Processing";
}

function buildTitle(order: UserOrderHistoryItem) {
  if (order.leadItem.extraItemsText) {
    return `${order.leadItem.title} ${order.leadItem.extraItemsText}`;
  }

  const extraCount = Math.max(order.totalItemsCount - 1, 0);

  if (extraCount > 0) {
    return `${order.leadItem.title} + ${extraCount} other item${
      extraCount > 1 ? "s" : ""
    }`;
  }

  return order.leadItem.title;
}

function buildItemsBadge(order: UserOrderHistoryItem) {
  const extraCount = Math.max(order.totalItemsCount - 1, 0);

  if (extraCount <= 0) return undefined;

  return `+${extraCount} item${extraCount > 1 ? "s" : ""}`;
}

export default function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const [historyResponse, setHistoryResponse] =
    useState<UserOrderHistoryResponse | null>(null);
  const [metricsResponse, setMetricsResponse] =
    useState<UserOrderMetricsResponse | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getUserOrderMetrics();
        setMetricsResponse(data);
      } catch (error) {
        console.error("Failed to load order metrics", error);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await getUserOrderHistory({
          page,
          limit: 10,
        });
        setHistoryResponse(data);
      } catch (error) {
        console.error("Failed to load order history", error);
      }
    };

    fetchOrderHistory();
  }, [page]);

  const metricsItems = useMemo(() => {
    const metrics = metricsResponse?.data;

    return [
      {
        id: "1",
        title: "ACTIVE DELIVERIES",
        value: String(metrics?.activeDeliveries.value ?? 0),
        icon: <Car className="h-4 w-4" />,
        trend: metrics?.activeDeliveries.trend
          ? {
              label: metrics.activeDeliveries.trend,
              direction: getTrendDirection(metrics.activeDeliveries.trend),
            }
          : undefined,
      },
      {
        id: "2",
        title: "ORDERED THIS MONTH",
        value: String(metrics?.orderedThisMonth.value ?? 0),
        icon: <ShoppingBag className="h-4 w-4" />,
        trend: metrics?.orderedThisMonth.trend
          ? {
              label: metrics.orderedThisMonth.trend,
              direction: getTrendDirection(metrics.orderedThisMonth.trend),
            }
          : undefined,
      },
      {
        id: "3",
        title: "ORDER VALUE (MONTH)",
        value: money(metrics?.orderValueMonth.value),
        icon: <DollarSign className="h-4 w-4" />,
        trend: metrics?.orderValueMonth.trend
          ? {
              label: metrics.orderValueMonth.trend,
              direction: getTrendDirection(metrics.orderValueMonth.trend),
            }
          : undefined,
      },
      {
        id: "4",
        title: "TOTAL ORDERED VALUE",
        value: money(metrics?.totalOrderedValue.value),
        icon: <CreditCard className="h-4 w-4" />,
        trend: metrics?.totalOrderedValue.trend
          ? {
              label: metrics.totalOrderedValue.trend,
              direction: getTrendDirection(metrics.totalOrderedValue.trend),
            }
          : undefined,
      },
    ];
  }, [metricsResponse]);

  const tableItems = useMemo(
    () =>
      (historyResponse?.data ?? []).map((order) => ({
        id: order.id,
        title: buildTitle(order),
        orderNo: `#${order.orderNumber}`,
        dateOrdered: order.dateOrdered,
        qtyLabel: `${order.totalItemsCount} item${
          order.totalItemsCount !== 1 ? "s" : ""
        }`,
        status: mapStatus(order.status),
        total: money(order.totalAmount),
        imageUrl: order.leadItem.imageUrl || "/photos/Image.png",
        itemsBadge: buildItemsBadge(order),
        viewHref: `/dashboard/user/order-details?id=${order.id}`,
        copyValue: order.orderNumber,
        reorderHref: `/public/cart?reorderFrom=${order.id}`,
      })),
    [historyResponse],
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 -mt-6">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900">Order History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your shipments and view receipts for medical equipment.
        </p>
      </div>

      <MetricsCards items={metricsItems} />
      <PastOrdersTable
        items={tableItems}
        page={historyResponse?.meta.page ?? 1}
        total={historyResponse?.meta.total ?? 0}
        totalPages={historyResponse?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />
    </main>
  );
}
