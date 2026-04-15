"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

export type RefundConfirmPayload = {
  reasonText: string;
  acknowledged: boolean;
};

export type RequestRefundModalProps = {
  open: boolean;
  onClose: () => void;

  courseTitle: string;
  metaText: string;
  refundWindowText: string;

  policyTitle: string;
  policyText: string;

  totalPaidLabel?: string;
  totalPaidValue: string;

  refundAmountLabel?: string;
  refundAmountValue: string;
  feeText?: string;

  disclaimerText: string;
  footnoteText: string;

  submitting?: boolean;
  errorText?: string | null;

  onConfirm?: (payload: RefundConfirmPayload) => void;
  onKeepBooking?: () => void;
};

export default function RequestRefundModalClient(props: RequestRefundModalProps) {
  const {
    open,
    onClose,

    courseTitle,
    metaText,
    refundWindowText,

    policyTitle,
    policyText,

    totalPaidLabel = "TOTAL PAID",
    totalPaidValue,

    refundAmountLabel = "REFUND AMOUNT",
    refundAmountValue,
    feeText,

    disclaimerText,
    footnoteText,

    submitting = false,
    errorText,

    onConfirm,
    onKeepBooking,
  } = props;

  const [reasonText, setReasonText] = useState("");
  const [ack, setAck] = useState(false);

  if (!open) return null;

  const canSubmit = ack && reasonText.trim().length > 0 && !submitting;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-[91] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-[16px] font-extrabold text-slate-900">Request Refund</div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="px-5 py-5">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-[#35BEEA] ring-1 ring-sky-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#35BEEA]">
                  <path
                    d="M8 2v3M16 2v3M3.5 9h17M6.5 5h11A3 3 0 0 1 20.5 8v11A3 3 0 0 1 17.5 22h-11A3 3 0 0 1 3.5 19V8A3 3 0 0 1 6.5 5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <div className="text-[13px] font-extrabold text-slate-900">{courseTitle}</div>
                <div className="mt-1 text-[11px] text-slate-500">{metaText}</div>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-sky-50 px-3 py-2 text-center ring-1 ring-sky-100">
              <div className="text-[9px] font-extrabold tracking-[0.15em] text-sky-700">
                REFUND WINDOW
              </div>
              <div className="mt-0.5 text-[11px] font-extrabold text-sky-700">
                {refundWindowText}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
            <div className="flex gap-3">
              <div className="mt-0.5 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div className="text-[11px] leading-relaxed text-rose-700">
                <span className="font-extrabold">{policyTitle}</span>{" "}
                <span className="text-rose-700/90">{policyText}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-[9px] font-extrabold tracking-[0.15em] text-slate-400">
                {totalPaidLabel}
              </div>
              <div className="mt-1 text-[16px] font-extrabold text-slate-900">
                {totalPaidValue}
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[9px] font-extrabold tracking-[0.15em] text-sky-700">
                  {refundAmountLabel}
                </div>
                <div className="text-[10px] font-extrabold text-rose-500">{feeText}</div>
              </div>

              <div className="mt-1 text-[16px] font-extrabold text-sky-700">
                {refundAmountValue}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[9px] font-extrabold tracking-[0.15em] text-slate-400">
              REASON FOR REFUND
            </div>

            <textarea
              value={reasonText}
              onChange={(event) => setReasonText(event.target.value)}
              placeholder="Write your refund reason"
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <label className="mt-4 flex items-start gap-3 text-[11px] text-slate-600">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>{disclaimerText}</span>
          </label>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] leading-relaxed text-slate-500">
            {footnoteText}
          </div>

          {errorText ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] text-rose-700">
              {errorText}
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onKeepBooking ?? onClose}
              className="h-11 rounded-xl border border-slate-200 bg-white text-[12px] font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Keep My Booking
            </button>

            <button
              type="button"
              onClick={() => onConfirm?.({ reasonText: reasonText.trim(), acknowledged: ack })}
              className="h-11 rounded-xl bg-[#35BEEA] text-[12px] font-extrabold text-white hover:opacity-95 disabled:opacity-50"
              disabled={!canSubmit}
              title={!canSubmit ? "Add reason and confirm terms to continue" : undefined}
            >
              {submitting ? "Submitting..." : "Confirm Refund Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
