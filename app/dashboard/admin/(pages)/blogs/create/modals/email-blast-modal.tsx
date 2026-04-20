"use client";

import { Info, SendHorizontal } from "lucide-react";
import { useState } from "react";

type EmailBlastModalProps = {
  title: string;
  audienceLabel?: string;
  totalRecipients?: number;
  subjectPreview?: string;
  isSubmitting?: boolean;
  onBack: () => void;
  onClose: () => void;
  onSend: (sendCopy: boolean) => void | Promise<void>;
};

export default function EmailBlastModal({
  title,
  audienceLabel = "General Subscribers",
  totalRecipients = 0,
  subjectPreview,
  isSubmitting = false,
  onBack,
  onClose,
  onSend,
}: EmailBlastModalProps) {
  const [sendCopy, setSendCopy] = useState(true);

  const previewText =
    subjectPreview?.trim() || title.trim() || "Untitled Article";

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[610px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="px-7 pb-7 pt-8">
          <h3 className="text-[18px] font-extrabold text-slate-900 sm:text-[20px]">
            Send Email Blast
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            You are about to send an immediate notification for this article.
          </p>

          <div className="mt-7 rounded-[20px] border border-slate-200 bg-slate-50 px-6 py-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Audience
                </p>
                <p className="mt-2 text-[15px] font-extrabold text-slate-800">
                  {audienceLabel}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Total Recipients
                </p>
                <p className="mt-2 text-[15px] font-extrabold text-slate-800">
                  {totalRecipients.toLocaleString()} Physicians &amp; Students
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-slate-200" />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Subject Line Preview
              </p>
              <p className="mt-2 text-[15px] italic leading-7 text-slate-600">
                &quot;{previewText}&quot;
              </p>
            </div>
          </div>

          <label className="mt-7 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={sendCopy}
              onChange={() => setSendCopy((prev) => !prev)}
              disabled={isSubmitting}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 accent-[var(--primary)]"
            />
            <span className="text-[15px] text-slate-700">
              Send a copy to my admin email for verification.
            </span>
          </label>

          <div className="mt-5 flex items-start gap-2 text-[13px] text-slate-400">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>Note: This action cannot be undone once the broadcast begins.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-7 py-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex h-12 min-w-[86px] items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => onSend(sendCopy)}
            disabled={isSubmitting}
            className="inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal size={16} />
            {isSubmitting ? "Sending..." : "Send Blast Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
