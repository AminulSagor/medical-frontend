"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, GraduationCap, Megaphone } from "lucide-react";

function BigActionCard({
  badge,
  icon,
  title,
  desc,
  statValue,
  statLabel,
  buttonLabel,
  href,
  variant = "primary",
}: {
  badge: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  statValue: string;
  statLabel: string;
  buttonLabel: string;
  href: string;
  variant?: "primary" | "dark";
}) {
  const router = useRouter();

  const btnClass =
    variant === "primary"
      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
      : "bg-slate-800 text-white hover:bg-slate-900";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-slate-200/40">
          {icon}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {badge}
        </span>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <p className="text-3xl font-semibold text-slate-900">{statValue}</p>
        <p className="pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {statLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push(href)}
        className={[
          "mt-5 inline-flex w-full items-center justify-center gap-2 border",
          "h-11 rounded-xl px-4 text-sm font-semibold",
          "transition active:scale-[0.99]",
          btnClass,
        ].join(" ")}
      >
        {buttonLabel}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function NewsletterActions() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <BigActionCard
        badge="Ready to send"
        icon={<Megaphone size={18} />}
        title="General Newsletter"
        desc="Create and manage blasts for the wider airway institute community."
        statValue="2,450"
        statLabel="Subscribers"
        buttonLabel="Manage Newsletter"
        href="/dashboard/admin/newsletters/general-newsletter"
        variant="primary"
      />

      <BigActionCard
        badge="Active cohorts"
        icon={<GraduationCap size={18} />}
        title="Course Announcements"
        desc="Target specific trainee groups for schedule updates and materials."
        statValue="12"
        statLabel="Cohorts"
        buttonLabel="Manage Course Announcement"
        href="/dashboard/admin/newsletters/course-announcements"
        variant="dark"
      />
    </div>
  );
}
