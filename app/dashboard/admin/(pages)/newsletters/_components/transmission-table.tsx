"use client";

import { Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { getRecentGeneralTransmissions } from "@/service/admin/newsletter/dashboard/recent-transmissions.service";
import type {
  RecentGeneralTransmissionItem,
  RecentGeneralTransmissionsResponse,
} from "@/types/admin/newsletter/dashboard/recent-transmissions.types";

type StatusFilter = "ALL" | "SENT" | "CANCELLED" | "DRAFT" | "SCHEDULED";

function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-[120px] rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-[var(--primary)]"
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-700">{v}%</span>
    </div>
  );
}

function getStatusDotClass(status: string) {
  switch (status.toUpperCase()) {
    case "SENT":
      return "bg-emerald-500";
    case "CANCELLED":
      return "bg-red-500";
    case "SCHEDULED":
      return "bg-amber-500";
    case "DRAFT":
      return "bg-slate-400";
    default:
      return "bg-slate-400";
  }
}

function getTypeLabel(contentType: string) {
  switch (contentType) {
    case "CUSTOM_MESSAGE":
      return "Custom Message";
    case "ARTICLE_LINK":
      return "Article Link";
    default:
      return contentType
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
  }
}

function formatSentDate(sentAt: string | null) {
  if (!sentAt) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(sentAt));
}

export default function TransmissionTable() {
  const [data, setData] = useState<RecentGeneralTransmissionsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRecentTransmissions = async () => {
      try {
        setIsLoading(true);

        const response = await getRecentGeneralTransmissions({
          page: 1,
          limit: 5,
        });

        if (!isMounted) return;
        setData(response);
      } catch (error) {
        console.error("Failed to load recent transmissions", error);

        if (!isMounted) return;
        setData(null);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadRecentTransmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRows = useMemo(() => {
    const items = data?.items ?? [];

    if (statusFilter === "ALL") {
      return items.slice(0, 5);
    }

    return items
      .filter((item) => item.status.toUpperCase() === statusFilter)
      .slice(0, 5);
  }, [data?.items, statusFilter]);

  const totalCount = data?.meta.total ?? 0;
  const showingCount = filteredRows.length;

  const filterOptions: Array<{ label: string; value: StatusFilter }> = [
    { label: "All Status", value: "ALL" },
    { label: "Sent", value: "SENT" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Scheduled", value: "SCHEDULED" },
  ];

  return (
    <div className="mt-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--primary-50)] text-[var(--primary)]">
            <span className="text-xs">↻</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            Recent Transmission History
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 outline-none ring-0"
          >
            <option value="ALL">All Status</option>
            <option value="SENT">Sent</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
          </select> */}

          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <Filter size={14} /> Filter
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Filter by status
                </p>

                <div className="mt-1 flex flex-col gap-1">
                  {filterOptions.map((option) => {
                    const isActive = statusFilter === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium transition ${
                          isActive
                            ? "bg-[var(--primary-50)] text-[var(--primary)]"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isActive ? <span>✓</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3">Status / Type</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Audience</th>
              <th className="px-5 py-3">Open Rate</th>
              <th className="px-5 py-3">Sent Date</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="px-5 py-4">
                    <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-100" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="ml-auto h-4 w-20 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row: RecentGeneralTransmissionItem) => (
                <tr key={row.id} className="border-t border-slate-100 bg-white">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDotClass(row.status)}`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {row.status}
                        </p>
                        <span className="mt-1 inline-flex rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                          {getTypeLabel(row.contentType)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-[420px] truncate text-xs font-semibold text-slate-900">
                      {row.subjectLine}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-slate-600">
                      {row.audienceLabel}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Progress value={row.openRatePercent} />
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-slate-600">
                      {formatSentDate(row.sentAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/admin/newsletters/transmission-history/${row.id}`}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline"
                    >
                      View Report
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-100">
                <td colSpan={6} className="px-5 py-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No transmissions found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Try changing the filter to see other transmission records.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {showingCount} of {totalCount} results
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/dashboard/admin/newsletters/transmission-history"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--primary)] bg-white px-5 py-2 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary-50)]"
        >
          View All Transmission History <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}
