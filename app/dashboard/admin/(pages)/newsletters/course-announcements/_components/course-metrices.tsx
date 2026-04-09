"use client";

import { useEffect, useState } from "react";
import { MapPin, Megaphone, UsersRound } from "lucide-react";
import { getCourseAnnouncementStats } from "@/service/admin/newsletter/course-announcements/course-announcement-stats.service";
import type { CourseAnnouncementStatsCards } from "@/types/admin/newsletter/course-announcements/course-announcement-stats.types";

const INITIAL_CARDS: CourseAnnouncementStatsCards = {
  totalActiveStudents: {
    value: 0,
  },
  scheduledBroadcasts: {
    pending: 0,
  },
  averageCohortSize: {
    value: 0,
  },
};

export default function CourseMetrics() {
  const [cards, setCards] =
    useState<CourseAnnouncementStatsCards>(INITIAL_CARDS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await getCourseAnnouncementStats();

        if (!isMounted) return;

        setCards(response.cards);
      } catch (error) {
        console.error("Failed to load course announcement stats:", error);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <MetricCard
        title="TOTAL ACTIVE STUDENTS"
        icon={<UsersRound className="h-11 w-11 stroke-[1.5]" />}
        value={
          <p className="text-[36px] font-black leading-none text-slate-900">
            {isLoading ? "..." : cards.totalActiveStudents.value}
          </p>
        }
        sub={
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            +4% week
          </span>
        }
      />

      <MetricCard
        title="SCHEDULED BROADCASTS"
        icon={<Megaphone className="h-11 w-11 stroke-[1.5]" />}
        value={
          <p className="text-[36px] font-black leading-none text-slate-900">
            {isLoading ? "..." : cards.scheduledBroadcasts.pending}
          </p>
        }
        sub={
          <span className="text-[15px] font-semibold text-slate-400">
            Pending
          </span>
        }
      />

      <MetricCard
        title="AVERAGE COHORT SIZE"
        icon={<MapPin className="h-11 w-11 stroke-[1.5]" />}
        value={
          <p className="text-[36px] font-black leading-none text-slate-900">
            {isLoading ? "..." : cards.averageCohortSize.value}
          </p>
        }
        sub={
          <span className="text-[15px] font-semibold text-slate-400">
            Students
          </span>
        }
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6">
      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200">
        {icon}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>

        <div className="mt-3 flex items-end gap-2">
          {value}
          {sub ? <div className="pb-1">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}
