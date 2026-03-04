"use client";

import React, { useState } from "react";
import { ArrowLeft, Pencil, XCircle } from "lucide-react";
import { ScheduledBroadcastHeaderData } from "@/app/(admin)/newsletters/view-scheduled-broadcast/types/scheduled-broadcast-view.type";
import {
  BroadcastCancelledSuccessDialog,
  CancelScheduledBroadcastDialog,
} from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/cancel-scheduled-broadcast-dialogs";
import { useRouter } from "next/navigation";

type Props = {
  data: ScheduledBroadcastHeaderData;
};

function statusStyles(status: ScheduledBroadcastHeaderData["status"]) {
  if (status === "scheduled") {
    return "border-[#b7efe9] bg-[#e8fbf8] text-[#14b8ad]";
  }
  if (status === "sent") {
    return "border-[#c8f0d8] bg-[#eefcf4] text-[#12b76a]";
  }
  return "border-slate-200 bg-slate-100 text-slate-500";
}

export default function ScheduledBroadcastViewHeader({ data }: Props) {
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openCancelSuccess, setOpenCancelSuccess] = useState(false);

  async function handleConfirmCancel() {
    //  call your cancel API here
    // await cancelScheduledBroadcast(data.broadcastId);

    setOpenCancelSuccess(true);
  }

  function handleReturnToQueue() {
    // router.push("/newsletters/broadcasts/general-newsletter");
  }

  const router = useRouter();

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
                  {data.title}
                </h1>

                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyles(
                    data.status,
                  )}`}
                >
                  {data.status}
                </span>
              </div>

              <p className="truncate text-sm text-slate-400">{data.subtitle}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenCancelConfirm(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-500 hover:bg-rose-50"
            >
              <XCircle size={15} />
              Cancel Schedule
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#14b8ad] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(20,184,173,0.22)] hover:opacity-95"
            >
              <Pencil size={15} />
              Edit Broadcast
            </button>
          </div>
        </div>
      </header>

      <CancelScheduledBroadcastDialog
        open={openCancelConfirm}
        onOpenChange={setOpenCancelConfirm}
        recipientCount={2450}
        scheduledDateLabel={"Nov 22, 2026"}
        articleTitle={data.title}
        onConfirmCancel={handleConfirmCancel}
        onKeepScheduled={() => {}}
      />

      <BroadcastCancelledSuccessDialog
        open={openCancelSuccess}
        onOpenChange={setOpenCancelSuccess}
        scheduledDateLabel={"Nov 22, 2026"}
        articleTitle={data.title}
        onReturnToQueue={handleReturnToQueue}
      />
    </>
  );
}
