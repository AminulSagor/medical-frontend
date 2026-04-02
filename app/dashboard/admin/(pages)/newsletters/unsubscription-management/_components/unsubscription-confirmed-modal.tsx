"use client";

import { Check } from "lucide-react";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export type UnsubConfirmedPayload = {
  subscriber: string;
  email: string;
  statusLabel: string; // "Removed from General Newsletter"
};

export default function UnsubscriptionConfirmedModal({
  open,
  data,
  onDone,
}: {
  open: boolean;
  data: UnsubConfirmedPayload | null;
  onDone: () => void;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* backdrop */}
      <button
        type="button"
        onClick={onDone}
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
        aria-label="Close"
      />

      <div className="absolute left-1/2 top-1/2 w-[480px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-[18px] bg-white shadow-[0_30px_80px_rgba(2,6,23,0.35)] ring-1 ring-slate-200/60">
          <div className="px-8 pb-7 pt-8 text-center">
            {/* top icon */}
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-500 shadow-[0_18px_40px_rgba(20,184,166,0.25)]">
              <Check className="text-white" size={22} strokeWidth={3} />
            </div>

            <h2 className="mt-5 text-[18px] font-bold text-slate-900">
              Unsubscription Confirmed
            </h2>

            {/* details box */}
            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-200/60">
              <div className="grid grid-cols-[120px_1fr] gap-0 px-5 py-4 text-left">
                <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
                  SUBSCRIBER
                </p>
                <p className="text-sm font-semibold text-slate-800 text-right">
                  {data.subscriber}
                </p>
              </div>
              <div className="h-px bg-slate-200/60" />
              <div className="grid grid-cols-[120px_1fr] gap-0 px-5 py-4 text-left">
                <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
                  EMAIL
                </p>
                <p className="text-sm font-semibold text-slate-700 text-right">
                  {data.email}
                </p>
              </div>
              <div className="h-px bg-slate-200/60" />
              <div className="grid grid-cols-[120px_1fr] gap-0 px-5 py-4 text-left">
                <p className="text-[10px] font-bold tracking-[0.22em] text-slate-400">
                  STATUS
                </p>
                <p className="text-sm font-bold text-teal-600 text-right">
                  {data.statusLabel}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-500">
              The user has been successfully removed from the selected
              distribution list. A standard confirmation email has been sent to
              the subscriber.
            </p>

            <button
              type="button"
              onClick={onDone}
              className={cn(
                "mt-6 h-11 w-full rounded-xl",
                "bg-teal-500 text-sm font-bold text-white",
                "hover:bg-teal-600"
              )}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}