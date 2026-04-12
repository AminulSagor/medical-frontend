"use client";

import { Check, FileText } from "lucide-react";
import Dialog from "@/components/dialog/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReturnToDashboard: () => void;
  recipientCount?: number;
  scheduledDateText?: string;
  articleTitle?: string;
};

export default function BroadcastScheduledSuccessDialog({
  open,
  onOpenChange,
  onReturnToDashboard,
  recipientCount = 2450,
  scheduledDateText = "Nov 22, 2026 at 09:00 AM",
  articleTitle = "New Clinical Insights: Pediatric Airway Management",
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      hideClose
      size="md"
      className="rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#18c3b2] shadow-[0_10px_24px_rgba(24,195,178,0.22)]">
            <Check className="h-8 w-8 text-white" strokeWidth={3} />
          </div>

          <h2 className="mt-6 max-w-[280px] text-[28px] font-semibold leading-[1.1] text-slate-800">
            Broadcast Scheduled Successfully
          </h2>

          <p className="mt-4 max-w-[340px] text-sm leading-6 text-slate-500">
            The clinical communication has been successfully queued for
            delivery. It will be sent to{" "}
            <span className="font-semibold text-slate-700">
              {recipientCount.toLocaleString()} recipients
            </span>{" "}
            on {scheduledDateText}.
          </p>

          <div className="mt-7 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <FileText className="h-5 w-5 text-[#18c3b2]" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Article Title
                </p>
                <p className="mt-1 text-sm font-medium leading-5 text-slate-700">
                  {articleTitle}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onReturnToDashboard}
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#18c3b2] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(24,195,178,0.28)] transition hover:opacity-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </Dialog>
  );
}