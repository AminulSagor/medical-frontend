import type { DashboardTopPerformingCourse } from "@/types/admin/dashboard.types";

function resolveBarColor(colorKey: string) {
    if (colorKey === "blue") return "bg-blue-500";
    if (colorKey === "purple") return "bg-purple-500";
    if (colorKey === "orange") return "bg-orange-500";
    if (colorKey === "cyan") return "bg-cyan-400";
    return "bg-cyan-400";
}

export default function TopPerformingCourses({
    topPerformingCourses,
}: {
    topPerformingCourses: DashboardTopPerformingCourse[];
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
                Top Performing Courses
            </p>

            <div className="mt-4 space-y-5">
                {topPerformingCourses.length === 0 ? (
                    <div className="text-sm text-slate-500">No top performing courses found.</div>
                ) : (
                    topPerformingCourses.map((course) => (
                        <div key={course.courseId}>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    {course.courseTitle}
                                </p>
                                <p className="text-sm font-semibold text-slate-900">
                                    {course.scorePercent}%
                                </p>
                            </div>

                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <div
                                    className={`h-2 rounded-full ${resolveBarColor(course.barColorKey)}`}
                                    style={{ width: `${course.scorePercent}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}