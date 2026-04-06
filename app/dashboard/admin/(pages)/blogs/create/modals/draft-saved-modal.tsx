"use client";

import { FileText, X } from "lucide-react";

type DraftSavedModalProps = {
  title: string;
  onClose: () => void;
  onContinue: () => void;
  onReturn: () => void;
};

export default function DraftSavedModal({
  title,
  onClose,
  onContinue,
  onReturn,
}: DraftSavedModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-cyan-100">
          <FileText size={18} className="text-[var(--primary)]" />
        </div>

        <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
          Draft Saved Successfully
        </h3>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Article Title
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {title.length > 34 ? `${title.slice(0, 34)}...` : title}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Last Saved
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                Just now
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                DRAFT
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-slate-500">
          Your progress has been safely stored. This article will remain as a
          draft and will not be visible to the public until you choose to
          publish it.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onContinue}
            className="h-10 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            Continue Editing
          </button>

          <button
            type="button"
            onClick={onReturn}
            className="h-10 w-full rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Return to Blog Management
          </button>
        </div>
      </div>
    </div>
  );
}