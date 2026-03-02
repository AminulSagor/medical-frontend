"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";
import NavbarSearch from "@/app/(user)/(not-register)/public/(pages)/home/_components/navbar-search";
import Link from "next/link";
import Image from "next/image";
import { LogIn, UserPlus } from "lucide-react";
import { IMAGE } from "@/constant/image-config";
import CartSidebar from "@/components/cart-sidebar";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [cartSidebar, setCartSidebar] = useState<boolean>(false);

  const links = useMemo(() => NAV_LINKS, []);

  return (
    <header className="w-full">
      <div className="mx-auto w-full">
        <div
          className={[
            "flex items-center gap-2 md:gap-6",
            "rounded-full bg-white",
            "shadow-sm",
            "px-2 md:px-5 py-2 md:py-3",
          ].join(" ")}
        >
          {/* logo */}
          <NavbarLogo />

          {/* search */}
          <div className="flex-1">
            <NavbarSearch value={q} onChange={setQ} />
          </div>

          {/* nav links */}
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary"
          >
            {links.map((l) => {
              const active = isActivePath(pathname, l.href);

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "relative flex items-center gap-2 text-sm font-semibold",
                    active ? "text-primary" : "text-light-slate",
                    "hover:text-black transition-colors",
                  ].join(" ")}
                >
                  <span>{l.label}</span>

                  {l.showDot && (
                    <span
                      className="h-2 w-2 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* right: icons */}
          <div className="flex items-center gap-4">
            {/* cart */}
            <button
              type="button"
              className={[
                "relative grid h-10 w-10 place-items-center rounded-full",
                "border border-light-slate/30 bg-white",
                "hover:bg-(--light-slate)/10 active:scale-95 transition",
                "hidden md:block",
              ].join(" ")}
              aria-label="Cart"
              onClick={() => setCartSidebar(true)}
            >
              <ShoppingCart size={18} className="text-black" />
              <span
                className={[
                  "absolute -right-0.5 -top-0.5",
                  "grid h-5 min-w-5 place-items-center rounded-full px-1",
                  "bg-primary text-white text-[11px] font-bold",
                ].join(" ")}
              >
                2
              </span>
            </button>
            {/* avatar */}
            <AccountAccessDropdown />
            {/* cart sidebar */}
            <CartSidebar
              open={cartSidebar}
              onClose={() => setCartSidebar(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

//dropdown
function AccountAccessDropdown() {
  return (
    <div className="relative hidden md:block">
      <div className="group relative">
        {/* avatar */}
        <button
          type="button"
          className={[
            "relative h-10 w-10 rounded-full",
            "border border-light-slate/30 bg-light-slate/15",
            "overflow-hidden",
          ].join(" ")}
          aria-label="Profile"
        >
          <Image
            src={IMAGE.user}
            alt="User"
            fill
            sizes="40px"
            className="object-cover"
            priority
          />

          {/* online dot */}
          <span
            className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-primary ring-2 ring-white"
            aria-hidden="true"
          />
        </button>

        {/* dropdown */}
        <div
          className={[
            "pointer-events-none opacity-0 translate-y-2",
            "group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-150 ease-out",
            "absolute right-0 top-[calc(100%+12px)] z-50",
            "w-[320px]",
          ].join(" ")}
        >
          {/* hover bridge */}
          <div className="absolute -top-6 right-3 h-18 w-24" />

          <div className="rounded-3xl border border-light-slate/15 bg-white shadow-xl overflow-hidden">
            <div className="px-7 py-5">
              <p className="text-xs font-semibold text-light-slate/50">
                ACCOUNT ACCESS
              </p>
            </div>

            <div className="h-px w-full bg-light-slate/15" />

            <div className="p-4">
              <Link
                href="#"
                className="flex items-center gap-4 rounded-2xl px-4 py-4 hover:bg-light-slate/5 transition"
              >
                <LogIn size={20} className="text-light-slate" />
                <span className="text-base font-semibold text-black">
                  Sign In
                </span>
              </Link>

              <Link
                href="#"
                className="flex items-center gap-4 rounded-2xl px-4 py-4 hover:bg-light-slate/5 transition"
              >
                <UserPlus size={20} className="text-primary" />
                <span className="text-base font-semibold text-primary">
                  Create Account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
