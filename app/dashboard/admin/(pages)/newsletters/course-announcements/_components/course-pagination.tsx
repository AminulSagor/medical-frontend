"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "@/utils/course-admin-ui";

type CoursePaginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (nextPage: number) => void;
};

function buildPages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages] as const;
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [1, "...", page - 1, page, page + 1, "...", totalPages] as const;
}

export default function CoursePagination({
  page,
  limit,
  total,
  onPageChange,
}: CoursePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm font-medium text-slate-500">
        Showing <span className="font-semibold text-slate-900">{start}</span> to{" "}
        <span className="font-semibold text-slate-900">{end}</span> of{" "}
        <span className="font-semibold text-slate-900">{total}</span> cohorts
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cx(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
            page <= 1
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {pages.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex h-10 min-w-10 items-center justify-center px-2 text-sm font-semibold text-slate-400"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={cx(
                  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition",
                  page === item
                    ? "bg-teal-500 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cx(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
            page >= totalPages
              ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
