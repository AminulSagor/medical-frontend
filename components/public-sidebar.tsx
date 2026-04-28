"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  LogIn,
  ShoppingCart,
  UserPlus,
  X,
} from "lucide-react";

import NavbarLogo from "@/components/logo";
import { NAV_LINKS } from "@/constant/navigation-links";
import {
  AUTH_CHANGED_EVENT,
  getToken,
} from "@/utils/token/cookie_utils";
import { getUserProfile } from "@/service/user/profile.service";
import UserAvatar from "@/components/common/user-avatar";

function isActivePath(pathname: string, href: string) {
  if (href === "/public/home") return pathname === "/public/home";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function PublicSidebar({
  open,
  onClose,
  onOpenCart,
  cartCount = 0,
  hideCart = false,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCart: () => void;
  cartCount?: number;
  hideCart?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const syncAuthState = async () => {
      const token = getToken();
      const authenticated = !!token;

      setIsAuthenticated(authenticated);

      if (!authenticated) {
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
        console.error("Failed to load public sidebar profile", error);
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

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      <div
        className={[
          "absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

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
                </div>

                <ChevronRight size={18} className="text-light-slate" />
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="rounded-3xl border border-light-slate/15 bg-white p-3 shadow-sm">
            {!hideCart && (
              <>
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-light-slate/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-light-slate/15 bg-white">
                      <ShoppingCart size={18} className="text-black" />
                    </div>
                    <span className="text-sm font-semibold text-black">
                      Cart
                    </span>
                  </div>

                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-2 text-[12px] font-bold text-white">
                    {cartCount}
                  </span>
                </button>

                <div className="my-2 h-px w-full bg-light-slate/15" />
              </>
            )}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/dashboard/user/dashboard");
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-light-slate/5"
              >
                <div className="relative shrink-0">
                  <UserAvatar name={userName} imageUrl={userImage} size={40} />
                  <span
                    className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-primary ring-2 ring-white"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-black">
                    My Account
                  </span>
                  <span className="text-xs text-light-slate">
                    Go to dashboard
                  </span>
                </div>
              </button>
            ) : (
              <>
                <Link
                  href="/public/auth/sign-in"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-light-slate/5"
                >
                  <LogIn size={18} className="text-light-slate" />
                  <span className="text-sm font-semibold text-black">
                    Sign In
                  </span>
                </Link>

                <Link
                  href="/public/auth/sign-up"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-light-slate/5"
                >
                  <UserPlus size={18} className="text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Create Account
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}