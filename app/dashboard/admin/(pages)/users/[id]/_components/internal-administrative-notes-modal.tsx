"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type NoteTag = "SYSTEM AUDIT" | "OUTREACH" | "ADMINISTRATIVE";

type NoteItem = {
    id: string;
    tag: NoteTag;
    date: string;
    title: string; // "Dr. Elena Rodriguez"
    subtitle?: string; // "(System Lead)"
    body: string;
};

function tagColor(tag: NoteTag) {
    // use project theme (primary) for labels
    if (tag === "SYSTEM AUDIT") return "text-[var(--primary)]";
    if (tag === "OUTREACH") return "text-[var(--primary)]";
    return "text-[var(--primary)]";
}

export default function InternalAdministrativeNotesModal({
    open,
    onClose,
    forName = "Dr. Sarah Thompson",
    avatarSrc, // ✅ add
}: {
    open: boolean;
    onClose: () => void;
    forName?: string;
    avatarSrc?: string; // ✅ add
}) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [topbarH, setTopbarH] = useState(0);
    const [noteText, setNoteText] = useState("");

    const notes = useMemo<NoteItem[]>(
        () => [
            {
                id: "n1",
                tag: "SYSTEM AUDIT",
                date: "Oct 24, 2026",
                title: "Dr. Elena Rodriguez",
                subtitle: "(System Lead)",
                body:
                    "Called about certificate download issue. Resolved via email and updated credentials database accordingly.",
            },
            {
                id: "n2",
                tag: "OUTREACH",
                date: "Sep 12, 2025",
                title: "Arthur Knight",
                body:
                    "Met at Houston conference. Interested in becoming a lead instructor for the Pediatric Airway course. Follow up scheduled for Q4.",
            },
            {
                id: "n3",
                tag: "ADMINISTRATIVE",
                date: "Jan 05, 2025",
                title: "Admin Portal",
                body:
                    "Initial profile creation and validation of medical license TX-77291. All documentation verified.",
            },
        ],
        []
    );

    // measure topbar height (NOT fixed)
    useEffect(() => {
        if (!open) return;

        const measure = () => {
            const el = document.getElementById("admin-topbar");
            if (!el) return setTopbarH(0);
            const r = el.getBoundingClientRect();
            setTopbarH(Math.max(0, Math.round(r.height)));
        };

        measure();

        // keep it in sync on resize
        window.addEventListener("resize", measure);

        // also re-measure next frame (fonts/layout settle)
        requestAnimationFrame(measure);

        return () => window.removeEventListener("resize", measure);
    }, [open]);

    // ESC close
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // prevent background scroll when open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            // overlay starts BELOW topbar so topbar stays visible
            style={{ position: "fixed", left: 0, right: 0, top: topbarH, bottom: 0, zIndex: 60 }}
            aria-modal="true"
            role="dialog"
            onMouseDown={(e) => {
                const box = modalRef.current;
                if (!box) return;
                if (!box.contains(e.target as Node)) onClose();
            }}
        >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* modal shell */}
            <div className="relative h-full w-full overflow-auto p-6">
                <div
                    ref={modalRef}
                    className="mx-auto w-[760px] max-w-[92vw] rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
                >
                    {/* header */}
                    <div className="flex items-start justify-between gap-4 rounded-t-3xl bg-slate-50 px-6 py-5">
                        <div>
                            <div className="text-xl font-extrabold text-slate-900">
                                Internal Administrative Notes
                            </div>
                            <div className="mt-1 text-xs font-semibold text-slate-500">For {forName}</div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* body */}
                    <div className="px-6 py-6">
                        {/* New note */}
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <span
                                className="grid h-5 w-5 place-items-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]"
                                aria-hidden="true"
                            >
                                <span className="text-lg font-extrabold leading-none">+</span>
                            </span>
                            New Administrative Note
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                                    {/* ✅ image if provided, otherwise fallback */}
                                    {avatarSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={avatarSrc}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            draggable={false}
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-slate-200" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Type a new administrative note here..."
                                        className="min-h-[120px] w-full resize-none bg-transparent px-0 py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 border-0"
                                    />

                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // hook API later
                                                setNoteText("");
                                                onClose();
                                            }}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
                                        >
                                            Save Note
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* History header */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm font-bold text-slate-900">
                                Previous Notes History ({notes.length} Notes)
                            </div>

                            <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                                Chronological
                            </div>
                        </div>

                        {/* list */}
                        <div className="mt-4 space-y-4">
                            {notes.map((n) => (
                                <div
                                    key={n.id}
                                    className="rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200"
                                >
                                    <div className="text-[10px] font-extrabold uppercase tracking-wide">
                                        <span className={tagColor(n.tag)}>{n.tag}</span>
                                    </div>

                                    <div className="mt-1 text-sm font-bold text-slate-900">
                                        {n.date} • {n.title}{" "}
                                        {n.subtitle ? (
                                            <span className="text-xs font-semibold text-slate-500">{n.subtitle}</span>
                                        ) : null}
                                    </div>

                                    <div className="mt-2 text-xs font-medium leading-5 text-slate-600">
                                        {n.body}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end gap-3 rounded-b-3xl bg-white px-6 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                        >
                            Print History
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}