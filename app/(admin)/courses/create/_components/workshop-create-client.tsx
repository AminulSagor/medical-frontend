"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronDown,
    Clock,
    ImageIcon,
    Plus,
    Trash2,
    Upload,
    BookOpen,
    Bold,
    Italic,
    List,
    ListOrdered,
    Link2,
    Search,
    Loader2,
} from "lucide-react";
import ThemeDropdown, { ThemeDropdownOption } from "@/app/(admin)/users/faculty/register-faculty/_components/theme-dropdown";
import ManageClinicalLocationsModal from "../../_components/manage-clinical-locations-modal";
import { searchFaculty } from "@/service/admin/faculty.service";
import type { Faculty } from "@/types/admin/faculty.types";
import type { Facility } from "@/types/admin/facility.types";
import { listFacilities } from "@/service/admin/facility.service";
import { useDebounce } from "@/hooks/useDebounce";
import { createWorkshop } from "@/service/admin/workshop.service";
import { createWorkshopSchema } from "@/schema/admin/workshop.schema";
import type { CreateWorkshopRequest, WorkshopStatus } from "@/types/admin/workshop.types";
import { useRouter } from "next/navigation";

type DeliveryMode = "in_person" | "online";

type Segment = {
    id: string;
    topic: string;
    details: string;
    date: string;
    startTime: string;
    endTime: string;
};

type DayAgenda = {
    id: string;
    label: string;
    segments: Segment[];
};

type FacultyChip = {
    id: string;
    name: string;
    role: string;
};

type WebinarPlatform =
    | "zoom"
    | "google_meet"
    | "microsoft_teams"
    | "webex"
    | "goto_webinar";

const WEBINAR_PLATFORM_OPTIONS: Array<ThemeDropdownOption<WebinarPlatform>> = [
    { value: "zoom", label: "Zoom" },
    { value: "google_meet", label: "Google Meet" },
    { value: "microsoft_teams", label: "Microsoft Teams" },
    { value: "webex", label: "Cisco Webex" },
    { value: "goto_webinar", label: "GoTo Webinar" },
];

type FacilityLocation = string;

function uid(prefix = "id") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function Card({
    title,
    subtitle,
    icon,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5">
                <div className="flex items-start gap-4">
                    {icon ? (
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary-50)] ring-1 ring-[var(--primary)]/15">
                            <span className="text-[var(--primary)]">
                                {icon}
                            </span>
                        </div>
                    ) : null}

                    <div>
                        <h2 className="text-base font-bold text-slate-900">{title}</h2>
                        {subtitle ? (
                            <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
                        ) : null}
                    </div>
                </div>

                {right ? <div className="shrink-0">{right}</div> : null}
            </div>

            {/* body */}
            <div className="px-6 pb-6">{children}</div>
        </section>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500">
            {children}
        </p>
    );
}

function TextInput(
    props: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
) {
    const { className, ...rest } = props;
    return (
        <input
            {...rest}
            className={cx(
                "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary)]/15 focus:border-[var(--primary)]",
                className
            )}
        />
    );
}

function TextArea(
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
) {
    const { className, ...rest } = props;
    return (
        <textarea
            {...rest}
            className={cx(
                "min-h-[96px] w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none",
                "placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--primary)]/15 focus:border-[var(--primary)]",
                className
            )}
        />
    );
}

function PrimaryButton({
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
                className
            )}
        >
            {children}
        </button>
    );
}

function SecondaryButton({
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
                className
            )}
        >
            {children}
        </button>
    );
}

function TinyPill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
            {children}
        </span>
    );
}

function SeatMap({ capacity }: { capacity: number }) {
    const dots = useMemo(() => {
        const total = Math.min(40, Math.max(16, capacity));
        return Array.from({ length: total }, (_, i) => i);
    }, [capacity]);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Visual Seat Map
            </p>
            <div className="mt-3 grid grid-cols-8 gap-2">
                {dots.map((i) => (
                    <span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]/60"
                        title="Available"
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]/60" />
                    Available
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    Overflow
                </div>
            </div>
        </div>
    );
}

function RichTextEditor({
    value,
    onChange,
    placeholder,
}: {
    value: string;                 // HTML string
    onChange: (html: string) => void;
    placeholder?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [active, setActive] = useState({
        bold: false,
        italic: false,
        ul: false,
        ol: false,
        link: false,
    });

    const isEmpty = useMemo(() => {
        const normalized = (value ?? "")
            .replace(/<br\s*\/?>/gi, "")
            .replace(/&nbsp;/gi, " ")
            .replace(/<\/?[^>]+(>|$)/g, "")
            .trim();
        return normalized.length === 0;
    }, [value]);

    // keep DOM synced if value changes externally
    useEffect(() => {
        if (!ref.current) return;
        if (ref.current.innerHTML !== value) {
            ref.current.innerHTML = value || "";
        }
    }, [value]);

    useEffect(() => {
        const handler = () => refreshActive();

        document.addEventListener("selectionchange", handler);
        return () => document.removeEventListener("selectionchange", handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function exec(cmd: string, arg?: string) {
        const el = ref.current;
        if (!el) return;
        el.focus();
        // execCommand still works for basic formatting in most browsers
        document.execCommand(cmd, false, arg);
        onChange(el.innerHTML);
    }

    function onToolbarMouseDown(e: React.MouseEvent) {
        // prevents selection from being lost when clicking toolbar
        e.preventDefault();
    }

    function addLink() {
        const url = window.prompt("Enter link URL");
        if (!url) return;
        exec("createLink", url);
    }

    function refreshActive() {
        // queryCommandState works with execCommand formatting
        const bold = document.queryCommandState("bold");
        const italic = document.queryCommandState("italic");
        const ul = document.queryCommandState("insertUnorderedList");
        const ol = document.queryCommandState("insertOrderedList");

        // link detection: look for <a> in current selection
        let link = false;
        const sel = window.getSelection();
        const node = sel?.anchorNode;
        const el =
            node && node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as any as HTMLElement | null);
        link = !!el?.closest?.("a");

        setActive({ bold, italic, ul, ol, link });
    }

    function toolBtn(activeOn: boolean) {
        return cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md transition",
            activeOn ? "bg-slate-900" : "hover:bg-white",
        );
    }

    function toolIcon(activeOn: boolean) {
        return activeOn ? "text-white" : "text-slate-600";
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* toolbar (like pic-2/3) */}
            <div
                className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2"
                onMouseDown={onToolbarMouseDown}
            >
                <button
                    type="button"
                    onClick={() => {
                        exec("bold");
                        refreshActive();
                    }}
                    className={toolBtn(active.bold)}
                    aria-label="Bold"
                >
                    <Bold size={18} className={toolIcon(active.bold)} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        exec("italic");
                        refreshActive();
                    }}
                    className={toolBtn(active.italic)}
                    aria-label="Italic"
                >
                    <Italic size={18} className={toolIcon(active.italic)} />
                </button>

                <span className="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    onClick={() => {
                        exec("insertUnorderedList");
                        refreshActive();
                    }}
                    className={toolBtn(active.ul)}
                    aria-label="Bulleted list"
                >
                    <List size={18} className={toolIcon(active.ul)} />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        exec("insertOrderedList");
                        refreshActive();
                    }}
                    className={toolBtn(active.ol)}
                    aria-label="Numbered list"
                >
                    <ListOrdered size={18} className={toolIcon(active.ol)} />
                </button>

                <span className="mx-1 h-6 w-px bg-slate-200" />

                <button
                    type="button"
                    onClick={() => {
                        addLink();
                        refreshActive();
                    }}
                    className={toolBtn(active.link)}
                    aria-label="Insert link"
                >
                    <Link2 size={18} className={toolIcon(active.link)} />
                </button>
            </div>

            {/* editor */}
            <div className="relative">
                {isEmpty ? (
                    <div className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400">
                        {placeholder}
                    </div>
                ) : null}

                <div
                    ref={ref}
                    contentEditable
                    suppressContentEditableWarning
                    className={[
                        "min-h-[150px] px-4 py-4 text-sm text-slate-800 outline-none",
                        "focus:ring-2 focus:ring-[var(--primary)]/15",
                    ].join(" ")}
                    onInput={() => onChange(ref.current?.innerHTML ?? "")}
                    onKeyUp={refreshActive}
                    onMouseUp={refreshActive}
                    onFocus={refreshActive}
                />
            </div>
        </div>
    );
}

export default function WorkshopCreateClient() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState<DeliveryMode>("in_person");
    const isOnline = mode === "online";
    const [webinarPlatform, setWebinarPlatform] = useState<WebinarPlatform | null>("zoom");
    const [meetingPassword, setMeetingPassword] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [recordAutomatically, setRecordAutomatically] = useState(false);
    const [title, setTitle] = useState("");
    const [blurb, setBlurb] = useState("");
    const [coverFileName, setCoverFileName] = useState<string | null>(null);
    const [learningObjectives, setLearningObjectives] = useState("");
    const [cme, setCme] = useState(false);

    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [facility, setFacility] = useState<FacilityLocation | null>(null);
    const [openLocations, setOpenLocations] = useState(false);

    const FACILITY_OPTIONS: Array<ThemeDropdownOption<FacilityLocation>> = useMemo(
        () => facilities.map((f) => ({
            value: f.id,
            label: f.roomNumber ? `${f.name} (${f.roomNumber})` : f.name,
        })),
        [facilities]
    );

    // Load facilities on mount
    useEffect(() => {
        listFacilities()
            .then((res) => {
                setFacilities(res.items);
                if (res.items.length > 0) setFacility(res.items[0].id);
            })
            .catch((err) => console.error("Failed to load facilities:", err));
    }, []);

    const [days, setDays] = useState<DayAgenda[]>([
        {
            id: uid("day"),
            label: "Day 1 Agenda",
            segments: [
                {
                    id: uid("seg"),
                    topic: "",
                    details: "",
                    date: "11/15/2024",
                    startTime: "08:00 AM",
                    endTime: "12:00 PM",
                },
                {
                    id: uid("seg"),
                    topic: "",
                    details: "",
                    date: "11/15/2024",
                    startTime: "01:00 PM",
                    endTime: "05:00 PM",
                },
            ],
        },
        {
            id: uid("day"),
            label: "Day 2 Agenda",
            segments: [
                {
                    id: uid("seg"),
                    topic: "",
                    details: "",
                    date: "11/16/2024",
                    startTime: "09:00 AM",
                    endTime: "03:00 PM",
                },
            ],
        },
    ]);

    const [selectedFaculty, setSelectedFaculty] = useState<FacultyChip[]>([
        { id: uid("fac"), name: "Dr. Sarah Chen", role: "LEAD" },
        { id: uid("fac"), name: "James Wilson, RN", role: "ASSISTANT" },
    ]);

    // Faculty search state
    const [facultyQuery, setFacultyQuery] = useState("");
    const [facultyResults, setFacultyResults] = useState<Faculty[]>([]);
    const [facultySearching, setFacultySearching] = useState(false);
    const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
    const facultySearchRef = useRef<HTMLDivElement | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const debouncedFacultyQuery = useDebounce(facultyQuery, 300);

    // Run search when debounced query changes (min 3 chars)
    useEffect(() => {
        if (debouncedFacultyQuery.length < 3) {
            setFacultyResults([]);
            setFacultyDropdownOpen(false);
            return;
        }

        // Cancel previous in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setFacultySearching(true);
        searchFaculty(debouncedFacultyQuery, 1, 10, controller.signal)
            .then((res) => {
                setFacultyResults(res.data);
                setFacultyDropdownOpen(true);
            })
            .catch((err) => {
                if (err?.name !== "AbortError" && err?.code !== "ERR_CANCELED") {
                    console.error("Faculty search failed:", err);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setFacultySearching(false);
                }
            });

        return () => controller.abort();
    }, [debouncedFacultyQuery]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (facultySearchRef.current && !facultySearchRef.current.contains(e.target as Node)) {
                setFacultyDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectFacultyFromSearch(faculty: Faculty) {
        const alreadySelected = selectedFaculty.some((f) => f.id === faculty.id);
        if (!alreadySelected) {
            setSelectedFaculty((prev) => [
                ...prev,
                {
                    id: faculty.id,
                    name: `${faculty.firstName} ${faculty.lastName}`,
                    role: faculty.medicalDesignation,
                },
            ]);
        }
        setFacultyQuery("");
        setFacultyDropdownOpen(false);
        setFacultyResults([]);
    }

    const [capacity, setCapacity] = useState(24);
    const [alert, setAlert] = useState(5);
    const [standardRate, setStandardRate] = useState(450);
    const [minAttendees, setMinAttendees] = useState(5);
    const [groupRate, setGroupRate] = useState(400);
    const [draftStatus, setDraftStatus] = useState<"Draft" | "Ready">("Draft");
    const derivedTotalDays = useMemo(() => days.length, [days.length]);

    function addDay() {
        setDays((prev) => [
            ...prev,
            {
                id: uid("day"),
                label: `Day ${prev.length + 1} Agenda`,
                segments: [
                    {
                        id: uid("seg"),
                        topic: "",
                        details: "",
                        date: "",
                        startTime: "",
                        endTime: "",
                    },
                ],
            },
        ]);
    }

    function removeDay(dayId: string) {
        setDays((prev) => prev.filter((d) => d.id !== dayId));
    }

    function addSegment(dayId: string) {
        setDays((prev) =>
            prev.map((d) =>
                d.id !== dayId
                    ? d
                    : {
                        ...d,
                        segments: [
                            ...d.segments,
                            {
                                id: uid("seg"),
                                topic: "",
                                details: "",
                                date: "",
                                startTime: "",
                                endTime: "",
                            },
                        ],
                    }
            )
        );
    }

    function removeSegment(dayId: string, segId: string) {
        setDays((prev) =>
            prev.map((d) =>
                d.id !== dayId ? d : { ...d, segments: d.segments.filter((s) => s.id !== segId) }
            )
        );
    }

    function updateSegment(dayId: string, segId: string, patch: Partial<Segment>) {
        setDays((prev) =>
            prev.map((d) =>
                d.id !== dayId
                    ? d
                    : { ...d, segments: d.segments.map((s) => (s.id === segId ? { ...s, ...patch } : s)) }
            )
        );
    }

    function removeFaculty(id: string) {
        setSelectedFaculty((prev) => prev.filter((f) => f.id !== id));
    }

    function buildPayload(status: WorkshopStatus): CreateWorkshopRequest {
        return {
            deliveryMode: mode,
            status,
            title,
            shortBlurb: blurb || undefined,
            coverImageUrl: coverFileName || undefined,
            learningObjectives: learningObjectives || undefined,
            offersCmeCredits: cme,
            facilityIds: facility ? [facility] : [],
            webinarPlatform: isOnline ? (webinarPlatform ?? undefined) : null,
            meetingLink: isOnline ? (meetingLink || undefined) : null,
            meetingPassword: isOnline ? (meetingPassword || undefined) : null,
            autoRecordSession: isOnline ? recordAutomatically : false,
            capacity,
            alertAt: alert,
            standardBaseRate: String(standardRate),
            groupDiscountEnabled: minAttendees > 0 && groupRate > 0,
            groupDiscounts:
                minAttendees > 0 && groupRate > 0
                    ? [{ minimumAttendees: minAttendees, groupRatePerPerson: String(groupRate) }]
                    : [],
            facultyIds: selectedFaculty.map((f) => f.id),
            days: days.map((d, dIdx) => ({
                date: d.segments[0]?.date || "",
                dayNumber: dIdx + 1,
                segments: d.segments.map((s, sIdx) => ({
                    segmentNumber: sIdx + 1,
                    courseTopic: s.topic || "",
                    topicDetails: s.details || undefined,
                    startTime: s.startTime || "",
                    endTime: s.endTime || "",
                })),
            })),
        };
    }

    async function handleSubmit(status: WorkshopStatus) {
        const payload = buildPayload(status);

        const parsed = createWorkshopSchema.safeParse(payload);
        if (!parsed.success) {
            setDraftStatus("Draft");
            window.alert(parsed.error.issues[0]?.message ?? "Validation error");
            return;
        }

        setSubmitting(true);
        try {
            await createWorkshop(payload);
            setDraftStatus("Ready");
            router.push("/courses");
        } catch (err: any) {
            console.error("Failed to create workshop:", err);
            window.alert(err?.response?.data?.message || "Failed to create workshop. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <Link
                        href="/courses"
                        className="mt-1 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                        aria-label="Back"
                    >
                        <ArrowLeft size={16} />
                    </Link>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Create New Clinical Workshop
                            </h1>

                            <span
                                className={cx(
                                    "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1",
                                    draftStatus === "Ready"
                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                                        : "bg-slate-50 text-slate-600 ring-slate-200"
                                )}
                            >
                                {draftStatus}
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Configure workshop details, faculty, and logistics for upcoming sessions.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <SecondaryButton type="button" onClick={() => router.push("/courses")}>
                        Discard
                    </SecondaryButton>
                    <PrimaryButton type="button" disabled={submitting} onClick={() => handleSubmit("published")}>
                        Publish
                    </PrimaryButton>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
                {/* LEFT */}
                <div className="space-y-5">
                    <Card
                        title="Delivery Mode"
                        subtitle="Select how this clinical training will be conducted."
                        icon={<span className="text-[var(--primary)]">⎈</span>}
                    >
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setMode("in_person")}
                                className={cx(
                                    "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                                    mode === "in_person"
                                        ? "border-[var(--primary)]/25 bg-[var(--primary-50)] ring-2 ring-[var(--primary)]/15"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                                        <span className="text-[var(--primary)]">🧪</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">In-Person Lab</p>
                                        <p className="text-xs text-slate-500">Hands-on training at facility</p>
                                    </div>
                                </div>

                                <span
                                    className={cx(
                                        "grid h-6 w-6 place-items-center rounded-full border",
                                        mode === "in_person" ? "border-cyan-300 bg-white" : "border-slate-200 bg-white"
                                    )}
                                >
                                    {mode === "in_person" ? (
                                        <Check size={14} className="text-[var(--primary)]" />
                                    ) : null}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setMode("online")}
                                className={cx(
                                    "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition",
                                    mode === "online"
                                        ? "border-[var(--primary)]/25 bg-[var(--primary-50)] ring-2 ring-[var(--primary)]/15"
                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200">
                                        <span className="text-[var(--primary)]">🖥️</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Online Webinar</p>
                                        <p className="text-xs text-slate-500">Live virtual session</p>
                                    </div>
                                </div>

                                <span
                                    className={cx(
                                        "grid h-6 w-6 place-items-center rounded-full border",
                                        mode === "online" ? "border-cyan-300 bg-white" : "border-slate-200 bg-white"
                                    )}
                                >
                                    {mode === "online" ? (
                                        <Check size={14} className="text-[var(--primary)]" />
                                    ) : null}
                                </span>
                            </button>
                        </div>
                    </Card>

                    {isOnline ? (
                        <Card
                            title="Webinar Configuration"
                            subtitle="Virtual classroom access and recording settings."
                            icon={<span className="text-[var(--primary)]">🛰️</span>}
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <Label>Webinar Platform</Label>

                                        <ThemeDropdown<WebinarPlatform>
                                            value={webinarPlatform}
                                            options={WEBINAR_PLATFORM_OPTIONS}
                                            placeholder="Select webinar platform"
                                            onChange={setWebinarPlatform}
                                            buttonClassName="rounded-md mt-0 h-10 px-3 py-0"
                                        />
                                    </div>

                                    <div>
                                        <Label>Meeting Password</Label>
                                        <TextInput
                                            value={meetingPassword}
                                            onChange={(e) => setMeetingPassword(e.target.value)}
                                            placeholder="e.g., TAI-2026-ADV"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Meeting Link</Label>
                                    <TextInput
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <label className="flex items-center gap-3 text-xs text-slate-600">
                                    {/* simple toggle without assuming your Switch component */}
                                    <button
                                        type="button"
                                        onClick={() => setRecordAutomatically((s) => !s)}
                                        className={cx(
                                            "relative h-6 w-11 rounded-full border transition",
                                            recordAutomatically
                                                ? "border-[var(--primary)] bg-[var(--primary)]"
                                                : "border-slate-200 bg-slate-100"
                                        )}
                                        aria-label="Record session automatically"
                                    >
                                        <span
                                            className={cx(
                                                "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition",
                                                recordAutomatically ? "left-[22px]" : "left-[2px]"
                                            )}
                                        />
                                    </button>

                                    Record Session Automatically
                                </label>
                            </div>
                        </Card>
                    ) : null}

                    <Card
                        title="Essentials"
                        subtitle="Define the core attributes of the workshop."
                        icon={<span className="text-[var(--primary)]">📄</span>}
                    >
                        <div className="space-y-4">
                            <div>
                                <Label>Workshop Title</Label>
                                <TextInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Advanced Airway Management"
                                />
                            </div>

                            <div>
                                <Label>Short Blurb</Label>
                                <TextArea
                                    value={blurb}
                                    onChange={(e) => setBlurb(e.target.value)}
                                    placeholder="Brief description for the course catalog..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card
                        title="Syllabus & Details"
                        subtitle="Learning objectives and accreditation info."
                        icon={<BookOpen size={18} />}
                    >
                        <div className="space-y-4">
                            <div>
                                <SectionLabel>Learning Objectives</SectionLabel>

                                <RichTextEditor
                                    value={learningObjectives}
                                    onChange={setLearningObjectives}
                                    placeholder="• Identify indications for endotracheal intubation..."
                                />
                            </div>

                            <label className="flex items-center gap-3 text-xs text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={cme}
                                    onChange={(e) => setCme(e.target.checked)}
                                    className="h-5 w-5 rounded-md border-slate-300 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                                />
                                This course offers CME credits
                            </label>
                        </div>
                    </Card>

                    <Card
                        title="Course Schedule"
                        subtitle="Build the workshop agenda and session timeline."
                        icon={<Calendar size={16} className="text-[var(--primary)]" />}
                    >
                        <div className="space-y-6">
                            {days.map((day, dayIndex) => (
                                <div key={day.id} className="rounded-2xl border border-slate-200 bg-white">
                                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                                {dayIndex + 1}
                                            </span>
                                            <p className="text-sm font-semibold text-slate-900">{day.label}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeDay(day.id)}
                                            className="text-xs font-semibold text-[var(--primary)] hover:underline"
                                        >
                                            REMOVE DAY
                                        </button>
                                    </div>

                                    <div className="space-y-4 px-4 pb-4">
                                        {day.segments.map((seg, segIndex) => (
                                            <div
                                                key={seg.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                        Segment {segIndex + 1}
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeSegment(day.id, seg.id)}
                                                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
                                                        aria-label="Remove segment"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div className="md:col-span-2">
                                                        <Label>Course Topic</Label>
                                                        <TextInput
                                                            value={seg.topic}
                                                            onChange={(e) =>
                                                                updateSegment(day.id, seg.id, { topic: e.target.value })
                                                            }
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <Label>Topic Details</Label>
                                                        <TextArea
                                                            value={seg.details}
                                                            onChange={(e) =>
                                                                updateSegment(day.id, seg.id, { details: e.target.value })
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <Label>Date</Label>
                                                        <div className="relative">
                                                            <TextInput
                                                                value={seg.date}
                                                                onChange={(e) =>
                                                                    updateSegment(day.id, seg.id, { date: e.target.value })
                                                                }
                                                            />
                                                            <Calendar
                                                                size={16}
                                                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label>Start Time</Label>
                                                            <div className="relative">
                                                                <TextInput
                                                                    value={seg.startTime}
                                                                    onChange={(e) =>
                                                                        updateSegment(day.id, seg.id, { startTime: e.target.value })
                                                                    }
                                                                />
                                                                <Clock
                                                                    size={16}
                                                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Label>End Time</Label>
                                                            <div className="relative">
                                                                <TextInput
                                                                    value={seg.endTime}
                                                                    onChange={(e) =>
                                                                        updateSegment(day.id, seg.id, { endTime: e.target.value })
                                                                    }
                                                                />
                                                                <Clock
                                                                    size={16}
                                                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <SecondaryButton type="button" onClick={() => addSegment(day.id)} className="w-fit">
                                            <Plus size={16} />
                                            Add Segment
                                        </SecondaryButton>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:opacity-90 active:scale-[0.99] transition"
                                >
                                    <Plus size={16} />
                                    Add Day
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card
                        title="Faculty"
                        subtitle="Assign instructors or add new experts."
                        icon={<span className="text-[var(--primary)]">🎓</span>}
                    >
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                <input
                                    type="checkbox"
                                    checked
                                    readOnly
                                    className="h-5 w-5 rounded-md border-slate-300 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                                />
                                Default Faculty (Admin)
                            </label>

                            <div>
                                <Label>Assign Existing Faculty</Label>
                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                    <div ref={facultySearchRef} className="relative">
                                        <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500">
                                            {facultySearching ? (
                                                <Loader2 size={16} className="animate-spin text-slate-400" />
                                            ) : (
                                                <Search size={16} className="text-slate-400" />
                                            )}
                                            <input
                                                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                                placeholder="Search by name, designation, or workplace..."
                                                value={facultyQuery}
                                                onChange={(e) => setFacultyQuery(e.target.value)}
                                                onFocus={() => {
                                                    if (facultyResults.length > 0) setFacultyDropdownOpen(true);
                                                }}
                                            />
                                            {facultyQuery.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFacultyQuery("");
                                                        setFacultyResults([]);
                                                        setFacultyDropdownOpen(false);
                                                    }}
                                                    className="text-slate-400 hover:text-slate-600"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>

                                        {facultyDropdownOpen && (
                                            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                                {facultyResults.length === 0 ? (
                                                    <div className="px-4 py-3 text-center text-sm text-slate-400">
                                                        No faculty found
                                                    </div>
                                                ) : (
                                                    facultyResults
                                                        .filter((r) => !selectedFaculty.some((s) => s.id === r.id))
                                                        .map((faculty) => (
                                                            <button
                                                                key={faculty.id}
                                                                type="button"
                                                                onClick={() => selectFacultyFromSearch(faculty)}
                                                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                                                            >
                                                                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                                                                    {faculty.imageUrl ? (
                                                                        <img
                                                                            src={faculty.imageUrl}
                                                                            alt={`${faculty.firstName} ${faculty.lastName}`}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="grid h-full w-full place-items-center text-xs font-bold text-slate-500">
                                                                            {faculty.firstName[0]}{faculty.lastName[0]}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 leading-tight">
                                                                    <p className="truncate text-sm font-semibold text-slate-800">
                                                                        {faculty.firstName} {faculty.lastName}
                                                                    </p>
                                                                    <p className="truncate text-xs text-slate-500">
                                                                        {faculty.medicalDesignation} · {faculty.institutionOrHospital}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        ))
                                                )}
                                            </div>
                                        )}

                                        {facultyQuery.length > 0 && facultyQuery.length < 3 && !facultySearching && (
                                            <p className="mt-1 text-xs text-slate-400">
                                                Type at least 3 characters to search
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {selectedFaculty.map((f) => (
                                            <div
                                                key={f.id}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5"
                                            >
                                                <span className="h-5 w-5 rounded-full bg-slate-100" />
                                                <div className="leading-tight">
                                                    <p className="text-xs font-semibold text-slate-800">{f.name}</p>
                                                    <p className="text-[10px] font-semibold text-slate-400">{f.role}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaculty(f.id)}
                                                    className="ml-1 text-slate-400 hover:text-slate-700"
                                                    aria-label="Remove faculty"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/users/faculty/register-faculty"
                                className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-4 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary-50)]/30 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-slate-200 group-hover:ring-[var(--primary)]/20 transition">
                                        <Plus size={18} className="text-[var(--primary)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Register New Faculty</p>
                                        <p className="text-xs text-slate-500">Add a new instructor or expert to the system</p>
                                    </div>
                                </div>
                                <ArrowLeft size={16} className="rotate-180 text-slate-400 group-hover:text-[var(--primary)] transition" />
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">
                    <Card
                        title="Date & Location"
                        subtitle="Schedule summary"
                        icon={<Calendar size={16} className="text-[var(--primary)]" />}
                        right={<TinyPill>{derivedTotalDays} Days Total</TinyPill>}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {days.map((d, idx) => (
                                    <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3">
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            Day {idx + 1}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span>{d.segments[0]?.date || "—"}</span>
                                            <span className="text-slate-300">•</span>
                                            <Clock size={14} className="text-slate-400" />
                                            <span>
                                                {(d.segments[0]?.startTime || "—") +
                                                    " - " +
                                                    (d.segments[0]?.endTime || "—")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <Label>Facility / Location</Label>

                                {isOnline ? (
                                    <div className="flex h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                                        <span className="text-slate-400">N/A (Online Only)</span>
                                    </div>
                                ) : (
                                    <>
                                        <ThemeDropdown<FacilityLocation>
                                            value={facility}
                                            options={FACILITY_OPTIONS}
                                            placeholder="Select facility"
                                            onChange={setFacility}
                                            buttonClassName="rounded-md mt-0 h-10 px-3 py-0"
                                        />

                                        <div className="mt-3">
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => setOpenLocations(true)}
                                                className="w-fit"
                                            >
                                                <Plus size={16} className="text-[var(--primary)]" />
                                                Add Location
                                            </SecondaryButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Inventory (Seats)" icon={<span className="text-[var(--primary)]">🪑</span>}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Capacity</Label>
                                    <TextInput
                                        value={String(capacity)}
                                        onChange={(e) => setCapacity(Number(e.target.value || 0))}
                                        inputMode="numeric"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label>Alert</Label>
                                        <span className="text-[11px] font-semibold text-slate-400">ⓘ</span>
                                    </div>
                                    <TextInput
                                        value={String(alert)}
                                        onChange={(e) => setAlert(Number(e.target.value || 0))}
                                        inputMode="numeric"
                                    />
                                </div>
                            </div>

                            <SeatMap capacity={capacity} />
                        </div>
                    </Card>

                    <Card title="Pricing" icon={<span className="text-[var(--primary)]">$</span>}>
                        <div className="space-y-4">
                            <div>
                                <Label>Standard Base Rate</Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                        $
                                    </span>
                                    <TextInput
                                        value={String(standardRate)}
                                        onChange={(e) => setStandardRate(Number(e.target.value || 0))}
                                        className="pl-8"
                                        inputMode="decimal"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                                    Group Discount Settings
                                </p>

                                <div className="mt-3 space-y-3">
                                    <div>
                                        <Label>Minimum Attendees</Label>
                                        <TextInput
                                            value={String(minAttendees)}
                                            onChange={(e) => setMinAttendees(Number(e.target.value || 0))}
                                            inputMode="numeric"
                                        />
                                        <p className="mt-1 text-xs text-slate-400">
                                            Set the minimum number of attendees required to trigger the group rate.
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Group Rate per Person</Label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                                $
                                            </span>
                                            <TextInput
                                                value={String(groupRate)}
                                                onChange={(e) => setGroupRate(Number(e.target.value || 0))}
                                                className="pl-8"
                                                inputMode="decimal"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Status & Tracking" icon={<span className="text-[var(--primary)]">⏱</span>}>
                        <div className="space-y-3">
                            <SecondaryButton type="button" className="w-full" disabled={submitting} onClick={() => handleSubmit("draft")}>
                                {submitting ? "Saving..." : "Save Draft"}
                            </SecondaryButton>

                            <p className="text-center text-[11px] text-slate-400">
                                LAST AUTO-SAVED 2 MINS AGO
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            <ManageClinicalLocationsModal
                open={openLocations}
                onClose={() => setOpenLocations(false)}
                selectedId={facility}
                onSelect={(fac) => {
                    setFacility(fac.id);
                }}
                onFacilitiesChange={(updated) => {
                    setFacilities(updated);
                }}
            />
        </div>
    );
}