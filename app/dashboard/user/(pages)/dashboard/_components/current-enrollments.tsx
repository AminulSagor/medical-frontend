import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, LogIn, MapPin } from "lucide-react";
import type { DashboardEnrollmentCardItem } from "@/types/user/dashboard/dashboard.types";

interface CurrentEnrollmentsProps {
  items?: DashboardEnrollmentCardItem[];
  isLoading?: boolean;
}

export default function CurrentEnrollments({
  items = [],
  isLoading = false,
}: CurrentEnrollmentsProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Current Enrollments
        </h2>

        <Link
          href="/dashboard/user/course"
          className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {items.slice(0, 2).map((item) => (
            <EnrollmentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          No enrolled workshops found yet.
        </div>
      )}
    </section>
  );
}

function EnrollmentCard({ item }: { item: DashboardEnrollmentCardItem }) {
  const badgeClass =
    item.mode === "Live Workshop"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-sky-50 text-sky-700 ring-sky-200";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="relative h-[170px] w-full overflow-hidden bg-slate-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-400 text-sm font-semibold text-white">
            Workshop Preview
          </div>
        )}
      </div>

      <div className="p-5">
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
            badgeClass,
          ].join(" ")}
        >
          {item.mode}
        </span>

        <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h3>

        <div className="mt-3 space-y-2 text-[12px] text-slate-600">
          {item.dateTime ? (
            <MetaRow
              icon={<CalendarDays className="h-4 w-4" />}
              text={item.dateTime}
            />
          ) : null}

          {item.location ? (
            <MetaRow icon={<MapPin className="h-4 w-4" />} text={item.location} />
          ) : null}

          {item.room ? (
            <MetaRow icon={<BookOpen className="h-4 w-4" />} text={item.room} />
          ) : null}
        </div>

        <div className="mt-4 h-px bg-slate-200/70" />

        <div className="mt-4">
          <Link
            href={item.ctaHref}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(2,132,199,0.22)] transition hover:bg-sky-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
          >
            {item.ctaIcon === "syllabus" ? <BookOpen className="h-4 w-4" /> : null}
            {item.ctaIcon === "enter" ? <LogIn className="h-4 w-4" /> : null}
            {item.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetaRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
