"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  BookOpen,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutUser } from "@/utils/logout.utils";
import { getUserProfile } from "@/service/user/profile.service";

type NavKey = "dashboard" | "courses" | "orders" | "settings";

type Props = {
  active?: NavKey;
  onChange?: (key: NavKey) => void;

  /** optional: if you want real navigation */
  hrefs?: Partial<Record<NavKey, string>>;

  user?: {
    name: string;
    subtitle?: string;
    avatarUrl?: string;
  };

  onSignOut?: () => void;
  className?: string;

  /** optional: initial state for mobile drawer */
  defaultOpen?: boolean;
};

type SidebarUser = NonNullable<Props["user"]>;

const FALLBACK_USER: SidebarUser = {
  name: "User",
  subtitle: "--",
};

function mapProfileToSidebarUser(profile: {
  firstName?: string | null;
  lastName?: string | null;
  institutionOrHospital?: string | null;
  role?: string | null;
  title?: string | null;
  emailAddress?: string | null;
  profilePicture?: string | null;
}): SidebarUser {
  const fullName = [profile.firstName, profile.lastName]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .trim();

  return {
    name: fullName || FALLBACK_USER.name,
    subtitle:
      profile.institutionOrHospital?.trim() ||
      profile.role?.trim() ||
      profile.title?.trim() ||
      profile.emailAddress?.trim() ||
      FALLBACK_USER.subtitle,
    avatarUrl: profile.profilePicture?.trim() || undefined,
  };
}

const NAV: Array<{
  key: NavKey;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <LayoutGrid className="h-[18px] w-[18px]" />,
  },
  {
    key: "courses",
    label: "My Courses",
    icon: <BookOpen className="h-[18px] w-[18px]" />,
  },
  {
    key: "orders",
    label: "Order History",
    icon: <ShoppingBag className="h-[18px] w-[18px]" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="h-[18px] w-[18px]" />,
  },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "U";
}

export default function AccountSidebarCard({
  active = "dashboard",
  onChange,
  hrefs,
  onSignOut,
  className,
  defaultOpen = false,
  user = FALLBACK_USER,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [sidebarUser, setSidebarUser] = useState<SidebarUser>(user);

  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    let isMounted = true;

    const loadUserProfile = async () => {
      try {
        const response = await getUserProfile();

        if (!isMounted) return;

        setSidebarUser(mapProfileToSidebarUser(response.data));
      } catch (error) {
        console.error("Failed to load sidebar profile", error);
      }
    };

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSidebarUser(user);
  }, [user]);

  const renderNavItem = (
    item: (typeof NAV)[number],
    opts?: { mobile?: boolean },
  ) => {
    const isActive = item.key === active;

    const base = cx(
      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
      "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
      isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-50",
    );

    const leftBar = cx(
      "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-opacity",
      isActive
        ? "bg-sky-500 opacity-100"
        : "bg-transparent opacity-0 group-hover:opacity-30",
    );

    const iconWrap = cx(
      "grid h-9 w-9 place-items-center rounded-xl border transition",
      isActive
        ? "border-sky-200 bg-white text-sky-600"
        : "border-slate-200 bg-white text-slate-600 group-hover:bg-white",
    );

    const label = cx(
      "text-[14px] font-medium",
      isActive ? "text-sky-700" : "text-slate-800",
    );

    const content = (
      <>
        <span className={leftBar} aria-hidden="true" />
        <span className={iconWrap} aria-hidden="true">
          {item.icon}
        </span>
        <span className={label}>{item.label}</span>
      </>
    );

    const href = hrefs?.[item.key];
    const commonProps = {
      className: base,
      "aria-current": (isActive ? "page" : undefined) as "page" | undefined,
      onClick: () => {
        onChange?.(item.key);
        if (opts?.mobile) closeDrawer();
      },
    };

    if (href) {
      return (
        <Link
          key={item.key}
          href={href}
          className={base}
          aria-current={isActive ? "page" : undefined}
          onClick={() => {
            if (opts?.mobile) closeDrawer();
          }}
        >
          {content}
        </Link>
      );
    }

    return (
      <button key={item.key} type="button" {...commonProps}>
        {content}
      </button>
    );
  };

  const SidebarInner = ({ mobile }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      {/* Top: user */}
      <div className="px-4 pt-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
            {sidebarUser.avatarUrl ? (
              <img
                src={sidebarUser.avatarUrl}
                alt={sidebarUser.name}
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-600">
                {initials(sidebarUser.name)}
              </div>
            )}
          </div>

          <div className="w-full max-w-[220px]">
            <div className="truncate text-[14px] font-semibold leading-5 text-slate-900">
              {sidebarUser.name}
            </div>
            {sidebarUser.subtitle ? (
              <div className="truncate text-[12px] leading-4 text-slate-500">
                {sidebarUser.subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 h-px bg-slate-200/70" />
      </div>

      {/* Middle: nav */}
      <nav className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          {NAV.map((n) => renderNavItem(n, { mobile }))}
        </div>
      </nav>

      {/* Bottom: sign out */}
      <div className="px-3 pb-4">
        <div className="mb-3 h-px bg-slate-200/70" />

        <button
          type="button"
          onClick={() => {
            logoutUser();
            if (mobile) closeDrawer();
          }}
          className={cx(
            "flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 transition",
            "border border-slate-200 bg-white",
            "hover:bg-slate-50 hover:border-slate-300",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
          )}
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700"
            aria-hidden="true"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </span>
          <span className="text-[14px] font-medium text-slate-900">
            Sign out
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ✅ Desktop sidebar (md+) — STICKY FIX ONLY */}
      <aside
        className={cx(
          "hidden w-[240px] shrink-0 box-border md:block",
          "md:sticky md:top-0 md:h-screen",
          className,
        )}
      >
        <SidebarInner />
      </aside>

      {/* ✅ Mobile: floating open button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx(
          "fixed left-4 top-[72px] z-40 md:hidden",
          "grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm",
          "hover:bg-slate-50",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
        )}
        aria-label="Open menu"
      >
        <Menu className="h-[18px] w-[18px] text-slate-700" />
      </button>

      {/* ✅ Mobile drawer */}
      <div
        className={cx(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cx(
            "absolute inset-0 transition-opacity",
            open ? "bg-black/30 opacity-100" : "bg-black/0 opacity-0",
          )}
          onClick={closeDrawer}
          aria-label="Close menu overlay"
        />

        <div
          className={cx(
            "absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="text-[13px] font-semibold text-slate-900">Menu</div>
            <button
              type="button"
              onClick={closeDrawer}
              className={cx(
                "grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white",
                "hover:bg-slate-50",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
              )}
              aria-label="Close menu"
            >
              <X className="h-[18px] w-[18px] text-slate-700" />
            </button>
          </div>

          <div className="mt-3 h-[calc(100%-60px)]">
            <SidebarInner mobile />
          </div>
        </div>
      </div>
    </>
  );
}
