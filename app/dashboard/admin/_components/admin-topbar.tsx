"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Search, ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import NotificationsPanel from "./notifications-panel";
import { getActiveAdminLabel } from "@/app/dashboard/admin/_data/admin-nav";
import {
  getDropdownNotifications,
  markAllNotificationsRead,
} from "@/service/admin/notifications.service";
import type {
  DropdownNotificationItem,
  GetDropdownNotificationsResponse,
} from "@/types/admin/notifications.types";

export default function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeLabel = getActiveAdminLabel(pathname);

  const [openNotif, setOpenNotif] = useState(false);
  const [dropdownData, setDropdownData] =
    useState<GetDropdownNotificationsResponse | null>(null);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const notifWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!notifWrapRef.current) return;
      if (!notifWrapRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!openNotif) return;

    const fetchDropdownNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const response = await getDropdownNotifications();
        setDropdownData(response);
      } catch (error) {
        console.error("Failed to fetch dropdown notifications:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    void fetchDropdownNotifications();
  }, [openNotif]);

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingAllRead(true);
      await markAllNotificationsRead();

      setDropdownData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          unreadCount: 0,
          recentNotifications: [],
        };
      });

      setOpenNotif(false);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleViewAll = () => {
    setOpenNotif(false);

    const backendRoute = dropdownData?.viewAllRoute;
    const fixedRoute = backendRoute
      ? `/dashboard${backendRoute}`
      : "/dashboard/admin/notifications";

    router.push(fixedRoute);
  };

  const notifications: DropdownNotificationItem[] =
    dropdownData?.recentNotifications ?? [];

  const unreadCount = dropdownData?.unreadCount ?? 0;

  return (
    <header
      id="admin-topbar"
      className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur"
    >
      <div className="px-6 py-3">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">Admin</p>
            <span className="text-xs text-slate-300">/</span>
            <p className="text-xs font-medium text-slate-700">{activeLabel}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500 md:flex">
              <Search size={16} className="text-slate-400" />
              <input
                className="w-[260px] bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                placeholder="Search students, orders..."
              />
            </div>

            <div className="relative" ref={notifWrapRef}>
              <button
                type="button"
                onClick={() => setOpenNotif((value) => !value)}
                className={[
                  "relative grid h-9 w-9 place-items-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200",
                  openNotif ? "ring-2 ring-cyan-200" : "",
                ].join(" ")}
                aria-label="Notifications"
                aria-haspopup="menu"
                aria-expanded={openNotif}
              >
                <Bell size={16} />

                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>

              {openNotif && (
                <div className="absolute right-0 mt-3">
                  {isLoadingNotifications ? (
                    <div className="w-[360px] rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-500 shadow-xl">
                      Loading notifications...
                    </div>
                  ) : (
                    <NotificationsPanel
                      title={dropdownData?.title}
                      notifications={notifications}
                      onMarkAllRead={handleMarkAllRead}
                      onViewAll={handleViewAll}
                      markAllDisabled={isMarkingAllRead}
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              Visit Live Site
              <ExternalLink size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}