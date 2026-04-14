"use client";

import { CalendarDays } from "lucide-react";
import React from "react";
import type {
  BlogManagementTabCounts,
  BlogManagementTabKey,
} from "@/types/admin/blogs/blog.types";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-md px-3 py-2 text-xs font-semibold transition",
        active
          ? "bg-[var(--primary-50)] text-[var(--primary-hover)] ring-1 ring-cyan-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  );
}

type BlogsManagementTabsProps = {
  tab: BlogManagementTabKey;
  setTab: (tab: BlogManagementTabKey) => void;
  tabCounts: BlogManagementTabCounts;
  onViewPublicationCalendar: () => void;
};

export default function BlogsManagementTabs({
  tab,
  setTab,
  tabCounts,
  onViewPublicationCalendar,
}: BlogsManagementTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-5 py-3">
      <TabButton active={tab === "all"} onClick={() => setTab("all")}>
        All Posts ({tabCounts.all})
      </TabButton>

      <TabButton
        active={tab === "published"}
        onClick={() => setTab("published")}
      >
        Published ({tabCounts.published})
      </TabButton>

      <TabButton active={tab === "drafts"} onClick={() => setTab("drafts")}>
        Drafts ({tabCounts.drafts})
      </TabButton>

      <TabButton
        active={tab === "scheduled"}
        onClick={() => setTab("scheduled")}
      >
        Scheduled ({tabCounts.scheduled})
      </TabButton>

      <div className="ml-auto">
        {/* <button
          type="button"
          onClick={onViewPublicationCalendar}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-100 bg-[var(--primary-50)] px-3 py-2 text-xs font-semibold text-[var(--primary-hover)] transition hover:bg-white"
        >
          <CalendarDays size={16} />
          View Publication Calendar
        </button> */}
      </div>
    </div>
  );
}
