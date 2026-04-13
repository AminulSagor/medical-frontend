import Link from "next/link";
import {
  ArrowLeft,
  Download,
  PackageCheck,
  ClipboardList,
  Boxes,
  MapPin,
} from "lucide-react";

type StepKey = "Ordered" | "Processing" | "Shipped" | "Delivered";

type TimelineStep = {
  key: StepKey;
  date?: string;
};

type OrderDetailsHeaderProps = {
  backHref?: string;
  orderNo?: string;
  placedOn?: string;

  statusLabel?: string;
  carrier?: string;
  trackingNo?: string;
  etaLabel?: string;

  activeStep?: StepKey;
  timelineSteps?: TimelineStep[];

  showReorder?: boolean;
  onDownloadInvoice?: () => void;
  onReorder?: () => void;
};

export default function OrderDetailsHeader({
  backHref = "/order-history",
  orderNo = "ORD-8829",
  placedOn = "October 24, 2026",
  statusLabel = "Order Received",
  carrier = "Not Assigned",
  trackingNo = "—",
  etaLabel = "Pending Shipment",
  activeStep = "Ordered",
  timelineSteps = [],
  showReorder = false,
  onDownloadInvoice,
  onReorder,
}: OrderDetailsHeaderProps) {
  return (
    <section className="mb-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Order History
      </Link>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Order <span className="text-slate-900">#{orderNo}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Placed on <span className="text-sky-600">{placedOn}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownloadInvoice}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Download Invoice
          </button>

          {showReorder ? (
            <button
              type="button"
              onClick={onReorder}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
            >
              <Boxes className="h-4 w-4 text-white" />
              Reorder All
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-slate-600">
            Status:{" "}
            <span className="ml-1 font-semibold text-sky-600">
              {statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MiniInfo
              icon={<Boxes className="h-4 w-4" />}
              label="CARRIER"
              value={carrier}
            />
            <MiniInfo
              icon={<ClipboardList className="h-4 w-4" />}
              label="TRACKING NUMBER"
              value={trackingNo}
            />
            <MiniInfo
              icon={<MapPin className="h-4 w-4" />}
              label="ESTIMATED DELIVERY"
              value={etaLabel}
            />
          </div>
        </div>

        <div className="my-5 h-px bg-slate-200/70" />

        <div className="mb-5 mt-14">
          <OrderTimeline
            activeStep={activeStep}
            timelineSteps={timelineSteps}
          />
        </div>
      </div>
    </section>
  );
}

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="leading-tight">
        <div className="text-[9px] font-semibold tracking-wider text-slate-400">
          {label}
        </div>
        <div className="text-[11px] font-semibold text-slate-700">{value}</div>
      </div>
    </div>
  );
}

function OrderTimeline({
  activeStep,
  timelineSteps,
}: {
  activeStep: StepKey;
  timelineSteps: TimelineStep[];
}) {
  const fallbackDates: Record<StepKey, string> = {
    Ordered: "—",
    Processing: "—",
    Shipped: "—",
    Delivered: "—",
  };

  const apiDates = timelineSteps.reduce<Record<StepKey, string>>(
    (acc, step) => {
      acc[step.key] = step.date || "—";
      return acc;
    },
    { ...fallbackDates },
  );

  const steps: { key: StepKey; icon: React.ReactNode; sub: string }[] = [
    {
      key: "Ordered",
      icon: <PackageCheck className="h-4 w-4" />,
      sub: apiDates.Ordered,
    },
    {
      key: "Processing",
      icon: <Boxes className="h-4 w-4" />,
      sub: apiDates.Processing,
    },
    {
      key: "Shipped",
      icon: <Boxes className="h-4 w-4" />,
      sub: apiDates.Shipped,
    },
    {
      key: "Delivered",
      icon: <PackageCheck className="h-4 w-4" />,
      sub: apiDates.Delivered,
    },
  ];

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === activeStep),
  );
  const progressPct =
    activeIndex <= 0 ? 0 : (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative pt-0.5">
      <div className="absolute left-0 right-0 top-[20px] z-0 px-[calc(12.5%-20px)]">
        <div className="h-[2px] w-full bg-slate-200" />
        <div
          className="h-[2px] bg-sky-500"
          style={{
            width: `${progressPct}%`,
            marginTop: "-2px",
          }}
        />
      </div>

      <div className="relative z-10 grid grid-cols-4 gap-2">
        {steps.map((s, idx) => {
          const done = idx <= activeIndex;

          return (
            <div key={s.key} className="flex flex-col items-center text-center">
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full ring-1",
                  done
                    ? "bg-sky-500 text-white ring-sky-200 shadow-[0_10px_20px_rgba(2,132,199,0.22)]"
                    : "bg-white text-slate-400 ring-slate-200",
                ].join(" ")}
              >
                {done && idx === 0 ? "✓" : s.icon}
              </div>

              <div className="mt-2 text-[11px] font-semibold text-slate-900">
                {s.key}
              </div>

              <div className="mt-0.5 text-[9px] font-semibold tracking-wider text-slate-400">
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
