"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Info,
  Video,
} from "lucide-react";
import type { InPersonCourseCard, OnlineCourseCard } from "@/types/course/course-type";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  inPerson: InPersonCourseCard | null;
  online: OnlineCourseCard | null;
};

function Badge({ text, variant }: { text: string; variant: "green" | "sky" }) {
  const cls =
    variant === "green"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-sky-100 text-sky-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1",
        "text-[11px] font-semibold tracking-wide",
        cls,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-[1px] text-sky-600">{icon}</div>
      <div className="leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="text-[12px] font-medium text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function CardShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border border-slate-200 bg-white",
        "shadow-[0_8px_20px_rgba(15,23,42,0.06)]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function CourseCardsSection({ inPerson, online }: Props) {
  const router = useRouter();
  return (
    <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* LEFT: In-person */}
      {inPerson && (
        <CardShell>
          <div className="relative h-[170px] w-full">
            <Image
              src={inPerson.imageSrc}
              alt={inPerson.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-4 top-4">
              <Badge text={inPerson.badge} variant="green" />
            </div>
          </div>

          {/* ✅ removed fixed height (your earlier fix) */}
          <div className="flex flex-col px-6 py-5">
            <h3 className="text-[15px] font-semibold text-slate-900">
              {inPerson.title}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
              <StatRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="DATE"
                value={inPerson.dateLabel}
              />
              <StatRow
                icon={<MapPin className="h-4 w-4" />}
                label="LOCATION"
                value={inPerson.locationLabel}
              />
              <StatRow
                icon={<Users className="h-4 w-4" />}
                label="BOOKED FOR"
                value={inPerson.bookedForLabel}
              />
              <StatRow
                icon={<DollarSign className="h-4 w-4" />}
                label="BOOKING FEE"
                value={inPerson.bookingFeeLabel}
              />
            </div>

            {/* ✅ removed mt-auto so buttons don't drop */}
            <div className="pt-5">
              <div className="h-px w-full bg-slate-100" />

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={inPerson.onAddToCalendar}
                  className={[
                    "h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4",
                    "text-sm font-medium text-slate-700",
                    "hover:bg-slate-50",
                  ].join(" ")}
                >
                  Add to Calendar
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/course/inperson`)
                  }
                  className={[
                    "h-11 flex-1 rounded-xl bg-sky-50 px-4",
                    "text-sm font-semibold text-sky-700",
                    "hover:bg-sky-100",
                  ].join(" ")}
                >
                  View Syllabus
                </button>
              </div>
            </div>
          </div>
        </CardShell>
      )}

      {/* RIGHT: Online */}
      {online && (
        <CardShell>
          <div className="relative h-[170px] w-full">
            <Image
              src={online.imageSrc}
              alt={online.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-4 top-4">
              <Badge text={online.badge} variant="sky" />
            </div>
          </div>

          {/* ✅ removed fixed height (your earlier fix) */}
          <div className="flex flex-col px-6 py-5">
            <h3 className="text-[15px] font-semibold text-slate-900">
              {online.title}
            </h3>

            <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <div className="mt-[2px] text-sky-600">
                  <Info className="h-4 w-4" />
                </div>
                <div className="text-[12px] leading-relaxed text-slate-600">
                  <span className="font-semibold text-sky-700">
                    {online.infoTitle}{" "}
                  </span>
                  {online.infoText}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
              <StatRow
                icon={<Users className="h-4 w-4" />}
                label="BOOKED FOR"
                value={online.bookedForLabel}
              />
              <StatRow
                icon={<DollarSign className="h-4 w-4" />}
                label="BOOKING FEE"
                value={online.bookingFeeLabel}
              />
              <StatRow
                icon={<Video className="h-4 w-4" />}
                label="PROGRESS"
                value={online.progressLabel}
              />
              <div />
            </div>

            {/* ✅ removed mt-auto so button stays right place */}
            <div className="pt-5">
              <button
                type="button"
                onClick={online.onJoinLive}
                className={[
                  "h-11 w-full rounded-xl bg-sky-600 px-4",
                  "text-sm font-semibold text-white",
                  "hover:bg-sky-700",
                ].join(" ")}
              >
                Join Live Session
              </button>
            </div>
          </div>
        </CardShell>
      )}
    </section>
  );
}