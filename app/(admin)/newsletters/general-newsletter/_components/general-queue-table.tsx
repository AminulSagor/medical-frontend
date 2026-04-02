"use client";

import React from "react";
import { Eye, GripVertical, Pencil, Trash2 } from "lucide-react";
import type {
  PaginationState,
  QueueBroadcastRow,
} from "@/app/(admin)/newsletters/general-newsletter/types/general-newsletter-data.type";
import GeneralDataPagination from "@/app/(admin)/newsletters/general-newsletter/_components/general-data-pagination";

type Props = {
  rows: QueueBroadcastRow[];
  pagination: PaginationState;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Avatar({ name, initials }: { name: string; initials?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
        {initials ?? name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-sm text-slate-600">{name}</span>
    </div>
  );
}

function FrequencyPill({ value }: { value: QueueBroadcastRow["frequency"] }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        value === "weekly"
          ? "bg-[#dff7f4] text-[#10b7aa]"
          : "bg-slate-800 text-white",
      )}
    >
      {value}
    </span>
  );
}

function TypePill({ value }: { value: QueueBroadcastRow["type"] }) {
  const label =
    value === "clinical_article" ? "Clinical Article" : "Special Report";

  return (
    <span
      className={cx(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        value === "clinical_article"
          ? "bg-[#dff7f4] text-[#10b7aa]"
          : "bg-[#efe2fb] text-[#8b3dff]",
      )}
    >
      {label}
    </span>
  );
}

function StatusBadge({ value }: { value: QueueBroadcastRow["status"] }) {
  const map = {
    ready: {
      label: "Ready",
      cls: "bg-[#e8f8ee] text-[#12b76a]",
      dot: "bg-[#12b76a]",
    },
    scheduled: {
      label: "Scheduled",
      cls: "bg-[#e8f8ee] text-[#12b76a]",
      dot: "bg-[#12b76a]",
    },
    review_pending: {
      label: "Review Pending",
      cls: "bg-[#fff5df] text-[#f59e0b]",
      dot: "bg-[#f59e0b]",
    },
  } as const;

  const item = map[value];

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        item.cls,
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", item.dot)} />
      {item.label}
    </span>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <button type="button" className="hover:text-slate-600">
        <Pencil size={15} />
      </button>
      <button type="button" className="hover:text-slate-600">
        <Eye size={15} />
      </button>
      <button type="button" className="hover:text-slate-600">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default function GeneralQueueTable({ rows, pagination }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Seq
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Scheduled Date (2026)
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Frequency
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Type
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Article Title
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Target
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Author
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Est. Read
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Status
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-4 py-5">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-300">
                    <GripVertical size={15} />
                  </div>
                </td>

                <td className="px-4 py-5">
                  <div className="font-semibold text-slate-800">{row.scheduledDate}</div>
                  <div className="text-xs text-slate-400">{row.scheduledMeta}</div>
                </td>

                <td className="px-4 py-5">
                  <FrequencyPill value={row.frequency} />
                </td>

                <td className="px-4 py-5">
                  <TypePill value={row.type} />
                </td>

                <td className="px-4 py-5">
                  <div className="max-w-[280px] font-semibold leading-6 text-slate-800">
                    {row.articleTitle}
                  </div>
                </td>

                <td className="px-4 py-5 text-sm text-slate-600">{row.target}</td>

                <td className="px-4 py-5">
                  <Avatar name={row.author.name} initials={row.author.initials} />
                </td>

                <td className="px-4 py-5 text-sm font-medium text-slate-500">
                  {row.estimatedReadMinutes} min
                </td>

                <td className="px-4 py-5">
                  <StatusBadge value={row.status} />
                </td>

                <td className="px-4 py-5">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs italic text-slate-400">
          Showing filtered intervals for the current broadcast cycle
        </p>
        <GeneralDataPagination pagination={pagination} />
      </div>
    </div>
  );
}