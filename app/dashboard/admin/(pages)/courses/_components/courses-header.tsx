"use client";

import PageTitle from "@/app/dashboard/admin/_components/page-title";
import { Plus } from "lucide-react";

export default function CoursesHeader({
  onSchedule,
}: {
  onSchedule?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 md:items-center">
      <PageTitle
        title="Course Management"
        subtitle="Manage and track your clinical workshop sessions for 2026"
      />

      <div className="flex items-center gap-2">

        <button
          type="button"
          onClick={onSchedule}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
        >
          <Plus size={16} strokeWidth={2} />
          Schedule New Workshop
        </button>
      </div>
    </div>
  );
}
