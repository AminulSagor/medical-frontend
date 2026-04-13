"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { DashboardRecentEnrollment } from "@/types/admin/dashboard.types";
import { mapAdminDashboardRoute } from "../_utils/dashboard-route";

function StatusBadge({ status }: { status: string }) {
    const cls =
        status.toLowerCase() === "paid"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "bg-amber-50 text-amber-700 ring-1 ring-amber-100";

    return (
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${cls}`}>
            {status}
        </span>
    );
}

function formatDate(date: string) {
    try {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    } catch {
        return date;
    }
}

export default function RecentEnrollments({
    recentEnrollments,
}: {
    recentEnrollments: DashboardRecentEnrollment[];
}) {
    const router = useRouter();
    const viewAllRoute = recentEnrollments[0]?.viewAllEnrollmentsRoute;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Recent Enrollments</p>
                <button
                    type="button"
                    onClick={() => {
                        if (viewAllRoute) {
                            router.push(mapAdminDashboardRoute(viewAllRoute));
                        }
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800 disabled:opacity-50"
                    disabled={!viewAllRoute}
                >
                    View All
                </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px]">
                        <thead className="bg-slate-50">
                            <tr className="text-left text-xs text-slate-500">
                                <th className="px-4 py-3 font-medium">STUDENT NAME</th>
                                <th className="px-4 py-3 font-medium">COURSE</th>
                                <th className="px-4 py-3 font-medium">DATE</th>
                                <th className="px-4 py-3 font-medium">STATUS</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {recentEnrollments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-sm text-slate-500"
                                    >
                                        No recent enrollments found.
                                    </td>
                                </tr>
                            ) : (
                                recentEnrollments.map((row) => (
                                    <tr key={row.id} className="text-sm text-slate-700">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200">
                                                    <Image
                                                        src={row.studentAvatarUrl || "/photos/image.png"}
                                                        alt={row.studentName}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium text-slate-900">
                                                    {row.studentName}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-slate-600">{row.courseTitle}</td>
                                        <td className="px-4 py-4 text-slate-600">
                                            {formatDate(row.date)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={row.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}