import Link from "next/link";
import type { PopularCourseTableItem } from "@/types/admin/analytics.types";

function StatusPill({ label }: { label: string }) {
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

function completionToPercent(completion: string) {
  const parsed = Number.parseInt(completion.replace("%", ""), 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
}

export default function MostPopularCoursesCard({
  rows,
  startDate,
  endDate,
}: {
  rows: PopularCourseTableItem[];
  startDate: string;
  endDate: string;
}) {
  const viewAllHref = `/dashboard/admin/analytics/most-popular-courses?startDate=${startDate}&endDate=${endDate}&page=1&limit=10`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Most Popular Courses
        </h2>

        <Link
          href={viewAllHref}
          className="text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-3 py-2 font-semibold">COURSE NAME</th>
              <th className="px-3 py-2 font-semibold">ENROLLED</th>
              <th className="px-3 py-2 font-semibold">COMPLETION</th>
              <th className="px-3 py-2 font-semibold">STATUS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {rows.map((r) => (
              <tr
                key={`${r.courseName}-${r.instructorDetails.id ?? "na"}`}
                className="text-slate-700"
              >
                <td className="px-3 py-3 font-medium text-slate-900">
                  {r.courseName}
                </td>
                <td className="px-3 py-3">{r.enrolled.toLocaleString()}</td>
                <td className="px-3 py-3">
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
                <td className="px-3 py-3">
                  <StatusPill label={r.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  No course analytics available for the selected period.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
