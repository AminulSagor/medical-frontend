"use client";

import { FileText } from "lucide-react";
import React from "react";
import type {
  BlogManagementRow,
  BlogManagementSortKey,
  BlogManagementTabCounts,
  BlogManagementTabKey,
} from "@/types/admin/blogs/blog.types";
import BlogsManagementTabs from "./blogs-management-tabs";
import BlogsManagementToolbar from "./blogs-management-toolbar";
import BlogsManagementTable from "./blogs-management-table";

type BlogsManagementListProps = {
  tab: BlogManagementTabKey;
  setTab: (tab: BlogManagementTabKey) => void;
  q: string;
  setQ: (value: string) => void;
  sort: BlogManagementSortKey;
  setSort: (sort: BlogManagementSortKey) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filteredCount: number;
  pageSize: number;
  rows: BlogManagementRow[];
  tabCounts: BlogManagementTabCounts;
  onViewPublicationCalendar: () => void;
};

export default function BlogsManagementList({
  tab,
  setTab,
  q,
  setQ,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  filteredCount,
  pageSize,
  rows,
  tabCounts,
  onViewPublicationCalendar,
}: BlogsManagementListProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          <FileText size={14} />
          Article Management List
        </p>
      </div>

      <BlogsManagementTabs
        tab={tab}
        setTab={setTab}
        tabCounts={tabCounts}
        onViewPublicationCalendar={onViewPublicationCalendar}
      />

      <BlogsManagementToolbar
        tab={tab}
        setTab={setTab}
        q={q}
        setQ={setQ}
        setPage={setPage}
        sort={sort}
        setSort={setSort}
      />

      <BlogsManagementTable
        rows={rows}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        filteredCount={filteredCount}
        pageSize={pageSize}
      />
    </div>
  );
}
