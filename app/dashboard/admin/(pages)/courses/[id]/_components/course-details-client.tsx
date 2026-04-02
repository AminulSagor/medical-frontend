"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Eye, Loader2 } from "lucide-react";
import { getWorkshopById } from "@/service/admin/workshop.service";
import type { Workshop } from "@/types/admin/workshop.types";

type DeliveryMode = "in_person" | "online";

type Model = {
    id: string;
    title: string;
    dateLabel: string;
    timeLabel: string;
    instructorName: string;
    instructorAvatarUrl: string;
    capacityUsed: number;
    capacityTotal: number;
    refundRequests: number;
    deliveryMode: string; // validate below
    shortBlurb: string;
    learningObjectives: string;
    offersCmeCredits: boolean;
    standardBaseRate: string;
    groupDiscounts: any;
    webinarPlatform: string;
    meetingLink: string;
    meetingPassword: string;
    autoRecordSession: boolean;
    days: any;
    faculty: any;
};

function cx(...p: Array<string | false | null | undefined>) {
    return p.filter(Boolean).join(" ");
}

function TinyPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
            {children}
        </span>
    );
}

function StatCard({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
                    {sub ? <p className="mt-0.5 text-xs text-slate-500">{sub}</p> : null}
                </div>

                {icon ? (
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15 text-[var(--primary)]">
                        {icon}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function workshopToModel(w: Workshop): Model {
    const firstDay = w.days?.[0];
    const firstSeg = firstDay?.segments?.[0];
    const lastSeg = firstDay?.segments?.[(firstDay?.segments?.length ?? 1) - 1];

    const dateLabel = firstDay?.date
        ? new Date(firstDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—";

    const timeLabel =
        firstSeg?.startTime && lastSeg?.endTime
            ? `${firstSeg.startTime} - ${lastSeg.endTime}`
            : "—";

    const lead = w.faculty?.[0];

    return {
        id: w.id,
        title: w.title,
        dateLabel,
        timeLabel,
        instructorName: lead ? `${lead.firstName} ${lead.lastName}` : "—",
        instructorAvatarUrl: lead?.imageUrl || "",
        capacityUsed: 0,
        capacityTotal: w.capacity,
        refundRequests: 0,
        deliveryMode: w.deliveryMode,
        shortBlurb: w.shortBlurb || "",
        learningObjectives: w.learningObjectives || "",
        offersCmeCredits: w.offersCmeCredits,
        standardBaseRate: w.standardBaseRate,
        groupDiscounts: w.groupDiscounts,
        webinarPlatform: w.webinarPlatform || "",
        meetingLink: w.meetingLink || "",
        meetingPassword: w.meetingPassword || "",
        autoRecordSession: w.autoRecordSession,
        days: w.days,
        faculty: w.faculty,
    };
}

export default function CourseDetailsClient({ workshopId, model: fallbackModel }: { workshopId: string; model?: Model }) {
    console.log("CourseDetailsClient rendered with workshopId:", workshopId);
    const [model, setModel] = useState<Model | null>(fallbackModel || null);
    const [loading, setLoading] = useState(!fallbackModel);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!workshopId) {
            console.error("No workshopId provided");
            setError("No workshop ID provided");
            setLoading(false);
            return;
        }
        
        console.log("Starting fetch for workshop ID:", workshopId);
        setLoading(true);
        setError(null);
        
        getWorkshopById(workshopId)
            .then((w) => {
                console.log("Workshop data received:", w);
                if (!w) {
                    throw new Error("Workshop not found");
                }
                setModel(workshopToModel(w));
            })
            .catch((err) => {
                console.error("Failed to load workshop:", err);
                setError(err instanceof Error ? err.message : "Failed to load workshop");
                setModel(null);
            })
            .finally(() => {
                console.log("Fetch completed, setting loading to false");
                setLoading(false);
            });
    }, [workshopId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
        );
    }

    if (!model) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-sm text-slate-500">Workshop not found.</p>
            </div>
        );
    }

    const mode = (model.deliveryMode as DeliveryMode) || null;

    const pct =
        model.capacityTotal <= 0
            ? 0
            : Math.min(100, Math.round((model.capacityUsed / model.capacityTotal) * 100));

    return (
        <div className="space-y-5">
            {/* Top */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        <span>Course Management</span>
                        <span>›</span>
                        <span>Workshop Details</span>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">{model.title || "—"}</h1>
                        <TinyPill>Published</TinyPill>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] active:scale-[0.99] transition"
                        onClick={() => alert("Edit (UI only)")}
                    >
                        Edit Course
                    </button>
                </div>
            </div>

            {/* Stats row (matches your screenshot style) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <StatCard
                    label="Total Enrolled"
                    value={`${model.capacityUsed}/${model.capacityTotal}`}
                    sub={`${pct}% Capacity`}
                    icon={<Eye size={18} />}
                />
                <StatCard
                    label="Refund Requests"
                    value={`${model.refundRequests}`}
                    sub={model.refundRequests > 0 ? "Pending review" : "None"}
                    icon={<span className="text-sm font-bold">$</span>}
                />
                <StatCard
                    label="Revenue Generated"
                    value="$—"
                    sub="Processed"
                    icon={<span className="text-sm font-bold">$</span>}
                />
            </div>

            {/* ✅ IMPORTANT: no guessing */}
            {!mode ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <p className="text-sm font-semibold text-slate-900">
                        Missing delivery mode
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Your list page doesn’t send <code>deliveryMode</code>. Tell me the rule
                        (or add a field), then I’ll render the exact In-Person vs Webinar UI.
                    </p>
                </div>
            ) : mode === "in_person" ? (
                <InPersonDetails model={model} />
            ) : (
                <OnlineWebinarDetails model={model} />
            )}
        </div>
    );
}

/* -------------------- Variants (I’ll finalize after you confirm deliveryMode) -------------------- */

function InPersonDetails({ model }: { model: Model }) {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
                <SectionCard title="Essentials">
                    <RowLine label="Delivery Mode" value="In-Person Lab (Multi-Day)" />
                    <RowLine label="Brief Description" value={model.shortBlurb || "—"} />
                </SectionCard>

                <SectionCard title="Syllabus & Details" right={<TinyPill>CME CREDITS: {model.offersCmeCredits ? "Yes" : "No"}</TinyPill>}>
                    <p className="text-sm text-slate-600">{model.learningObjectives || "—"}</p>
                </SectionCard>

                <SectionCard title="Course Agenda">
                    {model.days && model.days.length > 0 ? (
                        <div className="space-y-3">
                            {model.days.map((day: any, idx: number) => (
                                <div key={day.id || idx} className="border-l-2 border-slate-200 pl-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Day {day.dayNumber || idx + 1}: {day.date ? new Date(day.date).toLocaleDateString() : "—"}
                                    </p>
                                    {day.segments && day.segments.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {day.segments.map((segment: any, sIdx: number) => (
                                                <div key={segment.id || sIdx} className="text-xs text-slate-600">
                                                    <span className="font-medium">{segment.topic}</span>
                                                    {segment.details && <p className="mt-1">{segment.details}</p>}
                                                    <p className="text-slate-400">
                                                        {segment.startTime} - {segment.endTime}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">No agenda available</p>
                    )}
                </SectionCard>

                <SectionCard title="Faculty">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                            {model.instructorAvatarUrl ? (
                                <Image
                                    src={model.instructorAvatarUrl}
                                    alt={model.instructorName}
                                    fill
                                    className="object-cover"
                                />
                            ) : null}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{model.instructorName}</p>
                            <p className="text-xs text-slate-500">Lead Instructor</p>
                        </div>
                    </div>
                </SectionCard>
            </div>

            <div className="space-y-5">
                <SideCard title="Scheduled Summary">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{model.dateLabel || "—"}</span>
                        <span className="text-slate-300">•</span>
                        <Clock size={14} className="text-slate-400" />
                        <span>{model.timeLabel || "—"}</span>
                    </div>

                    <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Facility / Location
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">Sim Lab A</p>
                        <p className="mt-0.5 text-xs text-slate-500">—</p>
                    </div>
                </SideCard>

                <SideCard title="Enrollment Status" right={<Eye size={16} className="text-slate-400" />}>
                    <p className="text-sm font-semibold text-slate-900">
                        {model.capacityUsed}/{model.capacityTotal} Seats Filled
                    </p>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{
                                width:
                                    model.capacityTotal <= 0
                                        ? "0%"
                                        : `${Math.min(100, (model.capacityUsed / model.capacityTotal) * 100)}%`,
                            }}
                        />
                    </div>
                </SideCard>

                <SideCard title="Pricing">
                    <RowLine label="Base Rate" value={model.standardBaseRate ? `$${model.standardBaseRate}` : "$—"} />
                    {model.groupDiscounts && model.groupDiscounts.length > 0 ? (
                        model.groupDiscounts.map((discount: any, idx: number) => (
                            <RowLine 
                                key={idx} 
                                label={`Group ${discount.minimumAttendees}+`} 
                                value={`$${discount.groupRatePerPerson}/person`} 
                            />
                        ))
                    ) : (
                        <RowLine label="Group Rate" value="$—" />
                    )}
                </SideCard>
            </div>
        </div>
    );
}

function OnlineWebinarDetails({ model }: { model: Model }) {
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
                <SectionCard title="Essentials">
                    <RowLine label="Delivery Mode" value="Online Webinar" />
                    <RowLine label="Brief Description" value={model.shortBlurb || "—"} />
                </SectionCard>

                <SectionCard title="Syllabus & Details" right={<TinyPill>CME CREDITS: {model.offersCmeCredits ? "Yes" : "No"}</TinyPill>}>
                    <p className="text-sm text-slate-600">{model.learningObjectives || "—"}</p>
                </SectionCard>

                <SectionCard title="Webinar Configuration" right={<TinyPill>ACTION CONFIGURATION</TinyPill>}>
                    <RowLine label="Webinar Platform" value={model.webinarPlatform || "—"} />
                    <RowLine label="Meeting Link" value={model.meetingLink || "—"} />
                    <RowLine label="Meeting Password" value={model.meetingPassword || "••••••"} />
                    <RowLine label="Automatic Recording" value={model.autoRecordSession ? "Yes" : "No"} />
                </SectionCard>

                <SectionCard title="Course Agenda">
                    {model.days && model.days.length > 0 ? (
                        <div className="space-y-3">
                            {model.days.map((day: any, idx: number) => (
                                <div key={day.id || idx} className="border-l-2 border-slate-200 pl-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Day {day.dayNumber || idx + 1}: {day.date ? new Date(day.date).toLocaleDateString() : "—"}
                                    </p>
                                    {day.segments && day.segments.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {day.segments.map((segment: any, sIdx: number) => (
                                                <div key={segment.id || sIdx} className="text-xs text-slate-600">
                                                    <span className="font-medium">{segment.topic}</span>
                                                    {segment.details && <p className="mt-1">{segment.details}</p>}
                                                    <p className="text-slate-400">
                                                        {segment.startTime} - {segment.endTime}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600">No agenda available</p>
                    )}
                </SectionCard>

                <SectionCard title="Faculty">
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                            {model.instructorAvatarUrl ? (
                                <Image
                                    src={model.instructorAvatarUrl}
                                    alt={model.instructorName}
                                    fill
                                    className="object-cover"
                                />
                            ) : null}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{model.instructorName}</p>
                            <p className="text-xs text-slate-500">Virtual Lead</p>
                        </div>
                    </div>
                </SectionCard>
            </div>

            <div className="space-y-5">
                <SideCard title="Scheduled Summary">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{model.dateLabel || "—"}</span>
                        <span className="text-slate-300">•</span>
                        <Clock size={14} className="text-slate-400" />
                        <span>{model.timeLabel || "—"}</span>
                    </div>

                    <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Facility / Location
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">N/A (Online Only)</p>
                    </div>
                </SideCard>

                <SideCard title="Enrollment Status" right={<Eye size={16} className="text-slate-400" />}>
                    <p className="text-sm font-semibold text-slate-900">
                        {model.capacityUsed}/{model.capacityTotal} Attendees
                    </p>
                    <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{
                                width:
                                    model.capacityTotal <= 0
                                        ? "0%"
                                        : `${Math.min(100, (model.capacityUsed / model.capacityTotal) * 100)}%`,
                            }}
                        />
                    </div>
                </SideCard>

                <SideCard title="Pricing">
                    <RowLine label="Base Rate" value={model.standardBaseRate ? `$${model.standardBaseRate}` : "$—"} />
                    {model.groupDiscounts && model.groupDiscounts.length > 0 ? (
                        model.groupDiscounts.map((discount: any, idx: number) => (
                            <RowLine 
                                key={idx} 
                                label={`Group ${discount.minimumAttendees}+`} 
                                value={`$${discount.groupRatePerPerson}/person`} 
                            />
                        ))
                    ) : (
                        <RowLine label="Group Rate" value="$—" />
                    )}
                </SideCard>
            </div>
        </div>
    );
}

/* -------------------- UI atoms -------------------- */

function SectionCard({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            <div className="px-6 py-5">{children}</div>
        </section>
    );
}

function SideCard({
    title,
    right,
    children,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                {right ? <div className="shrink-0">{right}</div> : null}
            </div>
            <div className="px-5 py-5">{children}</div>
        </section>
    );
}

function RowLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}