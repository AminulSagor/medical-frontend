"use client";

import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

import type {
  TransmissionReportRecipientLogItem,
  TransmissionReportRecipientLogMeta,
} from "@/types/admin/newsletter/dashboard/transmission-report.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getStatusClasses(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "CLICKED") {
    return "border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]";
  }

  if (normalized === "OPENED") {
    return "border border-[#bbf7d0] bg-[#ecfdf3] text-[#059669]";
  }

  if (normalized === "BOUNCED") {
    return "border border-[#fecdd3] bg-[#fff1f2] text-[#e11d48]";
  }

  if (normalized === "DELIVERED" || normalized === "SENT") {
    return "border border-slate-200 bg-slate-50 text-slate-500";
  }

  return "border border-slate-200 bg-slate-50 text-slate-500";
}

function formatStatusLabel(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "DELIVERED") return "SENT";
  return normalized;
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getAvatarTone(index: number) {
  const tones = [
    "bg-[#dbeafe] text-[#4f46e5]",
    "bg-[#dcfce7] text-[#047857]",
    "bg-[#e2e8f0] text-[#64748b]",
    "bg-[#ede9fe] text-[#7c3aed]",
  ];

  return tones[index % tones.length];
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

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100">
          <td className="px-5 py-5 md:px-7">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100" />
              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </td>
          <td className="px-5 py-5 md:px-7">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
          </td>
          <td className="px-5 py-5 md:px-7">
            <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-5 py-5 md:px-7">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          </td>
          <td className="px-5 py-5 text-right md:px-7">
            <div className="ml-auto h-6 w-6 animate-pulse rounded bg-slate-100" />
          </td>
        </tr>
      ))}
    </>
  );
}

type Props = {
  items: TransmissionReportRecipientLogItem[];
  meta: TransmissionReportRecipientLogMeta | null;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
};

export default function RecipientLogTable({
  items,
  meta,
  isLoading,
  page,
  onPageChange,
}: Props) {
  const total = meta?.total ?? 0;
  const limit = meta?.limit ?? 10;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = total === 0 ? 0 : Math.min(currentPage * limit, total);
  const pages = buildPagination(currentPage, totalPages);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50/70">
            <tr className="border-b border-slate-100">
              <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:px-7">
                Recipient
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:px-7">
                Status
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:px-7">
                Device
              </th>
              <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:px-7">
                Timestamp
              </th>
              <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:px-7">
                &nbsp;
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {isLoading ? (
              <SkeletonRows />
            ) : items.length > 0 ? (
              items.map((item, index) => {
                const avatarTone = getAvatarTone(index);

                return (
                  <tr
                    key={`${item.recipient.email}-${item.timestamp}-${index}`}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/40"
                  >
                    <td className="px-5 py-5 align-middle md:px-7">
                      <div className="flex items-center gap-3">
                        <div
                          className={cx(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            avatarTone,
                          )}
                        >
                          {getInitials(item.recipient.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.recipient.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.recipient.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5 align-middle md:px-7">
                      <span
                        className={cx(
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
                          getStatusClasses(item.status),
                        )}
                      >
                        {formatStatusLabel(item.status)}
                      </span>
                    </td>

                    <td className="px-5 py-5 align-middle md:px-7">
                      <span className="text-xs font-medium text-slate-400">
                        — No Data —
                      </span>
                    </td>

                    <td className="px-5 py-5 align-middle md:px-7">
                      <span className="text-xs font-semibold text-slate-500">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-right align-middle md:px-7">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-50 hover:text-slate-500"
                        aria-label="More actions"
                      >
                        <Ellipsis size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center md:px-7">
                  <p className="text-sm font-semibold text-slate-700">
                    No recipient activity found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try a different tab or search term.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
        <p className="text-xs font-medium text-slate-500">
          Showing {start} to {end} of {total.toLocaleString()} results
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || isLoading}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition",
              currentPage <= 1 || isLoading
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-500 hover:bg-slate-50",
            )}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-2">
            {pages.map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-xs font-semibold text-slate-400"
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
                    "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-xs font-semibold transition",
                    currentPage === item
                      ? "border-[var(--primary)] bg-[var(--primary-50)] text-[var(--primary)]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition",
              currentPage >= totalPages || isLoading
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-500 hover:bg-slate-50",
            )}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
