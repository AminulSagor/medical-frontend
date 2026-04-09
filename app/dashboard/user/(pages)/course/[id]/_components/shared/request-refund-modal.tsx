// app/(user)/(registered-user)/course/[id]/_components/shared/request-refund-modal.client.tsx
"use client";

import { useMemo, useState } from "react";
import { X, AlertCircle, ChevronDown } from "lucide-react";

export type RefundReason = {
  id: string;
  label: string;
};

export type RequestRefundModalProps = {
  open: boolean;
  onClose: () => void;

  // UI display (later from backend)
  courseTitle: string;
  metaText: string; // "Mar 12 - 14 • Booked for: 1 Attendee"
  refundWindowText: string; // "2d 4h remaining"
  policyTitle: string; // "Refund Policy:"
  policyText: string; // policy paragraph

  totalPaidLabel?: string; // "TOTAL PAID"
  totalPaidValue: string; // "$650.00"

  refundAmountLabel?: string; // "REFUND AMOUNT"
  refundAmountValue: string; // "$600.00"
  feeText?: string; // "-$50.00 fee"

  disclaimerText: string; // checkbox line

  footnoteText: string; // bottom hint

  // options (later from backend)
  reasons: RefundReason[];

  // Placeholder callbacks (backend later)
  onConfirm?: (payload: { reasonId: string | null; acknowledged: boolean }) => void;
  onKeepBooking?: () => void;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

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
    feeText = "-$50.00 fee",

    disclaimerText,
    footnoteText,

    reasons,
    onConfirm,
    onKeepBooking,
  } = props;

  const [reasonId, setReasonId] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);

  const selectedReason = useMemo(
    () => reasons.find((r) => r.id === reasonId)?.label ?? "Select a reason...",
    [reasons, reasonId]
  );

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
      <div className="relative z-[91] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-[16px] font-extrabold text-slate-900">
            Request Refund
          </div>

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
          {/* course strip */}
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-[#35BEEA] ring-1 ring-sky-100">
                {/* calendar icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#35BEEA]"
                >
                  <path
                    d="M8 2v3M16 2v3M3.5 9h17M6.5 5h11A3 3 0 0 1 20.5 8v11A3 3 0 0 1 17.5 22h-11A3 3 0 0 1 3.5 19V8A3 3 0 0 1 6.5 5Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <div className="text-[13px] font-extrabold text-slate-900">
                  {courseTitle}
                </div>
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

          {/* policy alert */}
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

          {/* amounts */}
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
                <div className="text-[10px] font-extrabold text-rose-500">
                  {feeText}
                </div>
              </div>

              <div className="mt-1 text-[16px] font-extrabold text-sky-700">
                {refundAmountValue}
              </div>
            </div>
          </div>

          {/* reason */}
          <div className="mt-4">
            <div className="text-[9px] font-extrabold tracking-[0.15em] text-slate-400">
              REASON FOR REFUND
            </div>

            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setReasonOpen((v) => !v)}
                className={cx(
                  "flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left",
                  reasonOpen ? "border-sky-200 ring-2 ring-sky-100" : "border-slate-200"
                )}
              >
                <span className="text-[12px] font-semibold text-slate-700">
                  {selectedReason}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {reasonOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                  <div className="max-h-[220px] overflow-auto py-1">
                    {reasons.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setReasonId(r.id);
                          setReasonOpen(false);
                        }}
                        className={cx(
                          "w-full px-4 py-2.5 text-left text-[12px] hover:bg-slate-50",
                          reasonId === r.id ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* checkbox */}
          <label className="mt-4 flex items-start gap-3 text-[11px] text-slate-600">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              {disclaimerText.split("cannot be undone").length === 2 ? (
                <>
                  {disclaimerText.split("cannot be undone")[0]}
                  <span className="font-extrabold text-slate-900">cannot be undone</span>
                  {disclaimerText.split("cannot be undone")[1]}
                </>
              ) : (
                disclaimerText
              )}
            </span>
          </label>

          {/* footnote */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[10px] leading-relaxed text-slate-500">
            {footnoteText}
          </div>

          {/* actions */}
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
              onClick={() => onConfirm?.({ reasonId, acknowledged: ack })}
              className="h-11 rounded-xl bg-[#35BEEA] text-[12px] font-extrabold text-white hover:opacity-95 disabled:opacity-50"
              disabled={!ack || !reasonId}
              title={!ack || !reasonId ? "Select reason and acknowledge to continue" : undefined}
            >
              Confirm Refund Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}