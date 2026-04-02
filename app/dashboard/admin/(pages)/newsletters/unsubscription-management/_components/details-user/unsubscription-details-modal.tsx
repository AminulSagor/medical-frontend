"use client";

import { X } from "lucide-react";
import type { UnsubscriptionDetails } from "../../_lib/details-user-types";
import SubscriberHeader from "./subscriber-header";
import RequestInfoCard from "./request-info-card";
import ClinicalActivityCard from "./clinical-activity-card";

function cn(...p: Array<string | false | undefined>) {
  return p.filter(Boolean).join(" ");
}

export default function UnsubscriptionDetailsModal({
  open,
  data,
  onClose,
  onConfirm,
  onDismiss,
}: {
  open: boolean;
  data: UnsubscriptionDetails | null;
  onClose: () => void;
  onConfirm?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Close modal"
      />

      {/* Dialog */}
      <div className="absolute left-1/2 top-1/2 w-[920px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2">
        <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_rgba(2,6,23,0.35)] ring-1 ring-slate-200/60">
          {/* Modal header */}
          <div className="flex items-start justify-between gap-4 px-8 py-6">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900">
                Unsubscription Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Reviewing request from{" "}
                <span className="font-semibold text-teal-600">
                  {data.subscriberName}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Content */}
          <div className="px-8 py-7">
            <SubscriberHeader data={data} />

            <div className="mt-7 grid gap-8 md:grid-cols-2">
              <RequestInfoCard data={data} />
              <ClinicalActivityCard data={data} />
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => onDismiss?.(data.id)}
                className={cn(
                  "h-12 rounded-2xl px-6 text-sm font-semibold",
                  "bg-white text-slate-700 ring-1 ring-slate-200/70",
                  "hover:bg-slate-50"
                )}
              >
                Keep Subscribed (Dismiss Request)
              </button>

              <button
                type="button"
                onClick={() => onConfirm?.(data.id)}
                className={cn(
                  "h-12 rounded-2xl px-7 text-sm font-bold text-white",
                  "bg-teal-500 hover:bg-teal-600",
                  "shadow-[0_16px_35px_rgba(20,184,166,0.25)]"
                )}
              >
                Confirm Unsubscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}