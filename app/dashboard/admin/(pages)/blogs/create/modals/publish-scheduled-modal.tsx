"use client";

import { CalendarDays, X } from "lucide-react";
import { GhostBtn, PrimaryBtn } from "../shared/editor-form-controls";

type PublishScheduledModalProps = {
  title: string;
  publishDate: string;
  publishTime: string;
  onClose: () => void;
  onViewSchedule: () => void;
  onReturnDashboard: () => void;
};

export default function PublishScheduledModal({
  title,
  publishDate,
  publishTime,
  onClose,
  onViewSchedule,
  onReturnDashboard,
}: PublishScheduledModalProps) {
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
          <CalendarDays size={18} className="text-[var(--primary)]" />
        </div>

        <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
          Article Scheduled Successfully
        </h3>

        <p className="mt-2 text-center text-xs leading-5 text-slate-500">
          Your clinical update has been successfully queued for publication. It
          will go live and notify subscribers at the selected time.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Article Title
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Publish Date
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {publishDate}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Publish Time
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {publishTime}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <GhostBtn onClick={onViewSchedule} className="px-4">
            View Schedule
          </GhostBtn>
          <PrimaryBtn onClick={onReturnDashboard} className="px-4">
            Return to Dashboard
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}