
import type { CourseAnnouncementsMetrics } from "../types/course-annoucements-types";

function MetricCard({
    title,
    value,
    sub,
}: {
    title: string;
    value: React.ReactNode;
    sub?: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {title}
            </p>
            <div className="mt-2">{value}</div>
            {sub ? <div className="mt-2">{sub}</div> : null}
        </div>
    );
}

export default function CourseMetrics({
    metrics,
}: {
    metrics: CourseAnnouncementsMetrics;
}) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <MetricCard
                title="TOTAL ACTIVE STUDENTS"
                value={
                    <p className="text-[36px] font-black leading-[40px] tracking-[0px] text-slate-900">
                        {metrics.totalActiveStudents}
                    </p>
                }
                sub={
                    metrics.activeStudentsDeltaLabel ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {metrics.activeStudentsDeltaLabel}
                        </span>
                    ) : null
                }
            />

            <MetricCard
                title="SCHEDULED BROADCASTS"
                value={
                    <div className="flex items-baseline gap-2">
                        <p className="text-[36px] font-black leading-[40px] tracking-[0px] text-slate-900">
                            {metrics.scheduledBroadcasts}
                        </p>
                        {metrics.scheduledBroadcastsSubLabel ? (
                            <span className="text-xs font-semibold text-slate-500">
                                {metrics.scheduledBroadcastsSubLabel}
                            </span>
                        ) : null}
                    </div>
                }
            />

            <MetricCard
                title="AVERAGE COHORT SIZE"
                value={
                    <div className="flex items-baseline gap-2">
                        <p className="text-[36px] font-black leading-[40px] tracking-[0px] text-slate-900">
                            {metrics.averageCohortSize}
                        </p>
                        {metrics.averageCohortSizeUnitLabel ? (
                            <span className="text-xs font-semibold text-slate-500">
                                {metrics.averageCohortSizeUnitLabel}
                            </span>
                        ) : null}
                    </div>
                }
            />
        </div>
    );
}