"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, X, Building2, Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import type { Facility } from "@/types/admin/facility.types";
import {
    listFacilities,
    createFacility,
    updateFacility,
    deleteFacility,
} from "@/service/admin/facility.service";

type Props = {
    open: boolean;
    onClose: () => void;

    selectedId: string | null;

    onSelect: (facility: Facility) => void;
    onFacilitiesChange?: (facilities: Facility[]) => void;
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
    selectedId,
    onSelect,
    onFacilitiesChange,
}: Props) {
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    // data
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // form mode: "create" | "edit"
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [editingId, setEditingId] = useState<string | null>(null);

    // form fields
    const [name, setName] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [address, setAddress] = useState("");
    const [capacity, setCapacity] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => setMounted(true), []);

    // Fetch facilities when modal opens
    useEffect(() => {
        if (!open) return;
        setLoading(true);
        listFacilities()
            .then((res) => {
                setFacilities(res.items);
                onFacilitiesChange?.(res.items);
            })
            .catch((err) => console.error("Failed to load facilities:", err))
            .finally(() => setLoading(false));
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Reset form when modal opens
    useEffect(() => {
        if (!open) return;
        resetForm();
    }, [open]);

    function resetForm() {
        setFormMode("create");
        setEditingId(null);
        setName("");
        setRoomNumber("");
        setAddress("");
        setCapacity("");
        setNotes("");
    }

    function startEdit(fac: Facility) {
        setFormMode("edit");
        setEditingId(fac.id);
        setName(fac.name);
        setRoomNumber(fac.roomNumber || "");
        setAddress(fac.physicalAddress);
        setCapacity(fac.capacity ? String(fac.capacity) : "");
        setNotes(fac.notes || "");
    }

    const canSave = useMemo(() => {
        return name.trim().length > 0 && address.trim().length > 0;
    }, [name, address]);

    async function handleSave() {
        if (!canSave) return;
        setSaving(true);
        try {
            if (formMode === "edit" && editingId) {
                const updated = await updateFacility(editingId, {
                    name: name.trim(),
                    roomNumber: roomNumber.trim() || undefined,
                    physicalAddress: address.trim(),
                    capacity: capacity ? Number(capacity) : undefined,
                    notes: notes.trim() || undefined,
                });
                setFacilities((prev) =>
                    prev.map((f) => (f.id === editingId ? updated : f))
                );
                onFacilitiesChange?.(
                    facilities.map((f) => (f.id === editingId ? updated : f))
                );
            } else {
                const created = await createFacility({
                    name: name.trim(),
                    roomNumber: roomNumber.trim() || undefined,
                    physicalAddress: address.trim(),
                    capacity: capacity ? Number(capacity) : undefined,
                    notes: notes.trim() || undefined,
                });
                const next = [...facilities, created];
                setFacilities(next);
                onFacilitiesChange?.(next);
            }
            resetForm();
        } catch (err) {
            console.error("Failed to save facility:", err);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            await deleteFacility(id);
            const next = facilities.filter((f) => f.id !== id);
            setFacilities(next);
            onFacilitiesChange?.(next);
            if (editingId === id) resetForm();
        } catch (err) {
            console.error("Failed to delete facility:", err);
        } finally {
            setDeletingId(null);
        }
    }

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
                    className="w-full max-w-[720px] max-h-[calc(100vh-64px)] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4 px-6 py-5 shrink-0">
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

                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        {/* Existing locations */}
                        <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <span className="text-slate-400">▦</span>
                                Existing Locations
                            </div>

                            {loading ? (
                                <div className="mt-4 flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    Loading facilities...
                                </div>
                            ) : facilities.length === 0 ? (
                                <div className="mt-4 rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
                                    No facilities found. Create one below.
                                </div>
                            ) : (
                                <div className="mt-3 space-y-3">
                                    {facilities.map((fac) => {
                                        const active = selectedId === fac.id;
                                        const isDeleting = deletingId === fac.id;
                                        return (
                                            <div
                                                key={fac.id}
                                                className={cx(
                                                    "flex items-center justify-between gap-3 rounded-2xl border p-4",
                                                    active
                                                        ? "border-[var(--primary)]/25 bg-[var(--primary)]/5"
                                                        : "border-slate-200 bg-white"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                                                        <Building2 size={18} className="text-slate-500" />
                                                    </div>
                                                    <div className="min-w-0 leading-tight">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {fac.name}
                                                            {fac.roomNumber && (
                                                                <span className="ml-1 text-slate-400 font-normal">
                                                                    ({fac.roomNumber})
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="mt-0.5 truncate text-xs text-slate-500">{fac.physicalAddress}</p>
                                                        {fac.capacity > 0 && (
                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                Capacity: {fac.capacity}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        type="button"
                                                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                                                        aria-label="Edit location"
                                                        onClick={() => startEdit(fac)}
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                                                        aria-label="Delete location"
                                                        disabled={isDeleting}
                                                        onClick={() => handleDelete(fac.id)}
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>

                                                    <SecondaryButton
                                                        type="button"
                                                        onClick={() => {
                                                            onSelect(fac);
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
                            )}
                        </div>

                        {/* OR divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                {formMode === "edit" ? "EDITING" : "OR"}
                            </p>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Add / Edit location form */}
                        <div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                                >
                                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                                        {formMode === "edit" ? (
                                            <Pencil size={12} className="text-[var(--primary)]" />
                                        ) : (
                                            <Plus size={14} className="text-[var(--primary)]" />
                                        )}
                                    </span>
                                    {formMode === "edit" ? "Edit Location" : "Add New Location"}
                                </button>

                                {formMode === "edit" && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="text-xs font-semibold text-[var(--primary)] hover:underline"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Facility Name</Label>
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., City General Hospital"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Label>Room Number</Label>
                                        <span className="text-[11px] font-semibold text-slate-400">(Optional)</span>
                                    </div>
                                    <TextInput
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        placeholder="e.g., A-101"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Physical Address
                                    </p>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <MapPin size={16} />
                                        </span>

                                        <input
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="e.g., 123 Main Street, Dhaka"
                                            className={[
                                                "h-10 w-full rounded-md border border-slate-200 bg-white",
                                                "pl-10 pr-3 text-sm text-slate-800 outline-none",
                                                "placeholder:text-slate-400",
                                                "focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
                                            ].join(" ")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Label>Capacity</Label>
                                        <span className="text-[11px] font-semibold text-slate-400">(Optional)</span>
                                    </div>
                                    <TextInput
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="e.g., 50"
                                        inputMode="numeric"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Label>Notes</Label>
                                        <span className="text-[11px] font-semibold text-slate-400">(Optional)</span>
                                    </div>
                                    <TextInput
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="e.g., Recently renovated wing"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shrink-0">
                        <SecondaryButton type="button" onClick={onClose} className="h-10 px-6">
                            Cancel
                        </SecondaryButton>

                        <PrimaryButton
                            type="button"
                            disabled={!canSave || saving}
                            onClick={handleSave}
                            className={cx("h-10 px-6", (!canSave || saving) && "opacity-50 cursor-not-allowed")}
                        >
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {formMode === "edit" ? "Update Location" : "Save and Add to List"}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}