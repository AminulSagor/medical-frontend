"use client";

import React from "react";
import { Check } from "lucide-react";
import Dialog from "@/components/dialogs/dialog";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type ClinicianRegisteredDialogData = {
  name: string;
  role: string;
  statusLabel: string; // "Active Subscriber"
  initialSource: string; // "Manual Entry"
};

export default function ClinicianRegisteredDialog({
  open,
  onOpenChange,
  data,
  onGoProfile,
  onReturnList,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ClinicianRegisteredDialogData;
  onGoProfile: () => void;
  onReturnList: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl"
      hideClose
    >
      <div className="px-6 pb-5 pt-6">
        {/* top icon */}
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-500 shadow-sm">
          <Check className="text-white" size={26} strokeWidth={3} />
        </div>

        {/* title + desc */}
        <div className="mt-4 text-center">
          <h2 className="text-[18px] font-extrabold leading-6 text-slate-900">
            Clinician Registered Successfully
          </h2>
          <p className="mx-auto mt-2 max-w-[320px] text-sm leading-5 text-slate-500">
            The clinician has been successfully added to the master directory
            and is now eligible for newsletter distribution and course
            enrollment.
          </p>
        </div>

        {/* info card */}
        <div className="mt-5 rounded-xl bg-slate-50 ring-1 ring-slate-200/60">
          <div className="grid grid-cols-[120px_1fr] gap-y-3 px-4 py-4">
            <Label>NAME</Label>
            <Value>{data.name}</Value>

            <Label>ROLE</Label>
            <Value>{data.role}</Value>

            <Label>STATUS</Label>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <Value className="text-slate-700">{data.statusLabel}</Value>
            </div>

            <Label>INITIAL SOURCE</Label>
            <Value>{data.initialSource}</Value>
          </div>
        </div>

        {/* actions */}
        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={onGoProfile}
            className={cx(
              "inline-flex h-11 w-full items-center justify-center rounded-xl",
              "bg-teal-600 text-sm font-bold text-white shadow-sm",
              "hover:bg-teal-700",
            )}
          >
            Go to Subscriber Profile
          </button>

          <button
            type="button"
            onClick={onReturnList}
            className={cx(
              "inline-flex h-11 w-full items-center justify-center rounded-xl",
              "bg-white text-sm font-semibold text-slate-700",
              "ring-1 ring-slate-200/70 hover:bg-slate-50",
            )}
          >
            Return to Master List
          </button>
        </div>

        {/* footer note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-wide text-slate-400">
          <span className="grid h-4 w-4 place-items-center rounded-full ring-1 ring-slate-200">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
          </span>
          VERIFIED ADMINISTRATIVE ACTION
        </div>
      </div>
    </Dialog>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-extrabold tracking-widest text-slate-400">
      {children}
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("text-sm font-semibold text-slate-900", className)}>
      {children}
    </div>
  );
}
