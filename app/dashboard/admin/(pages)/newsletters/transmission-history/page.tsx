"use client";

import { useCallback, useEffect, useState } from "react";

import TransmissionDetailsTable from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-details-table";
import TransmissionHistoryHeader from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-history-header";
import TransmissionMetrics from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-metrics";
import TransmissionToolbar from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-toolbar";
import { getTransmissionHistory } from "@/service/admin/newsletter/dashboard/transmission-history.service";
import type {
  TransmissionHistoryResponse,
  TransmissionHistorySortOrder,
} from "@/types/admin/newsletter/dashboard/transmission-history.types";
import { archiveTransmissions } from "@/service/admin/newsletter/dashboard/archive-transmissions.service";

const PAGE_SIZE = 6;

export default function TransmissionHistoryPage() {
  const [data, setData] = useState<TransmissionHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] =
    useState<TransmissionHistorySortOrder>("DESC");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsArchiving(true);

      await archiveTransmissions({
        broadcastIds: selectedIds,
      });

      setSelectedIds([]);
      await loadTransmissionHistory();
    } catch (error) {
      console.error("Failed to archive transmissions", error);
    } finally {
      setIsArchiving(false);
    }
  };

  const loadTransmissionHistory = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getTransmissionHistory({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        sortOrder,
      });

      setData(response);
    } catch (error) {
      console.error("Failed to load transmission history", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortOrder]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    loadTransmissionHistory();
  }, [loadTransmissionHistory]);

  return (
    <div>
      <TransmissionHistoryHeader
        title="Transmission History"
        subtitle="A complete record of all outbound marketing and operational communications"
        selectedCount={selectedIds.length}
        isArchiving={isArchiving}
        onArchive={handleArchive}
      />

      <div className="mt-5 space-y-5">
        <TransmissionMetrics
          cards={data?.cards ?? null}
          isLoading={isLoading}
        />

        <TransmissionToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          sortOrder={sortOrder}
          onSortOrderChange={(value) => {
            setPage(1);
            setSortOrder(value);
          }}
        />

        <TransmissionDetailsTable
          items={data?.items ?? []}
          meta={data?.meta ?? null}
          isLoading={isLoading}
          page={page}
          onPageChange={setPage}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
      </div>
    </div>
  );
}
