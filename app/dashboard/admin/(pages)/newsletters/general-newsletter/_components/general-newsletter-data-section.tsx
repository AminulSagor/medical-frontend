"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  getToolbarSortLabel,
  getToolbarTitle,
  getWorkspaceCountLabel,
  getWorkspaceParentBadgeLabel,
  hasActiveClientFilters,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_utils/general-broadcast-workspace.utils";
import { generalBroadcastWorkspaceService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.service";
import { GeneralBroadcastWorkspaceListResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

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

  useEffect(() => {
    setPage(1);
  }, [parentTab, cadenceTab]);

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

  const filteredItems = useMemo(() => {
    if (!workspace) return [];

    return filterWorkspaceItems({
      items: workspace.items,
      parentTab,
      searchQuery,
      filters,
    });
  }, [filters, parentTab, searchQuery, workspace]);

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

  const toolbarSortLabel = useMemo(() => {
    return getToolbarSortLabel(parentTab);
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

                <GeneralDataToolbar
                  title={toolbarTitle}
                  countLabel={toolbarCountLabel}
                  searchPlaceholder={toolbarSearchPlaceholder}
                  sortBy={toolbarSortLabel}
                  actionLabel="Filter"
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={workspace?.filterOptions}
                  onApplyFilters={setFilters}
                />

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
                  />
                )}
              </>
            )}

            {parentTab === "drafts" && (
              <>
                <GeneralDataToolbar
                  title={toolbarTitle}
                  countLabel={toolbarCountLabel}
                  searchPlaceholder={toolbarSearchPlaceholder}
                  sortBy={toolbarSortLabel}
                  actionLabel="Filter"
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={workspace?.filterOptions}
                  onApplyFilters={setFilters}
                />

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
                  sortBy={toolbarSortLabel}
                  actionLabel="Advanced Filters"
                  dateRangeLabel={dateRangeLabel}
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  filters={filters}
                  filterOptions={workspace?.filterOptions}
                  onApplyFilters={setFilters}
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
