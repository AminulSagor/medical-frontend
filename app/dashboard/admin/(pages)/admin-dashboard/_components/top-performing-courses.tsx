const COURSES = [
    { name: "Airway Management 101", pct: 89, bar: "bg-cyan-400" },
    { name: "Emergency Procedures", pct: 62, bar: "bg-blue-500" },
    { name: "Pediatric Care", pct: 45, bar: "bg-purple-500" },
    { name: "Trauma Response", pct: 30, bar: "bg-orange-500" },
];

export default function TopPerformingCourses() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
                Top Performing Courses
            </p>

            <div className="mt-4 space-y-5">
                {COURSES.map((c) => (
                    <div key={c.name}>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-700">{c.name}</p>
                            <p className="text-sm font-semibold text-slate-900">{c.pct}%</p>
                        </div>

                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                            <div
                                className={`h-2 rounded-full ${c.bar}`}
                                style={{ width: `${c.pct}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}