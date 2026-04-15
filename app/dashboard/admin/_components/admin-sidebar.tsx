"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/constant/navigation-links";
import { logoutUser } from "@/utils/logout.utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-sky-50 ring-1 ring-sky-100">
            <span className="text-sm font-bold text-sky-700">TA</span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              Texas Airway
            </p>
            <p className="truncate text-xs text-slate-500">Institute Admin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="px-3 py-2">
        <ul className="space-y-1">
          {ADMIN_NAV_LINKS.map((it) => {
            const Icon = it.icon;
            const active = isActivePath(pathname, it.href);

            return (
              <li key={it.label}>
                <Link
                  href={it.href}
                  scroll={false}
                  onClick={() => onClose?.()}
                  className={[
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                    active
                      ? "bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  <Icon size={16} />
                  <span className="truncate">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-slate-200">
              <Image
                src="/photos/image.png"
                alt="Admin"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Dr. Farah
              </p>
              <p className="truncate text-xs text-slate-500">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logoutUser()}
            className="grid h-9 w-9 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
