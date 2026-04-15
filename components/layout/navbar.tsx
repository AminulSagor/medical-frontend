"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Menu,
  LogIn,
  UserPlus,
  Search,
  X,
  Heart,
} from "lucide-react";
import { getToken, removeToken } from "@/utils/token/cookie_utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";
import { IMAGE } from "@/constant/image-config";
import CartSidebar from "@/components/cart-sidebar";
import WishlistSidebar from "@/components/wishlist-sidebar";
import PublicSidebar from "@/components/public-sidebar";
import { LogOut, Settings } from "lucide-react";
import NavbarSearch from "@/app/public/(pages)/home/_components/navbar-search";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const [q, setQ] = useState("");
  const [cartSidebar, setCartSidebar] = useState(false);
  const [wishlistSidebar, setWishlistSidebar] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideOnScrollDown, setHideOnScrollDown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const links = useMemo(() => NAV_LINKS, []);

  const isPublicRoute =
    pathname.startsWith("/public/") || pathname.startsWith("/auth/");
  const isAuthRoute = pathname.startsWith("/auth/");

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

            <div className={`hidden lg:block ${isAuthRoute ? "" : ""}`}>
              <NavbarLogo />
            </div>

            <div className="flex-1 flex justify-center lg:hidden">
              {!isSearchOpen ? (
                <div className="lg:hidden">
                  <NavbarLogo />
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <NavbarSearch value={q} onChange={setQ} />
                </div>
              )}
            </div>

            <div className="hidden lg:flex flex-1">
              <NavbarSearch value={q} onChange={setQ} />
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={[
                "grid h-10 w-10 place-items-center rounded-full",
                "border border-light-slate/30 bg-white",
                "hover:bg-light-slate/5 active:scale-95 transition",
                "lg:hidden",
              ].join(" ")}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              {isSearchOpen ? (
                <X size={18} className="text-black" />
              ) : (
                <Search size={18} className="text-black" />
              )}
            </button>

            <nav
              className="hidden items-center gap-7 lg:flex"
              aria-label="Primary"
            >
              {links.map((link) => {
                const active = isActivePath(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "group relative flex items-center gap-2 text-sm font-semibold",
                      active ? "text-primary" : "text-light-slate",
                      "hover:text-black transition-colors",
                    ].join(" ")}
                  >
                    <span>{link.label}</span>

                    {link.showDot && (
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

            {!isAuthRoute && (
              <div className="flex items-center gap-2">
                {/* Wishlist button */}
                <button
                  type="button"
                  className={[
                    "relative grid h-10 w-10 place-items-center rounded-full",
                    "border border-light-slate/30 bg-white",
                    "hover:bg-light-slate/5 active:scale-95 transition",
                  ].join(" ")}
                  aria-label="Wishlist"
                  onClick={() => setWishlistSidebar(true)}
                >
                  <Heart size={18} className="text-black" />
                  {wishlistCount > 0 && (
                    <span
                      className={[
                        "absolute -right-0.5 -top-0.5",
                        "grid h-5 min-w-5 place-items-center rounded-full px-1",
                        "bg-red-500 text-[11px] font-bold text-white",
                      ].join(" ")}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart button */}
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
                    {totalItems}
                  </span>
                </button>
              </div>
            )}

            <div className="hidden md:block">
              <AccountAccessDropdown />
            </div>

            <CartSidebar
              open={cartSidebar}
              onClose={() => setCartSidebar(false)}
            />

            <WishlistSidebar
              open={wishlistSidebar}
              onClose={() => setWishlistSidebar(false)}
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
          cartCount={totalItems}
          hideCart={isAuthRoute}
        />
      )}
    </>
  );
}

function AccountAccessDropdown() {
  const path = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  const isDashboard =
    path === "/dashboard/user" ||
    path === "/dashboard/user/course" ||
    path === "/dashboard/user/order-history" ||
    path === "/dashboard/user/settings" ||
    path.startsWith("/dashboard/user/");

  if (!isAuthenticated) {
    return (
      <Link
        href="/public/auth/sign-in"
        className={[
          "hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
          "border-2 border-primary text-primary",
          "text-sm font-semibold",
          "hover:bg-primary hover:text-white transition-colors",
        ].join(" ")}
      >
        Sign In
      </Link>
    );
  }

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
              {isDashboard ? (
                <button
                  type="button"
                  onClick={() => {
                    removeToken();
                    setIsAuthenticated(false);
                    router.push("/public/home");
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-light-slate/5"
                >
                  <LogOut size={20} className="text-light-slate" />
                  <span className="text-base font-semibold text-black">
                    Sign Out
                  </span>
                </button>
              ) : (
                <Link
                  href="/public/auth/sign-in"
                  className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-light-slate/5"
                >
                  <LogIn size={20} className="text-light-slate" />
                  <span className="text-base font-semibold text-black">
                    Sign In
                  </span>
                </Link>
              )}

              <Link
                href={
                  isDashboard
                    ? "/dashboard/user/settings"
                    : "/public/auth/sign-up"
                }
                className="flex items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-light-slate/5"
              >
                {isDashboard ? (
                  <Settings size={20} className="text-primary" />
                ) : (
                  <UserPlus size={20} className="text-primary" />
                )}

                <span className="text-base font-semibold text-primary">
                  {isDashboard ? "Settings" : "Create Account"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
