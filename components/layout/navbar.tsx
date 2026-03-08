// app/(user)/(not-register)/public/_components/navbar.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Menu, LogIn, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";
import NavbarSearch from "@/app/(user)/(not-register)/public/(pages)/home/_components/navbar-search";
import { IMAGE } from "@/constant/image-config";
import CartSidebar from "@/components/cart-sidebar";
import PublicSidebar from "@/components/public-sidebar";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();

  const [q, setQ] = useState("");
  const [cartSidebar, setCartSidebar] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideOnScrollDown, setHideOnScrollDown] = useState(false);

  const links = useMemo(() => NAV_LINKS, []);

  const isPublicRoute = pathname.startsWith("/public/");

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsScrolled(currentY > 16);

      if (currentY > lastY && currentY > 90) {
        setHideOnScrollDown(true);
      } else {
        setHideOnScrollDown(false);
      }

      lastY = currentY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        animate={{
          y: hideOnScrollDown ? -6 : 0,
          opacity: 1,
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full"
      >
        <div className="mx-auto w-full">
          <motion.div
            animate={{
              scale: isScrolled ? 0.988 : 1,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={[
              "flex items-center gap-2 md:gap-6",
              "rounded-full bg-white",
              "px-2 md:px-5",
              isScrolled
                ? "py-2 md:py-2.5 shadow-md backdrop-blur-md"
                : "py-2 md:py-3 shadow-sm",
            ].join(" ")}
          >
            {isPublicRoute && (
              <button
                type="button"
                onClick={() => setMobileSidebar(true)}
                className={[
                  "grid h-10 w-10 place-items-center rounded-full",
                  "border border-light-slate/30 bg-white",
                  "hover:bg-light-slate/5 active:scale-95 transition",
                  "lg:hidden",
                ].join(" ")}
                aria-label="Open menu"
              >
                <Menu size={18} className="text-black" />
              </button>
            )}

            <div className="hidden lg:block">
              <NavbarLogo />
            </div>

            <div className="flex-1">
              <NavbarSearch value={q} onChange={setQ} />
            </div>

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
                      "group relative flex items-center gap-2 text-sm font-semibold",
                      active ? "text-primary" : "text-light-slate",
                      "hover:text-black transition-colors",
                    ].join(" ")}
                  >
                    <span>{l.label}</span>

                    {l.showDot && (
                      <span
                        className="absolute top-0 -right-3 h-2 w-2 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className={[
                        "absolute left-0 -bottom-1 h-[2px] w-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out",
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className={[
                "relative grid h-10 w-10 place-items-center rounded-full",
                "border border-light-slate/30 bg-white",
                "hover:bg-light-slate/5 active:scale-95 transition",
              ].join(" ")}
              aria-label="Cart"
              onClick={() => setCartSidebar(true)}
            >
              <ShoppingCart size={18} className="text-black" />
              <span
                className={[
                  "absolute -right-0.5 -top-0.5",
                  "grid h-5 min-w-5 place-items-center rounded-full px-1",
                  "bg-primary text-[11px] font-bold text-white",
                ].join(" ")}
              >
                2
              </span>
            </button>

            <div className="hidden md:block">
              <AccountAccessDropdown />
            </div>

            <CartSidebar
              open={cartSidebar}
              onClose={() => setCartSidebar(false)}
            />
          </motion.div>
        </div>
      </motion.header>

      {isPublicRoute && (
        <PublicSidebar
          open={mobileSidebar}
          onClose={() => setMobileSidebar(false)}
          onOpenCart={() => {
            setMobileSidebar(false);
            setCartSidebar(true);
          }}
          cartCount={2}
        />
      )}
    </>
  );
}

function AccountAccessDropdown() {
  return (
    <div className="relative hidden md:block">
      <div className="group relative">
        <button
          type="button"
          className={[
            "relative h-10 w-10 overflow-hidden rounded-full",
            "border border-light-slate/30 bg-light-slate/15",
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

          <span
            className="absolute right-0.5 bottom-0.5 h-3 w-3 rounded-full bg-primary ring-2 ring-white"
            aria-hidden="true"
          />
        </button>

        <div
          className={[
            "pointer-events-none translate-y-2 opacity-0",
            "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
            "absolute right-0 top-[calc(100%+12px)] z-50",
            "w-[320px]",
            "transition-all duration-150 ease-out",
          ].join(" ")}
        >
          <div className="absolute -top-6 right-3 h-18 w-24" />

          <div className="overflow-hidden rounded-3xl border border-light-slate/15 bg-white shadow-xl">
            <div className="px-7 py-5">
              <p className="text-xs font-semibold text-light-slate/50">
                ACCOUNT ACCESS
              </p>
            </div>

            <div className="h-px w-full bg-light-slate/15" />

            <div className="p-4">
              <Link
                href="#"
                className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-light-slate/5"
              >
                <LogIn size={20} className="text-light-slate" />
                <span className="text-base font-semibold text-black">
                  Sign In
                </span>
              </Link>

              <Link
                href="#"
                className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-light-slate/5"
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
