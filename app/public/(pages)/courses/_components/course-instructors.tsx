"use client";

import React from "react";
import Image from "next/image";
import { CourseDetails } from "@/app/public/types/course.details.types";
import Card from "@/components/cards/card";

export default function CourseInstructors({ data }: { data: CourseDetails }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-extrabold text-black">
        {data.instructors.title}
      </h2>

      <div className="mt-6 space-y-6">
        {data.instructors.list.map((i) => (
          <Card
            key={i.id}
            shape="soft"
            className="border border-light-slate/15 shadow-sm"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-light-slate/10">
                <Image
                  src={i.avatarSrc}
                  alt={i.avatarAlt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-base font-extrabold text-black">{i.name}</p>
                <p className="mt-1 text-sm font-extrabold text-primary">
                  {i.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-light-slate italic">
                  “{i.quote}”
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
