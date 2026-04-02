"use client";

import Image from "next/image";
import { Clock, MapPin, Layers, BadgeCheck } from "lucide-react";
import { CourseCardModel } from "@/app/public/types/course-browse.types";
import { useRouter } from "next/navigation";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function metaIcon(name: string) {
  if (name === "clock") return Clock;
  if (name === "pin") return MapPin;
  if (name === "modules") return Layers;
  return BadgeCheck;
}

export default function CourseBrowseCard({
  course,
}: {
  course: CourseCardModel;
}) {
  const isOnDemand = !!course.imageSrc;
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/public/courses/details/${course.id}`)}
      className={[
        "rounded-3xl bg-white border border-light-slate/15 shadow-sm overflow-hidden cursor-pointer",
        "flex flex-col h-full",
        course.action.kind === "reserve" ? "ring-2 ring-primary/30" : "",
      ].join(" ")}
    >
      {/* Top */}
      {isOnDemand ? (
        <div className="relative h-40 w-full">
          <Image
            src={course.imageSrc!}
            alt={course.imageAlt || course.title}
            fill
            className="object-cover"
          />
          {course.badge ? (
            <span
              className={[
                "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.12em]",
                course.badge.tone === "dark"
                  ? "bg-black/70 text-white"
                  : "bg-white/80 text-black",
              ].join(" ")}
            >
              {course.badge.label}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="p-6 flex-1 flex flex-col">
        {/* Top row: date pill (scheduled cards) */}
        {!isOnDemand && course.date ? (
          <div className="flex items-start justify-between gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full border border-light-slate/20 bg-light-slate/5 text-center p-2">
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-light-slate">
                {course.date.month}
              </p>
              <p className="text-xl font-semibold text-primary">
                {course.date.day}
              </p>
            </div>

            <h3 className="flex-1 text-lg font-semibold leading-snug text-black">
              {course.title}
            </h3>
          </div>
        ) : (
          <h3 className="text-lg font-semibold leading-snug text-black">
            {course.title}
          </h3>
        )}

        {course.description ? (
          <p className="mt-3 text-sm leading-relaxed text-light-slate">
            {course.description}
          </p>
        ) : null}

        {/* meta rows */}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-light-slate">
          {(course.metaTop || []).map((m) => {
            const Icon = metaIcon(m.icon);
            return (
              <div key={m.label} className="flex items-center gap-2">
                <Icon size={16} className="text-primary" />
                {m.label}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {(course.metaBottom || []).map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary"
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* availability bar */}
        {course.availability ? (
          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.18em]">
              <span className="text-light-slate">
                {course.availability.label}
              </span>
              <span
                className={
                  course.availability.tone === "danger"
                    ? "text-red"
                    : "text-primary"
                }
              >
                {course.availability.note}
              </span>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-light-slate/15 overflow-hidden">
              <div
                className={[
                  "h-full rounded-full",
                  course.availability.tone === "danger"
                    ? "bg-red"
                    : "bg-primary",
                ].join(" ")}
                style={{ width: `${course.availability.percent}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* bottom row always aligned */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div>
            {course.oldPrice ? (
              <p className="text-xs font-semibold text-light-slate line-through">
                {money(course.oldPrice)}
              </p>
            ) : null}
            <p className="text-xl font-bold text-black">
              {money(course.price)}
            </p>
          </div>

          <button
            type="button"
            className={[
              "h-11 rounded-full px-5 text-sm font-extrabold transition active:scale-95",
              course.action.kind === "reserve"
                ? "border border-primary/30 bg-white text-primary hover:bg-primary/10"
                : course.action.kind === "start"
                  ? "bg-primary text-white hover:opacity-90"
                  : "bg-light-slate/10 text-light-slate hover:bg-light-slate/15",
            ].join(" ")}
          >
            {course.action.label}
          </button>
        </div>
      </div>
    </div>
  );
}
