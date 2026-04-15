"use client";

import { CheckCircle2, Download, MapPin, User2 } from "lucide-react";
import {
  downloadCertificatePdf,
  triggerServiceFileDownload,
} from "@/service/user/course-details.service";
import type { CompletedTopStripProps } from "@/types/user/course/course-completed-details-type";

export default function CompletedTopStrip({
  locationText,
  instructorText,
  statusText,
  downloadLabel,
  ticketId,
  downloadHref,
}: CompletedTopStripProps) {
  const handleDownload = async () => {
    try {
      if (ticketId) {
        await downloadCertificatePdf(ticketId);
        return;
      }
      await triggerServiceFileDownload(downloadHref, "course-certificate.pdf");
    } catch (error) {
      console.error("Failed to download certificate", error);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-sky-50/70 px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-10 text-[13px] text-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <MapPin className="h-5 w-5 shrink-0 text-[#35BEEA]" />
            <span className="font-medium break-words">{locationText}</span>
          </div>

          <div className="flex items-center gap-3">
            <User2 className="h-5 w-5 text-[#35BEEA]" />
            <span className="font-medium">{instructorText}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {statusText}
          </div>

          {(ticketId || downloadHref) ? (
            <button
              type="button"
              onClick={() => {
                void handleDownload();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#35BEEA] px-4 py-2 text-[12px] font-extrabold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
            >
              <Download className="h-4 w-4" />
              {downloadLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
