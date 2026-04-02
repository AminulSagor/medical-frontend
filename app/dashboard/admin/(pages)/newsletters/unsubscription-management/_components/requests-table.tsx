"use client";

import { useMemo, useState } from "react";
import type { UnsubRow } from "../_lib/unsubscription-management-types";
import { Eye, Trash2, CheckCircle2 } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

function Tag({ label, tone }: { label: string; tone?: "teal" | "slate" }) {
  const cls =
    tone === "teal"
      ? "bg-teal-50 text-teal-700 ring-teal-100"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ring-1",
        cls
      )}
    >
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: UnsubRow["status"] }) {
  const isPending = status === "pending";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ring-1",
        isPending
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      )}
    >
      {isPending ? "PENDING" : "PROCESSED"}
    </span>
  );
}

export default function RequestsTable({
  rows,
  onOpenDetails,
}: {
  rows: UnsubRow[];
  onOpenDetails?: (id: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const allSelected = useMemo(() => {
    if (rows.length === 0) return false;
    return rows.every((r) => selected[r.id]);
  }, [rows, selected]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next: Record<string, boolean> = { ...prev };
      const should = !allSelected;
      rows.forEach((r) => (next[r.id] = should));
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
      <div className="grid grid-cols-[44px_1.5fr_110px_160px_1.3fr_120px_110px] border-b bg-slate-50 px-4 py-3 text-[10px] font-bold tracking-[0.22em] text-slate-400">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="h-4 w-4 accent-teal-500"
          />
        </div>
        <div>SUBSCRIBER</div>
        <div>REQUEST DATE</div>
        <div>SOURCE/SEGMENT</div>
        <div>FEEDBACK</div>
        <div>STATUS</div>
        <div className="text-right pr-2">ACTIONS</div>
      </div>

      {rows.map((r, idx) => {
        const checked = !!selected[r.id];

        return (
          <div
            key={r.id}
            className={cn(
              "grid grid-cols-[44px_1.5fr_110px_160px_1.3fr_120px_110px] items-center px-4 py-4",
              idx !== rows.length - 1 && "border-b border-slate-100"
            )}
          >
            {/* checkbox */}
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setSelected((p) => ({ ...p, [r.id]: !p[r.id] }))
                }
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 accent-teal-500"
              />
            </div>

            {/* subscriber */}
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200/60">
                {r.initials ?? r.subscriberName.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-[17.5px] text-slate-900">
                  {r.subscriberName}
                </p>
                <p className="text-[10px] font-medium leading-[15px] text-slate-500 lowercase">
                  {r.subscriberEmail.toLowerCase()}
                </p>
              </div>
            </div>

            {/* date */}
            <div className="text-sm text-slate-700">{r.requestDateLabel}</div>

            {/* source */}
            <div>
              <Tag label={r.source.label} tone={r.source.tone} />
            </div>

            {/* feedback */}
            <div className="truncate text-sm text-slate-600">
              {r.feedback ? `“${r.feedback}”` : "—"}
            </div>

            {/* status */}
            <div>
              <StatusPill status={r.status} />
            </div>

            {/* actions */}
            <div className="flex items-center justify-end gap-3 pr-2 text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // dummy action
                }}
                className="hover:text-teal-600"
                aria-label="Process"
              >
                <CheckCircle2 size={16} />
              </button>

              {/* OPEN MODAL FROM HERE (send only id) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(r.id);
                }}
                className="hover:text-slate-700"
                aria-label="View"
              >
                <Eye size={16} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // dummy delete
                }}
                className="hover:text-rose-600"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}