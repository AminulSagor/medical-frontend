"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  BroadcastCancelledSuccessDialog,
  CancelScheduledBroadcastDialog,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/cancel-scheduled-broadcast-dialogs";

import { formatBroadcastStatus } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";

import { generalBroadcastGetService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.service";

import type { GetGeneralBroadcastUIViewResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  data: GetGeneralBroadcastUIViewResponse;
  onCancelled?: () => Promise<void> | void;
};

function statusStyles(status: string) {
  if (status === "SCHEDULED") {
    return "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]";
  }

  if (status === "SENT") {
    return "border-[#c8f0d8] bg-[#eefcf4] text-[#12b76a]";
  }

  if (status === "CANCELLED") {
    return "border-rose-200 bg-rose-50 text-rose-500";
  }

  return "border-slate-200 bg-slate-100 text-slate-500";
}

export default function ScheduledBroadcastViewHeader({
  data,
  onCancelled,
}: Props) {
  const router = useRouter();

  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openCancelSuccess, setOpenCancelSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // 🔥 NEW DATA MAPPING
  const { header, summaryCards, viewType } = data;

  const statusLabel = formatBroadcastStatus(header.status);

  const subtitle =
    viewType === "CUSTOM_MESSAGE"
      ? "Custom message broadcast"
      : "Article link broadcast";

  const scheduledDateLabel = useMemo(() => {
    return summaryCards.scheduledForDisplay;
  }, [summaryCards.scheduledForDisplay]);

  const editHref = `/dashboard/admin/newsletters/general-newsletter/cadence-broadcast-edit/${header.id}`;

  async function handleConfirmCancel(reason: string) {
    try {
      setIsCancelling(true);
      await generalBroadcastGetService.cancelBroadcast(header.id, reason);

      setOpenCancelConfirm(false);

      await new Promise((resolve) => setTimeout(resolve, 100));

      setOpenCancelSuccess(true);

      if (onCancelled) {
        await onCancelled();
      }
    } catch (error) {
      console.error("Failed to cancel broadcast:", error);
    } finally {
      setIsCancelling(false);
    }
  }

  function handleReturnToQueue() {
    router.back();
  }

  return (
    <>
      <header>
        <div className="mx-auto flex w-full items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="Go back"
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[18px] font-semibold text-slate-800 md:text-[20px]">
                  {header.title}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyles(
                    header.status,
                  )}`}
                >
                  {statusLabel}
                </span>
              </div>

              <p className="truncate text-sm text-slate-400">{subtitle}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {header.actionsAllowed.cancel && header.status === "SCHEDULED" && (
              <button
                type="button"
                onClick={() => setOpenCancelConfirm(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-500 hover:bg-rose-50"
              >
                <XCircle size={15} />
                Cancel Schedule
              </button>
            )}

            {header.actionsAllowed.edit && (
              <button
                type="button"
                onClick={() => router.push(editHref)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:opacity-95"
              >
                <Pencil size={15} />
                Edit Broadcast
              </button>
            )}
          </div>
        </div>
      </header>

      <CancelScheduledBroadcastDialog
        open={openCancelConfirm}
        onOpenChange={setOpenCancelConfirm}
        recipientCount={summaryCards.recipients}
        scheduledDateLabel={scheduledDateLabel}
        articleTitle={header.title}
        onConfirmCancel={handleConfirmCancel}
        onKeepScheduled={() => {}}
        isSubmitting={isCancelling}
      />

      <BroadcastCancelledSuccessDialog
        open={openCancelSuccess}
        onOpenChange={setOpenCancelSuccess}
        scheduledDateLabel={scheduledDateLabel}
        articleTitle={header.title}
        onReturnToQueue={handleReturnToQueue}
      />
    </>
  );
}
