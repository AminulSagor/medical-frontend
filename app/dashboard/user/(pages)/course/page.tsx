// app/(user)/(registered-user)/course/page.tsx

"use client";

import CourseStatsCards from "./_components/course-stats-cards";
import CourseCardsSection from "./_components/course-cards-section";
import CoursesToolbarWithTabs from "./_components/courses-toolbar-with-tabs";


import BrowseCoursesSection from "./_components/browse-courses-section";

import { useCourseController } from "./course-controller";
import CompletedCoursesSection from "./_components/completed-courses-section";

export default function Page() {
  const {
    toolbarState,
    setActiveTab,
    setSearch,
    setCourseType,
    setSortBy,
    stats,
    activeCourses,

    // ✅ new from controller
    completedCourses,
    browseCourses,
  } = useCourseController();

  const hasAnyActive = Boolean(activeCourses.inPerson || activeCourses.online);

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
          hasAnyActive ? (
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

        {toolbarState.activeTab === "completed" && (
          <CompletedCoursesSection items={completedCourses} />
        )}

        {toolbarState.activeTab === "browse" && (
          <BrowseCoursesSection model={browseCourses} />
        )}
      </div>
    </main>
  );
}