"use client";

import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  DraftRow,
  PaginationState,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/general-newsletter-data.type";
import GeneralDataPagination from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-data-pagination";

type Props = {
  rows: DraftRow[];
  pagination: PaginationState;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function TypePill({ value }: { value: DraftRow["type"] }) {
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

function DraftBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
      Draft
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

export default function GeneralDraftsTable({ rows, pagination }: Props) {
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
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-4 py-5">
                  <div className="font-semibold text-slate-800">
                    {row.lastModifiedDate}
                  </div>
                  <div className="text-xs text-slate-400">
                    {row.lastModifiedTime}
                  </div>
                </td>

                <td className="px-4 py-5">
                  <TypePill value={row.type} />
                </td>

                <td className="px-4 py-5">
                  <div className="max-w-[360px] font-semibold leading-6 text-slate-800">
                    {row.articleTitle}
                  </div>
                </td>

                <td className="px-4 py-5">
                  <Avatar
                    name={row.author.name}
                    initials={row.author.initials}
                  />
                </td>

                <td className="px-4 py-5 text-sm font-medium text-slate-500">
                  {row.estimatedReadMinutes} min
                </td>

                <td className="px-4 py-5">
                  <DraftBadge />
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
          Showing recent work in progress drafts
        </p>
        <GeneralDataPagination pagination={pagination} />
      </div>
    </div>
  );
}
