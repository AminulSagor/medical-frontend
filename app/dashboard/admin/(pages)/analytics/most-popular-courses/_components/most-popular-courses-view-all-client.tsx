"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Users, BadgeCheck, GraduationCap } from "lucide-react";
import {
  getPopularCoursesMetrics,
  PopularCoursesMetricsResponses,
} from "@/service/admin/popular-courses-metrics.service";
import type {
  PopularCourseTableItem,
  PopularCoursesMetricsResponse,
} from "@/types/admin/analytics.types";

function moneyCompact(n: number) {
  return `$${Math.round(n).toLocaleString()}`;
}

function completionToPercent(completion: string) {
  const parsed = Number.parseInt(completion.replace("%", ""), 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

function statusPill(label: string) {
  const style =
    label === "TRENDING"
      ? "bg-cyan-50 text-cyan-700 ring-cyan-100"
      : label === "STABLE"
        ? "bg-slate-50 text-slate-700 ring-slate-200"
        : "bg-violet-50 text-violet-700 ring-violet-100";

  return (
    <span
      className={[
        "rounded-full px-2 py-1 text-[11px] font-semibold ring-1",
        style,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function MostPopularCoursesViewAllClient({
  items,
  page,
  limit,
  canNext,
  startDate,
  endDate,
  type,
}: {
  items: PopularCourseTableItem[];
  page: number;
  limit: number;
  canNext: boolean;
  startDate: string;
  endDate: string;
  type: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [metrics, setMetrics] = useState<PopularCoursesMetricsResponses | null>(
    null,
  );

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getPopularCoursesMetrics();
        setMetrics(response);
      } catch (error) {
        console.error("Failed to fetch popular courses metrics:", error);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  function goPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(Math.max(1, nextPage)));
    router.push(`${pathname}?${params.toString()}`);
  }

  function onTypeChange(nextType: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextType.trim()) {
      params.set("type", nextType.trim());
    } else {
      params.delete("type");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/admin/analytics"
            aria-label="Back to Analytics"
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--primary)] ring-1 ring-slate-200 transition-colors duration-150 hover:bg-[var(--primary)] hover:text-white hover:ring-[var(--primary)]"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Most Popular Courses
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Live analytics data from admin endpoints
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 ring-1 ring-sky-100">
              <Users size={20} className="text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Enrollments
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {metrics?.totalEnrollments?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
              <BadgeCheck size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Completion Rate
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {metrics?.completionRate ?? 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-50 ring-1 ring-violet-100">
              <GraduationCap size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Active Instructors
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">
                {metrics?.activeInstructors?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Period: {startDate} to {endDate}
        </p>
        {/* <div className="flex items-center gap-2">
          <input
            defaultValue={type}
            onBlur={(e) => onTypeChange(e.target.value)}
            placeholder="Filter type and blur"
            className="w-[220px] rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
          />
        </div> */}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-6 py-3">Course Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Next Session</th>
                <th className="px-6 py-3">Instructor</th>
                <th className="px-6 py-3 text-right">Enrolled</th>
                <th className="px-6 py-3">Completion</th>
                <th className="px-6 py-3 text-right">Revenue</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.map((r, index) => (
                <tr
                  key={`${r.courseName}-${index}`}
                  className="text-sm text-slate-800 hover:bg-slate-50/50"
                >
                  <td className="px-6 py-5 font-semibold text-slate-900">
                    {r.courseName}
                  </td>
                  <td className="px-6 py-5 text-slate-600">{r.category}</td>
                  <td className="px-6 py-5 text-slate-600">{r.nextSession}</td>
                  <td className="px-6 py-5 text-slate-700">
                    {r.instructorDetails?.name ?? "No instructor"}
                  </td>
                  <td className="px-6 py-5 text-right font-semibold text-slate-900">
                    {r.enrolled.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-[120px] rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-[var(--primary)]"
                          style={{
                            width: `${completionToPercent(r.completion)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {r.completion}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-semibold text-slate-900">
                    {moneyCompact(r.revenue)}
                  </td>
                  <td className="px-6 py-5">{statusPill(r.status)}</td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-sm text-slate-500">
                    No courses found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-xs text-slate-500">
            Page {page} • Limit {limit}
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => goPage(page - 1)}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={page <= 1}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goPage(page + 1)}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              disabled={!canNext}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
