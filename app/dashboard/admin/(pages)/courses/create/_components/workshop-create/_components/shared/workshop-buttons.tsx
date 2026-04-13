import React from "react";
import { cx } from "../../_utils/workshop-create.helpers";

export function PrimaryButton({
    children,
    className,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white",
                "hover:bg-[var(--primary-hover)] active:scale-[0.99] transition",
                className,
            )}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({
    children,
    className,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
                "hover:bg-slate-50 active:scale-[0.99] transition",
                className,
            )}
        >
            {children}
        </button>
    );
}

export function TinyPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
            {children}
        </span>
    );
}