// app/(user)/(registered-user)/course/page.tsx

"use client";

import CourseStatsCards from "./_components/course-stats-cards";
import CourseCardsSection from "./_components/CourseCardsSection";
import CoursesToolbarWithTabs from "./_components/CoursesToolbarWithTabs";
import { useCourseController } from "./course-controller";

export default function Page() {
  const {
    toolbarState,
    setActiveTab,
    setSearch,
    setCourseType,
    setSortBy,
    stats,
    activeCourses,
  } = useCourseController();

  const hasAny = Boolean(activeCourses.inPerson || activeCourses.online);

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="space-y-1">
          <h1 className="text-[22px] font-semibold leading-tight text-slate-900 md:text-2xl">
            Active &amp; In-Progress Courses
          </h1>

          <p className="text-sm leading-relaxed text-slate-500">
            Manage your current enrollments and upcoming clinical workshops.
          </p>
        </header>

        <CourseStatsCards
          totalCmeCredits={stats.totalCmeCredits}
          totalCmeDeltaText={stats.totalCmeDeltaText}
          inProgressCount={stats.inProgressCount}
          nextLiveSessionText={stats.nextLiveSessionText}
        />
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
        {toolbarState.activeTab === "active" && (
          hasAny ? (
            <CourseCardsSection
              inPerson={activeCourses.inPerson}
              online={activeCourses.online}
            />
          ) : (
            <div className="mt-10 text-center text-sm text-slate-500">
              No courses found.
            </div>
          )
        )}

        {toolbarState.activeTab === "completed" && <div>Completed content</div>}
        {toolbarState.activeTab === "browse" && <div>Browse Courses content</div>}
      </div>
    </main>
  );
}