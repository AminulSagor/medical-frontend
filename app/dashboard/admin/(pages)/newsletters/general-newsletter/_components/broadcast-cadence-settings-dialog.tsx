"use client";

import React from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Settings,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import Dialog from "@/components/dialogs/dialog";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FieldProps = {
  label: string;
  value: string;
  kind?: "date" | "select" | "time";
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Field({ label, value, kind = "select" }: FieldProps) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 text-left text-[15px] font-medium text-slate-700 hover:bg-white"
      >
        <span>{value}</span>

        <span className="text-slate-400">
          {kind === "date" && <CalendarDays size={16} />}
          {kind === "time" && <Clock3 size={16} />}
          {kind === "select" && <ChevronDown size={16} />}
        </span>
      </button>
    </div>
  );
}

type CadenceCardProps = {
  mode: "weekly" | "monthly";
  title: string;
  startDate: string;
  middleLabel: string;
  middleValue: string;
  time: string;
};

function CadenceConfigCard({
  mode,
  title,
  startDate,
  middleLabel,
  middleValue,
  time,
}: CadenceCardProps) {
  const isWeekly = mode === "weekly";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.03)]">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cx(
              "inline-flex rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
              isWeekly ? "bg-[#12b7ad] text-white" : "bg-slate-800 text-white",
            )}
          >
            {mode}
          </span>

          <h4 className="text-[15px] font-semibold text-slate-800">{title}</h4>
        </div>

        <div className="text-slate-300">
          <CalendarDays size={16} />
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Cycle Start Date" value={startDate} kind="date" />
        <Field label={middleLabel} value={middleValue} kind="select" />
        <Field label="Release Time" value={time} kind="time" />
      </div>
    </div>
  );
}

export default function BroadcastCadenceSettingsDialog({
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      hideClose
      size="xl"
      position="center"
      className="max-w-[820px] rounded-[26px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
    >
      <div className="-m-5">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pb-6 pt-7">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Settings size={18} />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold leading-tight text-slate-800">
                Broadcast Cadence Settings
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Configure automated delivery windows for clinical newsletters
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Body */}
        <div className="px-8 py-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CadenceConfigCard
              mode="weekly"
              title="Sequence Rhythm"
              startDate="11/01/2026"
              middleLabel="Release Day"
              middleValue="Sunday"
              time="09:00 AM"
            />

            <CadenceConfigCard
              mode="monthly"
              title="Standard Rhythm"
              startDate="11/01/2026"
              middleLabel="Day of Month"
              middleValue="1st of the Month"
              time="12:00 PM"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Footer */}
        <div className="flex flex-col gap-4 px-8 py-6 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.03em] text-amber-600">
            <AlertCircle size={14} />
            Existing queue intervals will be recalculated
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => router.push("/newsletters/cadence-broadcast")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#12b7ad] px-6 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(18,183,173,0.25)] hover:opacity-95"
            >
              Apply Cadence
              <Check size={16} />
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
