"use client";

import { useEffect, useMemo, useState } from "react";
import Dialog from "@/components/dialogs/dialog";
import { getSubscriberFilterOptions } from "@/service/admin/newsletter/subscribes/subscriber-filter-options.service";
import type {
    SubscriberFilterOptionsResponse,
    SubscriberFiltersState,
} from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-filter-options.types";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: SubscriberFiltersState;
    onApply: (filters: SubscriberFiltersState) => void;
    onReset: () => void;
};

const initialOptions: SubscriberFilterOptionsResponse = {
    statuses: [],
    acquisitionSources: [],
    roles: [],
    quickDateRanges: [],
};

export default function SubscribersFilterDialog({
    open,
    onOpenChange,
    value,
    onApply,
    onReset,
}: Props) {
    const [draft, setDraft] = useState<SubscriberFiltersState>(value);
    const [options, setOptions] =
        useState<SubscriberFilterOptionsResponse>(initialOptions);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setDraft(value);
    }, [value, open]);

    useEffect(() => {
        if (!open) return;

        const loadFilterOptions = async () => {
            try {
                setIsLoading(true);
                const response = await getSubscriberFilterOptions();
                setOptions(response);
            } catch (error) {
                console.error("Failed to load subscriber filter options:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadFilterOptions();
    }, [open]);

    const hasAnyValue = useMemo(() => {
        return Boolean(
            draft.status ||
            draft.source ||
            draft.role ||
            draft.minOpenRatePercent !== undefined,
        );
    }, [draft]);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            className="rounded-2xl"
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Filter Subscribers</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Narrow the subscriber list using available filters.
                    </p>
                </div>

                {isLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                        Loading filter options...
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Status
                            </label>
                            <select
                                value={draft.status ?? ""}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        status: e.target.value || undefined,
                                    }))
                                }
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            >
                                <option value="">All Statuses</option>
                                {options.statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Source
                            </label>
                            <select
                                value={draft.source ?? ""}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        source: e.target.value || undefined,
                                    }))
                                }
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            >
                                <option value="">All Sources</option>
                                {options.acquisitionSources.map((source) => (
                                    <option key={source} value={source}>
                                        {source}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Role
                            </label>
                            <select
                                value={draft.role ?? ""}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        role: e.target.value || undefined,
                                    }))
                                }
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            >
                                <option value="">All Roles</option>
                                {options.roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Min Open Rate %
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={draft.minOpenRatePercent ?? ""}
                                onChange={(e) =>
                                    setDraft((prev) => ({
                                        ...prev,
                                        minOpenRatePercent:
                                            e.target.value === ""
                                                ? undefined
                                                : Math.max(0, Math.min(100, Number(e.target.value))),
                                    }))
                                }
                                placeholder="e.g. 50"
                                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            onReset();
                            onOpenChange(false);
                        }}
                        disabled={!hasAnyValue}
                        className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onApply(draft);
                            onOpenChange(false);
                        }}
                        className="inline-flex h-11 items-center rounded-2xl bg-teal-500 px-5 text-sm font-bold text-white hover:bg-teal-600"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </Dialog>
    );
}