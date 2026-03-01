"use client";

import { CreditsRange } from "@/app/(user)/(not-register)/public/types/course-browse.types";

const OPTIONS: { key: CreditsRange; label: string }[] = [
  { key: "1_4", label: "1 - 4 Credits" },
  { key: "5_8", label: "5 - 8 Credits" },
  { key: "8_plus", label: "8+ Credits" },
];

export default function CmeCreditsFilter({
  value,
  onChange,
}: {
  value: CreditsRange | null;
  onChange: (v: CreditsRange | null) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-extrabold tracking-[0.18em] text-light-slate">
        CME CREDITS
      </p>

      {OPTIONS.map((o) => {
        const checked = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(checked ? null : o.key)}
            className="flex w-full items-center gap-3 text-left text-sm font-semibold text-black"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full border border-light-slate/30 bg-white">
              {checked ? (
                <span className="h-3 w-3 rounded-full bg-primary" />
              ) : null}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
