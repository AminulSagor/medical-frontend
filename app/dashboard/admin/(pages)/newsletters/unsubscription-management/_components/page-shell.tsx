"use client";

import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
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
import {
  confirmUnsubscription,
  getUnsubscribeRequests,
  getUnsubscriptionDetail,
} from "@/service/admin/newsletter/general-newsletter/subscribes/unsubscription-management.service";
import type {
  ConfirmUnsubscriptionErrorResponseDto,
  ConfirmUnsubscriptionSuccessModalDto,
  UnsubscribeRequestsListResponseDto,
} from "@/types/admin/newsletter/general-newsletter/subscribes/unsubscription-management.types";

import ProcessBulkModal from "./process/process-bulk-modal";
import type { BulkBreakdownItem } from "./process/process-bulk-modal";

import UnsubscriptionConfirmedModal, {
  type UnsubConfirmedModalData,
} from "./unsubscription-confirmed-modal";

export default function PageShell({ data }: { data: UnsubPageData }) {
  const [tab, setTab] = useState<UnsubTabKey>("requested");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [requestedRows, setRequestedRows] = useState(data.requested);
  const [requestedMeta, setRequestedMeta] = useState(data.requestedMeta);
  const [unsubscribedRows, setUnsubscribedRows] = useState(data.unsubscribed);
  const [unsubscribedMeta, setUnsubscribedMeta] = useState(data.unsubscribedMeta);

  const rows = tab === "requested" ? requestedRows : unsubscribedRows;
  const total = tab === "requested" ? requestedMeta.total : unsubscribedMeta.total;
  const totalLabel = tab === "requested" ? "pending requests" : "unsubscribed requests";

  // ── Details modal
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<UnsubscriptionDetails | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const refetchRows = async () => {
    const [requestedResponse, unsubscribedResponse] = await Promise.all([
      getUnsubscribeRequests({ tab: "requested", page: 1, limit: 10 }),
      getUnsubscribeRequests({ tab: "unsubscribed", page: 1, limit: 10 }),
    ]);

    const requestedData: UnsubscribeRequestsListResponseDto = requestedResponse;
    const unsubscribedData: UnsubscribeRequestsListResponseDto = unsubscribedResponse;

    setRequestedRows(requestedData.items);
    setRequestedMeta(requestedData.meta);
    setUnsubscribedRows(unsubscribedData.items);
    setUnsubscribedMeta(unsubscribedData.meta);

    const requestedIdSet = new Set(requestedData.items.map((item) => item.id));
    setSelectedRowIds((prev) => prev.filter((id) => requestedIdSet.has(id)));
  };

  const openDetailsById = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    try {
      setConfirmError(null);
      const response = await getUnsubscriptionDetail(id);
      setDetails(response);
    } catch (error) {
      console.error("Failed to load unsubscription details:", error);
      setDetails(getMockUnsubscriptionDetails(id));
    } finally {
      setOpen(true);
    }
  };

  // ── Bulk modal
  const [bulkOpen, setBulkOpen] = useState(false);
  const [removePermanently, setRemovePermanently] = useState(true);
  const [sendEmails, setSendEmails] = useState(false);

  const selectedPendingRows = useMemo(
    () => requestedRows.filter((row) => selectedRowIds.includes(row.id)),
    [requestedRows, selectedRowIds],
  );

  const totalSelected = selectedPendingRows.length;

  const breakdown: BulkBreakdownItem[] = useMemo(() => {
    const counts = new Map<string, number>();

    selectedPendingRows.forEach((row) => {
      const existing = counts.get(row.sourceSegment) ?? 0;
      counts.set(row.sourceSegment, existing + 1);
    });

    return Array.from(counts.entries()).map(([label, count]) => ({
      id: label,
      label,
      count,
    }));
  }, [selectedPendingRows]);

  // ── Success modal
  const [successOpen, setSuccessOpen] = useState(false);
  const [successData, setSuccessData] = useState<UnsubConfirmedModalData | null>(null);

  const openSuccess = (payload: ConfirmUnsubscriptionSuccessModalDto) => {
    setSuccessData(payload);
    setSuccessOpen(true);
  };

  const onConfirm = async (id: string) => {
    if (isConfirming) return;

    try {
      setIsConfirming(true);
      setConfirmError(null);

      const response = await confirmUnsubscription(id, {
        reason: "Unsubscribed by request",
        sendConfirmationEmail: true,
      });

      await refetchRows();
      setOpen(false);
      openSuccess(response.successModal);
    } catch (error) {
      const axiosError = error as AxiosError<ConfirmUnsubscriptionErrorResponseDto>;
      setConfirmError(
        axiosError.response?.data?.message || "Failed to confirm unsubscription",
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const onCloseDetails = () => {
    setConfirmError(null);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <HeaderBar />
      <MetricsRow metrics={data.metrics} />

      <RequestsTabs
        value={tab}
        onChange={setTab}
        requestedCount={requestedRows.length}
      />

      <SearchFilterRow />

      <RequestsTable
        rows={rows}
        onOpenDetails={openDetailsById}
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
      />

      <PaginationRow total={total} label={totalLabel} />

      <ActionDock
        onProcessSelected={() => setBulkOpen(true)}
        selectedCount={totalSelected}
        disableProcess={tab !== "requested" || totalSelected === 0}
      />

      {/* Details modal */}
      <UnsubscriptionDetailsModal
        open={open}
        data={details}
        onClose={onCloseDetails}
        onDismiss={onCloseDetails}
        onConfirm={onConfirm}
        isConfirming={isConfirming}
        confirmError={confirmError}
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
            title: "Unsubscription Confirmed",
            payload: {
              subscriberEmail: `${totalSelected} selected subscribers`,
              statusLabel: "Removed from selected lists",
            },
            ctaLabel: "Done",
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