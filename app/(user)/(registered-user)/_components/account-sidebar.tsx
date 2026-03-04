"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, BookOpen, ShoppingBag, Settings, LogOut } from "lucide-react";

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
};

const NAV: Array<{
    key: NavKey;
    label: string;
    icon: React.ReactNode;
}> = [
        { key: "dashboard", label: "Dashboard", icon: <LayoutGrid className="h-[18px] w-[18px]" /> },
        { key: "courses", label: "My Courses", icon: <BookOpen className="h-[18px] w-[18px]" /> },
        { key: "orders", label: "Order History", icon: <ShoppingBag className="h-[18px] w-[18px]" /> },
        { key: "settings", label: "Settings", icon: <Settings className="h-[18px] w-[18px]" /> },
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
    user = {
        name: "Dr. Sarah Thompson",
        subtitle: "Texas Airway Institute",
    },
}: Props) {
    const renderNavItem = (item: (typeof NAV)[number]) => {
        const isActive = item.key === active;

        const base = cx(
            "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
            "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100",
            isActive ? "bg-sky-50 text-sky-700" : "text-slate-700 hover:bg-slate-100"
        );

        const leftBar = cx(
            "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-opacity",
            isActive ? "bg-sky-500 opacity-100" : "bg-transparent opacity-0 group-hover:opacity-30"
        );

        const iconWrap = cx(
            "grid h-9 w-9 place-items-center rounded-xl border transition",
            isActive
                ? "border-sky-200 bg-white text-sky-600"
                : "border-slate-200 bg-white text-slate-600 group-hover:bg-white"
        );

        const label = cx("text-[14px] font-medium", isActive ? "text-sky-700" : "text-slate-800");

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
        if (href) {
            return (
                <Link
                    key={item.key}
                    href={href}
                    className={base}
                    aria-current={isActive ? "page" : undefined}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                key={item.key}
                type="button"
                onClick={() => onChange?.(item.key)}
                className={base}
                aria-current={isActive ? "page" : undefined}
            >
                {content}
            </button>
        );
    };

    return (
        // ✅ full height, no inner sticky needed (layout already handles sticky)
        <aside className={cx("h-full w-[240px] shrink-0 box-border", className)}>


            <div className="flex h-full flex-col border-r border-slate-200 bg-white">
                {/* Top: user */}
                <div className="px-4 pt-5">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                    sizes="44px"
                                    priority
                                />
                            ) : (
                                <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-600">
                                    {initials(user.name)}
                                </div>
                            )}
                        </div>

                        <div className="w-full max-w-[220px]">
                            <div className="truncate text-[14px] font-semibold leading-5 text-slate-900">
                                {user.name}
                            </div>
                            {user.subtitle ? (
                                <div className="truncate text-[12px] leading-4 text-slate-500">
                                    {user.subtitle}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-4 h-px bg-slate-200/70" />
                </div>

                {/* Middle: nav (fills) */}
                <nav className="flex-1 overflow-auto px-3 py-4">
                    <div className="space-y-1">{NAV.map(renderNavItem)}</div>
                </nav>

                {/* Bottom: sign out */}
                <div className="px-3 pb-4">
                    <div className="mb-3 h-px bg-slate-200/70" />

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={onSignOut}
                            className={cx(
                                "flex w-full items-center justify-center gap-3 rounded-xl px-3 py-2.5 transition",
                                "border border-slate-200 bg-white",
                                "hover:bg-slate-100 hover:border-slate-300",
                                "focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                            )}
                        >
                            <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700">
                                <LogOut className="h-[18px] w-[18px]" />
                            </span>

                            <span className="text-[14px] font-medium text-slate-900">Sign out</span>
                        </button>

                    </div>
                </div>

            </div>
        </aside>
    );
}
