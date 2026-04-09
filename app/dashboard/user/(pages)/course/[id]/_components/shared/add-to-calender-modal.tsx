// app/(user)/(registered-user)/course/[id]/_components/shared/add-to-calendar-modal.client.tsx
"use client";

import Image from "next/image";
import { X, CalendarDays, Clock } from "lucide-react";

export type AddToCalendarModalUIProps = {
  open: boolean;
  onClose: () => void;

  // UI-only (later from backend)
  title: string;
  dateText: string; // "March 12, 2024"
  timeText: string; // "08:00 AM - 04:00 PM (EST)"
  imageSrc?: string;
};

const PROVIDERS = [
  {
    key: "google",
    title: "Google Calendar",
    subtitle: "Sync to your personal Google account",
  },
  {
    key: "outlook",
    title: "Outlook Calendar",
    subtitle: "Office 365 or Outlook.com",
  },
  {
    key: "apple",
    title: "Apple Calendar",
    subtitle: "iCal for Mac, iPhone or iPad",
  },
  {
    key: "yahoo",
    title: "Yahoo Calendar",
    subtitle: "Sync to your Yahoo account",
  },
] as const;

export default function AddToCalendarModalClient({
  open,
  onClose,
  title,
  dateText,
  timeText,
  imageSrc,
}: AddToCalendarModalUIProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[91] w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-[13px] font-semibold text-slate-900">
            Add to Calendar
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="px-4 py-4">
          {/* Event Summary */}
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="relative h-[90px] w-full overflow-hidden rounded-lg bg-slate-200">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Event cover image"
                  fill
                  priority
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="mt-3 text-[9px] font-bold tracking-[0.15em] text-sky-600">
              EVENT SUMMARY
            </div>

            <div className="mt-1 text-[13px] font-semibold text-slate-900">
              {title}
            </div>

            <div className="mt-2 space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                <span>{dateText}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{timeText}</span>
              </div>
            </div>
          </div>

          {/* Providers */}
          <div className="mt-4 text-[9px] font-bold tracking-[0.15em] text-slate-400">
            SELECT CALENDAR PROVIDER
          </div>

          <div className="mt-3 space-y-2.5">
            {PROVIDERS.map((p) => (
              <div
                key={p.key}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5"
              >
                <div>
                  <div className="text-[12px] font-medium text-slate-900">
                    {p.title}
                  </div>
                  <div className="text-[10px] text-slate-500">{p.subtitle}</div>
                </div>

                {/* Placeholder action (backend routes later) */}
                <button
                  type="button"
                  onClick={onClose}
                  className="h-7 rounded-md bg-[#35BEEA] px-3 text-[11px] font-semibold text-white hover:opacity-95 active:scale-[0.99]"
                >
                  Add
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-slate-100 pt-3 text-center">
            {/* Placeholder action (backend routes later) */}
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-medium text-sky-600 hover:text-sky-700"
            >
              Prefer a manual file?{" "}
              <span className="underline underline-offset-2">
                Download .ics File
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}