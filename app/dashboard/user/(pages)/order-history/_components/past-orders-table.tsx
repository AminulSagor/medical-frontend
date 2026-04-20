"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Copy,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  OrderHistoryDuration,
  OrderHistoryStatus,
} from "@/types/user/order/order-history.types";
import { reorderBackendCart } from "@/service/public/cart-server.service";
import { useCart } from "@/app/public/context/cart-context";

type OrderStatus = "Ordered" | "Processing" | "Shipped" | "Delivered";

type PastOrder = {
  id: string;
  title: string;
  orderNo: string;
  dateOrdered: string;
  qtyLabel: string;
  status: OrderStatus;
  total: string;
  imageUrl: string;
  itemsBadge?: string;
  viewHref?: string;
  copyValue?: string;
  reorderHref?: string;
  reorderOrderId?: string;
};

const DURATION_LABELS: Record<OrderHistoryDuration, string> = {
  "3_months": "Past 3 Months",
  "6_months": "Past 6 Months",
  "1_year": "Past 1 Year",
};

const STATUS_LABELS: Record<OrderHistoryStatus, string> = {
  unfulfilled: "Ordered",
  processing: "Processing",
  shipped: "Shipped",
  received: "Delivered",
};

export default function PastOrdersTable(props: {
  items?: PastOrder[];
  page?: number;
  total?: number;
  totalPages?: number;
  duration?: OrderHistoryDuration;
  status?: OrderHistoryStatus | "";
  searchText?: string;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: OrderHistoryStatus | "") => void;
  onDurationChange?: (duration: OrderHistoryDuration) => void;
  onPageChange?: (page: number) => void;
  onResetFilters?: () => void;
}) {
  const router = useRouter();
  const { syncItems } = useCart();

  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const items: PastOrder[] = props.items ?? [];
  const currentPage = props.page ?? 1;
  const total = props.total ?? items.length;
  const totalPages = Math.max(props.totalPages ?? 1, 1);
  const currentDuration = props.duration ?? "3_months";
  const currentStatus = props.status ?? "";
  const searchText = props.searchText ?? "";

  const showingFrom = items.length === 0 ? 0 : (currentPage - 1) * 10 + 1;
  const showingTo = items.length === 0 ? 0 : showingFrom + items.length - 1;

  const goToOrderDetails = (href?: string) => {
    if (!href) return;
    router.push(href);
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Past Orders</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[560px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchText}
            onChange={(e) => props.onSearchChange?.(e.target.value)}
            placeholder="Search Order #, Product Name, or SKU"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <DropdownButton
              label={DURATION_LABELS[currentDuration]}
              leftIcon={<span />}
              onClick={() => {
                setShowDurationMenu((prev) => !prev);
                setShowStatusMenu(false);
              }}
            />

            {showDurationMenu ? (
              <div className="absolute right-0 z-20 mt-2 min-w-[170px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {(
                  Object.entries(DURATION_LABELS) as [
                    OrderHistoryDuration,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      props.onDurationChange?.(value);
                      setShowDurationMenu(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <DropdownButton
              label={
                currentStatus ? STATUS_LABELS[currentStatus] : "Order Status"
              }
              rightIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => {
                setShowStatusMenu((prev) => !prev);
                setShowDurationMenu(false);
              }}
            />

            {showStatusMenu ? (
              <div className="absolute right-0 z-20 mt-2 min-w-[170px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    props.onStatusChange?.("");
                    setShowStatusMenu(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  All Status
                </button>

                {(
                  Object.entries(STATUS_LABELS) as [
                    OrderHistoryStatus,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      props.onStatusChange?.(value);
                      setShowStatusMenu(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => props.onResetFilters?.()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/70">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-semibold tracking-wider text-slate-500">
              <th className="px-4 py-3">ITEM / DETAILS</th>
              <th className="px-4 py-3">DATE ORDERED</th>
              <th className="px-4 py-3">QTY</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">TOTAL</th>
              <th className="px-4 py-3 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {items.map((o) => (
              <tr key={o.id} className="bg-white">
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => goToOrderDetails(o.viewHref)}
                    className="flex items-center gap-3 rounded-lg text-left transition hover:bg-slate-50"
                  >
                    <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                      <Image
                        src={o.imageUrl}
                        alt={o.title}
                        fill
                        className="object-cover"
                      />
                      {o.itemsBadge ? (
                        <span className="absolute left-1 top-1 rounded-full bg-sky-500 px-2 py-0.5 text-[9px] font-semibold text-white">
                          {o.itemsBadge}
                        </span>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-semibold text-slate-900 hover:text-sky-600">
                        {o.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Order No:{" "}
                        <span className="font-medium">{o.orderNo}</span>
                      </div>
                    </div>
                  </button>
                </td>

                <td className="px-4 py-4 text-[11px] text-slate-600">
                  {o.dateOrdered}
                </td>

                <td className="px-4 py-4 text-[11px] text-slate-600">
                  {o.qtyLabel}
                </td>

                <td className="px-4 py-4">
                  <StatusPill status={o.status} />
                </td>

                <td className="px-4 py-4 text-[12px] font-semibold text-slate-900">
                  {o.total}
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2 text-slate-500">
                    <ActionIconButton
                      label="View"
                      onClick={() => {
                        goToOrderDetails(o.viewHref);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </ActionIconButton>

                    <ActionIconButton
                      label="Copy"
                      onClick={async () => {
                        if (!o.copyValue) return;
                        await navigator.clipboard.writeText(o.copyValue);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </ActionIconButton>

                    <ActionIconButton
                      label="Reorder"
                      onClick={async () => {
                        if (!o.reorderOrderId) return;

                        try {
                          const data = await reorderBackendCart({
                            orderId: o.reorderOrderId,
                          });

                          syncItems(
                            data.items.map((item) => ({
                              productId: item.productId,
                              quantity: item.quantity,
                            })),
                          );

                          router.push(o.reorderHref || "/public/cart");
                        } catch (error) {
                          console.error("Failed to reorder cart", error);
                        }
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </ActionIconButton>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-[11px] text-slate-500">
          Showing {showingFrom} to {showingTo} of {total} orders
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => props.onPageChange?.(currentPage - 1)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <PagePill
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => props.onPageChange?.(pageNumber)}
              >
                {pageNumber}
              </PagePill>
            ),
          )}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => props.onPageChange?.(currentPage + 1)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Go to page</span>
          <input
            value={currentPage}
            readOnly
            className="h-8 w-12 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-900 outline-none"
          />
        </div>
      </div>
    </section>
  );
}

function DropdownButton({
  label,
  leftIcon,
  rightIcon,
  onClick,
}: {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
    >
      {leftIcon ? <span className="text-slate-400">{leftIcon}</span> : null}
      <span>{label}</span>
      <span className="ml-2 text-slate-400">
        {rightIcon ?? <ChevronDown className="h-4 w-4" />}
      </span>
    </button>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const style =
    status === "Ordered"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : status === "Processing"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : status === "Shipped"
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold ring-1",
        style,
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ActionIconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
    >
      {children}
    </button>
  );
}

function PagePill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "grid h-8 w-8 place-items-center rounded-lg text-[11px] font-semibold",
        active
          ? "bg-sky-500 text-white shadow-[0_10px_20px_rgba(2,132,199,0.20)]"
          : "text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}