"use client";

import React from "react";

export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function LeftPanel({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {right}
            </div>

            <div className="px-5 py-5">{children}</div>
        </section>
    );
}

export function RightPanel({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 pt-6">
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                {right}
            </div>
            <div className="px-6 pb-6 pt-4">{children}</div>
        </section>
    );
}

export function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    );
}

export function Input({
    id,
    value,
    onChange,
    placeholder,
    className,
    type = "text",
}: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
    type?: string;
}) {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cx(
                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]",
                className,
            )}
        />
    );
}

export function Textarea({
    value,
    onChange,
    placeholder,
    rows = 5,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={cx(
                "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400",
                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-50)]",
            )}
        />
    );
}

export function PrimaryButton({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {children}
        </button>
    );
}

export function GhostButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

export function Toggle({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
            className={cx(
                "relative h-6 w-11 rounded-full transition",
                checked ? "bg-[var(--primary)]" : "bg-slate-300",
            )}
        >
            <span
                className={cx(
                    "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition",
                    checked ? "left-6" : "left-1",
                )}
            />
        </button>
    );
}