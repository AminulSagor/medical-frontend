"use client";

import React, { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import Dialog from "@/components/dialogs/dialog";

type ArticleCardProps = {
  title: string;
};

function ArticleCard({ title }: ArticleCardProps) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
          <div className="h-4 w-4 rounded-sm border border-slate-300" />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-wider text-slate-400">
            BROADCAST
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrimaryDangerButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 w-full rounded-xl bg-red-500 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function PrimarySuccessButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 w-full rounded-xl bg-emerald-500 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export type CancelScheduledBroadcastDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientCount: number;
  scheduledDateLabel: string;
  articleTitle: string;
  onConfirmCancel: (reason: string) => Promise<void> | void;
  onKeepScheduled?: () => void;
  isSubmitting?: boolean;
};

export function CancelScheduledBroadcastDialog({
  open,
  onOpenChange,
  recipientCount,
  scheduledDateLabel,
  articleTitle,
  onConfirmCancel,
  onKeepScheduled,
  isSubmitting = false,
}: CancelScheduledBroadcastDialogProps) {
  const [reason, setReason] = useState("Content update needed");

  const handleConfirm = async () => {
    await onConfirmCancel(reason.trim() || "Content update needed");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      hideClose
      className="rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          Cancel Scheduled Broadcast?
        </h2>

        <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
          Are you sure you want to cancel this broadcast? This will remove the
          newsletter from the queue and it will not be sent to your{" "}
          <span className="font-semibold text-slate-900">
            {recipientCount.toLocaleString()} recipients
          </span>{" "}
          on{" "}
          <span className="font-semibold text-slate-900">
            {scheduledDateLabel}
          </span>
          .
        </p>

        <ArticleCard title={articleTitle} />

        <div className="mt-5 w-full text-left">
          <label
            htmlFor="cancel-broadcast-reason"
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
          >
            Cancellation Reason
          </label>
          <textarea
            id="cancel-broadcast-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50"
            placeholder="Enter cancellation reason"
          />
        </div>

        <div className="mt-5 w-full space-y-3">
          <PrimaryDangerButton onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Cancelling..." : "Yes, Cancel Schedule"}
          </PrimaryDangerButton>

          <SecondaryButton
            disabled={isSubmitting}
            onClick={() => {
              onKeepScheduled?.();
              onOpenChange(false);
            }}
          >
            No, Keep Scheduled
          </SecondaryButton>
        </div>
      </div>
    </Dialog>
  );
}

export type BroadcastCancelledSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledDateLabel: string;
  articleTitle: string;
  onReturnToQueue: () => void;
};

export function BroadcastCancelledSuccessDialog({
  open,
  onOpenChange,
  scheduledDateLabel,
  articleTitle,
  onReturnToQueue,
}: BroadcastCancelledSuccessDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      hideClose
      className="rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
          <Check className="h-7 w-7 text-white" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">
          Broadcast Cancelled
          <br />
          Successfully
        </h2>

        <p className="mt-2 max-w-[320px] text-sm leading-6 text-slate-500">
          The scheduled broadcast for{" "}
          <span className="font-semibold text-slate-900">
            {scheduledDateLabel}
          </span>{" "}
          has been removed from the queue. No emails were sent.
        </p>

        <ArticleCard title={articleTitle} />

        <div className="mt-5 w-full">
          <PrimarySuccessButton
            onClick={() => {
              onReturnToQueue();
              onOpenChange(false);
            }}
          >
            Return to Queue
          </PrimarySuccessButton>
        </div>
      </div>
    </Dialog>
  );
}
