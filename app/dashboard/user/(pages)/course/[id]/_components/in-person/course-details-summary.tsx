"use client";

import { useMemo, useState } from "react";
import { MapPin, User2, CalendarPlus } from "lucide-react";
import type { CourseDetailsSummaryProps } from "@/types/user/course/course-details-type";
import AddToCalendarModalClient from "../shared/add-to-calender-modal";

export default function CourseDetailsSummary(
  props: CourseDetailsSummaryProps & { onAddToCalendar: () => void },
) {
  const { organizerLabel, organizerText, chips } = props;

  const [open, setOpen] = useState(false);

  const locationText =
    chips.find((c) => c.iconKey === "pin")?.text ??
    "Houston Sim Center, Room 4B";

  const secondText =
    chips.find((c) => c.iconKey === "users")?.text ??
    "Instructor: Dr. Alan Grant";

  // dummy modal preview info (later from backend)
  const modalEvent = useMemo(() => {
    return {
      title: "Advanced Difficult Airway Workshop",
      dateText: "March 12, 2024",
      timeText: "08:00 AM - 04:00 PM (EST)",
      imageSrc: "/photos/child.png",
    };
  }, []);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)]">
        {/* TOP */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_200px] md:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-[12px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {organizerLabel}
            </span>

            <p className="mt-4 max-w-[760px] text-[14px] leading-relaxed text-slate-500">
              {organizerText}
            </p>
          </div>

          <div className="md:justify-self-end">
            <div className="w-[200px] rounded-[26px] bg-[#35BEEA] px-6 py-5 text-center text-white">
              <div className="text-[11px] font-extrabold tracking-[0.22em] opacity-95">
                MAR 12 - 14
              </div>

              <div className="mt-2 text-[26px] font-extrabold leading-[1.05] whitespace-nowrap">
                Houston, TX
              </div>

              <div className="mt-3 text-[12px] font-semibold tracking-wide opacity-95">
                10:30 AM - 01:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-2xl bg-sky-50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-3 text-[14px] text-slate-700">
              <span className="text-[#35BEEA]">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="font-medium">{locationText}</span>
            </div>

            <div className="flex items-center gap-3 text-[14px] text-slate-700">
              <span className="text-[#35BEEA]">
                <User2 className="h-5 w-5" />
              </span>
              <span className="font-medium">{secondText}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)} // ✅ only open modal
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#35BEEA] hover:opacity-90"
          >
            <CalendarPlus className="h-5 w-5" />
            Add to Calendar
          </button>
        </div>
      </section>

      <AddToCalendarModalClient
        open={open}
        onClose={() => setOpen(false)}
        title={modalEvent.title}
        dateText={modalEvent.dateText}
        timeText={modalEvent.timeText}
        imageSrc={modalEvent.imageSrc}
      />
    </>
  );
}
