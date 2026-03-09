"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { Course } from "@/app/(user)/(not-register)/public/types/course.types";

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function modeBadgeClass(mode: Course["mode"]) {
  if (mode === "Online") {
    return "bg-primary/15 text-primary border border-primary/20";
  }
  return "bg-black/60 text-white border border-white/10";
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover="hover"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-light-slate/15 shadow-sm"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        <motion.div
          variants={{
            hover: { scale: 1.06 },
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <Image
            src={course.imageSrc}
            alt={course.imageAlt}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          variants={{
            hover: { y: -2 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-4 top-4"
        >
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              modeBadgeClass(course.mode),
              "backdrop-blur",
            ].join(" ")}
          >
            {course.mode}
          </span>
        </motion.div>

        <motion.div
          variants={{
            hover: { y: -2 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-4 top-4"
        >
          <span className="inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.durationLabel}
          </span>
        </motion.div>

        <motion.div
          variants={{
            hover: { y: -2 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-4 right-4"
        >
          <span className="inline-flex items-center rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {course.creditsLabel}
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={{
          hover: { y: -4 },
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex flex-1 flex-col bg-white p-6"
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays size={16} />
            <span>{course.dateLabel}</span>
          </div>

          <h3 className="mt-3 text-lg font-bold leading-snug text-black transition-colors duration-200 group-hover:text-primary">
            {course.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-light-slate">
            {course.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="mt-6 h-px w-full bg-light-slate/15" />

          <div className="mt-5 flex items-center justify-between">
            <div className="text-xl font-abold text-black">
              {money(course.price)}
            </div>

            <Link
              href={course.detailsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
            >
              View Details
              <motion.span
                variants={{
                  hover: { x: 4 },
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex"
              >
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}