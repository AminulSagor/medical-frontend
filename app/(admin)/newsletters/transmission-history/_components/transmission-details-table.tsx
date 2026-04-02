import React from "react";
import { Eye, Copy } from "lucide-react";
import {
  TransmissionRow,
  TransmissionType,
} from "@/app/(admin)/newsletters/transmission-history/types/transmission-history.type";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypeBadge({ type }: { type: TransmissionType }) {
  const cls =
    type === "marketing"
      ? "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]"
      : type === "class_update"
        ? "border-[#ede9fe] bg-[#f5f3ff] text-[#7c3aed]"
        : "border-[#fed7aa] bg-[#fff7ed] text-[#f97316]";

  const label =
    type === "marketing"
      ? "marketing"
      : type === "class_update"
        ? "class update"
        : "newsletter";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
        cls,
      )}
    >
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: TransmissionRow["status"] }) {
  const cls =
    status === "sent"
      ? "bg-[#12b76a]"
      : status === "queued"
        ? "bg-amber-400"
        : "bg-rose-500";

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

export default function TransmissionDetailsTable({
  rows,
}: {
  rows: TransmissionRow[];
}) {
  return (
    <section className="px-4 pb-10 md:px-6">
      <div className="mx-auto w-full">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_14px_50px_rgba(15,23,42,0.06)]">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1080px] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 360 }} />
                <col style={{ width: 260 }} />
                <col style={{ width: 240 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 110 }} />
              </colgroup>

              <thead>
                <tr className="border-b border-slate-100">
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
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2">
                        <StatusDot status={r.status} />
                        <span className="text-sm font-semibold text-slate-700">
                          {r.status === "sent" ? "Sent" : r.status}
                        </span>
                      </div>

                      <div className="mt-2">
                        <TypeBadge type={r.type} />
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="text-sm font-semibold text-slate-900">
                        {r.subject}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        ID: #{r.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <span className="text-slate-400">👥</span>
                        {r.targetAudience}
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <RateBar
                        openRatePct={r.openRatePct}
                        clickRatePct={r.clickRatePct}
                      />
                    </td>

                    <td className="px-6 py-5 align-top text-sm font-semibold text-slate-700">
                      {r.sentDateLabel}
                    </td>

                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600"
                          aria-label="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600"
                          aria-label="Copy"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold text-slate-500">
              Showing 1-10 of 1,452 communications
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
                aria-label="Previous page"
              >
                ‹
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#b7efe9] bg-[#e8fbf8] text-sm font-bold text-[#14b8ad]"
              >
                1
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                2
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                3
              </button>

              <span className="px-2 text-sm font-semibold text-slate-400">
                …
              </span>

              <button
                type="button"
                className="inline-flex h-9 w-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                146
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
