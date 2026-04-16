"use client";

import Image from "next/image";
import { BookOpen, ShoppingCart, CloudCheck } from "lucide-react";

import type { DropdownNotificationItem } from "@/types/admin/notifications.types";
import Link from "next/link";

function IconBox({
  type,
  avatarUrl,
}: {
  type: DropdownNotificationItem["type"];
  avatarUrl?: string;
}) {
  const base = "grid h-11 w-11 place-items-center rounded-xl ring-1";

  if (type === "course") {
    return (
      <div
        className={`${base} bg-emerald-50 ring-emerald-100 text-emerald-600`}
      >
        <BookOpen size={18} />
      </div>
    );
  }

  if (type === "order") {
    return (
      <div className={`${base} bg-sky-50 ring-sky-100 text-sky-600`}>
        <ShoppingCart size={18} />
      </div>
    );
  }

  if (type === "system") {
    return (
      <div className={`${base} bg-slate-50 ring-slate-200 text-slate-600`}>
        <CloudCheck size={18} />
      </div>
    );
  }

  return (
    <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-slate-200">
      <Image
        src={avatarUrl || "/photos/image.png"}
        alt="Notification avatar"
        fill
        className="object-cover"
      />
      <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
    </div>
  );
}

export default function NotificationsPanel({
  title,
  notifications,
  onMarkAllRead,
  onViewAll,
  markAllDisabled = false,
}: {
  title?: string;
  notifications: DropdownNotificationItem[];
  onMarkAllRead?: () => void | Promise<void>;
  onViewAll?: () => void;
  markAllDisabled?: boolean;
}) {
  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          {title ?? "Notifications"}
        </p>

        <button
          disabled
          type="button"
          onClick={onMarkAllRead}
          //   disabled={markAllDisabled}
          className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[420px] overflow-auto">
        {notifications.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-slate-400">
            No notifications
          </p>
        ) : (
          notifications.map((notification, idx) => (
            <div
              key={notification.id}
              className={[
                "flex gap-4 px-5 py-4",
                idx !== notifications.length - 1
                  ? "border-b border-slate-100"
                  : "",
              ].join(" ")}
            >
              <IconBox
                type={notification.type}
                avatarUrl={notification.avatarUrl}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {notification.title}
                  </p>
                  <p className="shrink-0 text-xs text-slate-400">
                    {notification.time}
                  </p>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-100 p-4 w-full">
        <button className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]">
          <Link href="/dashboard/admin/notifications">
            View All Notifications
          </Link>
        </button>
      </div>
    </div>
  );
}
