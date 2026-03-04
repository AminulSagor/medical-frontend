"use client";

import { ArrowLeft, Play } from "lucide-react";

type Props = {
  onBack?: () => void;
  onDiscard?: () => void;
  onUpdateSchedule?: () => void;
};

export default function CadenceEditorHeader({
  onBack,
  onDiscard,
  onUpdateSchedule,
}: Props) {
  return (
    <header>
      <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between gap-4 py-4 md:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold text-slate-800 md:text-[20px]">
              Cadence-Based Broadcast Editor
            </h1>
            <p className="truncate text-sm text-slate-400">
              Manage administrative newsletter scheduling
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Discard
          </button>

          <button
            type="button"
            onClick={onUpdateSchedule}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:opacity-95"
          >
            <Play size={14} className="fill-current" />
            Update Schedule
          </button>
        </div>
      </div>
    </header>
  );
}
