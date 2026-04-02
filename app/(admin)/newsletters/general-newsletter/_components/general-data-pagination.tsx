"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationState } from "@/app/(admin)/newsletters/general-newsletter/types/general-newsletter-data.type";

type Props = {
  pagination: PaginationState;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function GeneralDataPagination({ pagination }: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400"
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
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}