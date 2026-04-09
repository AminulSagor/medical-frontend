// app/(user)/(registered-user)/course/[id]/_components/shared/refund-unavailable-modal.client.tsx
"use client";

import { X, AlertCircle, Phone, Mail } from "lucide-react";

export type RefundUnavailableModalProps = {
  open: boolean;
  onClose: () => void;

  title: string; // "Unable to Process Refund"

  alertTitle: string; // "Refund Window Expired:"
  alertText: string;

  courseTitle: string;
  courseDateText: string; // "March 12 - 14, 2024"

  helperText: string;

  phoneLabel: string; // "(555) 123-4567"
  emailLabel: string; // "support@texasairway.com"
  supportHoursLabel: string; // "SUPPORT HOURS"
  supportHoursText: string; // "Available Mon-Fri, 8 AM - 5 PM CST"

  primaryCtaLabel: string; // "Contact Support"
  secondaryCtaLabel: string; // "Back to Itinerary"

  onPrimary?: () => void; // backend later
  onSecondary?: () => void; // backend later
};

export default function RefundUnavailableModalClient(props: RefundUnavailableModalProps) {
  const {
    open,
    onClose,

    title,

    alertTitle,
    alertText,

    courseTitle,
    courseDateText,

    helperText,

    phoneLabel,
    emailLabel,
    supportHoursLabel,
    supportHoursText,

    primaryCtaLabel,
    secondaryCtaLabel,
    onPrimary,
    onSecondary,
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
      <div className="relative z-[91] w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-[18px] font-extrabold text-slate-900">{title}</div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* alert */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4">
            <div className="flex gap-3">
              <div className="mt-0.5 text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>

              <div className="text-[12px] leading-relaxed text-rose-700">
                <span className="font-extrabold">{alertTitle}</span>{" "}
                <span className="text-rose-700/90">{alertText}</span>
              </div>
            </div>
          </div>

          {/* course strip */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-[#35BEEA] ring-1 ring-sky-100">
                {/* doc icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 3v4a2 2 0 0 0 2 2h4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 14l6 6M15 14l-6 6"
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
                <div className="mt-1 text-[11px] text-slate-500">{courseDateText}</div>
              </div>
            </div>
          </div>

          {/* helper text */}
          <p className="mt-5 text-[12px] leading-relaxed text-slate-500">
            {helperText}
          </p>

          {/* contact card */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[12px] font-semibold text-slate-800">
                <Phone className="h-4 w-4 text-slate-400" />
                {phoneLabel}
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-center gap-3 text-[12px] font-semibold text-slate-800">
                <Mail className="h-4 w-4 text-slate-400" />
                {emailLabel}
              </div>

              <div className="h-px bg-slate-200" />

              <div>
                <div className="text-[10px] font-extrabold tracking-[0.16em] text-slate-400">
                  {supportHoursLabel}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">{supportHoursText}</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={onPrimary ?? onClose}
              className="h-12 w-full rounded-xl bg-[#35BEEA] text-[13px] font-extrabold text-white shadow-[0_10px_20px_rgba(53,190,234,0.25)] hover:opacity-95 active:scale-[0.99]"
            >
              {primaryCtaLabel}
            </button>

            <button
              type="button"
              onClick={onSecondary ?? onClose}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white text-[13px] font-extrabold text-slate-700 hover:bg-slate-50"
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}