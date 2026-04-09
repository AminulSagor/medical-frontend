"use client";

import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import GeneralDataPagination from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-pagination";
import { PaginationState } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import {
  formatAuthorInitials,
  formatAuthorName,
  formatDateLabel,
  formatEstimatedReadMinutes,
  formatTimeLabel,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_utils/general-broadcast-workspace.utils";
import { GeneralBroadcastWorkspaceItem } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-workspace.types";

type Props = {
  items: GeneralBroadcastWorkspaceItem[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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

function DraftBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
      {label}
    </span>
  );
}

function ActionButtons({ item }: { item: GeneralBroadcastWorkspaceItem }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <button
        type="button"
        disabled={!item.actions?.edit}
        className="hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        disabled={!item.actions?.view}
        className="hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Eye size={15} />
      </button>
      <button
        type="button"
        disabled={!item.actions?.delete}
        className="hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default function GeneralDraftsTable({
  items,
  pagination,
  onPageChange,
}: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Last Modified
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Type
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Article Title
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
            {items.length > 0 ? (
              items.map((item) => {
                const authorName = formatAuthorName(item.author);

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-5">
                      <div className="font-semibold text-slate-800">
                        {formatDateLabel(item.lastModified)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatTimeLabel(item.lastModified)}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <TypePill
                        label={item.type.displayLabel}
                        variant={item.type.badgeVariant}
                      />
                    </td>

                    <td className="px-4 py-5">
                      <div className="max-w-[360px] font-semibold leading-6 text-slate-800">
                        {item.articleTitle || item.subjectLine || "—"}
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <Avatar
                        name={authorName}
                        initials={formatAuthorInitials(item.author)}
                      />
                    </td>

                    <td className="px-4 py-5 text-sm font-medium text-slate-500">
                      {formatEstimatedReadMinutes(item.estReadMinutes)}
                    </td>

                    <td className="px-4 py-5">
                      <DraftBadge label={item.status.displayLabel} />
                    </td>

                    <td className="px-4 py-5">
                      <ActionButtons item={item} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm font-medium text-slate-400"
                >
                  No drafts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs italic text-slate-400">
          Showing recent work in progress drafts
        </p>
        <GeneralDataPagination
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
