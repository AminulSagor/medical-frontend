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

export type NavLink = {
  label: string;
  href: string;
  showDot?: boolean;
};

export type AdminNavLink = {
  label: string;
  href: string;
  icon: React.ElementType;
};

export type UserNavKey = "dashboard" | "courses" | "orders" | "settings";

export type UserNavLink = {
  key: UserNavKey;
  label: string;
  href: string;
};

//public routes
export const NAV_LINKS: NavLink[] = [
  { label: "Courses", href: "/public/courses" },
  { label: "Store", href: "/public/store", showDot: true },
  { label: "Blogs", href: "/public/blogs" },
  { label: "About Us", href: "/public/about-us" },
  { label: "Contacts", href: "/public/contact-us" },
];

//admin routes
export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard/admin/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Courses",
    href: "/dashboard/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Products",
    href: "/dashboard/admin/products",
    icon: Package,
  },
  {
    label: "Orders and Sales",
    href: "/dashboard/admin/orders-and-sales",
    icon: ShoppingCart,
  },
  {
    label: "Blogs",
    href: "/dashboard/admin/blogs",
    icon: FileText,
  },
  {
    label: "Newsletters",
    href: "/dashboard/admin/newsletters",
    icon: Mail,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/admin/setting",
    icon: Settings,
  },
];

//user rotues
export const USER_NAV_LINKS: UserNavLink[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard/user/dashboard" },
  { key: "courses", label: "Courses", href: "/dashboard/user/course" },
  { key: "orders", label: "Orders", href: "/dashboard/user/order-history" },
  { key: "settings", label: "Settings", href: "/dashboard/user/settings" },
];
