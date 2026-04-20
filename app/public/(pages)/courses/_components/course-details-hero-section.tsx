"use client";

import React from "react";
import NetworkImageFallback from "@/utils/network-image-fallback";

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
  backgroundSrc?: string | null;
  backgroundAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <NetworkImageFallback
          src={backgroundSrc}
          alt={backgroundAlt}
          className="h-full w-full object-cover"
          fallbackVariant="cover"
          fallbackClassName="h-full w-full"
          iconClassName="h-12 w-12"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/35 to-transparent" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="pb-14 pt-32">
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

            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
