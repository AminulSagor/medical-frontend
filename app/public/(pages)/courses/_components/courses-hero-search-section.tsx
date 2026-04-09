"use client";

import React, { useState } from "react";
import { Search, CalendarDays, GraduationCap, ChevronDown } from "lucide-react";

export type CourseSearchValues = {
  topic: string;
  datesLabel: string;
  type: string;
};

export default function CoursesHeroSearchSection({
  badge = "CLINICAL EDUCATION",
  title = "Master Critical Procedures",
  subtitle = "Find and book accredited workshops and procedural training from top institutions with our frictionless booking engine.",
  onSearch,
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
  onSearch?: (v: CourseSearchValues) => void;
}) {
  const [topic, setTopic] = useState("");
  const [datesLabel, setDatesLabel] = useState("Select dates");
  const [type, setType] = useState("All Types");

  function submit() {
    onSearch?.({ topic, datesLabel, type });
  }

  return (
    <section className="w-full">
      <div className="relative overflow-hidden bg-primary pt-15">
        {/* subtle overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          {/* badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em] text-white backdrop-blur">
              {badge}
            </span>
          </div>

          {/* heading */}
          <h1 className="mt-6 text-center text-4xl font-bold leading-tight text-white md:text-6xl">
            {title}
          </h1>

          {/* subtitle */}
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-white/85 md:text-base">
            {subtitle}
          </p>

          {/* search bar */}
          <div className="mx-auto mt-10 max-w-5xl">
            <div
              className={[
                "relative overflow-hidden rounded-full border border-white/20",
                "bg-white/10 backdrop-blur",
                "px-4 py-3",
                "flex flex-col gap-3 md:flex-row md:items-center md:gap-0",
              ].join(" ")}
            >
              {/* Topic */}
              <div className="flex flex-1 items-center gap-3 px-3 md:px-5">
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

              {/* divider */}
              <div className="hidden h-10 w-px bg-white/20 md:block" />

              {/* Dates */}
              <button
                type="button"
                onClick={() => setDatesLabel("Select dates")}
                className="flex flex-1 items-center gap-3 px-3 md:px-5 text-left"
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

              {/* divider */}
              <div className="hidden h-10 w-px bg-white/20 md:block" />

              {/* Type */}
              <button
                type="button"
                onClick={() =>
                  setType((v) =>
                    v === "All Types" ? "Workshops" : "All Types",
                  )
                }
                className="flex flex-1 items-center justify-between gap-3 px-3 md:px-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} className="text-white/85" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold tracking-[0.18em] text-white/70">
                      TYPE
                    </p>
                    <p className="truncate text-sm font-semibold text-white/90">
                      {type}
                    </p>
                  </div>
                </div>
                <ChevronDown size={18} className="text-white/70" />
              </button>

              {/* search button */}
              <div className="md:pl-3 md:pr-2">
                <button
                  type="button"
                  onClick={submit}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white text-primary hover:opacity-90 active:scale-95 transition"
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
