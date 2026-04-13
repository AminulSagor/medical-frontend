import React from "react";
import { cx } from "../../_utils/workshop-create.helpers";

export function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
            {children}
        </p>
    );
}

export function TextInput(
    props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string },
) {
    const { className, ...rest } = props;

    return (
        <input
            {...rest}
            className={cx(
                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary)]/15 focus:border-[var(--primary)]",
                className,
            )}
        />
    );
}

export function TextArea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        className?: string;
    },
) {
    const { className, ...rest } = props;

    return (
        <textarea
            {...rest}
            className={cx(
                "min-h-[96px] w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary)]/15 focus:border-[var(--primary)]",
                className,
            )}
        />
    );
}