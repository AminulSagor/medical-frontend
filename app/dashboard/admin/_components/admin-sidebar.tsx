"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Package,
  ShoppingCart,
  FileText,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { removeToken } from "@/utils/token/cookie_utils";
import { ADMIN_NAV } from "@/app/dashboard/admin/_data/admin-nav";

type Item = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV: Item[] = [
  { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders and Sales", href: "/orders-and-sales", icon: ShoppingCart },
  { label: "Blogs", href: "/blogs", icon: FileText },
  { label: "Newsletters", href: "/newsletters", icon: Mail },
  { label: "Users", href: "/users", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // highlight exact or nested routes
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-sky-50 ring-1 ring-sky-100">
          <span className="text-sm font-bold text-sky-700">TA</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            Texas Airway
          </p>
          <p className="truncate text-xs text-slate-500">Institute Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          {ADMIN_NAV.map((it) => {
            const Icon = it.icon;
            const active = isActivePath(pathname, it.href);

            return (
              <li key={it.label}>
                <Link
                  href={it.href}
                  scroll={false}
                  onClick={(e) => {
                    if (active) {
                      e.preventDefault();
                      window.location.href = it.href;
                    }
                  }}
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

      {/* Footer user */}
      <div className="mt-auto border-t px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            onClick={() => {
              removeToken();
              router.push("/auth/sign-in");
            }}
            className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
