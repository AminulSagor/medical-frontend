"use client";

import { MapPin, CalendarDays, Clock } from "lucide-react";
import { CourseDetails } from "@/app/(user)/(not-register)/public/types/course.details.types";
import Card from "@/components/cards/card";

function iconOf(key: "location" | "dates" | "time") {
  if (key === "location") return MapPin;
  if (key === "dates") return CalendarDays;
  return Clock;
}

export default function CourseAboutAndInfo({ data }: { data: CourseDetails }) {
  return (
    <div className="space-y-6">
      <Card shape="soft" className="border border-light-slate/15 shadow-sm">
        <h2 className="text-2xl font-bold text-black">{data.about.title}</h2>
        <p className="mt-4 text-base text-light-slate">
          {data.about.description}
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {data.info.map((it) => {
          const Icon = iconOf(it.key);
          return (
            <Card
              key={it.key}
              shape="soft"
              className="border border-light-slate/15 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>

                <p className="mt-4 text-sm font-bold text-black">{it.title}</p>

                <div className="mt-3 space-y-1 text-sm font-medium text-light-slate">
                  {it.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
