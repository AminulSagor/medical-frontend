"use client";

import { Check } from "lucide-react";

export type FacultyStepKey = "account" | "clinical" | "role";

export type FacultyStep = {
    key: FacultyStepKey;
    title: string;
    subtitle: string;
};

export default function FacultyStepper({
    steps,
    activeKey,
    onStepClick,
    clickable = true,
}: {
    steps: readonly FacultyStep[];
    activeKey: FacultyStepKey;
    onStepClick?: (k: FacultyStepKey) => void;
    clickable?: boolean;
}) {
    const activeIndex = steps.findIndex((x) => x.key === activeKey);

    return (
        <div className="space-y-4">
            {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                const isDone = idx < activeIndex;

                const RowTag: any = clickable ? "button" : "div";

                return (
                    <RowTag
                        key={s.key}
                        type={clickable ? "button" : undefined}
                        onClick={clickable ? () => onStepClick?.(s.key) : undefined}
                        className={[
                            "flex w-full items-start gap-3 text-left",
                            clickable ? "cursor-pointer" : "cursor-default",
                        ].join(" ")}
                        aria-disabled={!clickable}
                    >
                        {/* circle */}
                        <div
                            className={[
                                "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-extrabold",
                                isDone
                                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                    : isActive
                                        ? "border-[var(--primary)] bg-[var(--primary-50)] text-[var(--primary)]"
                                        : "border-slate-200 bg-white text-slate-500",
                            ].join(" ")}
                        >
                            {isDone ? <Check size={14} className="text-white" /> : idx + 1}
                        </div>

                        <div className="min-w-0">
                            <div
                                className={[
                                    "text-sm font-extrabold",
                                    isActive ? "text-[var(--primary)]" : "text-slate-700",
                                ].join(" ")}
                            >
                                {s.title}
                            </div>
                            <div className="text-xs text-slate-500">{s.subtitle}</div>
                        </div>
                    </RowTag>
                );
            })}
        </div>
    );
}