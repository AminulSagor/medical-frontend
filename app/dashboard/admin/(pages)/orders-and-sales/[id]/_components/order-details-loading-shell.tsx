import { Package, Truck, User2, Clock3, AlertTriangle } from "lucide-react";

function SkeletonBlock({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-slate-200/70",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function CardShell({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>

      {children}
    </div>
  );
}

function OrderItemsShell() {
  return (
    <CardShell title="Order Items" icon={Package}>
      <div className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_80px_60px_80px] gap-4 border-b border-slate-200 pb-3">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="ml-auto h-3 w-10" />
          <SkeletonBlock className="ml-auto h-3 w-8" />
          <SkeletonBlock className="ml-auto h-3 w-12" />
        </div>

        {[1, 2].map((item) => (
          <div
            key={item}
            className="grid grid-cols-[minmax(0,1fr)_80px_60px_80px] items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
            </div>

            <SkeletonBlock className="ml-auto h-4 w-12" />
            <SkeletonBlock className="ml-auto h-4 w-6" />
            <SkeletonBlock className="ml-auto h-4 w-14" />
          </div>
        ))}

        <div className="border-t border-slate-200 pt-4">
          <div className="ml-auto max-w-xs space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between gap-4">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-4 w-16" />
              </div>
            ))}

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function ShippingDispatchShell() {
  return (
    <CardShell title="Shipping & Dispatch" icon={Truck}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-28 w-full rounded-2xl" />
        </div>

        <div className="border-t border-slate-200 pt-5">
          <SkeletonBlock className="mb-4 h-3 w-32" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <SkeletonBlock key={item} className="h-12 w-full rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function CustomerProfileShell() {
  return (
    <CardShell title="Customer Profile" icon={User2}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <SkeletonBlock className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>

        {[1, 2].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <SkeletonBlock className="mt-1 h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-4 w-40" />
            </div>
          </div>
        ))}

        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </CardShell>
  );
}

function EventTimelineShell() {
  return (
    <CardShell title="Event Timeline" icon={Clock3}>
      <div className="space-y-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3">
            <SkeletonBlock className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-24" />
              {item === 1 ? <SkeletonBlock className="h-3 w-40" /> : null}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function CriticalActionsShell() {
  return (
    <CardShell title="Critical Actions" icon={AlertTriangle}>
      <div className="space-y-4">
        <SkeletonBlock className="h-12 w-full rounded-full" />
        <SkeletonBlock className="mx-auto h-3 w-40" />
      </div>
    </CardShell>
  );
}

export default function OrderDetailsLoadingShell() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-9 w-9 rounded-full" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <SkeletonBlock className="h-10 w-[320px] max-w-full" />
          <SkeletonBlock className="h-4 w-52" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SkeletonBlock className="h-8 w-20 rounded-full" />
          <SkeletonBlock className="h-8 w-28 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <OrderItemsShell />
          <ShippingDispatchShell />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <CustomerProfileShell />
          <EventTimelineShell />
          <CriticalActionsShell />
        </div>
      </div>
    </div>
  );
}