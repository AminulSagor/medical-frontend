"use client";

import { useMemo, useState } from "react";
import SubscribersMetrics from "./subscribers/subscribers-metrics";
import { SubscribersSummary } from "../types/subscribers-type";
import { MOCK_SUBSCRIBERS, MOCK_SUBSCRIBERS_SUMMARY } from "../data/subscribers-mock-data";
import SubscribersToolbar from "./subscribers/subscribers-toolbar";
import SubscribersTable from "./subscribers/subscribers-table";
import SubscribersPagination from "./subscribers/subscribers-pagination";
import SubscribersSelectionDock from "./subscribers/subscribers-selection-dock";
import SubscribersTopSourceCard from "./subscribers/subscribers-top-source-card";

export default function GeneralNewsLetterSubscribeSection() {
  const summary: SubscribersSummary = MOCK_SUBSCRIBERS_SUMMARY;

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  const pageSize = 18;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return MOCK_SUBSCRIBERS;

    return MOCK_SUBSCRIBERS.filter((r) => {
      const hay = [
        r.name,
        r.email,
        r.clinicalRole ?? "",
        r.source,
        r.status,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  const total = filtered.length;

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const selectedCount = useMemo(() => {
    return Object.values(selected).filter(Boolean).length;
  }, [selected]);

  const toggleOne = (id: string) => {
    setSelected((p) => ({ ...p, [id]: !p[id] }));
  };

  const toggleAllOnPage = (ids: string[], next: boolean) => {
    setSelected((p) => {
      const copy = { ...p };
      ids.forEach((id) => (copy[id] = next));
      return copy;
    });
  };

  const clearSelection = () => setSelected({});

  // keep page valid when filtering
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  if (page > maxPage) setPage(maxPage);

  return (
    <div className="space-y-5">
      {/* Top metrics row + Top Source card */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
        <SubscribersMetrics summary={summary} />
        <SubscribersTopSourceCard summary={summary} />
      </div>

      {/* Search + actions */}
      <SubscribersToolbar
        value={q}
        onChange={setQ}
        totalLabel={`Search ${summary.totalSubscribers.toLocaleString()} subscribers by name, email, or role...`}
      />

      {/* Table */}
      <SubscribersTable
        rows={pageRows}
        selected={selected}
        onToggleOne={toggleOne}
        onToggleAllOnPage={toggleAllOnPage}
      />

      {/* Footer row (left label + right pagination) */}
      <SubscribersPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      />

      {/* Selection dock */}
      <SubscribersSelectionDock
        open={selectedCount > 0}
        selectedCount={selectedCount}
        onExport={() => console.log("export selected")}
        onDelete={() => console.log("delete selected")}
        onClear={clearSelection}
      />
    </div>
  );
}