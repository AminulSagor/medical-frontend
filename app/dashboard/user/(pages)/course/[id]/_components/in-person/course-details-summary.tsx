"use client";

import { useState } from "react";
import { CalendarPlus, MapPin, User2 } from "lucide-react";
import type { CourseDetailsSummaryProps } from "@/types/user/course/course-details-type";
import type { CalendarProviderKey } from "@/types/user/course/add-to-calender-type";
import type { CourseCalendarLinksResponse } from "@/types/user/course/course-detail-api.types";
import { getCourseCalendarLinks } from "@/service/user/course-details.service";
import AddToCalendarModalClient from "../shared/add-to-calender-modal";

function openLink(href?: string) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}

export default function CourseDetailsSummary(props: CourseDetailsSummaryProps) {
  const { organizerLabel, organizerText, chips, session, courseId, imageSrc, eventTitle } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CourseCalendarLinksResponse | null>(null);

  const locationText = chips.find((c) => c.iconKey === "pin")?.text ?? "not in api";
  const secondText = chips.find((c) => c.iconKey === "users")?.text ?? "not in api";

  const providers: Array<{ key: CalendarProviderKey; title: string; subtitle: string; href?: string }> = [
    {
      key: "google",
      title: "Google Calendar",
      subtitle: "Sync to your personal Google account",
      href: calendarData?.links.google,
    },
    {
      key: "outlook",
      title: "Outlook Calendar",
      subtitle: "Office 365 or Outlook.com",
      href: calendarData?.links.outlook,
    },
    {
      key: "apple",
      title: "Apple Calendar",
      subtitle: "iCal for Mac, iPhone or iPad",
      href: calendarData?.links.appleOrIcs,
    },
    {
      key: "yahoo",
      title: "Yahoo Calendar",
      subtitle: "Sync to your Yahoo account",
      href: calendarData?.links.yahoo,
    },
  ];

  const openCalendar = async () => {
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

  const onProvider = (key: CalendarProviderKey) => {
    const href = providers.find((item) => item.key === key)?.href;
    openLink(href);
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_10px_22px_rgba(15,23,42,0.08)]">
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
            <div className="w-[220px] max-w-full rounded-[26px] bg-[#35BEEA] px-5 py-5 text-center text-white">
              <div className="text-[11px] font-extrabold tracking-[0.22em] opacity-95">
                {session.dayText}
              </div>

              <div className="mt-2 text-[14px] font-extrabold leading-5 whitespace-normal break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                {session.venueTitle}
              </div>

              <div className="mt-3 text-[12px] font-semibold tracking-wide opacity-95">
                {session.timeText}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-2xl bg-sky-50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-10">
            <div className="flex items-start gap-3 text-[14px] text-slate-700">
              <span className="text-[#35BEEA]">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="font-medium leading-5">{locationText}</span>
            </div>

            <div className="flex items-start gap-3 text-[14px] text-slate-700">
              <span className="text-[#35BEEA]">
                <User2 className="h-5 w-5" />
              </span>
              <span className="font-medium">{secondText}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCalendar}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#35BEEA] hover:opacity-90"
          >
            <CalendarPlus className="h-5 w-5" />
            {session.ctaLabel}
          </button>
        </div>
      </section>

      <AddToCalendarModalClient
        open={open}
        onClose={() => setOpen(false)}
        event={{
          title: eventTitle || organizerLabel,
          dateText: session.dayText,
          timeText: session.timeText,
          imageSrc,
        }}
        providers={providers}
        loading={loading}
        description={calendarData?.description}
        onAddProvider={onProvider}
        onDownloadIcs={() => openLink(calendarData?.links.appleOrIcs)}
      />
    </>
  );
}
