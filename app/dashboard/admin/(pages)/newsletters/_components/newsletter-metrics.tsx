"use client";

import Link from "next/link";
import { Mail, Users, GraduationCap, UserMinus } from "lucide-react";
import { useEffect, useState } from "react";

import { getGeneralNewsletterDashboard } from "@/service/admin/newsletter/dashboard/general-dashboard.service";
import type { GeneralNewsletterDashboardResponse } from "@/types/admin/newsletter/dashboard/general-dashboard.types";

function CardShell({
  title,
  children,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          {children}
        </div>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-slate-200/40">
          {icon}
        </div>
      </div>
    </div>
  );
}

function GrowthIndicator({
  value,
  isPositive,
}: {
  value: number;
  isPositive: boolean;
}) {
  const sign = isPositive ? "+" : "-";
  const textClass = isPositive ? "text-emerald-600" : "text-red-500";

  return (
    <span className={`text-xs font-semibold ${textClass}`}>
      {sign}
      {Math.abs(value)}%
    </span>
  );
}

export default function NewsletterMetrics() {
  const [dashboardData, setDashboardData] =
    useState<GeneralNewsletterDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await getGeneralNewsletterDashboard();

        if (!isMounted) return;
        setDashboardData(response);
      } catch (error) {
        console.error("Failed to load newsletter dashboard metrics", error);

        if (!isMounted) return;
        setDashboardData(null);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSent = dashboardData?.metrics.totalSent ?? 0;
  const audienceReachTotal = dashboardData?.metrics.audienceReach.total ?? 0;
  const audienceGrowthRate =
    dashboardData?.metrics.audienceReach.growthRatePercent ?? 0;
  const isAudienceGrowthPositive =
    dashboardData?.metrics.audienceReach.isPositive ?? true;
  const courseUpdates = dashboardData?.metrics.courseUpdates ?? 0;
  const pendingUnsubs =
    dashboardData?.metrics.unsubscriptionRequests.count ?? 0;
  const unsubscriptionStatus =
    dashboardData?.metrics.unsubscriptionRequests.statusLabel ??
    "Pending action";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <CardShell title="Newsletter Metrics" icon={<Mail size={16} />}>
        <p className="mt-2 text-xs text-slate-500">Total Sent</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {isLoading ? "..." : totalSent}
        </p>
      </CardShell>

      <CardShell title="Audience Reach" icon={<Users size={16} />}>
        <p className="mt-2 text-xs text-slate-500">General Blasts</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-slate-900">
            {isLoading ? "..." : audienceReachTotal}
          </p>

          {!isLoading ? (
            <GrowthIndicator
              value={audienceGrowthRate}
              isPositive={isAudienceGrowthPositive}
            />
          ) : null}
        </div>
      </CardShell>

      <CardShell title="Trainee Comms" icon={<GraduationCap size={16} />}>
        <p className="mt-2 text-xs text-slate-500">Course Updates</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {isLoading ? "..." : courseUpdates}
        </p>
      </CardShell>

      <CardShell title="Unsubscription Requests" icon={<UserMinus size={16} />}>
        <p className="mt-2 text-sm font-semibold text-red-500">
          {isLoading ? "Loading..." : unsubscriptionStatus}
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {isLoading ? "..." : pendingUnsubs}
        </p>

        <div className="mt-4 flex justify-end">
          <Link
            href={"/dashboard/admin/newsletters/unsubscription-management"}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-50)] px-4 py-2 text-xs font-semibold text-[var(--primary)] hover:bg-slate-100"
          >
            Manage <span aria-hidden>→</span>
          </Link>
        </div>
      </CardShell>
    </div>
  );
}
