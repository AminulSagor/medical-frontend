"use client";

import { useEffect, useMemo, useState } from "react";
import SubscribersMetrics from "./subscribers/subscribers-metrics";
import type {
  SubscriberRow,
  SubscribersSummary,
  SubscriberSource,
  SubscriberStatus,
} from "../types/subscribers-type";
import SubscribersToolbar from "./subscribers/subscribers-toolbar";
import SubscribersTable from "./subscribers/subscribers-table";
import SubscribersPagination from "./subscribers/subscribers-pagination";
import SubscribersSelectionDock from "./subscribers/subscribers-selection-dock";
import SubscribersTopSourceCard from "./subscribers/subscribers-top-source-card";
import SubscribersFilterDialog from "./subscribers/subscribers-filter-dialog";
import { getSubscriberMetrics } from "@/service/admin/newsletter/subscribes/subscriber-metrics.service";
import { getAdminSubscriberList } from "@/service/admin/newsletter/subscribes/subscriber-list.service";
import { updateSubscriber } from "@/service/admin/newsletter/subscribes/update-subscriber.service";
import type { SubscriberMetricsResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-metrics.types";
import type {
  AdminSubscriberListItem,
  AdminSubscriberListResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-list.types";
import type { SubscriberFiltersState } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-filter-options.types";

const PAGE_SIZE = 20;

function formatJoinedDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapApiSourceToUiSource(source: string): SubscriberSource {
  if (
    source === "FOOTER" ||
    source === "POPUP" ||
    source === "WEBINAR" ||
    source === "CHECKOUT"
  ) {
    return source;
  }

  return "FOOTER";
}

function mapApiStatusToUiStatus(status: string): SubscriberStatus {
  if (
    status === "ACTIVE" ||
    status === "INACTIVE" ||
    status === "BOUNCED" ||
    status === "UNSUBSCRIBED" ||
    status === "SUPPRESSED"
  ) {
    return status;
  }

  return "INACTIVE";
}

function mapSubscriberItemToRow(item: AdminSubscriberListItem): SubscriberRow {
  return {
    id: item.id,
    name: item.subscriberIdentity.fullName,
    email: item.subscriberIdentity.email,
    clinicalRole: item.clinicalRole ?? undefined,
    source: mapApiSourceToUiSource(item.source),
    received: item.received,
    opened: item.opened,
    engagementRate: item.engagementRatePercent,
    joinedDateLabel: formatJoinedDate(item.joinedDate),
    status: mapApiStatusToUiStatus(item.status),
    avatarInitials:
      item.subscriberIdentity.avatarInitials ??
      item.subscriberIdentity.fullName.slice(0, 2).toUpperCase(),
    avatarUrl: item.subscriberIdentity.image ?? undefined,
  };
}

function mapMetricsToSummary(
  metrics: SubscriberMetricsResponse,
  totalSubscribers: number,
): SubscribersSummary {
  return {
    netGrowth: metrics.netGrowth.totalActive,
    netGrowthLabel: "ACTIVE",
    netGrowthDeltaLabel: `${metrics.netGrowth.growthRatePercent}% growth rate`,
    avgEngagement: metrics.avgEngagement.percent,
    avgEngagementLeftLabel: "OPEN RATE",
    avgEngagementRightLabel: "Active Audience",
    listHealthUnsubscribes: metrics.listHealth.unsubscribedCount,
    listHealthSubLabelLeft: "UNSUBSCRIBES",
    listHealthDeltaLabel: `${metrics.listHealth.unsubscribeRatePercent}% unsubscribe rate`,
    topSource: metrics.topSources.map((item) => ({
      source: mapApiSourceToUiSource(item.source),
      percent: item.ratePercent,
    })),
    totalSubscribers,
  };
}

function getActiveFilterCount(filters: SubscriberFiltersState): number {
  return Object.values(filters).filter(
    (value) => value !== undefined && value !== "",
  ).length;
}

export default function GeneralNewsLetterSubscribeSection() {
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SubscriberFiltersState>({});

  const [summary, setSummary] = useState<SubscribersSummary>({
    netGrowth: 0,
    netGrowthLabel: "ACTIVE",
    netGrowthDeltaLabel: "0% growth rate",
    avgEngagement: 0,
    avgEngagementLeftLabel: "OPEN RATE",
    avgEngagementRightLabel: "Active Audience",
    listHealthUnsubscribes: 0,
    listHealthSubLabelLeft: "UNSUBSCRIBES",
    listHealthDeltaLabel: "0% unsubscribe rate",
    topSource: [],
    totalSubscribers: 0,
  });

  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isUpdatingSubscriber, setIsUpdatingSubscriber] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(q.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const metrics = await getSubscriberMetrics();

        setSummary((prev) => ({
          ...mapMetricsToSummary(metrics, prev.totalSubscribers),
        }));
      } catch (error) {
        console.error("Failed to load subscriber metrics:", error);
      }
    };

    void loadMetrics();
  }, []);

  const reloadSubscribers = async () => {
    try {
      setIsListLoading(true);

      const response: AdminSubscriberListResponse = await getAdminSubscriberList(
        {
          page,
          limit: PAGE_SIZE,
          search: searchTerm || undefined,
          role: filters.role,
          minOpenRatePercent: filters.minOpenRatePercent,
          sortBy: "engagementRate",
          sortOrder: "DESC",
        },
      );

      const filteredItems = response.items.filter((item) => {
        const matchesStatus = filters.status
          ? item.status === filters.status
          : true;
        const matchesSource = filters.source
          ? item.source === filters.source
          : true;

        return matchesStatus && matchesSource;
      });

      const mappedRows = filteredItems.map(mapSubscriberItemToRow);

      setRows(mappedRows);
      setTotal(
        filters.status || filters.source
          ? filteredItems.length
          : response.meta.total,
      );
      setSelected({});

      setSummary((prev) => ({
        ...prev,
        totalSubscribers:
          filters.status || filters.source
            ? filteredItems.length
            : response.meta.total,
      }));
    } catch (error) {
      console.error("Failed to load subscribers:", error);
      setRows([]);
      setTotal(0);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    void reloadSubscribers();
  }, [page, searchTerm, filters]);

  const selectedCount = useMemo(() => {
    return Object.values(selected).filter(Boolean).length;
  }, [selected]);

  const activeFilterCount = useMemo(() => {
    return getActiveFilterCount(filters);
  }, [filters]);

  const toggleOne = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllOnPage = (ids: string[], next: boolean) => {
    setSelected((prev) => {
      const copy = { ...prev };
      ids.forEach((id) => {
        copy[id] = next;
      });
      return copy;
    });
  };

  const clearSelection = () => setSelected({});

  const handleUnsubscribeOne = async (subscriberId: string) => {
    try {
      setIsUpdatingSubscriber(true);

      await updateSubscriber(subscriberId, {
        status: "UNSUBSCRIBED",
        unsubscribeReason: "Requested removal via customer support",
      });

      await reloadSubscribers();
    } catch (error) {
      console.error("Failed to update subscriber:", error);
    } finally {
      setIsUpdatingSubscriber(false);
    }
  };

  const handleUnsubscribeSelected = async () => {
    const selectedIds = Object.entries(selected)
      .filter(([, isChecked]) => isChecked)
      .map(([id]) => id);

    if (!selectedIds.length) return;

    try {
      setIsUpdatingSubscriber(true);

      await Promise.all(
        selectedIds.map((subscriberId) =>
          updateSubscriber(subscriberId, {
            status: "UNSUBSCRIBED",
            unsubscribeReason: "Requested removal via customer support",
          }),
        ),
      );

      setSelected({});
      await reloadSubscribers();
    } catch (error) {
      console.error("Failed to update selected subscribers:", error);
    } finally {
      setIsUpdatingSubscriber(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
        <SubscribersMetrics summary={summary} />
        <SubscribersTopSourceCard summary={summary} />
      </div>

      <SubscribersToolbar
        value={q}
        onChange={setQ}
        isLoading={isListLoading}
        onOpenFilters={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        totalLabel={
          isListLoading && !rows.length
            ? "Loading subscribers..."
            : `Search ${summary.totalSubscribers.toLocaleString()} subscribers by name, email, or role...`
        }
      />

      {isListLoading && !rows.length ? (
        <div className="rounded-2xl bg-white p-6 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200/60">
          Loading subscribers...
        </div>
      ) : (
        <SubscribersTable
          rows={rows}
          selected={selected}
          onToggleOne={toggleOne}
          onToggleAllOnPage={toggleAllOnPage}
          onUpdateStatus={handleUnsubscribeOne}
          isUpdating={isUpdatingSubscriber}
        />
      )}

      <SubscribersPagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onChange={setPage}
      />

      <SubscribersSelectionDock
        open={selectedCount > 0}
        selectedCount={selectedCount}
        onExport={() => console.log("export selected")}
        onDelete={handleUnsubscribeSelected}
        onClear={clearSelection}
        isDeleting={isUpdatingSubscriber}
      />

      <SubscribersFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        value={filters}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
        }}
      />
    </div>
  );
}