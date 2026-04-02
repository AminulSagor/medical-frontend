"use client";

import GeneralDataChildTabs from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-child-tabs";
import GeneralDataParentTabs from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-parent-tabs";
import GeneralDataToolbar from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-toolbar";
import GeneralDraftsTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-drafts-table";
import GeneralHistoryTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-history-table";
import GeneralQueueTable from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-queue-table";
import GeneralStatOverview from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-stats-overview";
import {
  draftBroadcasts,
  draftsPagination,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/data/general-broadcast-drafts.data";
import {
  historyBroadcasts,
  historyPagination,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/data/general-broadcast-history.data";
import {
  monthlyQueueBroadcasts,
  queuePagination,
  weeklyQueueBroadcasts,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/data/general-broadcast-queue.data";
import {
  BroadcastCadenceTabKey,
  GeneralDataParentTabKey,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import React, { useMemo, useState } from "react";

export default function GeneralNewsLetterDataSection() {
  const [parentTab, setParentTab] = useState<GeneralDataParentTabKey>("queue");
  const [cadenceTab, setCadenceTab] =
    useState<BroadcastCadenceTabKey>("weekly");

  const queueRows = useMemo(() => {
    return cadenceTab === "weekly"
      ? weeklyQueueBroadcasts
      : monthlyQueueBroadcasts;
  }, [cadenceTab]);

  const parentBadgeLabel = useMemo(() => {
    if (parentTab === "queue") return "Active Broadcasting View";
    if (parentTab === "drafts") return "Draft Workspace";
    return "Archive Management";
  }, [parentTab]);

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
                  title={`Current ${
                    cadenceTab === "weekly" ? "Weekly" : "Monthly"
                  } Broadcast Queue`}
                  countLabel={`(${queueRows.length} Items)`}
                  searchPlaceholder="Search by title, author, or keyword..."
                  sortBy="Schedule Date"
                  actionLabel="Filter"
                />

                <GeneralQueueTable
                  rows={queueRows}
                  pagination={queuePagination}
                />
              </>
            )}

            {parentTab === "drafts" && (
              <>
                <GeneralDataToolbar
                  title="Newsletter Drafts"
                  countLabel={`(${draftBroadcasts.length} Items)`}
                  searchPlaceholder="Search drafts by title, type, or author..."
                  sortBy="Last Modified"
                  actionLabel="Filter"
                />

                <GeneralDraftsTable
                  rows={draftBroadcasts}
                  pagination={draftsPagination}
                />
              </>
            )}

            {parentTab === "history" && (
              <>
                <GeneralDataToolbar
                  title="Transmission History"
                  searchPlaceholder="Search past transmissions..."
                  sortBy="Sent Date (Newest)"
                  actionLabel="Advanced Filters"
                  dateRangeLabel="Jan 01, 2026 — Oct 24, 2026"
                />

                <GeneralHistoryTable
                  rows={historyBroadcasts}
                  pagination={historyPagination}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
