"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, Eye } from "lucide-react";

import type {
  TransmissionHistoryItem,
  TransmissionHistoryMeta,
} from "@/types/admin/newsletter/dashboard/transmission-history.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatTypeLabel(label: string) {
  const normalized = label.trim();

  if (!normalized) return "—";

  return normalized;
}

function getTypeBadgeClass(label: string) {
  const normalized = label.toUpperCase();

  if (normalized === "MARKETING") {
    return "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]";
  }

  if (normalized === "CLASS UPDATE") {
    return "border-[#ede9fe] bg-[#f5f3ff] text-[#7c3aed]";
  }

  return "border-[#fed7aa] bg-[#fff7ed] text-[#f97316]";
}

function TypeBadge({ label }: { label: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        getTypeBadgeClass(label),
      )}
    >
      {formatTypeLabel(label)}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const normalized = status.toUpperCase();

  const cls =
    normalized === "SENT"
      ? "bg-[#12b76a]"
      : normalized === "QUEUED"
        ? "bg-amber-400"
        : normalized === "CANCELLED"
          ? "bg-rose-500"
          : "bg-slate-400";

  return <span className={cx("h-2 w-2 rounded-full", cls)} />;
}

function RateBar({
  openRatePct,
  clickRatePct,
}: {
  openRatePct: number;
  clickRatePct: number;
}) {
  const openW = Math.max(0, Math.min(100, openRatePct));
  const clickW = Math.max(0, Math.min(100, clickRatePct));

  return (
    <div className="min-w-[220px]">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span>{openW}%</span>
        <span className="text-[#14b8ad]">{clickW}% clicks</span>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-slate-400"
          style={{ width: `${openW}%` }}
        />
        <div
          className="-mt-2 h-2 rounded-full bg-[#14b8ad]"
          style={{ width: `${clickW}%` }}
        />
      </div>
    </div>
  );
}

function formatSentDate(sentAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(sentAt));
}

type PaginationItem = number | "...";

function buildPagination(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100">
          <td className="px-4 py-5">
            <div className="h-4 w-4 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="h-10 w-24 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-6 py-5">
            <div className="ml-auto h-9 w-20 animate-pulse rounded bg-slate-100" />
          </td>
        </tr>
      ))}
    </>
  );
}

type Props = {
  items: TransmissionHistoryItem[];
  meta: TransmissionHistoryMeta | null;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  selectedIds: string[];
  onSelectedIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TransmissionDetailsTable({
  items,
  meta,
  isLoading,
  page,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
}: Props) {
  const total = meta?.total ?? 0;
  const limit = meta?.limit ?? 10;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * limit, total);
  const pages = buildPagination(currentPage, totalPages);

  const currentPageIds = items.map((item) => item.id);
  const hasRows = currentPageIds.length > 0;
  const isAllCurrentPageSelected =
    hasRows && currentPageIds.every((id) => selectedIds.includes(id));

  const handleToggleOne = (id: string) => {
    onSelectedIdsChange((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleToggleAllCurrentPage = () => {
    if (isAllCurrentPageSelected) {
      onSelectedIdsChange((prev) =>
        prev.filter((id) => !currentPageIds.includes(id)),
      );
      return;
    }

    onSelectedIdsChange((prev) => {
      const next = new Set(prev);
      currentPageIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  return (
    <section className="px-4 pb-10 md:px-6">
      <div className="mx-auto w-full">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1140px] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: 56 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 360 }} />
                <col style={{ width: 260 }} />
                <col style={{ width: 240 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 110 }} />
              </colgroup>

              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleToggleAllCurrentPage}
                      disabled={isLoading || !hasRows}
                      className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      aria-label="Select all rows on current page"
                    />
                  </th>

                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Status/Type
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Target Audience
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Open/Click Rate
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Sent Date
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <TableSkeletonRows />
                ) : items.length > 0 ? (
                  items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={cx(
                          "hover:bg-slate-50/60",
                          isSelected && "bg-[var(--primary-50)]/40",
                        )}
                      >
                        <td className="px-4 py-5 align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleOne(item.id)}
                            className="h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                            aria-label={`Select transmission ${item.id}`}
                          />
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center gap-2">
                            <StatusDot status={item.status.code} />
                            <span className="text-sm font-semibold text-slate-700">
                              {item.status.label}
                            </span>
                          </div>

                          <div className="mt-2">
                            <TypeBadge label={item.type.label} />
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.subject}
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-400">
                            ID: #{item.id}
                          </p>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span className="text-slate-400">👥</span>
                            {item.targetAudience}
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <RateBar
                            openRatePct={item.rates.openRatePercent}
                            clickRatePct={item.rates.clickRatePercent}
                          />
                        </td>

                        <td className="px-6 py-5 align-top text-sm font-semibold text-slate-700">
                          {formatSentDate(item.sentAt)}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center justify-end gap-2">
                            {item.actions.viewSentContent ? (
                              <Link
                                href={`/dashboard/admin/newsletters/transmission-history/${item.id}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600"
                                aria-label="View"
                              >
                                <Eye size={16} />
                              </Link>
                            ) : null}

                            {item.actions.viewReport ? (
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600"
                                aria-label="Copy"
                              >
                                <Copy size={16} />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        No transmission history found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try changing search or sort order.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Showing {start}-{end} of {total.toLocaleString()} communications
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1 || isLoading}
                className={cx(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200",
                  currentPage <= 1 || isLoading
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-400 hover:bg-slate-50",
                )}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {pages.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm font-semibold text-slate-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onPageChange(item)}
                    disabled={isLoading}
                    className={cx(
                      "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold",
                      currentPage === item
                        ? "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage >= totalPages || isLoading}
                className={cx(
                  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200",
                  currentPage >= totalPages || isLoading
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-400 hover:bg-slate-50",
                )}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
