"use client";

import { BarChart3, CheckCircle2, Eye, FileText, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getBlogAnalyticsOverview } from "@/service/admin/blogs/blog-analytics.service";
import type { BlogAnalyticsOverviewResponse } from "@/types/admin/blogs/blog-analytics.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  const isDelta = sub.trim().startsWith("+");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>

          <p
            className={cx(
              "mt-1 text-xs",
              isDelta ? "font-medium text-[var(--primary)]" : "text-slate-500",
            )}
          >
            {sub}
          </p>
        </div>

        <div
          className={cx(
            "grid h-9 w-9 place-items-center rounded-lg ring-1",
            iconBg,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_ANALYTICS: BlogAnalyticsOverviewResponse = {
  totalPosts: {
    value: 0,
    label: "All time records",
  },
  published: {
    value: 0,
    addedThisWeek: 0,
    label: "+0 this week",
  },
  drafts: {
    value: 0,
    label: "Pending review",
  },
  totalViews: {
    value: 0,
    displayValue: "0",
    growthRatePercent: 0,
    label: "No growth data",
  },
};

function buildPublishedSubText(
  metric: BlogAnalyticsOverviewResponse["published"],
): string {
  if (typeof metric.addedThisWeek === "number") {
    if (metric.addedThisWeek > 0) {
      return `+${metric.addedThisWeek} this week`;
    }

    if (metric.addedThisWeek < 0) {
      return `${metric.addedThisWeek} this week`;
    }

    return "0 this week";
  }

  return metric.label || "—";
}

function buildViewsSubText(
  metric: BlogAnalyticsOverviewResponse["totalViews"],
): string {
  if (typeof metric.growthRatePercent === "number") {
    if (metric.growthRatePercent > 0) {
      return `+${metric.growthRatePercent}% vs last month`;
    }

    if (metric.growthRatePercent < 0) {
      return `${metric.growthRatePercent}% vs last month`;
    }

    return "0% vs last month";
  }

  return metric.label || "—";
}

export default function BlogsAnalyticsOverview() {
  const [analytics, setAnalytics] =
    useState<BlogAnalyticsOverviewResponse>(DEFAULT_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);

        const response = await getBlogAnalyticsOverview();

        if (ignore) return;
        setAnalytics(response);
      } catch (error) {
        if (ignore) return;
        console.error("Failed to load blog analytics overview:", error);
        setAnalytics(DEFAULT_ANALYTICS);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3
          size={18}
          className="text-[var(--primary)]"
          strokeWidth={2.2}
        />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Analytics Overview
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Posts"
          value={isLoading ? "..." : String(analytics.totalPosts.value ?? 0)}
          sub={analytics.totalPosts.label || "All time records"}
          icon={<FileText size={16} className="text-emerald-600" />}
          iconBg="bg-emerald-50 ring-emerald-100"
        />

        <StatCard
          label="Published"
          value={isLoading ? "..." : String(analytics.published.value ?? 0)}
          sub={buildPublishedSubText(analytics.published)}
          icon={<CheckCircle2 size={16} className="text-sky-600" />}
          iconBg="bg-sky-50 ring-sky-100"
        />

        <StatCard
          label="Drafts"
          value={isLoading ? "..." : String(analytics.drafts.value ?? 0)}
          sub={analytics.drafts.label || "Pending review"}
          icon={<Pencil size={16} className="text-slate-600" />}
          iconBg="bg-slate-100 ring-slate-200"
        />

        <StatCard
          label="Total Views"
          value={
            isLoading
              ? "..."
              : analytics.totalViews.displayValue ||
                String(analytics.totalViews.value ?? 0)
          }
          sub={buildViewsSubText(analytics.totalViews)}
          icon={<Eye size={16} className="text-[var(--primary)]" />}
          iconBg="bg-[var(--primary-50)] ring-cyan-100"
        />
      </div>
    </div>
  );
}
