"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCheck,
  Filter,
  Search,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

import FilterNotificationsModal, {
  type FilterValues,
} from "./_components/filter-notifications-modal";
import { getNotifications } from "@/service/admin/notifications.service";
import type {
  GetNotificationsResponse,
  NotificationItem,
  NotificationTabKey,
} from "@/types/admin/notifications.types";

const PAGE_LIMIT = 10;

function TypeDot({ type }: { type?: string }) {
  const normalizedType = type?.toLowerCase() ?? "";

  const cls = normalizedType.includes("refund")
    ? "bg-rose-500"
    : normalizedType.includes("system")
      ? "bg-slate-400"
      : normalizedType.includes("critical")
        ? "bg-amber-500"
        : "bg-sky-500";

  return <span className={`mt-1 h-2.5 w-2.5 rounded-full ${cls}`} />;
}

function buildRequestParams(tab: NotificationTabKey, page: number) {
  if (tab === "all") {
    return {
      page,
      limit: PAGE_LIMIT,
      status: "",
    };
  }

  if (tab === "unread") {
    return {
      page,
      limit: PAGE_LIMIT,
      status: "Unread Only",
      category: "refund_request",
    };
  }

  return null;
}

function getNotificationTime(notification: NotificationItem) {
  return notification.time ?? notification.createdAt ?? "";
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<NotificationTabKey>("all");
  const [q, setQ] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [data, setData] = useState<GetNotificationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    const params = buildRequestParams(tab, page);

    if (!params) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getNotifications(params);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [page, tab]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = useMemo(() => {
    const notifications = data?.notifications ?? [];
    const keyword = q.trim().toLowerCase();

    if (!keyword) {
      return notifications;
    }

    return notifications.filter((item) => {
      const haystack = `${item.title} ${item.message}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [data?.notifications, q]);

  const tabs = data?.tabs ?? [
    { key: "all", label: "All Alerts", count: 0, isActive: tab === "all" },
    { key: "unread", label: "Unread", count: 0, isActive: tab === "unread" },
    {
      key: "critical",
      label: "Critical",
      count: 0,
      isActive: tab === "critical",
    },
  ];

  const pagination = data?.pagination;
  const summary = data?.summary;

  const handleOpenPreferences = () => {
    router.push("/dashboard/admin/notifications/preferences");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {data?.title ?? "All Notifications"}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {data?.subtitle ??
              "Manage and review all system alerts and clinical updates."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!data?.canMarkAllRead}
            className="flex items-center  gap-4 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={15} /> Mark All as Read
          </button>

          {/* <button
            type="button"
            onClick={handleOpenPreferences}
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button> */}
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Total Notifications
          </p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold text-slate-900">
              {summary?.totalNotifications.count ?? 0}
            </p>
            <span className="mb-1 text-[11px] text-slate-400">
              {summary?.totalNotifications.label ?? ""}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Unread Alerts
          </p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold text-rose-500">
              {summary?.unreadAlerts.count ?? 0}
            </p>
            <span className="mb-1 flex items-center gap-1 text-[11px] text-rose-500">
              <AlertTriangle size={10} />
              {summary?.unreadAlerts.label ?? ""}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Refund Requests
          </p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold text-slate-900">
              {summary?.refundRequests.count ?? 0}
            </p>
            <span className="mb-1 inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[11px] text-amber-700">
              {summary?.refundRequests.label ?? ""}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            System Updates
          </p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold text-slate-900">
              {summary?.systemUpdates.count ?? 0}
            </p>
            <span className="mb-1 text-[11px] text-slate-400">
              {summary?.systemUpdates.label ?? ""}
            </span>
          </div>
        </div>
      </div> */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-8 border-b border-slate-200">
          {tabs.map((item) => {
            const active = tab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setPage(1);
                  setTab(item.key);
                }}
                className={[
                  "relative py-3 text-sm font-semibold transition",
                  active
                    ? "text-cyan-500"
                    : "text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  {item.label}
                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
                  )}
                </span>

                {active && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-cyan-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-600 md:flex">
            <Search size={16} className="text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-[240px] bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search specific alerts..."
            />
          </div>

          <button
            type="button"
            onClick={() => setOpenFilter(true)}
            className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              No notifications found.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                <TypeDot type={item.type} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="shrink-0 text-xs text-slate-400">
                      {getNotificationTime(item)}
                    </p>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing {pagination?.from ?? 0} to {pagination?.to ?? 0} of{" "}
            {pagination?.total ?? 0} alerts
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (pagination?.hasPrev) {
                  setPage((prev) => prev - 1);
                }
              }}
              disabled={!pagination?.hasPrev}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹
            </button>

            <button className="grid h-8 min-w-8 place-items-center rounded-md bg-sky-50 px-2 text-sky-700 ring-1 ring-sky-100">
              {pagination?.page ?? 1}
            </button>

            <button
              type="button"
              onClick={() => {
                if (pagination?.hasNext) {
                  setPage((prev) => prev + 1);
                }
              }}
              disabled={!pagination?.hasNext}
              className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <FilterNotificationsModal
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApply={(value) => {
          setFilters(value);
          setOpenFilter(false);
        }}
      />
    </div>
  );
}
