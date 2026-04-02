import Image from "next/image";

type Row = {
    name: string;
    course: string;
    date: string;
    status: "Paid" | "Pending";
    avatarSrc: string;
};

const ROWS: Row[] = [
    {
        name: "John Doe",
        course: "Airway Management 101",
        date: "Oct 24, 2023",
        status: "Paid",
        avatarSrc: "/photos/image.png",
    },
    {
        name: "Sarah Lee",
        course: "Advanced Intubation",
        date: "Oct 23, 2023",
        status: "Pending",
        avatarSrc: "/photos/image.png",
    },
    {
        name: "Mike King",
        course: "Pediatric Airway",
        date: "Oct 23, 2023",
        status: "Paid",
        avatarSrc: "/photos/image.png",
    },
];

function StatusBadge({ status }: { status: Row["status"] }) {
    const cls =
        status === "Paid"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
            : "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    return (
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${cls}`}>
            {status}
        </span>
    );
}

export default function RecentEnrollments() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Recent Enrollments</p>
                <button
                    type="button"
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                >
                    View All
                </button>
            </div>

            {/* ✅ Table wrapper like design (no black dividers) */}
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
                            {ROWS.map((r) => (
                                <tr key={r.name} className="text-sm text-slate-700">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-slate-200">
                                                <Image
                                                    src={r.avatarSrc}
                                                    alt={r.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-slate-900">{r.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-slate-600">{r.course}</td>
                                    <td className="px-4 py-4 text-slate-600">{r.date}</td>

                                    <td className="px-4 py-4">
                                        <StatusBadge status={r.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}