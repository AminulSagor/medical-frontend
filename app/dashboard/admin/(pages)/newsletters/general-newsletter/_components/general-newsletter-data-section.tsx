"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import GeneralDataChildTabs from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-child-tabs";
import GeneralDataParentTabs from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-parent-tabs";
import GeneralDataToolbar from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-toolbar";
import GeneralDraftsTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-drafts-table";
import GeneralHistoryTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-history-table";
import GeneralQueueTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-queue-table";
import GeneralStatOverview from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-stats-overview";
import {
  BroadcastCadenceTabKey,
  GeneralDataParentTabKey,
  WorkspaceFilterState,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import {
  buildPaginationState,
  buildWorkspaceListParams,
  DEFAULT_WORKSPACE_FILTERS,
  filterWorkspaceItems,
  getToolbarSearchPlaceholder,
  getToolbarTitle,
  getWorkspaceCountLabel,
  getWorkspaceParentBadgeLabel,
  hasActiveClientFilters,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_utils/general-broadcast-workspace.utils";
import { generalBroadcastWorkspaceService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.service";
import type {
  GeneralBroadcastWorkspaceFilterOptions,
  GeneralBroadcastWorkspaceItem,
  GeneralBroadcastWorkspaceListResponse,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

export type ToolbarSortValue =
  | "last_modified"
  | "draft"
  | "published"
  | "scheduled";

function getItemStatusValue(item: GeneralBroadcastWorkspaceItem): string {
  return item.status.code.toLowerCase();
}

function getItemLastModifiedTime(item: GeneralBroadcastWorkspaceItem): number {
  if (!item.lastModified) return 0;

  const timestamp = new Date(item.lastModified).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function sortWorkspaceItems(
  items: GeneralBroadcastWorkspaceItem[],
  sortValue: ToolbarSortValue,
): GeneralBroadcastWorkspaceItem[] {
  const nextItems = [...items];

  if (sortValue === "last_modified") {
    return nextItems.sort(
      (a, b) => getItemLastModifiedTime(b) - getItemLastModifiedTime(a),
    );
  }

  const targetStatusMap: Record<
    Exclude<ToolbarSortValue, "last_modified">,
    string
  > = {
    draft: "draft",
    published: "published",
    scheduled: "scheduled",
  };

  const targetStatus = targetStatusMap[sortValue];

  return nextItems.sort((a, b) => {
    const aMatched = getItemStatusValue(a) === targetStatus;
    const bMatched = getItemStatusValue(b) === targetStatus;

    if (aMatched && !bMatched) return -1;
    if (!aMatched && bMatched) return 1;

    return getItemLastModifiedTime(b) - getItemLastModifiedTime(a);
  });
}

function getResolvedFilterOptions(
  workspace: GeneralBroadcastWorkspaceListResponse | null,
): GeneralBroadcastWorkspaceFilterOptions | undefined {
  if (!workspace) return undefined;

  const backendOptions = workspace.filterOptions;

  const derivedContentTypes = Array.from(
    new Set(
      workspace.items
        .map((item) => item.type?.displayLabel?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );

  return {
    contentTypes:
      backendOptions?.contentTypes && backendOptions.contentTypes.length > 0
        ? backendOptions.contentTypes
        : derivedContentTypes,
    authors: backendOptions?.authors ?? [],
    audienceSegments: backendOptions?.audienceSegments ?? [],
    quickDateRanges:
      backendOptions?.quickDateRanges &&
      backendOptions.quickDateRanges.length > 0
        ? backendOptions.quickDateRanges
        : ["LAST_7_DAYS", "LAST_30_DAYS", "CUSTOM"],
  };
}

export default function GeneralNewsLetterDataSection() {
  const [parentTab, setParentTab] = useState<GeneralDataParentTabKey>("queue");
  const [cadenceTab, setCadenceTab] =
    useState<BroadcastCadenceTabKey>("weekly");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<WorkspaceFilterState>(
    DEFAULT_WORKSPACE_FILTERS,
  );
  const [workspace, setWorkspace] =
    useState<GeneralBroadcastWorkspaceListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortValue, setSortValue] = useState<ToolbarSortValue>("last_modified");

  useEffect(() => {
    setPage(1);
  }, [parentTab, cadenceTab]);

  const fetchWorkspaceData = useCallback(
    async (currentPage: number) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await generalBroadcastWorkspaceService.getGeneralBroadcastWorkspaceList(
            buildWorkspaceListParams(parentTab, cadenceTab, currentPage),
          );
        setWorkspace(response);
      } catch (error) {
        setWorkspace(null);
        setErrorMessage("Failed to load general broadcast workspace.");
        console.error("Error fetching workspace:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [parentTab, cadenceTab],
  );

  useEffect(() => {
    let active = true;

    const loadWorkspace = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response =
          await generalBroadcastWorkspaceService.getGeneralBroadcastWorkspaceList(
            buildWorkspaceListParams(parentTab, cadenceTab, page),
          );

        if (!active) return;
        setWorkspace(response);
      } catch (error) {
        if (!active) return;
        setWorkspace(null);
        setErrorMessage("Failed to load general broadcast workspace.");
        console.error("Error loading workspace:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadWorkspace();

    return () => {
      active = false;
    };
  }, [parentTab, cadenceTab, page]);

  const handleRefresh = useCallback(async () => {
    await fetchWorkspaceData(page);
  }, [fetchWorkspaceData, page]);

  const resolvedFilterOptions = useMemo(() => {
    return getResolvedFilterOptions(workspace);
  }, [workspace]);

  const filteredItems = useMemo(() => {
    if (!workspace) return [];

    const clientFilteredItems = filterWorkspaceItems({
      items: workspace.items,
      parentTab,
      searchQuery,
      filters,
    });

    return sortWorkspaceItems(clientFilteredItems, sortValue);
  }, [filters, parentTab, searchQuery, sortValue, workspace]);

  const pagination = useMemo(() => {
    return buildPaginationState(
      workspace?.meta ?? {
        page: 1,
        limit: 10,
        total: 0,
      },
    );
  }, [workspace]);

  const parentBadgeLabel = useMemo(() => {
    return getWorkspaceParentBadgeLabel(workspace, parentTab);
  }, [parentTab, workspace]);

  const isFiltered = useMemo(() => {
    return hasActiveClientFilters(searchQuery, filters);
  }, [filters, searchQuery]);

  const toolbarTitle = useMemo(() => {
    return getToolbarTitle(parentTab, cadenceTab);
  }, [cadenceTab, parentTab]);

  const toolbarCountLabel = useMemo(() => {
    return getWorkspaceCountLabel({
      total: workspace?.meta.total ?? 0,
      visible: filteredItems.length,
      isFiltered,
    });
  }, [filteredItems.length, isFiltered, workspace?.meta.total]);

  const toolbarSearchPlaceholder = useMemo(() => {
    return getToolbarSearchPlaceholder(parentTab);
  }, [parentTab]);

  const dateRangeLabel = useMemo(() => {
    if (parentTab !== "history") return undefined;

    if (filters.fromDate && filters.toDate) {
      return `${filters.fromDate} — ${filters.toDate}`;
    }

    if (filters.quickDateRange) {
      return filters.quickDateRange.replaceAll("_", " ");
    }

    return undefined;
  }, [filters.fromDate, filters.quickDateRange, filters.toDate, parentTab]);

  return (
    <div className="space-y-6">
      <GeneralStatOverview />

      <section>
        <div>
          <GeneralDataParentTabs
            value={parentTab}
            onChange={setParentTab}
            rightBadgeLabel={parentBadgeLabel}
          />

          <div className="mt-6 space-y-5">
            {parentTab === "queue" && (
              <>
                <GeneralDataChildTabs
                  value={cadenceTab}
                  onChange={setCadenceTab}
                />

                {/* <GeneralDataToolbar
                  title={toolbarTitle}
                  countLabel={toolbarCountLabel}
                  searchPlaceholder={toolbarSearchPlaceholder}
                  actionLabel="Filter"
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={resolvedFilterOptions}
                  onApplyFilters={setFilters}
                  sortValue={sortValue}
                  onSortChange={setSortValue}
                /> */}

                {isLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm font-medium text-slate-400">
                    Loading queue broadcasts...
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm font-medium text-rose-600">
                    {errorMessage}
                  </div>
                ) : (
                  <GeneralQueueTable
                    items={filteredItems}
                    pagination={pagination}
                    onPageChange={setPage}
                    onRefresh={handleRefresh}
                  />
                )}
              </>
            )}

            {parentTab === "drafts" && (
              <>
                {/* <GeneralDataToolbar
                  title={toolbarTitle}
                  countLabel={toolbarCountLabel}
                  searchPlaceholder={toolbarSearchPlaceholder}
                  actionLabel="Filter"
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={resolvedFilterOptions}
                  onApplyFilters={setFilters}
                  sortValue={sortValue}
                  onSortChange={setSortValue}
                /> */}

                {isLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm font-medium text-slate-400">
                    Loading drafts...
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm font-medium text-rose-600">
                    {errorMessage}
                  </div>
                ) : (
                  <GeneralDraftsTable
                    items={filteredItems}
                    pagination={pagination}
                    onPageChange={setPage}
                    onRefresh={handleRefresh}
                  />
                )}
              </>
            )}

            {parentTab === "history" && (
              <>
                <GeneralDataToolbar
                  title={toolbarTitle}
                  countLabel={toolbarCountLabel}
                  searchPlaceholder={toolbarSearchPlaceholder}
                  actionLabel="Advanced Filters"
                  dateRangeLabel={dateRangeLabel}
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={resolvedFilterOptions}
                  onApplyFilters={setFilters}
                  sortValue={sortValue}
                  onSortChange={setSortValue}
                />

                {isLoading ? (
                  <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm font-medium text-slate-400">
                    Loading transmission history...
                  </div>
                ) : errorMessage ? (
                  <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm font-medium text-rose-600">
                    {errorMessage}
                  </div>
                ) : (
                  <GeneralHistoryTable
                    items={filteredItems}
                    pagination={pagination}
                    onPageChange={setPage}
                    onRefresh={handleRefresh}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
