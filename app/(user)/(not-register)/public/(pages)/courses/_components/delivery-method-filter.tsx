"use client";
import { DeliveryMethod } from "@/app/(user)/(not-register)/public/types/course-browse.types";

export default function DeliveryMethodFilter({
  value,
  onChange,
}: {
  value: Record<DeliveryMethod, boolean>;
  onChange: (v: Record<DeliveryMethod, boolean>) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-extrabold tracking-[0.18em] text-light-slate">
        METHODS OF DELIVERY
      </p>

      <label className="flex items-center gap-3 text-sm font-semibold text-black">
        <span className="grid h-5 w-5 place-items-center rounded-full border border-light-slate/30 bg-white">
          <span
            className={value.in_person ? "h-3 w-3 rounded-full bg-primary" : ""}
          />
        </span>
        <input
          type="checkbox"
          checked={value.in_person}
          onChange={(e) => onChange({ ...value, in_person: e.target.checked })}
          className="hidden"
        />
        In Person
      </label>

      <label className="flex items-center gap-3 text-sm font-semibold text-black">
        <span className="grid h-5 w-5 place-items-center rounded-full border border-light-slate/30 bg-white">
          <span
            className={value.online ? "h-3 w-3 rounded-full bg-primary" : ""}
          />
        </span>
        <input
          type="checkbox"
          checked={value.online}
          onChange={(e) => onChange({ ...value, online: e.target.checked })}
          className="hidden"
        />
        Online
      </label>
    </div>
  );
}
