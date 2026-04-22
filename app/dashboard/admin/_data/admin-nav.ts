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

const ADMIN_BASE_PATH = "/dashboard/admin";

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: `${ADMIN_BASE_PATH}/admin-dashboard`,
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    href: `${ADMIN_BASE_PATH}/courses`,
    icon: BookOpen,
  },
  {
    label: "Products",
    href: `${ADMIN_BASE_PATH}/products`,
    icon: Package,
  },
  {
    label: "Orders and Sales",
    href: `${ADMIN_BASE_PATH}/orders-and-sales`,
    icon: ShoppingCart,
  },
  {
    label: "Blogs",
    href: `${ADMIN_BASE_PATH}/blogs`,
    icon: FileText,
  },
  {
    label: "Newsletters",
    href: `${ADMIN_BASE_PATH}/newsletters`,
    icon: Mail,
  },
  {
    label: "Users",
    href: `${ADMIN_BASE_PATH}/users`,
    icon: Users,
  },
  {
    label: "Analytics",
    href: `${ADMIN_BASE_PATH}/analytics`,
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: `${ADMIN_BASE_PATH}/setting`,
    icon: Settings,
  },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveAdminLabel(pathname: string) {
  const found = ADMIN_NAV.find((it) => isActivePath(pathname, it.href));
  const label = found?.label ?? "Dashboard";

  return label.replace(/^Admin\s*\/\s*/i, "").trim();
}