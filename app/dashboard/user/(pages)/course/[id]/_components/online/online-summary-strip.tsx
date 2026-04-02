"use client";

import { Video, User2, CalendarPlus } from "lucide-react";
import type { OnlineSummaryStripProps } from "@/types/course/course-online-details-type";
import SessionPill from "../shared/session-pill";

export default function OnlineSummaryStripClient(
  props: OnlineSummaryStripProps & { onAddToCalendar?: () => void }
) {
  const {
    statusPillText,
    description,
    instructorText,
    sessionCard,
    addToCalendarLabel,
    onAddToCalendar,
  } = props;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* TOP */}
      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[1fr_220px] md:items-start">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-[12px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {statusPillText}
          </span>

          {description && (
            <p className="mt-4 max-w-[760px] text-[13px] leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>

        {/* RIGHT PILL */}
        {sessionCard && (
          <div className="md:justify-self-end">
            <SessionPill
              dateRange={sessionCard.dateRange}
              title={sessionCard.label}
              timeRange={sessionCard.time}
            />
          </div>
        )}
      </div>

      {/* BOTTOM STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-sky-50/70 px-6 py-4">
        <div className="flex flex-wrap items-center gap-10">
          {/* Platform */}
          <div className="flex items-center gap-3 text-[13px] text-slate-700">
            <span className="text-[#35BEEA]">
              <Video className="h-5 w-5" />
            </span>
            <span className="font-medium">Online Workshop (via Zoom/Meet)</span>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 text-[13px] text-slate-700">
            <span className="text-[#35BEEA]">
              <User2 className="h-5 w-5" />
            </span>

            {/* match figma: "Instructor: Dr. Alan Grant" with bold name */}
            <span className="font-medium">
              Instructor: <span className="font-extrabold">{instructorText}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddToCalendar}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#35BEEA] hover:opacity-90"
        >
          <CalendarPlus className="h-5 w-5" />
          {addToCalendarLabel}
        </button>
      </div>
    </section>
  );
}