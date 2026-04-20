// app/(user)/(registered-user)/course/[id]/_components/shared/refund-submitted-modal.client.tsx
"use client";

import { X, Check, Clock } from "lucide-react";

export type RefundSubmittedModalProps = {
  open: boolean;
  onClose: () => void;

  title: string; // "Refund Request Submitted"
  subtitle: string; // `Your request for "..." has been received and is being processed.`
  courseTitle: string;

  requestIdLabel?: string; // "REQUEST ID"
  requestIdValue: string; // "#REF-9921"

  expectedRefundLabel?: string; // "EXPECTED REFUND"
  expectedRefundValue: string; // "$650.00"

  confirmationText?: string; // optional helper line
  footnoteText?: string; // "Refunds typically take 5–7 business days..."

  ctaLabel: string; // "Back to Dashboard"
  onCta?: () => void; // backend later
};

export default function RefundSubmittedModalClient(props: RefundSubmittedModalProps) {
  const {
    open,
    onClose,

    title,
    subtitle,
    courseTitle,

    requestIdLabel = "REQUEST ID",
    requestIdValue,

    expectedRefundLabel = "EXPECTED REFUND",
    expectedRefundValue,

    confirmationText,
    footnoteText,

    ctaLabel,
    onCta,
  } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-[91] w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {/* top right close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>

        <div className="px-8 pb-8 pt-10">
          {/* success icon */}
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-emerald-500 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
          </div>

          {/* title */}
          <div className="mt-6 text-center text-[26px] font-extrabold text-slate-900">
            {title}
          </div>

          {/* subtitle */}
          <div className="mx-auto mt-3 max-w-[420px] text-center text-[13px] leading-relaxed text-slate-500">
            {subtitle.split(courseTitle).length === 2 ? (
              <>
                {subtitle.split(courseTitle)[0]}
                <span className="font-extrabold text-slate-900">{courseTitle}</span>
                {subtitle.split(courseTitle)[1]}
              </>
            ) : (
              subtitle
            )}
          </div>

          {/* info card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-sky-100 bg-sky-50">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="px-6 py-5">
                <div className="text-[10px] font-extrabold tracking-[0.16em] text-slate-400">
                  {requestIdLabel}
                </div>
                <div className="mt-2 text-[13px] font-extrabold text-slate-900">
                  {requestIdValue}
                </div>
              </div>

              <div className="px-6 py-5 md:border-l md:border-sky-100">
                <div className="text-[10px] font-extrabold tracking-[0.16em] text-slate-400">
                  {expectedRefundLabel}
                </div>
                <div className="mt-2 text-[18px] font-extrabold text-[#35BEEA]">
                  {expectedRefundValue}
                </div>
              </div>
            </div>
          </div>

          {/* confirmation */}
          {confirmationText ? (
            <div className="mt-6 text-center text-[12px] text-slate-500">
              {confirmationText}
            </div>
          ) : null}

          {/* footnote */}
          {footnoteText ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="mt-0.5 text-slate-400">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-[11px] leading-relaxed text-slate-500">
              {footnoteText.split("5-7 business days").length === 2 ? (
                <>
                  {footnoteText.split("5-7 business days")[0]}
                  <span className="font-extrabold text-slate-700">
                    5-7 business days
                  </span>
                  {footnoteText.split("5-7 business days")[1]}
                </>
              ) : (
                footnoteText
              )}
            </div>
          </div>
          ) : null}

          {/* CTA */}
          <button
            type="button"
            onClick={onCta ?? onClose}
            className="mt-8 h-12 w-full rounded-xl bg-[#35BEEA] text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(53,190,234,0.25)] hover:opacity-95 active:scale-[0.99]"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}