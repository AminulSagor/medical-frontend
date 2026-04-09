"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";

type Props = {
  pagination: PaginationState;
  onPageChange?: (page: number) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function GeneralDataPagination({
  pagination,
  onPageChange,
}: Props) {
  const canGoPrev = pagination.currentPage > 1;
  const canGoNext = pagination.currentPage < pagination.totalPages;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => canGoPrev && onPageChange?.(pagination.currentPage - 1)}
        disabled={!canGoPrev}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={15} />
      </button>

      {pagination.pages.map((p, index) =>
        p === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm font-medium text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange?.(p)}
            className={cx(
              "inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-sm font-semibold",
              p === pagination.currentPage
                ? "border-[#12b7ad] bg-[#12b7ad] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-500",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => canGoNext && onPageChange?.(pagination.currentPage + 1)}
        disabled={!canGoNext}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
