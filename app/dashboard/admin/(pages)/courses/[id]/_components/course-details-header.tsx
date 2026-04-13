import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CourseDetailsTinyPill from "./course-details-tiny-pill";
import type { WorkshopStatus } from "@/types/admin/workshop.types";

export default function CourseDetailsHeader({
    title,
    status,
}: {
    title: string;
    status: WorkshopStatus;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <span>Course Management</span>
                    <span>›</span>
                    <span>Workshop Details</span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">{title || "—"}</h1>
                    <CourseDetailsTinyPill>
                        {status === "published" ? "Published" : "Draft"}
                    </CourseDetailsTinyPill>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href="/dashboard/admin/courses"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                    onClick={() => alert("Edit (UI only)")}
                >
                    Edit Course
                </button>
            </div>
        </div>
    );
}