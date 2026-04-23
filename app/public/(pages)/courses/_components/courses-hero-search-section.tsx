"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, CalendarDays, GraduationCap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const COURSE_TYPE_OPTIONS = ["All Types", "In Person", "Online"] as const;
type CourseTypeOption = (typeof COURSE_TYPE_OPTIONS)[number];

function formatSingleDate(value: string) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatDateRangeLabel(from: string, to: string) {
  const fromLabel = formatSingleDate(from);
  const toLabel = formatSingleDate(to);

  if (fromLabel && toLabel) return `${fromLabel} - ${toLabel}`;
  if (fromLabel) return `${fromLabel} - Select end date`;
  if (toLabel) return `Select start date - ${toLabel}`;
  return "Select dates";
}

function getTypeFromQuery(value: string | null): CourseTypeOption {
  if (value === "in_person") return "In Person";
  if (value === "online") return "Online";
  return "All Types";
}

function getQueryFromType(value: CourseTypeOption): string {
  if (value === "In Person") return "in_person";
  if (value === "Online") return "online";
  return "";
}

function getResolvedTopic(searchParams: ReturnType<typeof useSearchParams>) {
  return (
    searchParams.get("q") ??
    searchParams.get("search") ??
    searchParams.get("topic") ??
    ""
  );
}

export default function CoursesHeroSearchSection({
  badge = "CLINICAL EDUCATION",
  title = "Master Critical Procedures",
  subtitle = "Find and book accredited workshops and procedural training from top institutions with our frictionless booking engine.",
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState(getResolvedTopic(searchParams));
  const [type, setType] = useState<CourseTypeOption>(
    getTypeFromQuery(searchParams.get("deliveryMode")),
  );
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") ?? "");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  useEffect(() => {
    setTopic(getResolvedTopic(searchParams));
    setType(getTypeFromQuery(searchParams.get("deliveryMode")));
    setDateFrom(searchParams.get("dateFrom") ?? "");
    setDateTo(searchParams.get("dateTo") ?? "");
  }, [searchParams]);

  const datesLabel = useMemo(
    () => formatDateRangeLabel(dateFrom, dateTo),
    [dateFrom, dateTo],
  );

  function cycleType() {
    setType((current) => {
      const currentIndex = COURSE_TYPE_OPTIONS.indexOf(current);
      return COURSE_TYPE_OPTIONS[(currentIndex + 1) % COURSE_TYPE_OPTIONS.length];
    });
  }

  function submit() {
    const params = new URLSearchParams(searchParams.toString());

    if (topic.trim()) params.set("q", topic.trim());
    else params.delete("q");

    params.delete("search");
    params.delete("topic");

    const deliveryMode = getQueryFromType(type);
    if (deliveryMode) params.set("deliveryMode", deliveryMode);
    else params.delete("deliveryMode");

    if (dateFrom) params.set("dateFrom", dateFrom);
    else params.delete("dateFrom");

    if (dateTo) params.set("dateTo", dateTo);
    else params.delete("dateTo");

    params.delete("page");
    router.push(`/public/courses${params.toString() ? `?${params.toString()}` : ""}`);
    setIsDateRangeOpen(false);
  }

  return (
    <section className="w-full">
      <div className="relative overflow-visible bg-primary pt-15">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-black/10" />

        <div
          className={[
            "relative mx-auto max-w-7xl px-6 pt-16",
            isDateRangeOpen ? "pb-40 md:pb-16" : "pb-16",
          ].join(" ")}
        >
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-white backdrop-blur">
              {badge}
            </span>
          </div>

          <h1 className="mt-6 text-center text-4xl font-bold leading-tight text-white md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-white/85 md:text-base">
            {subtitle}
          </p>

          <div className="mx-auto mt-10 max-w-5xl">
            <div
              className={[
                "relative overflow-visible rounded-[48px] border border-white/20",
                "bg-white/10 backdrop-blur",
                "pb-5 pl-8 pr-4 pt-7 md:px-4 md:py-3",
                "flex flex-col gap-3 md:flex-row md:items-center md:gap-0",
              ].join(" ")}
            >
              <div className="flex flex-1 items-center gap-3 px-1 md:px-5">
                <Search size={18} className="text-white/85" />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/70">
                    TOPIC
                  </p>
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Airway, Ultrasound"
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/60 outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-px bg-white/20 md:block" />

              <div className="relative flex flex-1 items-center gap-3 px-1 md:px-5">
                <button
                  type="button"
                  onClick={() => setIsDateRangeOpen((prev) => !prev)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <CalendarDays size={18} className="text-white/85" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/70">
                      DATES
                    </p>
                    <p className="truncate text-sm font-semibold text-white/90">
                      {datesLabel}
                    </p>
                  </div>
                </button>

                {isDateRangeOpen ? (
                  <div className="absolute left-0 right-4 top-full z-30 mt-3 rounded-3xl border border-white/20 bg-primary/95 p-4 shadow-2xl backdrop-blur md:left-5 md:right-5">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-xs font-bold tracking-[0.16em] text-white/70">
                          FROM
                        </span>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => {
                            const nextFrom = e.target.value;
                            setDateFrom(nextFrom);
                            if (dateTo && nextFrom && dateTo < nextFrom) {
                              setDateTo(nextFrom);
                            }
                          }}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-bold tracking-[0.16em] text-white/70">
                          TO
                        </span>
                        <input
                          type="date"
                          value={dateTo}
                          min={dateFrom || undefined}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none"
                        />
                      </label>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                        }}
                        className="text-xs font-extrabold tracking-[0.16em] text-white/70"
                      >
                        CLEAR
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsDateRangeOpen(false)}
                        className="rounded-full bg-white px-4 py-2 text-xs font-extrabold tracking-[0.16em] text-primary"
                      >
                        DONE
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="hidden h-10 w-px bg-white/20 md:block" />

              <div className="relative flex flex-1 items-center justify-between gap-3 px-1 md:px-5">
                <button
                  type="button"
                  onClick={cycleType}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <GraduationCap size={18} className="shrink-0 text-white/85" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/70">
                      TYPE
                    </p>
                    <p className="truncate text-sm font-semibold text-white/90">{type}</p>
                  </div>
                </button>
              </div>

              <div className="md:pl-3 md:pr-2">
                <button
                  type="button"
                  onClick={submit}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white text-primary transition hover:opacity-90 active:scale-95"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}