"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ShoppingCart, Menu, Search, X, Heart } from "lucide-react";
import {
  AUTH_CHANGED_EVENT,
  getToken,
  getUserRole,
} from "@/utils/token/cookie_utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";
import CartSidebar from "@/components/cart-sidebar";
import WishlistSidebar from "@/components/wishlist-sidebar";
import PublicSidebar from "@/components/public-sidebar";
import NavbarSearch from "@/app/public/(pages)/home/_components/navbar-search";
import { useCart } from "@/app/public/context/cart-context";
import { useWishlist } from "@/app/public/context/wishlist-context";
import { getUserProfile } from "@/service/user/profile.service";
import UserAvatar from "@/components/common/user-avatar";
import { getRoleFromToken } from "@/utils/decode-token.utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const handleWishlistClick = () => {
    const token = getToken();

    if (!token) {
      if (typeof window !== "undefined") {
        const currentUrl =
          window.location.pathname +
          window.location.search +
          window.location.hash;

        window.sessionStorage.setItem("postLoginRedirect", currentUrl);
        window.sessionStorage.setItem("postLoginOpenWishlist", "true");
      }

      router.push("/public/auth/sign-in");
      return;
    }

    setWishlistSidebar(true);
  };

  return (
    <>
      <Suspense fallback={null}>
        <NavbarWishlistQueryHandler
          pathname={pathname}
          onOpenWishlist={() => setWishlistSidebar(true)}
        />
      </Suspense>

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

            <div className="flex flex-1 justify-center lg:hidden">
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

            <div className="hidden flex-1 lg:flex">
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

                    <span
                      className={[
                        "absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out",
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
                <button
                  type="button"
                  className={[
                    "relative grid h-10 w-10 place-items-center rounded-full",
                    "border border-light-slate/30 bg-white",
                    "hover:bg-light-slate/5 active:scale-95 transition",
                  ].join(" ")}
                  aria-label="Wishlist"
                  onClick={handleWishlistClick}
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
              <AccountAccessButton />
            </div>

            <CartSidebar
              open={cartSidebar}
              onClose={() => setCartSidebar(false)}
            />

            <WishlistSidebar
              open={wishlistSidebar}
              onClose={() => setWishlistSidebar(false)}
              onOpenCart={() => setCartSidebar(true)}
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

function NavbarWishlistQueryHandler({
  pathname,
  onOpenWishlist,
}: {
  pathname: string;
  onOpenWishlist: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldOpenWishlist = searchParams.get("openWishlist") === "true";
    const token = getToken();

    if (!shouldOpenWishlist || !token) return;

    onOpenWishlist();

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("openWishlist");

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [onOpenWishlist, pathname, router, searchParams]);

  return null;
}

function AccountAccessButton() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string | null>(null);

  const ROLE_DASHBOARD_MAP: Record<string, string> = {
    admin: "/dashboard/admin/admin-dashboard",
  };

  const handleRedirectToDashboard = () => {
    const token = getToken();
    if (!token) return;

    const role = getRoleFromToken(token);
    if (!role) return;

    const redirectPath =
      ROLE_DASHBOARD_MAP[role] || "/dashboard/user/dashboard";

    router.push(redirectPath);
  };

  useEffect(() => {
    const syncAuthState = async () => {
      const token = getToken();
      setIsAuthenticated(!!token);

      if (!token) {
        setUserName("");
        setUserImage(null);
        return;
      }

      try {
        const response = await getUserProfile();
        const data = response.data;

        setUserName(
          `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || "User",
        );
        setUserImage(data.profilePicture ?? null);
      } catch (error) {
        console.error("Failed to load navbar profile", error);
        setUserName("User");
        setUserImage(null);
      }
    };

    void syncAuthState();

    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState);
    window.addEventListener("profile-updated", syncAuthState); // ✅ added

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState);
      window.removeEventListener("profile-updated", syncAuthState); // ✅ added
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href="/public/auth/sign-in"
        className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRedirectToDashboard}
      className="relative transition active:scale-95"
    >
      <UserAvatar name={userName} imageUrl={userImage} size={34} />
      <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
    </button>
  );
}
