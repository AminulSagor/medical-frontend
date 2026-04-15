"use client";

import Image from "next/image";
import {
  Eye,
  Pencil,
  MoreVertical,
  GraduationCap,
  UserRound,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { UserTabKey } from "./users-tabs";

export type UserStatus = "active" | "inactive";
export type UserRole = "Student" | "Instructor" | "Admin";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credential: string;
  status: UserStatus;
  courses: number;
  joined: string;
  profilePhoto?: string | null;
};

function RoleBadge({ role }: { role: UserRole }) {
  const cfg =
    role === "Instructor"
      ? {
          cls: "bg-purple-50 text-purple-700 ring-1 ring-purple-100",
          Icon: GraduationCap,
        }
      : role === "Student"
        ? {
            cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
            Icon: UserRound,
          }
        : { cls: "bg-slate-900 text-white", Icon: Shield };

  const Icon = cfg.Icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        cfg.cls,
      ].join(" ")}
    >
      <Icon size={12} />
      {role.toUpperCase()}
    </span>
  );
}

function StatusCell({ status }: { status: UserStatus }) {
  const active = status === "active";

  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-emerald-500" : "bg-slate-400",
        ].join(" ")}
      />
      <span className={active ? "text-slate-800" : "text-slate-600"}>
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function CoursesPill({ n }: { n: number }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
      {n}
    </span>
  );
}

function getVisiblePages(
  page: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const nearStart = page <= 3;
  const nearEnd = page >= totalPages - 2;

  if (nearStart) return [1, 2, 3, "...", totalPages];
  if (nearEnd) return [1, "...", totalPages - 2, totalPages - 1, totalPages];

  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className={[
          "grid h-9 w-9 place-items-center rounded-full transition",
          canPrev
            ? "bg-white text-slate-600 hover:bg-slate-50"
            : "cursor-not-allowed text-slate-300",
        ].join(" ")}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-1 text-sm text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={[
              "grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-semibold transition",
              p === page
                ? "bg-[var(--primary)] text-white"
                : "text-slate-600 hover:bg-slate-100",
            ].join(" ")}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className={[
          "grid h-9 w-9 place-items-center rounded-full transition",
          canNext
            ? "bg-white text-slate-600 hover:bg-slate-50"
            : "cursor-not-allowed text-slate-300",
        ].join(" ")}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default function UsersTable({
  items,
  tab,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  isLoading = false,
}: {
  items: UserRow[];
  tab: UserTabKey;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  isLoading?: boolean;
}) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="pt-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">USER IDENTITY</th>
              <th className="py-3">ROLE</th>
              <th className="py-3">CREDENTIAL</th>
              <th className="py-3">STATUS</th>
              <th className="py-3">COURSES</th>
              <th className="py-3">JOINED</th>
              {/* <th className="py-3 pr-5 text-right">ACTIONS</th> */}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              items.map((u) => (
                <tr key={u.id} className="border-b border-slate-200">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200">
                        <Image
                          src={u.profilePhoto || "/photos/image.png"}
                          alt={u.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {u.name}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <RoleBadge role={u.role} />
                  </td>

                  <td className="py-4 text-sm text-slate-700">
                    {u.credential}
                  </td>

                  <td className="py-4">
                    <StatusCell status={u.status} />
                  </td>

                  <td className="py-4">
                    <CoursesPill n={u.courses} />
                  </td>

                  <td className="py-4 text-sm text-slate-700">{u.joined}</td>

                  {/* <td className="py-4 pr-5">
                    <div className="flex items-center justify-end gap-6 text-slate-600">
                      <button
                        type="button"
                        onClick={() => onView(u.id)}
                        className="transition hover:text-slate-900"
                        aria-label="View"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(u.id)}
                        className="transition hover:text-slate-900"
                        aria-label="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        className="transition hover:text-slate-900"
                        aria-label="More"
                        onClick={() => console.log("more", { id: u.id, tab })}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-xs text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {from}-{to}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {totalItems.toLocaleString()}
          </span>{" "}
          users
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
