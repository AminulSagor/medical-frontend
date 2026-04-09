"use client";

export type UserTabKey = "all" | "students" | "instructors";

export default function UsersTabs({
    tab,
    onChange,
    counts,
}: {
    tab: UserTabKey;
    onChange: (k: UserTabKey) => void;
    counts: { all: number; students: number; instructors: number };
}) {
    const items: Array<{ key: UserTabKey; label: string; count: number }> = [
        { key: "all", label: "All Users", count: counts.all },
        { key: "students", label: "Students/Customers", count: counts.students },
        { key: "instructors", label: "Faculty/Instructors", count: counts.instructors },
    ];

    return (
        <div className="flex flex-wrap items-center gap-3">
            {items.map((it) => {
                const active = it.key === tab;

                return (
                    <button
                        key={it.key}
                        type="button"
                        onClick={() => onChange(it.key)}
                        className={[
                            "inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold transition",
                            active
                                ? "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20"
                                : "bg-transparent text-slate-600 hover:bg-slate-50",
                        ].join(" ")}
                    >
                        <span>{it.label}</span>

                        <span
                            className={[
                                "rounded-full px-2.5 py-1 text-[11px]",
                                active
                                    ? "bg-white text-[var(--primary)]"
                                    : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                        >
                            {it.count.toLocaleString()}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}