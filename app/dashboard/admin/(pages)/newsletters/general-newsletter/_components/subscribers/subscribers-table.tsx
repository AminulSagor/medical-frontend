"use client";

import { Eye, Trash2 } from "lucide-react";
import type { SubscriberRow } from "../../types/subscribers-type";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

function SourceTag({ source }: { source: SubscriberRow["source"] }) {
  const map: Record<string, string> = {
    FOOTER: "bg-teal-50 text-teal-700 ring-teal-100",
    POPUP: "bg-slate-50 text-slate-700 ring-slate-200",
    WEBINAR: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    CHECKOUT: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ring-1",
        map[source]
      )}
    >
      {source}
    </span>
  );
}

function StatusPill({ status }: { status: SubscriberRow["status"] }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    INACTIVE: "bg-slate-50 text-slate-700 ring-slate-200",
    BOUNCED: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ring-1",
        map[status]
      )}
    >
      {status}
    </span>
  );
}

function EngagementBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <div className="h-[6px] w-[92px] rounded-full bg-slate-100">
        <div
          className="h-[6px] rounded-full bg-teal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-teal-600">{pct}%</span>
    </div>
  );
}

export default function SubscribersTable({
  rows,
  selected,
  onToggleOne,
  onToggleAllOnPage,
}: {
  rows: SubscriberRow[];
  selected: Record<string, boolean>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (ids: string[], next: boolean) => void;
}) {
  const ids = rows.map((r) => r.id);
  const allSelected = rows.length > 0 && rows.every((r) => selected[r.id]);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
      {/* header */}
      <div className="overflow-x-auto">
        <div className="min-w-[1120px]">
          <div className="grid grid-cols-[46px_320px_260px_160px_120px_120px_170px_140px_140px_110px] border-b bg-slate-50 px-4 py-3 text-[10px] font-bold tracking-[0.22em] text-slate-400">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onToggleAllOnPage(ids, !allSelected)}
                className="h-4 w-4 accent-teal-500"
              />
            </div>
            <div>SUBSCRIBER IDENTITY</div>
            <div>CLINICAL ROLE</div>
            <div>SOURCE</div>
            <div>RECEIVED</div>
            <div>OPENED</div>
            <div>ENGAGEMENT RATE</div>
            <div>JOINED DATE</div>
            <div>STATUS</div>
            <div className="text-right pr-2">ACTIONS</div>
          </div>

          {/* rows */}
          {rows.map((r, idx) => {
            const checked = !!selected[r.id];

            return (
              <div
                key={r.id}
                className={cn(
                  "grid grid-cols-[46px_320px_260px_160px_120px_120px_170px_140px_140px_110px] items-center px-4 py-4",
                  idx !== rows.length - 1 && "border-b border-slate-100"
                )}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleOne(r.id)}
                    className="h-4 w-4 accent-teal-500"
                  />
                </div>

                {/* identity */}
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200/60">
                    {r.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.avatarUrl} alt={`${r.name} avatar`} className="h-full w-full object-cover" />
                    ) : (
                      (r.avatarInitials ?? r.name.slice(0, 2)).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    {/* Name style you asked: 12 bold */}
                    <p className="text-[12px] font-bold leading-[15px] text-slate-900">
                      {r.name}
                    </p>
                    <p className="text-[10px] font-medium leading-[15px] text-slate-500">
                      {r.email}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-slate-700">{r.clinicalRole ?? "—"}</div>

                <div>
                  <SourceTag source={r.source} />
                </div>

                <div className="text-sm font-semibold text-slate-900">{r.received}</div>

                <div className="text-sm font-semibold text-slate-900">{r.opened}</div>

                <div>
                  <EngagementBar value={r.engagementRate} />
                </div>

                <div className="text-sm text-slate-600">{r.joinedDateLabel}</div>

                <div>
                  <StatusPill status={r.status} />
                </div>

                <div className="flex items-center justify-end gap-4 pr-2 text-slate-400">
                  <button className="hover:text-slate-700" aria-label="View">
                    <Eye size={16} />
                  </button>
                  <button className="hover:text-slate-700" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}