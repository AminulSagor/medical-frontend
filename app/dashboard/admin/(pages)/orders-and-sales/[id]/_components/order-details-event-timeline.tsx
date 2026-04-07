"use client";

import { CreditCard, ShoppingCart } from "lucide-react";
import { OrderDetailsViewModel } from "../_utils/order-details.mapper";

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 pt-6">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function TimelineIcon({ title, type }: { title: string; type: string }) {
  const normalized = `${title} ${type}`.toLowerCase();

  if (normalized.includes("payment")) {
    return <CreditCard size={18} />;
  }

  if (normalized.includes("order")) {
    return <ShoppingCart size={18} />;
  }

  return <ShoppingCart size={18} />;
}

export default function OrderDetailsEventTimeline({
  order,
}: {
  order: OrderDetailsViewModel;
}) {
  return (
    <Panel>
      <PanelHeader title="Event Timeline" />

      <div className="space-y-3 px-6 pb-6 pt-4">
        {order.timeline.map((item, index) => {
          const isLast = index === order.timeline.length - 1;

          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="relative mt-0.5 flex w-9 justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
                  <TimelineIcon title={item.title} type={item.type} />
                </div>

                {!isLast ? (
                  <div className="absolute top-10 h-8 w-px bg-slate-200" />
                ) : null}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">
                  {item.title}
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  {item.at}
                </div>
                {item.description ? (
                  <div className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}