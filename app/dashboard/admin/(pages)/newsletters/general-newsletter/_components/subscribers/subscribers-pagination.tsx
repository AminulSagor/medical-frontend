"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

function getVisiblePages(page: number, totalPages: number): number[] {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 2) {
    return [1, 2, 3];
  }

  if (page >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [page - 1, page, page + 1];
}

export default function SubscribersPagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const go = (p: number) => onChange(Math.max(1, Math.min(totalPages, p)));
  const visiblePages = getVisiblePages(page, totalPages);
  const showTrailingEllipsis =
    totalPages > 4 && visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
        DISPLAYING {from}-{to} OF {total.toLocaleString()} SUBSCRIBERS
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-slate-200/70 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} className="text-slate-500" />
        </button>

        {visiblePages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ring-1",
              page === n
                ? "bg-teal-500 text-white ring-teal-500"
                : "bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50",
            )}
          >
            {n}
          </button>
        ))}

        {showTrailingEllipsis ? (
          <>
            <span className="px-1 text-slate-400">…</span>
            <button
              type="button"
              onClick={() => go(totalPages)}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ring-1",
                page === totalPages
                  ? "bg-teal-500 text-white ring-teal-500"
                  : "bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50",
              )}
            >
              {totalPages}
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-slate-200/70 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}