import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/public"];
const AUTH_ROUTES = ["/public/auth/sign-in", "/public/auth/sign-up"];
const ADMIN_ONLY_ROUTES = ["/dashboard/admin"];
const USER_ONLY_ROUTES = ["/dashboard/user"];
const PUBLIC_USER_ROUTES = ["/dashboard/user/ticket"];

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    ) ||
    PUBLIC_USER_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  );
}

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}

function isAdminRoute(pathname: string) {
  return ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

function isUserRoute(pathname: string) {
  return USER_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/public/home", request.url));
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  if (isPublicRoute(pathname)) {
    if (token && isAuthRoute(pathname)) {
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/dashboard/admin/admin-dashboard", request.url),
        );
      }
      return NextResponse.redirect(
        new URL("/dashboard/user/dashboard", request.url),
      );
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/public/auth/sign-in", request.url));
  }

  if (role) {
    if (isAdminRoute(pathname) && role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard/user/dashboard", request.url),
      );
    }

    if (isUserRoute(pathname) && role !== "user") {
      return NextResponse.redirect(
        new URL("/dashboard/admin/admin-dashboard", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
