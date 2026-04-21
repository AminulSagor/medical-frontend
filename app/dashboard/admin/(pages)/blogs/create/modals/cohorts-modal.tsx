"use client";

import {
  CalendarDays,
  Check,
  Loader2,
  MoveLeft,
  Send,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cx } from "../_utils/create-blog-post.helpers";
import { getCourseAnnouncementCohorts } from "@/service/admin/newsletter/course-announcements/course-announcement-cohort.service";
import type { CourseAnnouncementCohortItem } from "@/types/admin/newsletter/course-announcements/course-announcement-cohort.types";

type CohortsModalProps = {
  isSubmitting?: boolean;
  onBack: () => void;
  onClose: () => void;
  onProceed: (cohortIds: string[]) => void;
};

const COHORTS_LIMIT = 10;

function formatCohortDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function getCohortAccent(index: number) {
  const accents = [
    "bg-[#19c7bd]",
    "bg-[#b785ff]",
    "bg-[#4a86ff]",
    "bg-[#19c7bd]",
  ];

  return accents[index % accents.length];
}

export default function CohortsModal({
  isSubmitting = false,
  onBack,
  onClose,
  onProceed,
}: CohortsModalProps) {
  const [cohorts, setCohorts] = useState<CourseAnnouncementCohortItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string>("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const hasMore = cohorts.length < total;

  const loadCohorts = async (targetPage: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setLoadError("");
    }

    try {
      const response = await getCourseAnnouncementCohorts({
        page: targetPage,
        limit: COHORTS_LIMIT,
        tab: "UPCOMING",
      });

      const incomingItems = response.items ?? [];
      const incomingTotal = response.meta?.total ?? 0;

      setTotal(incomingTotal);
      setPage(targetPage);

      setCohorts((prev) => {
        if (!append) {
          return incomingItems;
        }

        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueIncoming = incomingItems.filter(
          (item) => !existingIds.has(item.id),
        );

        return [...prev, ...uniqueIncoming];
      });
    } catch (error) {
      if (!append) {
        setLoadError("Failed to load upcoming cohorts.");
      }
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    void loadCohorts(1, false);
  }, []);

  const areAllSelected =
    cohorts.length > 0 && selectedIds.length === cohorts.length;

  const selectedCount = selectedIds.length;

  const totalStudents = useMemo(() => {
    return cohorts
      .filter((cohort) => selectedIds.includes(cohort.id))
      .reduce((sum, cohort) => sum + cohort.enrolledCount, 0);
  }, [cohorts, selectedIds]);

  const handleToggleSingle = (cohortId: string) => {
    setSelectedIds((prev) =>
      prev.includes(cohortId)
        ? prev.filter((item) => item !== cohortId)
        : [...prev, cohortId],
    );
  };

  const handleToggleAll = () => {
    if (areAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(cohorts.map((cohort) => cohort.id));
  };

  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMore || isLoading || isSubmitting) {
      return;
    }

    await loadCohorts(page + 1, true);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-[720px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="px-8 pb-6 pt-8">
          <h3 className="text-[20px] font-extrabold leading-none text-slate-800 md:text-[22px]">
            Select Target Cohorts
          </h3>
          <p className="mt-3 text-sm text-slate-500">
            Distribute this article to students in specific active or upcoming
            classes.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Select All Active Cohorts
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleAll}
                disabled={isLoading || cohorts.length === 0 || isSubmitting}
                aria-label="Toggle all cohorts"
                className={cx(
                  "relative inline-flex h-7 w-[44px] shrink-0 items-center rounded-full transition",
                  areAllSelected ? "bg-[#19c7bd]" : "bg-slate-300",
                  isLoading || cohorts.length === 0 || isSubmitting
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer",
                )}
              >
                <span
                  className={cx(
                    "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                    areAllSelected ? "translate-x-[21px]" : "translate-x-[3px]",
                  )}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 h-[360px] overflow-y-auto pr-1">
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-6 animate-pulse rounded-md bg-slate-100" />
                      <div className="h-12 w-[4px] animate-pulse rounded-full bg-slate-100" />
                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-52 animate-pulse rounded bg-slate-100" />
                        <div className="mt-3 h-4 w-36 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </div>
                ))
              ) : loadError ? (
                <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 text-center">
                  <div>
                    <p className="text-sm font-semibold text-rose-600">
                      {loadError}
                    </p>
                    <p className="mt-1 text-xs text-rose-500">
                      Please close this modal and try again.
                    </p>
                  </div>
                </div>
              ) : cohorts.length === 0 ? (
                <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      No upcoming cohorts found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      There are no upcoming cohorts available right now.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {cohorts.map((cohort, index) => {
                    const isSelected = selectedIds.includes(cohort.id);

                    return (
                      <button
                        key={cohort.id}
                        type="button"
                        onClick={() => handleToggleSingle(cohort.id)}
                        disabled={isSubmitting}
                        className={cx(
                          "w-full rounded-2xl border bg-white px-4 py-4 text-left transition",
                          isSelected
                            ? "border-[#cfd8e3] shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                            : "border-slate-200 hover:border-slate-300",
                          isSubmitting ? "cursor-not-allowed opacity-80" : "",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cx(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition",
                              isSelected
                                ? "border-[#19c7bd] bg-[#19c7bd] text-white"
                                : "border-slate-300 bg-white text-transparent",
                            )}
                          >
                            <Check size={15} strokeWidth={3} />
                          </div>

                          <div
                            className={cx(
                              "h-12 w-[4px] shrink-0 rounded-full",
                              getCohortAccent(index),
                            )}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-extrabold text-slate-800 md:text-[16px]">
                              {cohort.title}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays
                                  size={14}
                                  className="text-slate-400"
                                />
                                {formatCohortDate(cohort.startDate)}
                              </span>

                              <span className="inline-flex items-center gap-1.5">
                                <Users size={14} className="text-slate-400" />
                                {cohort.enrolledCount} Students
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {hasMore ? (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore || isSubmitting}
                        className={cx(
                          "flex h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 transition",
                          isLoadingMore || isSubmitting
                            ? "cursor-not-allowed opacity-70"
                            : "hover:bg-slate-100",
                        )}
                      >
                        {isLoadingMore ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Loading more cohorts...
                          </>
                        ) : (
                          <>More</>
                        )}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {!isLoading && !loadError && cohorts.length > 0 ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">
                Loaded {cohorts.length} of {total} cohorts
              </p>

              <p className="text-xs font-semibold text-slate-500">
                {selectedCount} selected • {totalStudents} students
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-200 bg-white px-8 py-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MoveLeft size={16} />
            Back
          </button>

          <button
            type="button"
            disabled={
              selectedIds.length === 0 ||
              isSubmitting ||
              isLoading ||
              !!loadError
            }
            onClick={() => onProceed(selectedIds)}
            className={cx(
              "inline-flex h-[42px] items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition",
              selectedIds.length === 0 ||
                isSubmitting ||
                isLoading ||
                !!loadError
                ? "cursor-not-allowed bg-slate-300 text-slate-100"
                : "bg-[#19c7bd] hover:bg-[#12b8ae]",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Broadcasting...
              </>
            ) : (
              <>
                Proceed to Broadcast
                <Send size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
