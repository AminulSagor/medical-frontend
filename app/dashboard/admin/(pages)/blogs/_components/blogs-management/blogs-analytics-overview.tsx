"use client";

import { BarChart3, CheckCircle2, Eye, FileText, Pencil } from "lucide-react";
import React from "react";

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
              isDelta ? "text-[var(--primary)] font-medium" : "text-slate-500"
            )}
          >
            {sub}
          </p>
        </div>

        <div
          className={cx(
            "grid h-9 w-9 place-items-center rounded-lg ring-1",
            iconBg
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function BlogsAnalyticsOverview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-[var(--primary)]" strokeWidth={2.2} />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Analytics Overview
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Posts"
          value="42"
          sub="All time records"
          icon={<FileText size={16} className="text-emerald-600" />}
          iconBg="bg-emerald-50 ring-emerald-100"
        />
        <StatCard
          label="Published"
          value="38"
          sub="+2 this week"
          icon={<CheckCircle2 size={16} className="text-sky-600" />}
          iconBg="bg-sky-50 ring-sky-100"
        />
        <StatCard
          label="Drafts"
          value="4"
          sub="Pending review"
          icon={<Pencil size={16} className="text-slate-600" />}
          iconBg="bg-slate-100 ring-slate-200"
        />
        <StatCard
          label="Total Views"
          value="12.4k"
          sub="+12% vs last month"
          icon={<Eye size={16} className="text-[var(--primary)]" />}
          iconBg="bg-[var(--primary-50)] ring-cyan-100"
        />
      </div>
    </div>
  );
}