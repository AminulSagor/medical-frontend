"use client";

import { useMemo, useState } from "react";
import type { UnsubPageData, UnsubTabKey } from "../_lib/unsubscription-management-types";

import HeaderBar from "./header-bar";
import MetricsRow from "./metrics-row";
import RequestsTabs from "./requests-tabs";
import SearchFilterRow from "./search-filter-row";
import RequestsTable from "./requests-table";
import PaginationRow from "./pagination-row";
import ActionDock from "./action-dock";

import type { UnsubscriptionDetails } from "../_lib/details-user-types";
import UnsubscriptionDetailsModal from "./details-user/unsubscription-details-modal";
import { getMockUnsubscriptionDetails } from "../_lib/details-user-mock-data";

import ProcessBulkModal from "./process/process-bulk-modal";
import type { BulkBreakdownItem } from "./process/process-bulk-modal";

import UnsubscriptionConfirmedModal, {
  type UnsubConfirmedPayload,
} from "./unsubscription-confirmed-modal";

export default function PageShell({ data }: { data: UnsubPageData }) {
  const [tab, setTab] = useState<UnsubTabKey>("requested");
  const rows = tab === "requested" ? data.requested : data.unsubscribed;

  // ── Details modal
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<UnsubscriptionDetails | null>(null);

  const openDetailsById = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    setDetails(getMockUnsubscriptionDetails(id));
    setOpen(true);
  };

  // ── Bulk modal
  const [bulkOpen, setBulkOpen] = useState(false);
  const [removePermanently, setRemovePermanently] = useState(true);
  const [sendEmails, setSendEmails] = useState(false);

  const totalSelected = 14;

  const breakdown: BulkBreakdownItem[] = useMemo(
    () => [
      { id: "b1", label: "General Newsletter", count: 10 },
      { id: "b2", label: "Course Updates", count: 4 },
    ],
    []
  );

  // ── Success modal
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState<UnsubConfirmedPayload | null>(
    null
  );

  const openSuccess = (payload: UnsubConfirmedPayload) => {
    setSuccessData(payload);
    setSuccessOpen(true);
  };

  return (
    <div className="space-y-6">
      <HeaderBar />
      <MetricsRow metrics={data.metrics} />

      <RequestsTabs
        value={tab}
        onChange={setTab}
        requestedCount={data.requested.length}
      />

      <SearchFilterRow />

      <RequestsTable rows={rows} onOpenDetails={openDetailsById} />

      <PaginationRow />

      <ActionDock onProcessSelected={() => setBulkOpen(true)} />

      {/* Details modal */}
      <UnsubscriptionDetailsModal
        open={open}
        data={details}
        onClose={() => setOpen(false)}
        onDismiss={() => setOpen(false)}
        onConfirm={() => {
          // close details modal and open success modal
          setOpen(false);

          openSuccess({
            subscriber: details?.subscriberName ?? "Subscriber",
            email: details?.subscriberEmail ?? "subscriber@email.com",
            statusLabel:
              "Removed from " + (details?.requestInfo?.sourceLabel ?? "List"),
          });
        }}
      />

      {/* Bulk modal */}
      <ProcessBulkModal
        open={bulkOpen}
        totalSelected={totalSelected}
        breakdown={breakdown}
        removePermanently={removePermanently}
        sendEmails={sendEmails}
        onToggleRemovePermanently={() => setRemovePermanently((v) => !v)}
        onToggleSendEmails={() => setSendEmails((v) => !v)}
        onClose={() => setBulkOpen(false)}
        onProcess={() => {
          setBulkOpen(false);

          openSuccess({
            subscriber: `${totalSelected} Subscribers`,
            email: "Bulk action",
            statusLabel: `Removed from selected lists`,
          });
        }}
      />

      {/* Success modal */}
      <UnsubscriptionConfirmedModal
        open={successOpen}
        data={successData}
        onDone={() => setSuccessOpen(false)}
      />
    </div>
  );
}