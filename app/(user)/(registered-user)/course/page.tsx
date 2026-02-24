"use client";

import { useState } from "react";
import CourseStatsCards from "./_components/course-stats-cards";
import CourseCardsSection from "./_components/CourseCardsSection";
import CoursesToolbarWithTabs from "./_components/CoursesToolbarWithTabs";

type TabKey = "active" | "completed" | "browse";

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabKey>("active");
    const [search, setSearch] = useState("");
    const [courseType, setCourseType] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    return (
        <main className="w-full">
            {/* padded container for header + stats */}
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
                    totalCmeCredits={12.0}
                    totalCmeDeltaText="+2.5"
                    inProgressCount={3}
                    nextLiveSessionText="Mar 15, 10:00 AM"
                />
            </div>

            {/* toolbar should control its own padding */}
            <CoursesToolbarWithTabs
                search={search}
                onSearchChange={setSearch}
                courseType={courseType}
                onCourseTypeChange={setCourseType}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* padded container for tab content */}
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
                {activeTab === "active" && (
                    <CourseCardsSection
                        inPerson={{
                            badge: "ALL IN-PERSON WORKSHOP",
                            title: "Advanced Airway Management",
                            dateLabel: "Mar 12, 2024",
                            locationLabel: "Sim Lab B",
                            bookedForLabel: "2 people",
                            bookingFeeLabel: "$450.00",
                            imageSrc: "/photos/child.png",
                            onAddToCalendar: () => console.log("Add to Calendar"),
                            onViewSyllabus: () => console.log("View Syllabus"),
                        }}
                        online={{
                            badge: "ONLINE SELF-PACED COURSE",
                            title: "Ultrasound Physics & Knobology",
                            infoTitle: "Live Online Session Included:",
                            infoText:
                                "A Q&A workshop is scheduled for Mar 15. Check your email for the link.",
                            bookedForLabel: "1 person",
                            bookingFeeLabel: "$125.00",
                            progressLabel: "12% Complete",
                            imageSrc: "/photos/strethoscope.png",
                            onJoinLive: () => console.log("Join Live"),
                        }}
                    />
                )}

                {activeTab === "completed" && <div>Completed content</div>}

                {activeTab === "browse" && <div>Browse Courses content</div>}
            </div>
        </main>
    );
}