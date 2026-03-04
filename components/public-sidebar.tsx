// components/public/public-sidebar.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LogIn,
  Menu,
  ShoppingCart,
  UserPlus,
  X,
} from "lucide-react";

import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function PublicSidebar({
  open,
  onClose,
  onOpenCart,
  cartCount = 0,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  cartCount?: number;
}) {
  const pathname = usePathname();

  // lock scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={[
        "fixed inset-0 z-[80] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        className={[
          "absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        className={[
          "absolute left-0 top-0 h-full w-[86%] max-w-[360px]",
          "bg-white",
          "border-r border-light-slate/15",
          "shadow-[20px_0_50px_rgba(0,0,0,0.12)]",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-label="Public menu"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4">
          <NavbarLogo />

          <button
            type="button"
            onClick={onClose}
            className={[
              "grid h-10 w-10 place-items-center rounded-full",
              "border border-light-slate/20 bg-white",
              "hover:bg-light-slate/5 active:scale-95 transition",
            ].join(" ")}
            aria-label="Close menu"
          >
            <X size={18} className="text-black" />
          </button>
        </div>

        {/* links */}
        <nav className="px-3" aria-label="Public primary">
          {NAV_LINKS.map((l) => {
            const active = isActivePath(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={onClose}
                className={[
                  "flex items-center justify-between",
                  "rounded-2xl px-4 py-3",
                  "transition",
                  active ? "bg-primary/10" : "hover:bg-light-slate/5",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "text-sm font-semibold",
                      active ? "text-primary" : "text-black",
                    ].join(" ")}
                  >
                    {l.label}
                  </span>

                  {l.showDot && (
                    <span
                      className="h-2 w-2 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <ChevronRight size={18} className="text-light-slate" />
              </Link>
            );
          })}
        </nav>

        {/* bottom actions */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="rounded-3xl border border-light-slate/15 bg-white p-3 shadow-sm">
            {/* cart */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 hover:bg-light-slate/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-light-slate/15 bg-white">
                  <ShoppingCart size={18} className="text-black" />
                </div>
                <span className="text-sm font-semibold text-black">Cart</span>
              </div>

              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-2 text-[12px] font-bold text-white">
                {cartCount}
              </span>
            </button>

            <div className="my-2 h-px w-full bg-light-slate/15" />

            {/* auth actions */}
            <Link
              href="#"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-light-slate/5 transition"
            >
              <LogIn size={18} className="text-light-slate" />
              <span className="text-sm font-semibold text-black">Sign In</span>
            </Link>

            <Link
              href="#"
              onClick={onClose}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-light-slate/5 transition"
            >
              <UserPlus size={18} className="text-primary" />
              <span className="text-sm font-semibold text-primary">
                Create Account
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
