"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import type {
  SubscriberOrderHistoryItem,
  SubscriberOrderHistoryResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-order-history.types";
import { getSubscriberOrderHistory } from "@/service/admin/newsletter/subscribes/subscriber-order-history.service";
import { useRouter } from "next/navigation";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypePill({ type }: { type: string }) {
  const normalizedType = type?.toUpperCase();
  const isProduct = normalizedType === "PRODUCT";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        isProduct
          ? "border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]"
          : "border-[#ede9fe] bg-[#f5f3ff] text-[#7c3aed]",
      )}
    >
      {normalizedType}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  const normalizedStatus = status?.toLowerCase();

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        normalizedStatus === "paid"
          ? "border-[#c8f0d8] bg-[#eefcf4] text-[#12b76a]"
          : normalizedStatus === "refunded"
            ? "border-[#fee4e2] bg-[#fff1f0] text-[#f04438]"
            : "border-slate-200 bg-slate-50 text-slate-500",
      )}
    >
      {status}
    </span>
  );
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatMoney(amount: string) {
  const value = Number(amount);

  if (Number.isNaN(value)) return amount || "-";

  return `$${value.toFixed(2)}`;
}

export default function OrdersTable({ id }: { id: string }) {
  const [rows, setRows] = useState<SubscriberOrderHistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<
    SubscriberOrderHistoryResponse["meta"] | null
  >(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const canLoadMore = useMemo(() => {
    if (!meta) return false;
    return page < meta.totalPages;
  }, [meta, page]);

  const loadOrders = async (nextPage: number, append = false) => {
    try {
      setError(null);

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      const response = await getSubscriberOrderHistory(id, nextPage, 10);

      setRows((prev) =>
        append ? [...prev, ...response.items] : response.items,
      );
      setMeta(response.meta);
      setPage(response.meta.page);
    } catch (err) {
      setError("Failed to load order history.");
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadOrders(1, false);
  }, [id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="w-[600px] max-w-full overflow-x-auto">
        <table className="min-w-[980px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: 220 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 360 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 170 }} />
            <col style={{ width: 80 }} />
          </colgroup>

          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Item Details
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Type
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Total
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Payment Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Invoice
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isInitialLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Loading order history...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No order history found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-5 text-sm font-semibold text-[#0e8f86]">
                    {r.displayOrderId || r.orderId}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">
                    {formatDate(r.date)}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                    {r.itemDetails || "-"}
                  </td>
                  <td className="px-6 py-5">
                    <TypePill type={r.type} />
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                    {formatMoney(r.total)}
                  </td>
                  <td className="px-6 py-5">
                    <PaymentPill status={r.paymentStatus} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      type="button"
                      disabled={!r.invoice?.view}
                      onClick={() => {
                        if (!r.invoice?.view) return;
                        router.push(
                          `/dashboard/admin/orders-and-sales/${r.id}`,
                        );
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="View invoice"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isInitialLoading && rows.length > 0 ? (
        <div className="flex items-center justify-center border-t border-slate-100 py-5">
          {canLoadMore ? (
            <button
              type="button"
              onClick={() => loadOrders(page + 1, true)}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more orders"
              )}
            </button>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-300">
              No more orders
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
