"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ActiveCourseItem } from "@/types/user/course/course-type";

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

function Badge({ text }: { text: string }) {
  const normalizedText = text.toLowerCase();
  const isOnline = normalizedText.includes("online");

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1",
        "text-[11px] font-semibold tracking-wide",
        isOnline
          ? "bg-sky-100 text-sky-700"
          : "bg-emerald-100 text-emerald-700",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function StatRow({
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
      <div className="mt-[1px] text-sky-600">{icon}</div>
      <div className="leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-[12px] font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function CourseCardsSection({ items }: Props) {
  const router = useRouter();

  return (
    <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((course) => (
        <div
          key={course.enrollmentId}
          className={[
            "overflow-hidden rounded-2xl border border-slate-200 bg-white",
            "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
          ].join(" ")}
        >
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Badge text={course.tag} />
                <div>
                  <h3 className="text-[15px] font-semibold leading-snug">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/80">
                    {course.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StatRow
                icon={<UserRound className="h-4 w-4" />}
                label="Instructor"
                value={`${course.instructor.name}${course.instructor.role ? `, ${course.instructor.role}` : ""}`}
              />
              <StatRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={course.location}
              />
              <StatRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Date"
                value={course.date}
              />
              <StatRow
                icon={<Clock3 className="h-4 w-4" />}
                label="Time"
                value={`${course.deliveryMethod} • ${course.timeLabel}`}
              />
            </div>

            <div className="mt-5 h-px w-full bg-slate-100" />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {course.actions.secondary ? (
                <button
                  type="button"
                  onClick={() => openRoute(course.actions.secondary!.route, router)}
                  className={[
                    "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4",
                    "text-sm font-medium text-slate-700",
                    "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <ExternalLink className="h-4 w-4" />
                  {course.actions.secondary.label}
                </button>
              ) : null}

              {course.actions.primary ? (
                <button
                  type="button"
                  onClick={() => openRoute(course.actions.primary!.route, router)}
                  className={[
                    "flex h-11 flex-1 items-center justify-center rounded-xl bg-sky-50 px-4",
                    "text-sm font-semibold text-sky-700",
                    "hover:bg-sky-100",
                  ].join(" ")}
                >
                  {course.actions.primary.label}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
