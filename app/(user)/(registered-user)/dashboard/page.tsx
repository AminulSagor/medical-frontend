// app/(user)/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "My Courses", icon: BookOpen, href: "/my-courses" },
  { label: "My Orders", icon: ShoppingBag, href: "/orders" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const enrollments = [
  {
    title: "Advanced Airway Management",
    desc: "Dr. Maria S. • 12 Modules • CME Eligible",
    badge: "Active",
    cta: "View syllabus",
    img: "/photos/image.png", // replace with your course banner
  },
  {
    title: "Pediatric Anesthesia Updates",
    desc: "Dr. Paul F. • 8 Modules • New",
    badge: "In Review",
    cta: "Start learning",
    img: "/photos/image.png",
  },
];

const orders = [
  { title: "Laryngoscope Blade Set", date: "May 12, 2026", price: "$72.00", status: "Shipping" },
  { title: "Ultrasonic Cartilage Kit", date: "May 06, 2026", price: "$38.00", status: "Paid" },
  { title: "Clinical Anesthesia Guide (E)", date: "Feb 23, 2026", price: "$19.00", status: "Success" },
];

const activity = [
  { title: "Order placed: Laryngoscope Blade", status: "Shipped" },
  { title: "Course completed: Airway Basics", status: "Completed" },
  { title: "New certificate available", status: "Ready" },
];

function Pill({ children, tone = "sky" }: { children: React.ReactNode; tone?: "sky" | "emerald" | "amber" | "slate" }) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-100"
      : tone === "slate"
      ? "bg-slate-100 text-slate-700 ring-slate-200"
      : "bg-sky-50 text-sky-700 ring-sky-100";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${cls}`}>
      {children}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
        {/* SIDEBAR */}
        <aside className="hidden w-[260px] shrink-0 md:block">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-slate-200">
                {/* replace with your real avatar */}
                <Image src="/photos/image.png" alt="Profile" fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">Dr. Sarah Thompson</div>
                <div className="truncate text-xs text-slate-500">Texas Airway Institute</div>
              </div>
            </div>

            <div className="mt-5 h-px w-full bg-slate-100" />

            {/* Nav */}
            <nav className="mt-4 space-y-1">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                      item.active
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                        : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid h-9 w-9 place-items-center rounded-2xl",
                        item.active ? "bg-white ring-1 ring-sky-100" : "bg-slate-50 ring-1 ring-slate-100",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 h-px w-full bg-slate-100" />

            <button className="mt-4 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </span>
              <span className="text-slate-400">↩</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="text-lg font-semibold text-slate-900">Texas Airway</div>
              <Pill tone="slate">INSTITUTE</Pill>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden w-[340px] md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search courses, products, or tutorials..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <button className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                <Bell className="h-5 w-5" />
              </button>

              <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <User className="h-4 w-4" />
                Sarah
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Hero */}
          <section className="mt-5">
            <div className="relative overflow-hidden rounded-3xl bg-sky-500 px-6 py-7 text-white shadow-[0_18px_55px_rgba(2,132,199,0.25)]">
              <div className="max-w-[560px]">
                <div className="text-2xl font-bold">Welcome back, Sarah</div>
                <div className="mt-1 text-sm text-white/85">
                  Your clinical journey continues. You’re making great progress this week.
                </div>
              </div>

              {/* soft background blobs */}
              <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
              <div className="pointer-events-none absolute right-10 top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
            </div>

            {/* Stats cards (overlap like screenshot) */}
            <div className="-mt-6 grid gap-4 px-2 sm:grid-cols-3">
              <StatCard icon={<BookOpen className="h-5 w-5 text-sky-600" />} label="ENROLLED COURSES" value="12.0" />
              <StatCard icon={<Users className="h-5 w-5 text-sky-600" />} label="COMMUNITY" value="3" />
              <StatCard icon={<Calendar className="h-5 w-5 text-sky-600" />} label="NEXT CLASS" value="Mar 12" />
            </div>
          </section>

          {/* Current enrollments */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">Current Enrollments</div>
              <Link href="#" className="text-xs font-semibold text-sky-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {enrollments.map((c) => (
                <div
                  key={c.title}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="relative h-36 w-full bg-slate-100">
                    {/* Replace with real course banners */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                    <div className="absolute inset-0 opacity-60">
                      <Image src={c.img} alt="" fill className="object-cover opacity-40" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{c.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{c.desc}</div>
                      </div>
                      <Pill tone={c.badge === "Active" ? "emerald" : "amber"}>{c.badge}</Pill>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button className="inline-flex h-10 items-center justify-center rounded-2xl bg-sky-50 px-4 text-xs font-semibold text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100">
                        {c.cta}
                      </button>
                      <button className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-50 px-4 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100">
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lists */}
          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {/* Recent Orders */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Recent Orders</div>
                <Link href="#" className="text-xs font-semibold text-sky-600 hover:underline">
                  View all
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {orders.map((o) => (
                  <div key={o.title} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{o.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{o.date}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-sm font-semibold text-slate-900">{o.price}</div>
                      <Pill tone={o.status === "Paid" || o.status === "Success" ? "emerald" : "amber"}>{o.status}</Pill>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Recent Activity</div>
                <Link href="#" className="text-xs font-semibold text-sky-600 hover:underline">
                  View all
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {activity.map((a) => (
                  <div key={a.title} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white ring-1 ring-slate-200">
                        <LayoutDashboard className="h-4 w-4 text-slate-600" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{a.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{a.status}</div>
                      </div>
                    </div>
                    <span className="text-slate-400">›</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile nav (optional) */}
          <div className="mt-6 md:hidden">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="grid grid-cols-4 gap-2">
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={[
                        "grid place-items-center rounded-2xl py-3 text-xs font-semibold",
                        item.active ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100" : "bg-slate-50 text-slate-700 ring-1 ring-slate-100",
                      ].join(" ")}
                    >
                      <Icon className="mb-1 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 ring-1 ring-sky-100">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-widest text-slate-400">
            {label}
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
