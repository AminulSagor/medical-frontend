"use client";

import { Clock, MapPin, Layers, BadgeCheck } from "lucide-react";
import NetworkImageFallback from "@/utils/network-image-fallback";
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
  const isRegistrationClosed = !!course.isRegistrationClosed;
  const isSoldOut = !!course.isSoldOut;
  const isDisabled = isRegistrationClosed || isSoldOut;
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (isDisabled) return;
        router.push(`/public/courses/details/${course.id}`);
      }}
      aria-disabled={isDisabled}
      className={[
        "h-full min-h-[450px] rounded-3xl bg-white border border-light-slate/15 shadow-sm overflow-hidden",
        "flex flex-col transition",
        isDisabled
          ? "cursor-not-allowed bg-slate-50 grayscale-[0.55] opacity-70"
          : "cursor-pointer hover:shadow-md",
        course.action.kind === "reserve" && !isDisabled
          ? "ring-2 ring-primary/30"
          : "",
      ].join(" ")}
    >
      {/* Top */}
      {isOnDemand ? (
        <div className="relative h-32 w-full overflow-hidden">
          <NetworkImageFallback
            src={course.imageSrc!}
            alt={course.imageAlt || course.title}
            className="h-full w-full object-cover"
            fallbackClassName="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400"
            iconClassName="h-8 w-8"
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

      <div className="p-5 flex-1 flex flex-col">
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

            <h3 className="flex-1 min-h-[3.5rem] line-clamp-2 text-lg font-semibold leading-snug text-black">
              {course.title}
            </h3>
          </div>
        ) : (
          <h3 className="min-h-[3.5rem] line-clamp-2 text-lg font-semibold leading-snug text-black">
            {course.title}
          </h3>
        )}

        {course.description ? (
          <p className="mt-3 min-h-[3rem] line-clamp-2 text-sm leading-relaxed text-light-slate">
            {course.description}
          </p>
        ) : null}

        {/* meta rows */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-semibold text-light-slate">
          {(course.metaTop || []).map((m) => {
            const Icon = metaIcon(m.icon);
            const isPin = m.icon === "pin";
            return (
              <div key={m.label} className="flex min-w-0 items-center gap-2">
                <Icon size={16} className="shrink-0 text-primary" />
                <span className={isPin ? "truncate" : ""}>{m.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {(course.metaBottom || []).map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary"
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-8">
          {/* availability bar */}
          {course.availability ? (
            <div>
              <div className="flex items-center justify-between gap-3 text-[11px] font-bold tracking-[0.18em]">
                <span className="uppercase text-light-slate">
                  {course.availability.label}
                </span>
                <span
                  className={[
                    "text-right text-sm font-extrabold tracking-normal",
                    course.availability.tone === "danger"
                      ? "text-red"
                      : "text-primary",
                  ].join(" ")}
                >
                  {course.availability.note}
                </span>
              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-light-slate/15">
                <div
                  className={[
                    "h-full rounded-full",
                    course.availability.tone === "danger"
                      ? "bg-red"
                      : "bg-primary",
                  ].join(" ")}
                  style={{ width: `${Math.max(0, Math.min(100, course.availability.percent))}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* bottom row always aligned */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-light-slate/10 pt-6">
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
            disabled={isDisabled}
            className={[
              "h-11 shrink-0 rounded-full px-5 text-sm font-extrabold transition active:scale-95 disabled:pointer-events-none disabled:opacity-70",
              course.action.kind === "reserve"
                ? "border border-primary/30 bg-white text-primary hover:bg-primary/10"
                : course.action.kind === "start"
                  ? "bg-primary text-white hover:opacity-90"
                  : "border border-red/20 bg-red/5 text-red",
            ].join(" ")}
          >
            {course.action.label}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
