"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
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

  // compact window like screenshot: 1 2 3 ... 52
  const last = totalPages;

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
        DISPLAYING {from}-{to} OF {total.toLocaleString()} SUBSCRIBERS
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(page - 1)}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-slate-200/70 hover:bg-slate-50"
        >
          <ChevronLeft size={16} className="text-slate-500" />
        </button>

        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => go(n)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ring-1",
              page === n
                ? "bg-teal-500 text-white ring-teal-500"
                : "bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50"
            )}
          >
            {n}
          </button>
        ))}

        <span className="px-1 text-slate-400">…</span>

        <button
          type="button"
          onClick={() => go(last)}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ring-1",
            page === last
              ? "bg-teal-500 text-white ring-teal-500"
              : "bg-white text-slate-700 ring-slate-200/70 hover:bg-slate-50"
          )}
        >
          {last}
        </button>

        <button
          type="button"
          onClick={() => go(page + 1)}
          className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-slate-200/70 hover:bg-slate-50"
        >
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}