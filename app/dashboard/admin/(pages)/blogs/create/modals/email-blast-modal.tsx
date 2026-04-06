"use client";

import { CalendarDays, FileText } from "lucide-react";
import { useState } from "react";

type EmailBlastModalProps = {
  title: string;
  onBack: () => void;
  onClose: () => void;
  onSend: () => void;
};

export default function EmailBlastModal({
  title,
  onBack,
  onClose,
  onSend,
}: EmailBlastModalProps) {
  const [sendCopy, setSendCopy] = useState(true);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-slate-900">
          Send Email Blast
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          You are about to send an immediate notification for this article.
        </p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
            Next Campaign
          </p>

          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Weekly Clinical Briefing
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-slate-400" />
                  Next Sunday, Nov 08
                </span>

                <span className="inline-flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />3 Articles in
                  Queue
                </span>
              </div>
            </div>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-[var(--primary)] transition hover:bg-slate-50"
              aria-label="Open newsletter"
            >
              ✉️
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Newsletter Preview
          </p>

          <div className="mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100" />

            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Recent longitudinal studies demonstrate that hybrid intubation
                techniques significantly reduce first-pass failure rates in
                traum...
              </p>
            </div>
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={sendCopy}
            onChange={() => setSendCopy((v) => !v)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--primary)]"
          />
          <span>Send a copy to my admin email for verification.</span>
        </label>

        <p className="mt-2 text-[11px] text-slate-400">
          Note: This action cannot be undone once the broadcast begins.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-10 w-[110px] rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onSend}
            className="h-10 rounded-md bg-[var(--primary)] px-5 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            <span className="inline-flex items-center gap-2">
              <span aria-hidden>▶</span> Send Blast Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
