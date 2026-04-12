"use client";

import { Users } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export type BulkBreakdownItem = {
  id: string;
  label: string; // "General Newsletter"
  count: number; // 10
};

export default function ProcessBulkModal({
  open,
  totalSelected,
  breakdown,
  removePermanently,
  sendEmails,
  onToggleRemovePermanently,
  onToggleSendEmails,
  onClose,
  onProcess,
}: {
  open: boolean;

  totalSelected: number;
  breakdown: BulkBreakdownItem[];

  removePermanently: boolean;
  sendEmails: boolean;

  onToggleRemovePermanently: () => void;
  onToggleSendEmails: () => void;

  onClose: () => void;
  onProcess: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95]">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close"
      />

      <div className="absolute left-1/2 top-1/2 w-[720px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-[16px] bg-white shadow-[0_30px_80px_rgba(2,6,23,0.35)] ring-1 ring-slate-200/60">
          {/* Header */}
          <div className="px-8 pt-7 text-center">
            <h2 className="text-[20px] font-bold text-slate-900">
              Process Bulk Unsubscriptions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              You have selected{" "}
              <span className="font-semibold text-slate-700">
                {totalSelected}
              </span>{" "}
              pending requests for processing.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-6 pt-6">
            {/* Summary card */}
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/60">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                  <Users size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    {totalSelected} Subscribers Selected
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Breakdown by Segment:
                  </p>

                  <div className="mt-2 text-xs text-slate-500">
                    {breakdown.map((b, i) => (
                      <div key={b.id} className="flex items-center gap-2">
                        <span className="text-slate-400">•</span>
                        <span>{b.label}:</span>
                        <span className="font-semibold text-slate-600">
                          {b.count}
                        </span>
                        {i === breakdown.length - 1 ? null : null}
                      </div>
                    ))}

                    {breakdown.length === 0 ? (
                      <p className="text-xs text-slate-500">No selected segment data.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={removePermanently}
                  onChange={onToggleRemovePermanently}
                  className="mt-[3px] h-4 w-4 accent-teal-500"
                />
                <span className="text-sm text-slate-700">
                  Permanently remove selected subscribers from their requested
                  lists.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={sendEmails}
                  onChange={onToggleSendEmails}
                  className="mt-[3px] h-4 w-4 accent-teal-500"
                />
                <span className="text-sm text-slate-700">
                  Send automated confirmation emails to all{" "}
                  <span className="font-semibold">{totalSelected}</span>{" "}
                  subscribers.
                </span>
              </label>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
                NOTE: THIS ACTION IS FINAL AND WILL UPDATE{" "}
                {totalSelected} CLINICAL RECORDS IN THE DATABASE.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-8 py-5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl bg-white px-5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200/70 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onProcess}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-teal-500 px-5 text-sm font-bold text-white shadow-sm hover:bg-teal-600"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-white/15">
                ✓
              </span>
              Process All Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}