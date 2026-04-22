"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, GripVertical, Pencil, Trash2 } from "lucide-react";
import GeneralDataPagination from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-pagination";
import { PaginationState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import {
  formatAuthorInitials,
  formatAuthorName,
  formatDateLabel,
  formatEstimatedReadMinutes,
  formatFrequencyLabel,
  formatTimeLabel,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_utils/general-broadcast-workspace.utils";
import { GeneralBroadcastWorkspaceItem } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";
import { generalBroadcastGetService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.service";

type Props = {
  items: GeneralBroadcastWorkspaceItem[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onRefresh: () => Promise<void>;
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

function FrequencyPill({
  value,
}: {
  value: GeneralBroadcastWorkspaceItem["frequency"];
}) {
  const label = formatFrequencyLabel(value);

  return (
    <span
      className={cx(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        value === "WEEKLY"
          ? "bg-[#dff7f4] text-[#10b7aa]"
          : "bg-slate-800 text-white",
      )}
    >
      {label}
    </span>
  );
}

function TypePill({ label, variant }: { label: string; variant: string }) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        variant === "gray"
          ? "bg-slate-100 text-slate-600"
          : "bg-[#efe2fb] text-[#8b3dff]",
      )}
    >
      {label}
    </span>
  );
}

function StatusBadge({ label, code }: { label: string; code: string }) {
  const isPositive = ["SCHEDULED", "READY", "SENT"].includes(code);
  const isWarning = ["REVIEW_PENDING"].includes(code);

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        isPositive
          ? "bg-[#e8f8ee] text-[#12b76a]"
          : isWarning
            ? "bg-[#fff5df] text-[#f59e0b]"
            : "bg-slate-100 text-slate-600",
      )}
    >
      <span
        className={cx(
          "h-1.5 w-1.5 rounded-full",
          isPositive
            ? "bg-[#12b76a]"
            : isWarning
              ? "bg-[#f59e0b]"
              : "bg-slate-500",
        )}
      />
      {label}
    </span>
  );
}

function ActionButtons({
  item,
  onRefresh,
}: {
  item: GeneralBroadcastWorkspaceItem;
  onRefresh: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const editHref = `/dashboard/admin/newsletters/general-newsletter/cadence-broadcast-edit/${item.id}`;
  const viewHref = `/dashboard/admin/newsletters/general-newsletter/view-scheduled-broadcast/${item.id}`;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this broadcast?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await generalBroadcastGetService.deleteBroadcast(item.id);
      await onRefresh();
    } catch (error) {
      console.error("Failed to delete broadcast:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 text-slate-400">
      {item.actions?.edit ? (
        <Link
          href={editHref}
          className="hover:text-slate-600"
          aria-label="Edit broadcast"
          title="Edit broadcast"
        >
          <Pencil size={15} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Pencil size={15} />
        </button>
      )}

      {item.actions?.view ? (
        <Link
          href={viewHref}
          className="hover:text-slate-600"
          aria-label="View broadcast"
          title="View broadcast"
        >
          <Eye size={15} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eye size={15} />
        </button>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={!item.actions?.cancel || isDeleting}
        className="hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Delete broadcast"
        title="Delete broadcast"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default function GeneralQueueTable({
  items,
  pagination,
  onPageChange,
  onRefresh,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead className="bg-white">
            <tr className="border-b border-slate-200">
              {/* <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Seq
              </th> */}
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Scheduled Date
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
              {/* <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Est. Read
              </th> */}
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
              items.map((item) => {
                const authorName = formatAuthorName(item.author);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    {/* <td className="px-4 py-5">
                      <div className="flex items-center gap-2">
                        {item.actions?.reorder ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-300">
                            <GripVertical size={15} />
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold text-slate-700">
                          {item.sequence ?? "—"}
                        </span>
                      </div>
                    </td> */}

                    <td className="px-4 py-5">
                      <div className="font-semibold text-slate-800">
                        {formatDateLabel(item.scheduledDate)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatTimeLabel(item.scheduledDate)}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <FrequencyPill value={item.frequency} />
                    </td>

                    <td className="px-4 py-5 w-44">
                      <TypePill
                        label={item.type.displayLabel}
                        variant={item.type.badgeVariant}
                      />
                    </td>

                    <td className="px-4 py-5">
                      <div className="max-w-[280px] font-semibold leading-6 text-slate-800">
                        {item.articleTitle || item.subjectLine || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-600">
                      {item.target.displayLabel}
                    </td>

                    <td className="px-4 py-5">
                      <Avatar
                        name={authorName}
                        initials={formatAuthorInitials(item.author)}
                      />
                    </td>

                    {/* <td className="px-4 py-5 text-sm font-medium text-slate-500">
                      {formatEstimatedReadMinutes(item.estReadMinutes)}
                    </td> */}

                    <td className="px-4 py-5">
                      <StatusBadge
                        label={item.status.displayLabel}
                        code={item.status.code}
                      />
                    </td>

                    <td className="px-4 py-5">
                      <ActionButtons item={item} onRefresh={onRefresh} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-sm font-medium text-slate-400"
                >
                  No queue broadcasts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs italic text-slate-400">
          Showing filtered intervals for the current broadcast cycle
        </p>
        <GeneralDataPagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
