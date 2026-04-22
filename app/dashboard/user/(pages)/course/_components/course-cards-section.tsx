"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  CirclePlay,
  MapPin,
  NotebookTabs,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ActiveCourseItem } from "@/types/user/course/course-type";
import type { CalendarProviderKey } from "@/types/user/course/add-to-calender-type";
import type { CourseCalendarLinksResponse } from "@/types/user/course/course-detail-api.types";
import { getCourseCalendarLinks } from "@/service/user/course-details.service";
import AddToCalendarModalClient from "../[id]/_components/shared/add-to-calender-modal";
import NetworkImageFallback from "../../../../../../utils/network-image-fallback";

type Props = {
  items: ActiveCourseItem[];
};

function openRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (!route) return;
  if (/^https?:\/\//i.test(route)) {
    window.open(route, "_blank", "noopener,noreferrer");
    return;
  }
  router.push(route);
}

function ActiveStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-[2px] text-sky-500">{icon}</div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-[13px] font-medium leading-4 text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function openLink(href?: string) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}

export default function CourseCardsSection({ items }: Props) {
  const router = useRouter();
  const [calendarCourse, setCalendarCourse] = useState<ActiveCourseItem | null>(null);
  const [calendarData, setCalendarData] = useState<CourseCalendarLinksResponse | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

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

  const handleOpenCalendar = async (course: ActiveCourseItem) => {
    setCalendarCourse(course);
    try {
      setLoadingCalendar(true);
      const response = await getCourseCalendarLinks(course.courseId);
      setCalendarData(response);
    } catch (error) {
      console.error("Failed to load calendar links", error);
      setCalendarData(null);
    } finally {
      setLoadingCalendar(false);
    }
  };

  return (
    <>
      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((course) => {
          const isOnline = course.courseType === "online";

          return (
            <div
              key={course.enrollmentId}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
            >
              <div className="relative h-[160px] w-full overflow-hidden bg-slate-200">
                <NetworkImageFallback
                  src={course.coverImageUrl}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  fallbackVariant="cover"
                  fallbackClassName="h-full w-full"
                  iconClassName="h-8 w-8"
                />

                <div className="absolute left-3 top-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold tracking-wide text-white",
                      isOnline ? "bg-sky-500" : "bg-emerald-500",
                    ].join(" ")}
                  >
                    {course.tag}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
                <h3 className="text-[15px] font-semibold leading-tight text-slate-900">{course.title}</h3>

                <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">
                  {course.subtitle}
                </p>

                {isOnline && course.infoTitle ? (
                  <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-[12px] leading-5 text-slate-600">
                    <div className="flex items-start gap-2">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                      <p className="line-clamp-2">
                        <span className="font-semibold text-sky-500">{course.infoTitle} </span>
                        {course.infoText ?? ""}
                      </p>
                    </div>
                  </div>
                ) : null}

                {isOnline ? (
                  <div className="mt-5 grid grid-cols-2 gap-y-4">
                    <ActiveStat
                      icon={<UserRound className="h-4 w-4" />}
                      label="Booked For"
                      value={course.bookedFor}
                    />
                    <ActiveStat
                      icon={<WalletCards className="h-4 w-4" />}
                      label="Booking Fee"
                      value={course.bookingFee}
                    />
                    <ActiveStat
                      icon={<NotebookTabs className="h-4 w-4" />}
                      label="Progress"
                      value={course.progress}
                    />
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-2 gap-y-4">
                    <ActiveStat
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Date"
                      value={course.date}
                    />
                    <ActiveStat
                      icon={<MapPin className="h-4 w-4" />}
                      label="Location"
                      value={course.location}
                    />
                    <ActiveStat
                      icon={<UserRound className="h-4 w-4" />}
                      label="Booked For"
                      value={course.bookedFor}
                    />
                    <ActiveStat
                      icon={<WalletCards className="h-4 w-4" />}
                      label="Booking Fee"
                      value={course.bookingFee}
                    />
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                  {!isOnline && course.actions.secondary ? (
                    <button
                      type="button"
                      onClick={() => handleOpenCalendar(course)}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <CalendarDays className="h-4 w-4" />
                      {course.actions.secondary.label}
                    </button>
                  ) : null}

                  {course.actions.primary ? (
                    <button
                      type="button"
                      onClick={() => openRoute(course.actions.primary?.route ?? "", router)}
                      className={[
                        "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold",
                        isOnline
                          ? "bg-sky-500 text-white hover:bg-sky-600"
                          : "bg-sky-50 text-sky-600 hover:bg-sky-100",
                      ].join(" ")}
                    >
                      {isOnline ? <CirclePlay className="h-4 w-4" /> : null}
                      {course.actions.primary.label}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <AddToCalendarModalClient
        open={!!calendarCourse}
        onClose={() => setCalendarCourse(null)}
        event={{
          title: calendarCourse?.title || "Course",
          dateText: calendarCourse?.date || "",
          timeText: "",
          imageSrc: calendarCourse?.coverImageUrl,
        }}
        providers={providers}
        loading={loadingCalendar}
        description={calendarData?.description}
        onAddProvider={(key) => openLink(providers.find((item) => item.key === key)?.href)}
        onDownloadIcs={() => openLink(calendarData?.links.appleOrIcs)}
      />
    </>
  );
}