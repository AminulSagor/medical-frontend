export type NavLink = {
  label: string;
  href: string;
  showDot?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Courses", href: "/public/courses" },
  { label: "Store", href: "/public/store", showDot: true },
  { label: "Blogs", href: "/public/blogs" },
  { label: "About Us", href: "/public/about-us" },
  { label: "Contacts", href: "/public/contact-us" },
];
