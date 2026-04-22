"use client";

import React from "react";
import Link from "next/link";
import { Copy, Eye } from "lucide-react";
import GeneralDataPagination from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-pagination";
import { PaginationState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import {
  formatDateLabel,
  formatTimeLabel,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_utils/general-broadcast-workspace.utils";
import { GeneralBroadcastWorkspaceItem } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

type Props = {
  items: GeneralBroadcastWorkspaceItem[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onRefresh: () => Promise<void>;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypeTag({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]",
        variant === "gray"
          ? "bg-slate-100 text-slate-600"
          : "bg-[#efe2fb] text-[#8b3dff]",
      )}
    >
      {label}
    </span>
  );
}

function CadenceTag({ value }: { value: string | null }) {
  if (!value) return null;

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
        <div
          className="h-full rounded-full bg-[#12b7ad]"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-[#12b7ad]">{value}%</span>
    </div>
  );
}

function ActionButtons({ item }: { item: GeneralBroadcastWorkspaceItem }) {
  const reportHref = `/dashboard/admin/newsletters/transmission-history/${item.id}`;
  // const reportHref = "#";
  return (
    <div className="flex items-center gap-4 text-slate-400">
      {item.actions?.view ? (
        <Link
          href={reportHref}
          className="inline-flex items-center gap-1.5 hover:text-slate-600"
          aria-label="View report"
          title="View report"
        >
          <Eye size={15} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eye size={15} />
        </button>
      )}

      {/* <button type="button" className="hover:text-slate-600">
        <Copy size={15} />
      </button> */}
    </div>
  );
}

export default function GeneralHistoryTable({
  items,
  pagination,
  onPageChange,
  onRefresh,
}: Props) {
  void onRefresh;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Sent Date
              </th>
              <th className="px-4 py-4 text text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
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
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-800">
                      {formatDateLabel(item.sentDate)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatTimeLabel(item.sentDate)}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 flex-col">
                      <TypeTag
                        label={item.type.displayLabel}
                        variant={item.type.badgeVariant}
                      />
                      <CadenceTag value={item.frequency} />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="max-w-[430px] font-semibold leading-6 text-slate-800">
                      {item.articleTitle || item.subjectLine || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-lg font-semibold text-slate-800">
                    {item.recipients.toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <EngagementBar
                        label="OPEN"
                        value={item.engagement.openRatePercent}
                      />
                      <EngagementBar
                        label="CLICK"
                        value={item.engagement.clickRatePercent}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#12b76a]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" />
                      {item.status.displayLabel}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <ActionButtons item={item} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm font-medium text-slate-400"
                >
                  No historical transmissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs italic text-slate-400">
          Showing {items.length} of {pagination.totalItems} historical
          transmissions
        </p>
        <GeneralDataPagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
