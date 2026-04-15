"use client";

import { useState } from "react";
import { CalendarPlus, User2, Video } from "lucide-react";
import type { OnlineSummaryStripProps } from "@/types/user/course/course-online-details-type";
import type { CalendarProviderKey } from "@/types/user/course/add-to-calender-type";
import type { CourseCalendarLinksResponse } from "@/types/user/course/course-detail-api.types";
import { getCourseCalendarLinks } from "@/service/user/course-details.service";
import SessionPill from "../shared/session-pill";
import AddToCalendarModalClient from "../shared/add-to-calender-modal";

function openLink(href?: string) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}

export default function OnlineSummaryStripClient(props: OnlineSummaryStripProps) {
  const {
    courseId,
    imageSrc,
    eventTitle,
    statusPillText,
    description,
    instructorText,
    platformText,
    sessionCard,
    addToCalendarLabel,
  } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CourseCalendarLinksResponse | null>(null);

  const providers: Array<{ key: CalendarProviderKey; title: string; subtitle: string; href?: string }> = [
    { key: "google", title: "Google Calendar", subtitle: "Sync to your personal Google account", href: calendarData?.links.google },
    { key: "outlook", title: "Outlook Calendar", subtitle: "Office 365 or Outlook.com", href: calendarData?.links.outlook },
    { key: "apple", title: "Apple Calendar", subtitle: "iCal for Mac, iPhone or iPad", href: calendarData?.links.appleOrIcs },
    { key: "yahoo", title: "Yahoo Calendar", subtitle: "Sync to your Yahoo account", href: calendarData?.links.yahoo },
  ];

  const handleOpenCalendar = async () => {
    setOpen(true);
    try {
      setLoading(true);
      const response = await getCourseCalendarLinks(courseId);
      setCalendarData(response);
    } catch (error) {
      console.error("Failed to load calendar links", error);
      setCalendarData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[1fr_220px] md:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-[12px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {statusPillText}
            </span>

            {description ? (
              <p className="mt-4 max-w-[760px] text-[13px] leading-relaxed text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {sessionCard ? (
            <div className="md:justify-self-end">
              <SessionPill
                dateRange={sessionCard.dateRange}
                title={sessionCard.label}
                timeRange={sessionCard.time}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 bg-sky-50/70 px-6 py-4">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-3 text-[13px] text-slate-700">
              <span className="text-[#35BEEA]">
                <Video className="h-5 w-5" />
              </span>
              <span className="font-medium">{platformText || "Online Workshop"}</span>
            </div>

            <div className="flex items-center gap-3 text-[13px] text-slate-700">
              <span className="text-[#35BEEA]">
                <User2 className="h-5 w-5" />
              </span>
              <span className="font-medium">
                Instructor: <span className="font-extrabold">{instructorText}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenCalendar}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#35BEEA] hover:opacity-90"
          >
            <CalendarPlus className="h-5 w-5" />
            {addToCalendarLabel}
          </button>
        </div>
      </section>

      <AddToCalendarModalClient
        open={open}
        onClose={() => setOpen(false)}
        event={{
          title: eventTitle || statusPillText,
          dateText: sessionCard?.dateRange || "not in api",
          timeText: sessionCard?.time || "not in api",
          imageSrc,
        }}
        providers={providers}
        loading={loading}
        description={calendarData?.description}
        onAddProvider={(key) => openLink(providers.find((item) => item.key === key)?.href)}
        onDownloadIcs={() => openLink(calendarData?.links.appleOrIcs)}
      />
    </>
  );
}
