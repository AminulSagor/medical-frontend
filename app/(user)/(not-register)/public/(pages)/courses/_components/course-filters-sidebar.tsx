"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import DeliveryMethodFilter from "./delivery-method-filter";
import CmeCreditsFilter from "./cme-credits-filter";
import {
  CreditsRange,
  DeliveryMethod,
} from "@/app/(user)/(not-register)/public/types/course-browse.types";

export type CourseFiltersState = {
  availableOnly: boolean;
  delivery: Record<DeliveryMethod, boolean>;
  credits: CreditsRange | null;
};

export default function CourseFiltersSidebar({
  value,
  onChange,
  onReset,
}: {
  value: CourseFiltersState;
  onChange: (v: CourseFiltersState) => void;
  onReset: () => void;
}) {
  return (
    <aside className="rounded-3xl bg-white shadow-sm border border-light-slate/15 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-extrabold text-black">
          <SlidersHorizontal size={18} className="text-primary" />
          Filters
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-extrabold tracking-[0.16em] text-light-slate hover:text-black"
        >
          RESET
        </button>
      </div>

      {/* Available Only toggle */}
      <div className="mt-6 rounded-2xl bg-light-slate/10 p-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-black">Available Only</p>

        <button
          type="button"
          onClick={() =>
            onChange({ ...value, availableOnly: !value.availableOnly })
          }
          className={[
            "relative h-7 w-12 rounded-full transition",
            value.availableOnly ? "bg-primary" : "bg-light-slate/30",
          ].join(" ")}
          aria-label="Toggle available only"
        >
          <span
            className={[
              "absolute top-1 h-5 w-5 rounded-full bg-white transition",
              value.availableOnly ? "left-6" : "left-1",
            ].join(" ")}
          />
        </button>
      </div>

      <div className="mt-6 h-px w-full bg-light-slate/15" />

      <div className="mt-6">
        <DeliveryMethodFilter
          value={value.delivery}
          onChange={(delivery) => onChange({ ...value, delivery })}
        />
      </div>

      <div className="mt-6 h-px w-full bg-light-slate/15" />

      <div className="mt-6">
        <CmeCreditsFilter
          value={value.credits}
          onChange={(credits) => onChange({ ...value, credits })}
        />
      </div>
    </aside>
  );
}
