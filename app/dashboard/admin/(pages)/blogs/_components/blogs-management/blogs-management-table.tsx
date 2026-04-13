"use client";

import { Eye, Pencil, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import type {
  BlogManagementPostStatus,
  BlogManagementRow,
} from "@/types/admin/blogs/blog.types";
import { IMAGE } from "@/constant/image-config";
import { deleteBlogPost } from "@/service/admin/blogs/delete.blog.list";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary bg-white px-2.5 py-1 text-[11px] font-semibold text-primary">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: BlogManagementPostStatus }) {
  if (status === "Published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Published
      </span>
    );
  }

  if (status === "Draft") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-50)] px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-hover)] ring-1 ring-cyan-100">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
      Scheduled
    </span>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cx(
        "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400",
        className,
      )}
    >
      {children}
    </th>
  );
}

function IconAction({
  children,
  label,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        "grid h-9 w-9 place-items-center rounded-md border border-transparent transition",
        danger
          ? "text-rose-500 hover:bg-rose-50"
          : "hover:bg-slate-100 hover:text-slate-700",
      )}
    >
      {children}
    </button>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "grid h-9 w-9 place-items-center rounded-md border text-xs font-semibold transition",
        active
          ? "border-cyan-100 bg-[var(--primary)] text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        disabled && "opacity-50 hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

type BlogsManagementTableProps = {
  rows: BlogManagementRow[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  filteredCount: number;
  pageSize: number;
};

export default function BlogsManagementTable({
  rows,
  page,
  setPage,
  totalPages,
  filteredCount,
  pageSize,
}: BlogsManagementTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const visibleRows = useMemo(() => {
    return rows.filter((row) => !deletedIds.includes(row.id));
  }, [rows, deletedIds]);

  const effectiveFilteredCount = Math.max(filteredCount - deletedIds.length, 0);
  const effectiveTotalPages = Math.max(
    1,
    Math.ceil(effectiveFilteredCount / pageSize),
  );

  const handleView = useCallback(
    (blogPostId: string) => {
      router.push(`/dashboard/admin/blogs/live/${blogPostId}`);
    },
    [router],
  );

  const handleEdit = useCallback(
    (blogPostId: string) => {
      router.push(`/dashboard/admin/blogs/edit/${blogPostId}`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (blogPostId: string) => {
      if (deletingId) return;

      try {
        setDeletingId(blogPostId);

        await deleteBlogPost(blogPostId);

        setDeletedIds((prev) => {
          if (prev.includes(blogPostId)) return prev;

          const next = [...prev, blogPostId];
          const nextFilteredCount = Math.max(filteredCount - next.length, 0);
          const nextTotalPages = Math.max(
            1,
            Math.ceil(nextFilteredCount / pageSize),
          );

          if (page > nextTotalPages) {
            setPage(nextTotalPages);
          }

          return next;
        });

        router.refresh();
      } catch (error) {
        console.error("Failed to delete blog post:", error);
        window.alert("Failed to delete the article. Please try again.");
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, filteredCount, page, pageSize, router, setPage],
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-t border-slate-200 bg-slate-50">
              <Th className="pl-5">Article</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Views</Th>
              <Th className="pr-5 text-right">Actions</Th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((r) => (
                <tr key={r.id} className="border-t border-slate-200">
                  <td className="py-4 pl-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                        <img
                          src={r.thumbSrc || IMAGE.fallbackImage}
                          alt={r.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {r.title}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {r.author}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <Pill>{r.category}</Pill>
                  </td>

                  <td className="py-4">
                    <StatusBadge status={r.status} />
                  </td>

                  <td className="py-4 text-xs text-slate-500">{r.dateLabel}</td>

                  <td className="py-4 pr-4 text-center text-sm font-semibold text-slate-900">
                    {typeof r.views === "number"
                      ? r.views.toLocaleString()
                      : "—"}
                  </td>

                  <td className="py-4 pr-5">
                    <div className="flex items-center justify-end gap-2 text-slate-500">
                      <IconAction label="Share">
                        <Share2 size={16} />
                      </IconAction>

                      <IconAction label="View" onClick={() => handleView(r.id)}>
                        <Eye size={16} />
                      </IconAction>

                      <IconAction label="Edit" onClick={() => handleEdit(r.id)}>
                        <Pencil size={16} />
                      </IconAction>

                      <IconAction
                        label="Delete"
                        danger
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 size={16} />
                      </IconAction>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-200">
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {effectiveFilteredCount === 0 ? 0 : (page - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700">
            {Math.min(page * pageSize, effectiveFilteredCount)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {effectiveFilteredCount}
          </span>{" "}
          articles
        </p>

        <div className="flex items-center justify-end gap-1">
          <PageBtn disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ‹
          </PageBtn>

          {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map(
            (n) => (
              <PageBtn key={n} active={n === page} onClick={() => setPage(n)}>
                {n}
              </PageBtn>
            ),
          )}

          <PageBtn
            disabled={page >= effectiveTotalPages}
            onClick={() => setPage(page + 1)}
          >
            ›
          </PageBtn>
        </div>
      </div>
    </>
  );
}
