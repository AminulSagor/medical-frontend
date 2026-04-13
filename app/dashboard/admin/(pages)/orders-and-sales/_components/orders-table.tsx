"use client";

import {
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type FulfillmentStatus = "shipped" | "processing" | "received";
export type PaymentStatusFilter = "all" | "paid" | "pending" | "refunded";

export type OrderRow = {
  id: string;
  orderCode: string;
  date: string;
  customer: string;
  customerEmail?: string;
  customerAvatar?: string | null;
  type: "product" | "course";
  paymentStatus: "paid" | "pending" | "refunded";
  fulfillment: FulfillmentStatus;
  fulfillmentLabel?: string;
  total: string;
};

const OPTIONS: PaymentStatusFilter[] = ["all", "paid", "pending", "refunded"];

function Pill({
  tone,
  label,
  showDot = true,
}: {
  tone: "green" | "orange" | "red" | "slate" | "purple" | "blue";
  label: string;
  showDot?: boolean;
}) {
  const map: Record<string, { wrap: string; dot: string }> = {
    green: {
      wrap: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-500",
    },
    orange: {
      wrap: "bg-orange-50 text-orange-700 ring-orange-100",
      dot: "bg-orange-500",
    },
    red: {
      wrap: "bg-rose-50 text-rose-700 ring-rose-100",
      dot: "bg-rose-500",
    },
    slate: {
      wrap: "bg-slate-50 text-slate-700 ring-slate-200",
      dot: "bg-slate-400",
    },
    purple: {
      wrap: "bg-purple-50 text-purple-700 ring-purple-100",
      dot: "bg-purple-500",
    },
    blue: {
      wrap: "bg-blue-50 text-blue-700 ring-blue-100",
      dot: "bg-blue-500",
    },
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ring-1",
        map[tone].wrap,
      ].join(" ")}
    >
      {showDot && (
        <span className={["h-2 w-2 rounded-full", map[tone].dot].join(" ")} />
      )}
      {label}
    </span>
  );
}

function DotStatus({
  tone,
  label,
}: {
  tone: "green" | "orange" | "slate";
  label: string;
}) {
  const map = {
    green: {
      outer: "bg-emerald-100",
      inner: "bg-emerald-500",
    },
    orange: {
      outer: "bg-orange-100",
      inner: "bg-orange-500",
    },
    slate: {
      outer: "bg-slate-100",
      inner: "bg-slate-400",
    },
  };

  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-700">
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span
          className={["absolute h-5 w-5 rounded-full", map[tone].outer].join(
            " ",
          )}
        />
        <span
          className={["relative h-2 w-2 rounded-full", map[tone].inner].join(
            " ",
          )}
        />
      </span>

      {label}
    </span>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = (parts[0]?.[0] ?? "").toUpperCase();
  const b = (parts[1]?.[0] ?? "").toUpperCase();
  return a + b || "U";
}

function avatarStyle(name: string) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }

  const hue = hash % 360;
  const a = `hsl(${hue} 85% 70%)`;
  const b = `hsl(${(hue + 35) % 360} 85% 55%)`;

  return {
    backgroundImage: `linear-gradient(135deg, ${a}, ${b})`,
  } as React.CSSProperties;
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => canPrev && onChange(page - 1)}
        className={[
          "rounded-full px-4 py-2 text-xs font-semibold",
          canPrev
            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            : "border border-slate-200 bg-white text-slate-300",
        ].join(" ")}
      >
        Previous
      </button>

      {pages.map((p) => {
        const active = p === page;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={[
              "grid h-9 w-9 place-items-center rounded-full text-xs font-semibold",
              active
                ? "bg-[var(--primary)] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => canNext && onChange(page + 1)}
        className={[
          "rounded-full px-4 py-2 text-xs font-semibold",
          canNext
            ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            : "border border-slate-200 bg-white text-slate-300",
        ].join(" ")}
      >
        Next
      </button>
    </div>
  );
}

export default function OrdersTable({
  rows,
  search,
  onSearchChange,
  status,
  onStatusChange,
  page,
  pageSize,
  totalCount,
  totalPages,
  isLoading = false,
  onPageChange,
}: {
  rows: OrderRow[];
  search: string;
  onSearchChange: (v: string) => void;
  status: PaymentStatusFilter;
  onStatusChange: (v: PaymentStatusFilter) => void;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (p: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<PaymentStatusFilter | null>(null);
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) {
        return;
      }

      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHovered(null);
      }
    };

    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Recent Transactions
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Real-time ledger of all academy orders
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
          <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 sm:w-[360px] focus-within:ring-2 focus-within:ring-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search by Order ID or Customer..."
            />
          </div>

          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => {
                setOpen((prev) => {
                  const next = !prev;

                  if (!next) {
                    setHovered(null);
                  }

                  return next;
                });
              }}
            >
              <Filter size={16} className="text-slate-500" />
              {status === "all"
                ? "Filter Status"
                : status.charAt(0).toUpperCase() + status.slice(1)}
              <ChevronDown size={16} className="text-slate-500" />
            </button>

            {open && (
              <div
                className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                onMouseLeave={() => setHovered(null)}
              >
                {OPTIONS.map((s) => {
                  const active = status === s;
                  const isHighlighted = hovered ? hovered === s : active;

                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        onStatusChange(s);
                        setHovered(null);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setHovered(s)}
                      className={[
                        "block w-full cursor-pointer px-4 py-2 text-left text-sm transition",
                        isHighlighted
                          ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "text-slate-700",
                      ].join(" ")}
                    >
                      {s === "all"
                        ? "All"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full">
          <thead className="bg-slate-100/70">
            <tr className="text-left text-[11px] font-semibold tracking-wide text-slate-500">
              <th className="px-6 py-3">ORDER ID</th>
              <th className="px-6 py-3">DATE</th>
              <th className="px-6 py-3">CUSTOMER</th>
              <th className="px-6 py-3">TYPE</th>
              <th className="px-6 py-3">PAYMENT STATUS</th>
              <th className="px-6 py-3">FULFILLMENT</th>
              <th className="px-6 py-3">TOTAL</th>
              <th className="px-6 py-3 text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-6 py-10 text-sm text-slate-500" colSpan={8}>
                  Loading transactions...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-sm text-slate-500" colSpan={8}>
                  No orders found.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const typePill =
                  r.type === "product" ? (
                    <Pill tone="purple" label="PRODUCT" showDot={false} />
                  ) : (
                    <Pill tone="blue" label="COURSE" showDot={false} />
                  );

                const payPill =
                  r.paymentStatus === "paid" ? (
                    <Pill tone="green" label="PAID" />
                  ) : r.paymentStatus === "pending" ? (
                    <Pill tone="orange" label="PENDING" />
                  ) : (
                    <Pill tone="red" label="REFUNDED" />
                  );

                const fulfillmentLabel = (
                  r.fulfillmentLabel || r.fulfillment
                ).toUpperCase();

                const fulfill =
                  r.fulfillment === "shipped" ? (
                    <DotStatus tone="green" label={fulfillmentLabel} />
                  ) : r.fulfillment === "processing" ? (
                    <DotStatus tone="orange" label={fulfillmentLabel} />
                  ) : (
                    <DotStatus tone="slate" label={fulfillmentLabel} />
                  );

                return (
                  <tr
                    key={r.id}
                    className="border-t border-slate-100 text-sm text-slate-800 hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
                      <span className="font-semibold text-[var(--primary)]">
                        {r.orderCode}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-600">{r.date}</td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-full ring-1 ring-white shadow-sm"
                          style={avatarStyle(r.customer)}
                          aria-hidden
                        />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {r.customer}
                          </div>
                          {r.customerEmail ? (
                            <div className="text-xs text-slate-500">
                              {r.customerEmail}
                            </div>
                          ) : null}
                          <span className="sr-only">
                            {initials(r.customer)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">{typePill}</td>
                    <td className="px-6 py-5">{payPill}</td>
                    <td className="px-6 py-5">{fulfill}</td>
                    <td className="px-6 py-5 font-bold text-slate-900">
                      {r.total}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/dashboard/admin/orders-and-sales/${encodeURIComponent(r.id)}`}
                          className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
                          aria-label="View"
                        >
                          <Eye size={16} />
                        </Link>
                        {/* <button
                          className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
                          aria-label="Docs"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          className="grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
                          aria-label="More"
                        >
                          <MoreHorizontal size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs tracking-wide text-slate-500">
          SHOWING <span className="font-bold text-slate-700">{from}</span> TO{" "}
          <span className="font-bold text-slate-700">{to}</span> OF{" "}
          <span className="font-bold text-slate-700">{totalCount}</span>
        </p>

        <Pagination
          page={page}
          totalPages={Math.max(1, totalPages)}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
