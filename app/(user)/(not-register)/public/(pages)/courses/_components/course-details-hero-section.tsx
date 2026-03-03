"use client";

import React from "react";
import Image from "next/image";

export type CourseDetailsHeroBadge = {
  label: string;
  tone?: "primary" | "muted";
};

export default function CourseDetailsHeroSection({
  title,
  badges,
  backgroundSrc,
  backgroundAlt = "Course cover",
}: {
  title: string;
  badges: CourseDetailsHeroBadge[];
  backgroundSrc: string;
  backgroundAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0">
        <Image
          src={backgroundSrc}
          alt={backgroundAlt}
          fill
          priority
          className="object-cover"
        />
        {/* dark overlay to match screenshot */}
        <div className="absolute inset-0 bg-black/45" />
        {/* subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/35 to-transparent" />
      </div>

      {/* content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6">
          {/* give space for fixed navbar overlay */}
          <div className="pt-32 pb-14">
            {/* pills */}
            <div className="flex flex-wrap items-center gap-3">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={[
                    "inline-flex items-center rounded-full px-4 py-2",
                    "text-xs font-extrabold tracking-[0.16em]",
                    b.tone === "primary"
                      ? "bg-primary text-white"
                      : "bg-white/20 text-white",
                  ].join(" ")}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* title */}
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
