"use client";

import { ClipboardList } from "lucide-react";

export type AssignedUserRole = "instructor" | "faculty";

export default function RoleAssignmentCard({
    value,
    onChange,
    onActivate,
}: {
    value: string;
    onChange: (v: string) => void;
    onActivate?: () => void;
}) {
    return (
        <div
            className={[
                "rounded-2xl bg-white p-6 ring-1 ring-slate-200",
                "shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
            ].join(" ")}
            onFocusCapture={onActivate}
        >
            {/* header */}
            <div className="mb-6 flex items-center gap-2">
                <ClipboardList size={18} className="text-[var(--primary)]" />
                <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                        Role Assignment
                    </h2>
                </div>
            </div>

            <div>
                <label className="text-[11px] font-bold tracking-wide text-slate-600">
                    ASSIGNED USER ROLE
                </label>

                <input
                    value={value}
                    onFocus={() => onActivate?.()}
                    onChange={(e) =>
                        onChange(e.target.value as AssignedUserRole)
                    }
                    className={[
                        "mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                        "text-slate-900 placeholder:text-slate-400",
                        "outline-none transition",
                        "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                    ].join(" ")}
                    placeholder="Instructor"
                />

                <p className="mt-3 text-xs text-slate-500">
                    Roles are used for administrative categorization and course assignment visibility.
                </p>
            </div>
        </div>
    );
}