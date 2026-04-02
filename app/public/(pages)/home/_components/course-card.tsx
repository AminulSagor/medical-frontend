"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { PublicWorkshop } from "@/types/public/workshop/public-workshop.types";

function money(price: string) {
  const num = parseFloat(price);
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function modeBadgeClass(mode: PublicWorkshop["deliveryMode"]) {
  if (mode === "online") {
    return "bg-primary/15 text-primary border border-primary/20";
  }
  return "bg-black/60 text-white border border-white/10";
}

function formatDeliveryMode(mode: PublicWorkshop["deliveryMode"]) {
  return mode === "online" ? "Online" : "In-Person";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CourseCard({ workshop }: { workshop: PublicWorkshop }) {
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
            src={workshop.workshopPhoto || "/photos/course_details_cover.png"}
            alt={workshop.title}
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
              modeBadgeClass(workshop.deliveryMode),
              "backdrop-blur",
            ].join(" ")}
          >
            {formatDeliveryMode(workshop.deliveryMode)}
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
            {workshop.totalHours}
          </span>
        </motion.div>

        <motion.div
          variants={{
            hover: { y: -2 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute bottom-4 right-4"
        >
          {workshop.cmeFredits && (
            <span className="inline-flex items-center rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              CME Credits
            </span>
          )}
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
            <span>{formatDate(workshop.date)}</span>
          </div>

          <h3 className="mt-3 text-lg font-bold leading-snug text-black transition-colors duration-200 group-hover:text-primary">
            {workshop.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-light-slate">
            {workshop.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="mt-6 h-px w-full bg-light-slate/15" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {workshop.offerPrice ? (
                <>
                  <span className="text-xl font-bold text-black">
                    {money(workshop.offerPrice)}
                  </span>
                  <span className="text-sm text-light-slate line-through">
                    {money(workshop.price)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-black">
                  {money(workshop.price)}
                </span>
              )}
            </div>

            <Link
              href={`/public/courses/details/${workshop.id}`}
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
