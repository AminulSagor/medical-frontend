"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CourseDetails } from "@/app/(user)/(not-register)/public/types/course.details.types";
import Card from "@/components/cards/card";

export default function CourseItinerary({ data }: { data: CourseDetails }) {
  const [openDay, setOpenDay] = useState<number>(
    data.itinerary.days.find((d) => d.expanded)?.dayNumber ?? 1,
  );

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-black">{data.itinerary.title}</h2>

      <div className="mt-6 relative">
        <div className="absolute `left-4.5 top-2 bottom-2 w-0.5 bg-primary/40" />

        <div className="space-y-8">
          {data.itinerary.days.map((d) => {
            const isOpen = openDay === d.dayNumber;

            return (
              <div key={d.dayNumber} className="relative pl-14">
                <div className="absolute left-0 top-6 grid h-10 w-10 place-items-center rounded-full bg-primary text-white text-sm font-extrabold">
                  {d.dayNumber}
                </div>

                <Card
                  shape="soft"
                  className="border border-light-slate/15 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenDay(isOpen ? 0 : d.dayNumber)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-[11px] font-extrabold tracking-[0.12em] text-primary">
                            {d.dayPill}
                          </span>
                          <span className="text-[11px] font-extrabold tracking-[0.18em] text-light-slate">
                            {d.dateLabel}
                          </span>
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-black">
                          {d.title}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-light-slate">
                          {d.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3">
                        <span className="text-[11px] font-extrabold tracking-[0.18em] text-light-slate">
                          {d.trackLabel}
                        </span>
                        <ChevronDown
                          size={18}
                          className={[
                            "text-light-slate transition",
                            isOpen ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </button>

                  {isOpen && d.schedule?.length ? (
                    <div className="mt-6 border-t border-light-slate/15 pt-6">
                      <div className="space-y-6">
                        {d.schedule.map((s) => (
                          <div key={s.id} className="relative pl-6">
                            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm font-extrabold text-primary">
                              {s.at}
                            </p>
                            <p className="mt-1 text-sm font-extrabold text-black">
                              {s.title}
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-light-slate">
                              {s.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
