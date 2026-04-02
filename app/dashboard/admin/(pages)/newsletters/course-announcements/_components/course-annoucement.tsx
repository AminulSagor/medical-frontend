"use client";

import { useMemo, useState } from "react";
import type {
  CourseAnnouncementsData,
  CourseAnnouncementsTabKey,
} from "../types/course-annoucements-types";

import CourseHeader from "./course-header";
import CourseMetrics from "./course-metrices";
import CourseToolbar from "./course-toolbar";
import CohortGrid from "./cohort-grid";
import CourseTransmissionCTA from "./course-transmission-cta";

export default function CourseAnnouncements({ data }: { data: CourseAnnouncementsData }) {
  const [tab, setTab] = useState<CourseAnnouncementsTabKey>("upcoming");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return data.cohorts.filter((item) => {
      const matchesTab = tab === "all" ? true : item.status === (tab as any);
      const matchesQuery = !query || item.title.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    });
  }, [data.cohorts, tab, q]);

  return (
    <div className="space-y-6">
      <CourseHeader>
  <CourseMetrics metrics={data.metrics} />
</CourseHeader>

      <CourseToolbar
        query={q}
        onQueryChange={setQ}
        tab={tab}
        onTabChange={setTab}
        onFilterClick={() => {}}
      />

      <CohortGrid items={filtered} />
      <CourseTransmissionCTA />
    </div>
  );
}