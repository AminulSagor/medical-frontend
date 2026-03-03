"use client";

import Card from "@/components/cards/card";
import { Plus, Bandage, Microscope, Scissors, Shield } from "lucide-react";

type CatKey = "Respiratory" | "Wound Care" | "Diagnostics" | "Surgical" | "PPE";
type BrandKey = "3M Medical" | "Welch Allyn" | "MedLine" | "B. Braun";

const CATS: { key: CatKey; icon: React.ReactNode; count: number }[] = [
  { key: "Respiratory", icon: <Plus size={18} />, count: 124 },
  { key: "Wound Care", icon: <Bandage size={18} />, count: 48 },
  { key: "Diagnostics", icon: <Microscope size={18} />, count: 39 },
  { key: "Surgical", icon: <Scissors size={18} />, count: 22 },
  { key: "PPE", icon: <Shield size={18} />, count: 17 },
];

const BRANDS: BrandKey[] = ["3M Medical", "Welch Allyn", "MedLine", "B. Braun"];

function SidebarShell({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

function SectionHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-base font-bold text-slate-900">{title}</div>
      {right}
    </div>
  );
}

function CategoryRow({
  active,
  icon,
  label,
  count,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      className={[
        "w-full flex items-center justify-between rounded-2xl px-4 py-1 transition",
        active ? "bg-primary/10 ring-1 ring-primary/25" : "hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "flex h-9 w-9 items-center justify-center rounded-xl",
            active ? "bg-primary/10 text-primary" : "text-slate-500",
          ].join(" ")}
        >
          {icon}
        </span>

        <span
          className={[
            "text-sm font-bold",
            active ? "text-primary" : "text-slate-700",
          ].join(" ")}
        >
          {label}
        </span>
      </div>

      <span
        className={[
          "text-xs font-extrabold",
          active ? "text-primary" : "text-slate-400",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function RangeTrack() {
  return (
    <div className="mt-5">
      <div className="relative h-2 w-full rounded-full bg-slate-100">
        <div className="absolute left-6 right-10 top-0 h-2 rounded-full bg-primary" />
        <div className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white ring-2 ring-slate-200" />
        <div className="absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white ring-2 ring-slate-200" />
      </div>
    </div>
  );
}

function BrandRow({ checked, label }: { checked?: boolean; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    >
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full border",
          checked ? "bg-primary border-primary" : "bg-white border-slate-300",
        ].join(" ")}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </span>

      {label}
    </button>
  );
}

export default function FiltersSidebar() {
  return (
    <SidebarShell>
      <Card>
        <SectionHeader
          title="Categories"
          right={
            <button
              type="button"
              className="text-sm font-semibold text-slate-400 hover:opacity-80"
            >
              Clear
            </button>
          }
        />

        <div className="mt-4 space-y-2">
          {CATS.map((c, idx) => (
            <CategoryRow
              key={c.key}
              active={idx === 0}
              icon={c.icon}
              label={c.key}
              count={c.count}
            />
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl p-6">
        <SectionHeader
          title="Price Range"
          right={
            <div className="text-sm font-extrabold text-primary">
              $10 - $500
            </div>
          }
        />
        <RangeTrack />
      </Card>

      <Card className="rounded-3xl p-6">
        <SectionHeader title="Brands" />
        <div className="mt-4 space-y-2">
          {BRANDS.map((b, idx) => (
            <BrandRow key={b} checked={idx === 0} label={b} />
          ))}
        </div>
      </Card>
    </SidebarShell>
  );
}
