"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, X, Building2, Pencil, Plus } from "lucide-react";

type LocationItem = {
    id: string;
    name: string;
    address: string;
};

type Props = {
    open: boolean;
    onClose: () => void;

    locations: LocationItem[];
    selectedId: string | null;

    onSelect: (id: string) => void;

    onCreate: (loc: { name: string; suite?: string; address: string; notes?: string }) => void;
};

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={cx(
                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            )}
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cx(
                "min-h-[96px] w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            )}
        />
    );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className, ...rest } = props;
    return (
        <button
            {...rest}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white",
                "hover:bg-[var(--primary-hover)] active:scale-[0.99] transition",
                className
            )}
        />
    );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { className, ...rest } = props;
    return (
        <button
            {...rest}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700",
                "hover:bg-slate-50 active:scale-[0.99] transition",
                className
            )}
        />
    );
}

export default function ManageClinicalLocationsModal({
    open,
    onClose,
    locations,
    selectedId,
    onSelect,
    onCreate,
}: Props) {
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    // form
    const [name, setName] = useState("");
    const [suite, setSuite] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        // reset add form each time modal opens
        setName("");
        setSuite("");
        setAddress("");
        setNotes("");
    }, [open]);

    const canSave = useMemo(() => {
        return name.trim().length > 0 && address.trim().length > 0;
    }, [name, address]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[80]">
            {/* overlay */}
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/30"
            />

            {/* panel */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    ref={panelRef}
                    className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4 px-6 py-5">
                        <div className="flex items-start gap-4">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                                <MapPin size={18} className="text-[var(--primary)]" />
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-slate-900">Manage Clinical Locations</h3>
                                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    WORKSHOP LOGISTICS
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="px-6 pb-6">
                        {/* Existing locations */}
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <span className="text-slate-400">▦</span>
                                Existing Locations
                            </div>

                            <div className="mt-3 space-y-3">
                                {locations.map((loc) => {
                                    const active = selectedId === loc.id;
                                    return (
                                        <div
                                            key={loc.id}
                                            className={cx(
                                                "flex items-center justify-between gap-3 rounded-2xl border p-4",
                                                active
                                                    ? "border-[var(--primary)]/25 bg-[var(--primary)]/5"
                                                    : "border-slate-200 bg-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                                                    <Building2 size={18} className="text-slate-500" />
                                                </div>
                                                <div className="leading-tight">
                                                    <p className="text-sm font-semibold text-slate-900">{loc.name}</p>
                                                    <p className="mt-0.5 text-xs text-slate-500">{loc.address}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                                    aria-label="Edit location"
                                                    onClick={() => {
                                                        // UI only (you can wire later)
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <SecondaryButton
                                                    type="button"
                                                    onClick={() => {
                                                        onSelect(loc.id);
                                                        onClose();
                                                    }}
                                                    className="h-9 rounded-full px-4"
                                                >
                                                    Select
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* OR divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">OR</p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Add new location */}
                        <div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                            >
                                <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                                    <Plus size={14} className="text-[var(--primary)]" />
                                </span>
                                Add New Location
                            </button>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Facility Name</Label>
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Simulation Lab C"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Label>Room Number / Suite</Label>
                                        <span className="text-[11px] font-semibold text-slate-400">(Optional)</span>
                                    </div>
                                    <TextInput
                                        value={suite}
                                        onChange={(e) => setSuite(e.target.value)}
                                        placeholder="e.g., Suite 402"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Physical Address
                                    </p>

                                    <div className="relative">
                                        {/* icon */}
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MapPin size={16} />
                                        </span>

                                        <input
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="e.g., 123 Medical Dr, Houston"
                                            className={[
                                                "h-10 w-full rounded-md border border-slate-200 bg-white",
                                                "pl-10 pr-3 text-sm text-slate-800 outline-none",
                                                "placeholder:text-slate-400",
                                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                                            ].join(" ")}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Capacity Notes</Label>
                                    <TextArea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Enter details about seating layout, equipment availability, or max attendees..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                        <SecondaryButton type="button" onClick={onClose} className="h-10 px-6">
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton
                            type="button"
                            disabled={!canSave}
                            onClick={() => {
                                onCreate({
                                    name: name.trim(),
                                    suite: suite.trim() || undefined,
                                    address: address.trim(),
                                    notes: notes.trim() || undefined,
                                });
                                onClose();
                            }}
                            className={cx("h-10 px-6", !canSave && "opacity-50 cursor-not-allowed")}
                        >
                            Save and Add to List
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}