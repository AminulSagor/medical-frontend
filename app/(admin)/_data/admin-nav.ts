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
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders and Sales", href: "/orders-and-sales", icon: ShoppingCart },
  { label: "Blogs", href: "/blogs", icon: FileText },
  { label: "Newsletters", href: "/newsletters", icon: Mail },
  { label: "Users", href: "/users", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/setting", icon: Settings },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveAdminLabel(pathname: string) {
  const found = ADMIN_NAV.find((it) => isActivePath(pathname, it.href));
  const label = found?.label ?? "Dashboard";

  // ✅ prevent "Admin" duplication if label accidentally includes it
  return label.replace(/^Admin\s*\/\s*/i, "").trim();
}
