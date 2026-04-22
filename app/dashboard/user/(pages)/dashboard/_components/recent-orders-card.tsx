import Image from "next/image";
import Link from "next/link";
import type { DashboardRecentOrderCardItem } from "@/types/user/dashboard/dashboard.types";
import NetworkImageFallback from "@/utils/network-image-fallback";

interface RecentOrdersCardProps {
  items?: DashboardRecentOrderCardItem[];
  isLoading?: boolean;
}

export default function RecentOrdersCard({
  items = [],
  isLoading = false,
}: RecentOrdersCardProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
            <Image
              src="/icons/shopping.png"
              alt="Orders"
              width={16}
              height={16}
              className="opacity-80"
            />
          </span>

          <h2 className="text-sm font-semibold text-slate-900">Recent Orders</h2>
        </div>

        <Link
          href="/dashboard/user/order-history"
          className="text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline"
        >
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-[76px] animate-pulse rounded-xl border border-slate-200/70 bg-slate-50"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="mt-4 space-y-3">
          {items.slice(0, 3).map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
          No recent product order found.
        </div>
      )}
    </section>
  );
}

function OrderRow({ order }: { order: DashboardRecentOrderCardItem }) {
  const badge = getBadge(order.status);

  return (
    <Link
      href={order.detailsHref}
      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm transition hover:bg-slate-50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
          <NetworkImageFallback
            src={order.imageUrl}
            alt={order.title}
            className="h-full w-full object-cover"
            fallbackVariant="cover"
            fallbackClassName="h-full w-full"
            iconClassName="h-5 w-5"
          />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <div className="truncate text-[12px] font-semibold text-slate-900">
              {order.title}
            </div>
            {order.titleSuffix ? (
              <span className="shrink-0 text-[10px] font-medium text-slate-400">
                {order.titleSuffix}
              </span>
            ) : null}
          </div>
          <div className="text-[10px] text-slate-500">{order.orderNo}</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-[10px] text-slate-500">{order.date}</div>
          <div className="text-[12px] font-semibold text-slate-900">
            {order.amount}
          </div>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1",
            badge.className,
          ].join(" ")}
        >
          {order.status}
        </span>
      </div>
    </Link>
  );
}

function getBadge(status: string): { className: string } {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("process")) {
    return { className: "bg-sky-50 text-sky-700 ring-sky-200" };
  }

  if (
    normalizedStatus.includes("ship") ||
    normalizedStatus.includes("deliver") ||
    normalizedStatus.includes("paid")
  ) {
    return { className: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
  }

  if (normalizedStatus.includes("cancel")) {
    return { className: "bg-rose-50 text-rose-700 ring-rose-200" };
  }

  return { className: "bg-slate-50 text-slate-700 ring-slate-200" };
}
