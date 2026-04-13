"use client";

import { useEffect, useMemo, useState } from "react";
import OrdersHeader from "./_components/orders-header";
import OrderStats from "./_components/order-stats";
import OrdersToolbar from "./_components/orders-toolbar";
import OrdersTable, {
  type OrderRow,
  type PaymentStatusFilter,
} from "./_components/orders-table";
import { getAdminOrdersSummary } from "@/service/admin/orders/order.summary.service";
import { getAdminOrderTransactions } from "@/service/admin/orders/order.transaction.service";
import { AdminOrdersSummaryCards } from "@/types/admin/orders/order.summary.types";
import {
  AdminOrderTransaction,
  AdminOrderTransactionMeta,
} from "@/types/admin/orders/order.transaction.types";

const PAGE_SIZE = 10;

const DEFAULT_SUMMARY_CARDS: AdminOrdersSummaryCards = {
  thisMonthRevenue: 0,
  totalOrders: 0,
  toBeShipped: 0,
  avgOrderValue: 0,
};

const DEFAULT_TRANSACTION_META: AdminOrderTransactionMeta = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: string | number): string {
  const amount =
    typeof value === "number" ? value : Number.parseFloat(value || "0");

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isNaN(amount) ? 0 : amount);
}

function normalizeFulfillmentStatus(status: string): OrderRow["fulfillment"] {
  const value = status.toLowerCase();

  if (value === "shipped") {
    return "shipped";
  }

  if (value === "processing" || value === "pending") {
    return "processing";
  }

  return "received";
}

function mapTransactionToRow(item: AdminOrderTransaction): OrderRow {
  return {
    id: item.id,
    orderCode: item.orderId,
    date: formatDate(item.date),
    customer: item.customer?.name || "Unknown Customer",
    customerEmail: item.customer?.email || "",
    customerAvatar: item.customer?.avatar,
    type: item.type === "course" ? "course" : "product",
    paymentStatus:
      item.paymentStatus === "paid" ||
      item.paymentStatus === "pending" ||
      item.paymentStatus === "refunded"
        ? item.paymentStatus
        : "pending",
    fulfillment: normalizeFulfillmentStatus(item.fulfillment),
    fulfillmentLabel: item.fulfillment,
    total: formatCurrency(item.total),
  };
}

export default function OrdersAndSalesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatusFilter>("all");
  const [page, setPage] = useState(1);

  const [summaryCards, setSummaryCards] = useState<AdminOrdersSummaryCards>(
    DEFAULT_SUMMARY_CARDS,
  );
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [transactions, setTransactions] = useState<AdminOrderTransaction[]>([]);
  const [transactionsMeta, setTransactionsMeta] =
    useState<AdminOrderTransactionMeta>(DEFAULT_TRANSACTION_META);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);

  useEffect(() => {
    const loadOrdersSummary = async () => {
      try {
        setIsSummaryLoading(true);
        const response = await getAdminOrdersSummary();
        setSummaryCards(response.cards ?? DEFAULT_SUMMARY_CARDS);
      } catch (error) {
        console.error("Failed to load orders summary:", error);
        setSummaryCards(DEFAULT_SUMMARY_CARDS);
      } finally {
        setIsSummaryLoading(false);
      }
    };

    void loadOrdersSummary();
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        setIsTransactionLoading(true);

        const response = await getAdminOrderTransactions({
          page,
          limit: PAGE_SIZE,
          search: search.trim() || undefined,
          paymentStatus: status === "all" ? undefined : status,
        });

        setTransactions(response.items ?? []);
        setTransactionsMeta(response.meta ?? DEFAULT_TRANSACTION_META);
      } catch (error) {
        console.error("Failed to load order transactions:", error);
        setTransactions([]);
        setTransactionsMeta(DEFAULT_TRANSACTION_META);
      } finally {
        setIsTransactionLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [page, search, status]);

  const rows = useMemo(() => {
    return transactions.map(mapTransactionToRow);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <OrdersHeader />

        <div className="shrink-0">
          {/* <OrdersToolbar
            onDownload={() => console.log("download csv")}
            onNewOrder={() => console.log("new order")}
          /> */}
        </div>
      </div>

      <OrderStats cards={summaryCards} isLoading={isSummaryLoading} />

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <OrdersTable
          rows={rows}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          page={transactionsMeta.page || page}
          pageSize={transactionsMeta.limit || PAGE_SIZE}
          totalCount={transactionsMeta.total || 0}
          totalPages={transactionsMeta.totalPages || 1}
          isLoading={isTransactionLoading}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
