"use client";

import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
        map[source] ?? "bg-slate-50 text-slate-700 ring-slate-200",
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
    UNSUBSCRIBED: "bg-amber-50 text-amber-700 ring-amber-200",
    SUPPRESSED: "bg-violet-50 text-violet-700 ring-violet-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ring-1",
        map[status] ?? "bg-slate-50 text-slate-700 ring-slate-200",
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
      <div className="h-[6px] w-[92px] overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-[width]"
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
  onUpdateStatus,
  isUpdating = false,
}: {
  rows: SubscriberRow[];
  selected: Record<string, boolean>;
  onToggleOne: (id: string) => void;
  onToggleAllOnPage: (ids: string[], next: boolean) => void;
  onUpdateStatus: (subscriberId: string) => void;
  isUpdating?: boolean;
}) {
  const router = useRouter();
  const ids = rows.map((r) => r.id);
  const allSelected = rows.length > 0 && rows.every((r) => selected[r.id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="h-[2px] w-full bg-slate-200" />

      <div className="overflow-x-auto">
        <table className="min-w-[1120px] w-full border-collapse">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200">
              <th className="w-[46px] px-4 py-4 text-center align-middle">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleAllOnPage(ids, !allSelected)}
                  className="h-4 w-4 rounded border-slate-300 accent-teal-500"
                />
              </th>

              <th className="w-[320px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                SUBSCRIBER IDENTITY
              </th>

              <th className="w-[260px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                CLINICAL ROLE
              </th>

              <th className="w-[160px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                SOURCE
              </th>

              <th className="w-[120px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                RECEIVED
              </th>

              <th className="w-[120px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                OPENED
              </th>

              <th className="w-[170px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                ENGAGEMENT RATE
              </th>

              <th className="w-[140px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                JOINED DATE
              </th>

              <th className="w-[140px] px-4 py-4 text-left text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                STATUS
              </th>

              <th className="w-[110px] px-4 py-4 text-right text-[10px] font-bold tracking-[0.22em] text-slate-400 align-middle">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const checked = !!selected[r.id];
              const isUnsubscribed = r.status === "UNSUBSCRIBED";

              return (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/60 last:border-b-0"
                >
                  <td className="px-4 py-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleOne(r.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-teal-500"
                    />
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200/70">
                        {r.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.avatarUrl}
                            alt={`${r.name} avatar`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (r.avatarInitials ?? r.name.slice(0, 2)).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-5 text-slate-900">
                          {r.name}
                        </p>
                        <p className="truncate text-xs font-medium leading-5 text-slate-500">
                          {r.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-middle text-sm font-medium text-slate-700">
                    {r.clinicalRole ?? "—"}
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <SourceTag source={r.source} />
                  </td>

                  <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-900">
                    {r.received}
                  </td>

                  <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-900">
                    {r.opened}
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <EngagementBar value={r.engagementRate} />
                  </td>

                  <td className="px-4 py-4 align-middle text-sm text-slate-600">
                    {r.joinedDateLabel}
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <StatusPill status={r.status} />
                  </td>

                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        aria-label="View"
                        disabled={isUnsubscribed}
                        onClick={() => {
                          if (isUnsubscribed) return;

                          router.push(
                            `/dashboard/admin/newsletters/general-newsletter/subscribers/subscriber-profile/${r.id}`,
                          );
                        }}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Unsubscribe"
                        disabled={isUpdating || isUnsubscribed}
                        onClick={() => onUpdateStatus(r.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
