"use client";

import React from "react";
import { Copy, Eye } from "lucide-react";
import type {
  HistoryRow,
  PaginationState,
} from "@/app/(admin)/newsletters/general-newsletter/types/general-newsletter-data.type";
import GeneralDataPagination from "@/app/(admin)/newsletters/general-newsletter/_components/general-data-pagination";

type Props = {
  rows: HistoryRow[];
  pagination: PaginationState;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypeTag({ value }: { value: HistoryRow["typeTag"] }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
        value === "clinical"
          ? "bg-[#dff7f4] text-[#10b7aa]"
          : "bg-[#efe2fb] text-[#8b3dff]",
      )}
    >
      {value}
    </span>
  );
}

function CadenceTag({ value }: { value: HistoryRow["cadenceTag"] }) {
  return (
    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
      {value}
    </span>
  );
}

function EngagementBar({
  label,
  value,
}: {
  label: "OPEN" | "CLICK";
  value: number;
}) {
  const width = Math.min(Math.max(value, 0), 100);
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-[30px] text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
        {label}
      </span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-[#12b7ad]" style={{ width: `${width}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-[#12b7ad]">{value}%</span>
    </div>
  );
}

export default function GeneralHistoryTable({ rows, pagination }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Sent Date
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Type
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Article Title
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Recipients
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Engagement
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
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-800">{row.sentDate}</div>
                  <div className="text-xs text-slate-400">{row.sentTime}</div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <TypeTag value={row.typeTag} />
                    <CadenceTag value={row.cadenceTag} />
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="max-w-[430px] font-semibold leading-6 text-slate-800">
                    {row.articleTitle}
                  </div>
                </td>

                <td className="px-4 py-4 text-lg font-semibold text-slate-800">
                  {row.recipients.toLocaleString()}
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <EngagementBar label="OPEN" value={row.engagement.openPct} />
                    <EngagementBar label="CLICK" value={row.engagement.clickPct} />
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#12b76a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" />
                    Sent
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-4 text-slate-400">
                    <button type="button" className="inline-flex items-center gap-1.5 hover:text-slate-600">
                      <Eye size={15} />
                      <span className="text-xs font-semibold">Report</span>
                    </button>
                    <button type="button" className="hover:text-slate-600">
                      <Copy size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs italic text-slate-400">
          Showing 10 of 142 historical transmissions
        </p>
        <GeneralDataPagination pagination={pagination} />
      </div>
    </div>
  );
}