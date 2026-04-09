"use client";

import { Mail, MapPin, Phone, User } from "lucide-react";
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

function IconField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-700">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </div>
        <div className="truncate text-sm font-semibold text-slate-800">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsCustomerProfile({
  order,
}: {
  order: OrderDetailsViewModel;
}) {
  return (
    <Panel>
      <PanelHeader title="Customer Profile" />

      <div className="space-y-5 px-6 pb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
            <User size={18} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-[var(--primary)]">
              {order.customer.name}
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {order.customer.subtitle}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        <div className="space-y-3">
          <IconField
            icon={<Mail size={16} />}
            label="Email"
            value={order.customer.email}
          />
          <IconField
            icon={<Phone size={16} />}
            label="Phone"
            value={order.customer.phone}
          />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <MapPin size={14} className="text-slate-400" />
            <span>Shipping Address</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2">
            <div className="space-y-1 text-sm font-semibold text-slate-700">
              {order.customer.addressLines.map((line, index) => (
                <div key={`${line}-${index}`}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}