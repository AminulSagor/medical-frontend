"use client";

import type { Recipient } from "../_lib/compose-types";

function Avatar({ r }: { r: Recipient }) {
    if (r.avatarUrl) {
        return (
            // swap to next/image if your project uses it here
            <img
                src={r.avatarUrl}
                alt={r.name}
                className="h-10 w-10 rounded-full object-cover"
            />
        );
    }

    const initials =
        r.initials ??
        r.name
            .split(" ")
            .slice(0, 2)
            .map((s) => s[0])
            .join("")
            .toUpperCase();

    return (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/60">
            {initials}
        </div>
    );
}

function Check({ checked }: { checked: boolean }) {
    return (
        <span
            className={[
                "grid h-5 w-5 place-items-center rounded-md text-[12px] font-black",
                checked
                    ? "bg-teal-500 text-white"
                    : "bg-white text-transparent ring-1 ring-slate-300",
            ].join(" ")}
        >
            ✓
        </span>
    );
}

export default function RecipientsList({
    recipients,
    selected,
    onToggle,
}: {
    recipients: Recipient[];
    selected: Record<string, boolean>;
    onToggle: (id: string) => void;
}) {
    return (
        <div className="max-h-[520px] overflow-auto">
            {/* Two columns like the design */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {recipients.map((r, idx) => {
                    const checked = !!selected[r.id];

                    // borders: match the grid separators
                    const borderRight = idx % 2 === 0 ? "md:border-r md:border-slate-100" : "";
                    const borderBottom = "border-b border-slate-100";

                    return (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => onToggle(r.id)}
                            className={[
                                "flex w-full items-center justify-between gap-3 px-6 py-4 text-left hover:bg-slate-50",
                                borderBottom,
                                borderRight,
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <Check checked={checked} />
                                <Avatar r={r} />

                                <div>
                                    <p className="text-[14px] font-bold leading-[17.5px] tracking-[0px] text-slate-900">
                                        {r.name}
                                    </p>

                                    <p className="text-[10px] font-medium leading-[15px] tracking-[0px] text-slate-500 lowercase">
                                        {r.email}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs text-slate-300">⋯</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}