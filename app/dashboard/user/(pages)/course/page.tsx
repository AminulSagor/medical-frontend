"use client";

import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CourseStatsCards from "./_components/course-stats-cards";
import CourseCardsSection from "./_components/course-cards-section";
import CoursesToolbarWithTabs from "./_components/courses-toolbar-with-tabs";
import BrowseCoursesSection from "./_components/browse-courses-section";
import CompletedCoursesSection from "./_components/completed-courses-section";
import { useCourseController } from "./course-controller";

const TAB_COPY = {
  active: {
    title: "Active & In-Progress Courses",
    description:
      "Manage your current enrollments and upcoming clinical workshops.",
    emptyMessage: "No active or in-progress courses found.",
  },
  completed: {
    title: "Completed Courses",
    description: "Review completed workshops and revisit course details.",
    emptyMessage: "No completed courses found.",
  },
  browse: {
    title: "Browse Courses",
    description: "Explore new workshops and clinical learning opportunities.",
    emptyMessage: "No courses available to browse right now.",
  },
} as const;

export default function Page() {
  const {
    toolbarState,
    setActiveTab,
    setSearch,
    setCourseType,
    setSortBy,
    setPage,
    stats,
    activeCourses,
    completedCourses,
    browseCourses,
    featuredBrowseCourse,
    currentMeta,
    isSummaryLoading,
    isListLoading,
    summaryError,
    listError,
  } = useCourseController();

  const currentTabCopy = TAB_COPY[toolbarState.activeTab];

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="space-y-1">
          <h1 className="text-[22px] font-semibold leading-tight text-slate-900 md:text-2xl">
            {currentTabCopy.title}
          </h1>

          <p className="text-sm leading-relaxed text-slate-500">
            {currentTabCopy.description}
          </p>
        </header>

        <CourseStatsCards {...stats} isLoading={isSummaryLoading} />

        {summaryError ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <span>{summaryError}</span>
          </div>
        ) : null}
      </div>

      <CoursesToolbarWithTabs
        search={toolbarState.search}
        onSearchChange={setSearch}
        courseType={toolbarState.courseType}
        onCourseTypeChange={setCourseType}
        sortBy={toolbarState.sortBy}
        onSortByChange={setSortBy}
        activeTab={toolbarState.activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        {listError ? (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            <span>{listError}</span>
          </div>
        ) : isListLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        ) : (
          <>
            {toolbarState.activeTab === "active" &&
              (activeCourses.length > 0 ? (
                <CourseCardsSection items={activeCourses} />
              ) : (
                <EmptyState message={currentTabCopy.emptyMessage} />
              ))}

            {toolbarState.activeTab === "completed" &&
              (completedCourses.length > 0 ? (
                <CompletedCoursesSection items={completedCourses} />
              ) : (
                <EmptyState message={currentTabCopy.emptyMessage} />
              ))}

            {toolbarState.activeTab === "browse" &&
              (browseCourses.length > 0 ? (
                <BrowseCoursesSection
                  items={browseCourses}
                  featuredCourse={featuredBrowseCourse}
                />
              ) : (
                <EmptyState message={currentTabCopy.emptyMessage} />
              ))}

            <PaginationRow
              page={currentMeta.page}
              total={currentMeta.total}
              limit={currentMeta.limit}
              totalPages={currentMeta.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function PaginationRow({
  page,
  total,
  limit,
  totalPages,
  onPageChange,
}: {
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (total <= 0) return null;

  const safePage = Math.max(page, 1);
  const safeTotalPages = Math.max(totalPages, 1);
  const showingFrom = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const showingTo = Math.min(safePage * limit, total);

  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-[11px] text-slate-500">
        Showing {showingFrom} to {showingTo} of {total} courses
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        {Array.from({ length: safeTotalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={[
                "inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-medium",
                pageNumber === safePage
                  ? "bg-sky-500 text-white"
                  : "text-slate-500 hover:bg-slate-100",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={safePage >= safeTotalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span>Go to page</span>
        <input
          value={safePage}
          readOnly
          className="h-8 w-12 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-900 outline-none"
        />
      </div>
    </div>
  );
}
