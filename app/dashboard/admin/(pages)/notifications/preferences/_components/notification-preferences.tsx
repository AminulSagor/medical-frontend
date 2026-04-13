"use client";

import { useEffect, useMemo, useState } from "react";
import { IdCard, Archive, Shield, Network, Save } from "lucide-react";

import PreferencesSavedModal from "./preferences-saved-modal";
import {
    getNotificationPreferences,
    saveNotificationPreferences,
} from "@/service/admin/notifications.service";
import type {
    NotificationPreferenceItem,
    NotificationPreferencesResponse,
    SaveNotificationPreferencesPayload,
} from "@/types/admin/notifications.types";

type Row = {
    id: string;
    preferenceKey: string;
    title: string;
    desc: string;
    inApp: boolean;
    email: boolean;
    frequency?: string;
    frequencyOptions?: string[];
    supportsFrequency: boolean;
    isEditable: boolean;
    sectionKey: string;
};

function Toggle({
    checked,
    onChange,
    ariaLabel,
    disabled = false,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    ariaLabel: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={() => {
                if (!disabled) onChange(!checked);
            }}
            disabled={disabled}
            className={[
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                checked ? "bg-cyan-500" : "bg-slate-200",
                disabled ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                    checked ? "translate-x-5" : "translate-x-1",
                ].join(" ")}
            />
        </button>
    );
}

function SectionCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <span className="text-cyan-600">{icon}</span>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {title}
                </p>
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function mapPreferenceItemToRow(item: NotificationPreferenceItem): Row {
    return {
        id: item.id,
        preferenceKey: item.key,
        title: item.title,
        desc: item.description,
        inApp: item.inAppEnabled,
        email: item.emailEnabled,
        frequency: item.frequency,
        frequencyOptions: item.frequencyOptions,
        supportsFrequency: item.supportsFrequency,
        isEditable: item.isEditable,
        sectionKey: item.sectionKey,
    };
}

export default function NotificationPreferences() {
    const [openSaved, setOpenSaved] = useState(false);
    const [data, setData] = useState<NotificationPreferencesResponse | null>(null);
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [desktopPushEnabled, setDesktopPushEnabled] = useState(false);

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                setLoading(true);
                const response = await getNotificationPreferences();
                setData(response);

                const mappedRows = response.sections
                    .flatMap((section) => section.items)
                    .map(mapPreferenceItemToRow);

                setRows(mappedRows);
                setDesktopPushEnabled(response.communicationChannels.desktopPushEnabled);
            } catch (error) {
                console.error("Failed to fetch notification preferences:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchPreferences();
    }, []);

    const groups = useMemo(() => {
        if (!data) return [];

        return data.sections
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((section) => ({
                title: section.title,
                sectionKey: section.key,
                icon:
                    section.icon === "stethoscope" ? (
                        <IdCard size={16} />
                    ) : section.icon === "box" ? (
                        <Archive size={16} />
                    ) : (
                        <Shield size={16} />
                    ),
            }));
    }, [data]);

    const setRow = (id: string, patch: Partial<Row>) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
        );
    };

    const handleSavePreferences = async () => {
        try {
            setIsSaving(true);

            const payload: SaveNotificationPreferencesPayload = {
                preferences: rows.map((row) => ({
                    preferenceKey: row.preferenceKey,
                    inAppEnabled: row.inApp,
                    emailEnabled: row.email,
                    ...(row.supportsFrequency && row.frequency
                        ? { frequency: row.frequency }
                        : {}),
                })),
                desktopPushEnabled,
            };

            const response = await saveNotificationPreferences(payload);

            if (response.saveResult.status) {
                setOpenSaved(true);
            }
        } catch (error) {
            console.error("Failed to save notification preferences:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <p className="p-6 text-sm text-slate-500">Loading...</p>;
    }

    if (!data) {
        return <p className="p-6 text-sm text-slate-500">Failed to load preferences.</p>;
    }

    return (
        <div className="mx-auto w-full max-w-[860px] space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">{data.title}</h1>
                    <p className="mt-1 text-xs text-slate-500">{data.subtitle}</p>
                </div>

                {data.canSave && (
                    <button
                        type="button"
                        onClick={handleSavePreferences}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                )}
            </div>

            {groups.map((group) => (
                <SectionCard key={group.sectionKey} title={group.title} icon={group.icon}>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-[1fr_120px_120px] items-center">
                            <div />
                            <p className="text-[10px] font-semibold uppercase text-slate-400 text-center">
                                In-App
                            </p>
                            <p className="text-[10px] font-semibold uppercase text-slate-400 text-center">
                                Email
                            </p>
                        </div>

                        {rows
                            .filter((row) => row.sectionKey === group.sectionKey)
                            .map((row) => (
                                <div
                                    key={row.id}
                                    className="grid grid-cols-[1fr_120px_120px] items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{row.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{row.desc}</p>

                                        {row.supportsFrequency && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                    Frequency:
                                                </p>
                                                <select
                                                    value={row.frequency ?? ""}
                                                    onChange={(e) => setRow(row.id, { frequency: e.target.value })}
                                                    disabled={!row.isEditable}
                                                    className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                                                >
                                                    {row.frequencyOptions?.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-center pt-1">
                                        <Toggle
                                            checked={row.inApp}
                                            onChange={(value) => setRow(row.id, { inApp: value })}
                                            ariaLabel={`${row.title} in-app`}
                                            disabled={!row.isEditable}
                                        />
                                    </div>

                                    <div className="flex justify-center pt-1">
                                        <Toggle
                                            checked={row.email}
                                            onChange={(value) => setRow(row.id, { email: value })}
                                            ariaLabel={`${row.title} email`}
                                            disabled={!row.isEditable}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </SectionCard>
            ))}

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                    <Network size={16} className="text-cyan-600" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Communication Channels
                    </p>
                </div>

                <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Email Delivery</p>
                        <p className="mt-1 text-xs text-slate-500">
                            The primary address for all system correspondence.
                        </p>

                        <input
                            value={data.communicationChannels.emailDeliveryAddress}
                            readOnly={!data.communicationChannels.emailDeliveryEditable}
                            className="mt-3 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 read-only:bg-slate-50"
                        />
                    </div>

                    <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Desktop Push</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Enable real-time browser notifications for critical alerts.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                if (data.communicationChannels.desktopPushSupported) {
                                    setDesktopPushEnabled((prev) => !prev);
                                }
                            }}
                            disabled={!data.communicationChannels.desktopPushSupported}
                            className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {desktopPushEnabled
                                ? "Desktop Notifications Enabled"
                                : "Enable Desktop Notifications"}
                        </button>
                    </div>
                </div>
            </div>

            <PreferencesSavedModal open={openSaved} onClose={() => setOpenSaved(false)} />
        </div>
    );
}