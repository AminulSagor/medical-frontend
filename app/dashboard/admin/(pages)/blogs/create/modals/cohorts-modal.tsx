"use client";

import { CalendarDays, Check, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { cx, toggleStringItem } from "../_utils/create-blog-post.helpers";
import type { BlogCourseCohort } from "@/types/admin/blogs/blog-distribution.types";

type CohortsModalProps = {
  cohorts: BlogCourseCohort[];
  isSubmitting?: boolean;
  onBack: () => void;
  onClose: () => void;
  onProceed: (cohortIds: string[]) => void;
};

export default function CohortsModal({
  cohorts,
  isSubmitting = false,
  onBack,
  onClose,
  onProceed,
}: CohortsModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedCount = selectedIds.length;

  const totalStudents = useMemo(() => {
    return cohorts
      .filter((cohort) => selectedIds.includes(cohort.id))
      .reduce((sum, cohort) => sum + cohort.students, 0);
  }, [cohorts, selectedIds]);

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[720px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-xl font-extrabold text-slate-900">
          Notify Course Trainees
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Select the active cohorts that should receive this article broadcast.
        </p>

        <div className="mt-5 space-y-3">
          {cohorts.map((cohort) => {
            const active = selectedIds.includes(cohort.id);

            return (
              <button
                key={cohort.id}
                type="button"
                onClick={() =>
                  setSelectedIds((prev) => toggleStringItem(prev, cohort.id))
                }
                className={cx(
                  "w-full rounded-xl border p-4 text-left transition",
                  "border-slate-200 bg-white hover:bg-slate-50",
                  active && "border-cyan-200 ring-2 ring-cyan-100",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-700">
                    <Users size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-slate-900">
                        {cohort.name}
                      </p>

                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        Active Cohort
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} className="text-slate-400" />
                        {cohort.date}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Users size={14} className="text-slate-400" />
                        {cohort.students} students
                      </span>
                    </div>
                  </div>

                  <span
                    className={cx(
                      "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                      active
                        ? "border-[var(--primary)] bg-white"
                        : "border-slate-300",
                    )}
                  >
                    {active ? (
                      <Check size={12} className="text-[var(--primary)]" />
                    ) : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Selected Cohorts
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {selectedCount} cohort{selectedCount === 1 ? "" : "s"} selected
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Estimated Recipients
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {totalStudents} trainees
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-10 w-[110px] rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back
          </button>

          <button
            type="button"
            disabled={selectedIds.length === 0 || isSubmitting}
            onClick={() => onProceed(selectedIds)}
            className={cx(
              "h-10 rounded-md px-5 text-xs font-semibold text-white transition",
              selectedIds.length === 0 || isSubmitting
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
            )}
          >
            {isSubmitting ? "Broadcasting..." : "Proceed to Broadcast"}
          </button>
        </div>
      </div>
    </div>
  );
}
