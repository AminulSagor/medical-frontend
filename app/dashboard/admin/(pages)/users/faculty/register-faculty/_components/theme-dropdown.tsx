"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type ThemeDropdownOption<T extends string> = {
    value: T;
    label: string;
};

export default function ThemeDropdown<T extends string>({
    value,
    options,
    placeholder = "Select",
    onChange,
    buttonClassName = "",
    onOpen,
}: {
    value: T | null;
    options: Array<ThemeDropdownOption<T>>;
    placeholder?: string;
    onChange: (v: T) => void;
    buttonClassName?: string;
    onOpen?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState<T | null>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const selectedLabel = useMemo(() => {
        const found = options.find((o) => o.value === value);
        return found?.label ?? "";
    }, [options, value]);

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        if (!open) setHovered(null);
    }, [open]);

    return (
        <div className="relative" ref={wrapRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={[
                    // ✅ same vibe as your filter button + form fields
                    "mt-2 inline-flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm",
                    "text-slate-900 hover:bg-slate-50",
                    "outline-none transition",
                    "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                    buttonClassName,
                ].join(" ")}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={selectedLabel ? "text-slate-900" : "text-slate-400"}>
                    {selectedLabel || placeholder}
                </span>
                <ChevronDown size={16} className="text-slate-500" />
            </button>

            {open && (
                <div
                    className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                    onMouseLeave={() => setHovered(null)}
                    role="listbox"
                >
                    {options.map((opt) => {
                        const active = value === opt.value;
                        const isHighlighted = hovered ? hovered === opt.value : active;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);   // ✅ update selected value in parent
                                    setOpen(false);        // ✅ close dropdown
                                }}
                                onMouseEnter={() => setHovered(opt.value)}
                                className={[
                                    "block w-full px-4 py-2 text-left text-sm transition",
                                    isHighlighted
                                        ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                        : "text-slate-700",
                                ].join(" ")}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}