"use client";

import { useEffect, useState } from "react";

import StatCards from "./_components/stat-cards";
import RevenueTrends from "./_components/revenue-trends";
import RecentEnrollments from "./_components/recent-enrollments";
import QuickActions from "./_components/quick-actions";
import LowStockAlert from "./_components/low-stock-alert";
import RecentActivity from "./_components/recent-activity";
import TopPerformingCourses from "./_components/top-performing-courses";
import PageTitle from "@/app/dashboard/admin/_components/page-title";
import { getAdminDashboardOverview } from "@/service/admin/dashboard.service";
import type { DashboardOverviewResponse } from "@/types/admin/dashboard.types";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardOverview();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard overview:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageTitle
          title="Overview Analytics"
          subtitle="Track your institute's performance at a glance."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageTitle
          title="Overview Analytics"
          subtitle="Track your institute's performance at a glance."
        />
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Failed to load dashboard overview.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title={data.title} subtitle={data.subtitle} />

      <StatCards kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <RevenueTrends revenueTrend={data.revenueTrend} />
          <RecentEnrollments recentEnrollments={data.recentEnrollments} />
        </div>

        <div className="min-w-0 space-y-6">
          <QuickActions quickActions={data.quickActions} />
          <LowStockAlert lowStockAlerts={data.lowStockAlerts} />
          <RecentActivity recentActivities={data.recentActivities} />
          <TopPerformingCourses topPerformingCourses={data.topPerformingCourses} />
        </div>
      </div>
    </div>
  );
}