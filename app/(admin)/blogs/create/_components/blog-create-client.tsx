"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AddedToNewsletterModal from "./added-to-newsletter-modal";
import {
    ArrowLeft,
    Bold,
    Italic,
    Underline,
    Link as LinkIcon,
    ImageIcon,
    Heading1,
    Heading2,
    Quote,
    Eye,
    CalendarDays,
    ChevronDown,
    X,
    FileText,
    Share2,
    Mail,
    Check,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {children}
        </p>
    );
}

function Input({
    placeholder,
    value,
    onChange,
}: {
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100"
        />
    );
}

function TextArea({
    placeholder,
    value,
    onChange,
    rows = 5,
}: {
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
}) {
    return (
        <textarea
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-100"
        />
    );
}

function GhostBtn({
    children,
    onClick,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition",
                className
            )}
        >
            {children}
        </button>
    );
}

function PrimaryBtn({
    children,
    onClick,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition",
                className
            )}
        >
            {children}
        </button>
    );
}

function ToolBtn({ icon }: { icon: React.ReactNode }) {
    return (
        <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
            {icon}
        </button>
    );
}

function PublishScheduledModal({
    title,
    publishDate,
    publishTime,
    onClose,
    onViewSchedule,
    onReturnDashboard,
}: {
    title: string;
    publishDate: string;
    publishTime: string;
    onClose: () => void;
    onViewSchedule: () => void;
    onReturnDashboard: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            {/* modal */}
            <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-cyan-100">
                    <CalendarDays size={18} className="text-[var(--primary)]" />
                </div>

                <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
                    Article Scheduled Successfully
                </h3>

                <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                    Your clinical update has been successfully queued for publication. It will go live and
                    notify subscribers at the selected time.
                </p>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Article Title
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Publish Date
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">{publishDate}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Publish Time
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">{publishTime}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <GhostBtn onClick={onViewSchedule} className="px-4">
                        View Schedule
                    </GhostBtn>
                    <PrimaryBtn onClick={onReturnDashboard} className="px-4">
                        Return to Dashboard
                    </PrimaryBtn>
                </div>
            </div>
        </div>
    );
}

function DraftSavedModal({
    title,
    onClose,
    onContinue,
    onReturn,
}: {
    title: string;
    onClose: () => void;
    onContinue: () => void;
    onReturn: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-cyan-100">
                    <FileText size={18} className="text-[var(--primary)]" />
                </div>

                <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
                    Draft Saved Successfully
                </h3>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Article Title
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                        {title.length > 34 ? `${title.slice(0, 34)}...` : title}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Last Saved
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">Just now</p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Status
                            </p>
                            <span className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                DRAFT
                            </span>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                    Your progress has been safely stored. This article will remain as a draft and will not be
                    visible to the public until you choose to publish it.
                </p>

                <div className="mt-5 space-y-2">
                    <button
                        type="button"
                        onClick={onContinue}
                        className="h-10 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                    >
                        Continue Editing
                    </button>

                    <button
                        type="button"
                        onClick={onReturn}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Return to Blog Management
                    </button>
                </div>
            </div>
        </div>
    );
}

function DiscardUnsavedModal({
    onClose,
    onSaveAsDraft,
    onDiscard,
}: {
    onClose: () => void;
    onSaveAsDraft: () => void;
    onDiscard: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 ring-1 ring-rose-100">
                    {/* warning icon */}
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[var(--red)] ring-1 ring-rose-100">
                        ▲
                    </span>
                </div>

                <h3 className="mt-4 text-center text-base font-extrabold text-slate-900">
                    Discard Unsaved Changes?
                </h3>

                <p className="mt-2 text-center text-xs leading-5 text-slate-500">
                    You have unsaved changes in your clinical article. If you leave now, these updates will be
                    permanently lost. Would you like to save your progress as a draft first?
                </p>

                <div className="mt-5 space-y-2">
                    <button
                        type="button"
                        onClick={onSaveAsDraft}
                        className="h-10 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                    >
                        Save as Draft
                    </button>

                    <button
                        type="button"
                        onClick={onDiscard}
                        className="h-10 w-full rounded-md border px-3 text-xs font-semibold transition"
                        style={{
                            borderColor: "var(--red)",
                            color: "var(--red)",
                            backgroundColor: "#fff",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                "rgba(231,53,8,0.06)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fff";
                        }}
                    >
                        Discard Anyway
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

function LiveNowModal({
    title,
    author,
    category,
    readTime,
    onClose,
    onViewLive,
    onShare,
    onDone,
}: {
    title: string;
    author: string;
    category: string;
    readTime: string;
    onClose: () => void;
    onViewLive: () => void;
    onShare: () => void;
    onDone: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
            {/* backdrop */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
                    aria-label="Close modal"
                >
                    <X size={16} />
                </button>

                {/* top icon */}
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--primary-50)] ring-1 ring-cyan-100">
                    {/* closest lucide vibe */}
                    <span className="text-[var(--primary)]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 3v10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M8 7a6 6 0 0 1 8 0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M5 10a10 10 0 0 1 14 0"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M12 19a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </span>
                </div>

                <h3 className="mt-4 text-center text-xl font-extrabold text-slate-900">
                    Your Clinical Insight is Now Live!
                </h3>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Article
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Author
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">{author}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Category
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">{category}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Read Time
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-700">{readTime}</p>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                    Your article has been successfully published to the Clinical Blog and is now visible to all
                    subscribers and the medical community.
                </p>

                <button
                    type="button"
                    onClick={onViewLive}
                    className="mt-5 h-11 w-full rounded-md bg-[var(--primary)] text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                >
                    <span className="inline-flex items-center justify-center gap-2">
                        <Eye size={16} />
                        View Live Article
                    </span>
                </button>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={onShare}
                        className="h-11 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            <Share2 size={16} />
                            Share Article
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onDone}
                        className="h-11 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

function ShareDistributionModal({
    onClose,
    onProceed,
}: {
    onClose: () => void;
    onProceed: (channel: "email_blast" | "newsletter" | "trainees") => void;
}) {
    const [selected, setSelected] = useState<
        "email_blast" | "newsletter" | "trainees" | null
    >(null);

    const Option = ({
        id,
        title,
        desc,
        icon,
    }: {
        id: "email_blast" | "newsletter" | "trainees";
        title: string;
        desc: string;
        icon: React.ReactNode;
    }) => {
        const active = selected === id;

        return (
            <button
                type="button"
                onClick={() => setSelected(id)}
                className={cx(
                    "w-full rounded-xl border p-4 text-left transition",
                    "border-slate-200 bg-white hover:bg-slate-50",
                    active && "ring-2 ring-cyan-100 border-cyan-200"
                )}
            >
                <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-700">
                        {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-slate-900">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                    </div>

                    <span
                        className={cx(
                            "mt-1 grid h-5 w-5 place-items-center rounded-full border",
                            active ? "border-[var(--primary)]" : "border-slate-300"
                        )}
                    >
                        <span
                            className={cx(
                                "h-2.5 w-2.5 rounded-full",
                                active ? "bg-[var(--primary)]" : "bg-transparent"
                            )}
                        />
                    </span>
                </div>
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="p-6">
                    <h3 className="text-xl font-extrabold text-slate-900">
                        Distribute Clinical Article
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Select your target distribution channels for this post.
                    </p>

                    <div className="mt-5 space-y-3">
                        <Option
                            id="email_blast"
                            title="Email Blast"
                            desc="Send an immediate notification to all 2,450 general subscribers."
                            icon={<span className="text-base">📣</span>}
                        />
                        <Option
                            id="newsletter"
                            title="Monthly/Weekly Newsletter"
                            desc="Add this article to the queue for the upcoming monthly clinical digest."
                            icon={<span className="text-base">🗞️</span>}
                        />
                        <Option
                            id="trainees"
                            title="Course Trainees"
                            desc="Notify current students in active airway cohorts about this new resource."
                            icon={<span className="text-base">🎓</span>}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 w-[120px] rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={!selected}
                        onClick={() => selected && onProceed(selected)}
                        className={cx(
                            "h-11 rounded-md px-5 text-sm font-semibold text-white transition",
                            !selected
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                        )}
                    >
                        <span className="inline-flex items-center gap-2">
                            Proceed to Delivery <span aria-hidden>→</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function EmailBlastModal({
    title,
    onBack,
    onClose,
    onSend,
}: {
    title: string;
    onBack: () => void;
    onClose: () => void;
    onSend: () => void;
}) {
    const [sendCopy, setSendCopy] = useState(true);

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-lg font-extrabold text-slate-900">Send Email Blast</h3>
                <p className="mt-1 text-xs text-slate-500">
                    You are about to send an immediate notification for this article.
                </p>

                {/* NEXT CAMPAIGN */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                        Next Campaign
                    </p>

                    <div className="mt-1 flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-extrabold text-slate-900">Weekly Clinical Briefing</p>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays size={14} className="text-slate-400" />
                                    Next Sunday, Nov 08
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <FileText size={14} className="text-slate-400" />
                                    3 Articles in Queue
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-[var(--primary)] hover:bg-slate-50 transition"
                            aria-label="Open newsletter"
                        >
                            ✉️
                        </button>
                    </div>
                </div>

                {/* NEWSLETTER PREVIEW */}
                <div className="mt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Newsletter Preview
                    </p>

                    <div className="mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100" />

                        <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900">
                                Advanced Airway Management Protocols: 2026 Clinical Updates
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Recent longitudinal studies demonstrate that hybrid intubation techniques significantly reduce first-pass failure rates in traum...
                            </p>
                        </div>
                    </div>
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-slate-600">
                    <input
                        type="checkbox"
                        checked={sendCopy}
                        onChange={() => setSendCopy((v) => !v)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--primary)]"
                    />
                    <span>Send a copy to my admin email for verification.</span>
                </label>

                <p className="mt-2 text-[11px] text-slate-400">
                    Note: This action cannot be undone once the broadcast begins.
                </p>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="h-10 w-[110px] rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onSend}
                        className="h-10 rounded-md bg-[var(--primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                    >
                        <span className="inline-flex items-center gap-2">
                            <span aria-hidden>▶</span> Send Blast Now
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function NewsletterQueueModal({
    onBack,
    onClose,
    onConfirm,
}: {
    onBack: () => void;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const [rhythm, setRhythm] = useState<"weekly" | "monthly">("weekly");

    const NewsletterPreviewCard = () => (
        <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Newsletter Preview
            </p>

            <div className="mt-2 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                {/* thumbnail */}
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100">
                    <ImageIcon size={18} className="text-slate-400" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                        Advanced Airway Management Protocols: 2026 Clinical Updates
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Recent longitudinal studies demonstrate that hybrid intubation
                        techniques significantly reduce first-pass failure rates in traum...
                    </p>
                </div>
            </div>
        </div>
    );

    const RhythmCard = ({
        id,
        title,
        subtitle,
        activeIcon,
    }: {
        id: "weekly" | "monthly";
        title: string;
        subtitle: string;
        activeIcon?: boolean;
    }) => {
        const active = rhythm === id;

        return (
            <button
                type="button"
                onClick={() => setRhythm(id)}
                className={cx(
                    "relative rounded-xl border p-4 text-left transition",
                    active
                        ? "border-[var(--primary)] bg-[var(--primary-50)] ring-2 ring-cyan-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                )}
            >
                <div
                    className={cx(
                        "grid h-9 w-9 place-items-center rounded-lg",
                        active ? "bg-white text-[var(--primary)]" : "bg-slate-50 text-slate-600"
                    )}
                >
                    <CalendarDays size={16} />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

                {/* ✅ bottom-right selected tick (like your 2nd screenshot) */}
                {active && (
                    <span className="absolute bottom-3 right-3 grid h-5 w-5 place-items-center rounded-full border border-[var(--primary)] bg-white">
                        <Check size={12} className="text-[var(--primary)]" />
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[640px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-xl font-extrabold text-slate-900">
                    Add to Newsletter Queue
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Select the delivery rhythm for this clinical article.
                </p>

                {/* rhythm choices */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <RhythmCard
                        id="weekly"
                        title="Weekly Update"
                        subtitle="Sends every Sunday"
                    />
                    <RhythmCard
                        id="monthly"
                        title="Monthly Digest"
                        subtitle="First Monday monthly"
                    />
                </div>

                {/* next campaign */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                        Next Campaign
                    </p>

                    <div className="mt-1 flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Weekly Clinical Briefing
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays size={14} className="text-slate-400" />
                                    Next Sunday, Nov 08
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <FileText size={14} className="text-slate-400" />
                                    3 Articles in Queue
                                </span>
                            </div>
                        </div>

                        {/* ✅ right-side icon button (missing in your 1st screenshot output) */}
                        <button
                            type="button"
                            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-[var(--primary)] hover:bg-slate-50 transition"
                            aria-label="Open newsletter"
                        >
                            <Mail size={16} />
                        </button>
                    </div>
                </div>

                {/* ✅ newsletter preview (missing in your 1st screenshot output) */}
                <NewsletterPreviewCard />

                {/* actions */}
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="h-10 w-[110px] rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="h-10 rounded-md bg-[var(--primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--primary-hover)] transition"
                    >
                        Confirm &amp; Add to Queue
                    </button>
                </div>
            </div>
        </div>
    );
}

function CohortsModal({
    onBack,
    onClose,
    onProceed,
}: {
    onBack: () => void;
    onClose: () => void;
    onProceed: () => void;
}) {
    const cohorts = [
        {
            name: "Advanced Airway Management",
            date: "March 12, 2026",
            students: 24,
            tone: "cyan" as const,
        },
        {
            name: "Pediatric Intubation Masters",
            date: "April 05, 2026",
            students: 18,
            tone: "purple" as const,
        },
        {
            name: "Critical Care Ventilation",
            date: "May 14, 2026",
            students: 32,
            tone: "blue" as const,
        },
        {
            name: "Emergency RSI Techniques",
            date: "June 22, 2026",
            students: 15,
            tone: "cyan" as const,
        },
    ];

    const [selected, setSelected] = useState<string[]>([
        "Advanced Airway Management",
        "Pediatric Intubation Masters",
        "Critical Care Ventilation",
    ]);

    const allSelected = selected.length === cohorts.length;

    const toggleSelectAll = () => {
        if (allSelected) setSelected([]);
        else setSelected(cohorts.map((c) => c.name));
    };

    const toggleOne = (name: string) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
        );
    };

    const toneBar = (tone: "cyan" | "purple" | "blue") => {
        if (tone === "purple") return "bg-[#7c3aed]";
        if (tone === "blue") return "bg-[#1d4ed8]";
        return "bg-[var(--primary)]";
    };

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            />

            <div className="relative w-full max-w-[820px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-xl font-extrabold text-slate-900">
                    Select Target Cohorts
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Distribute this article to students in specific active or upcoming
                    classes.
                </p>

                {/* select all */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">
                        Select All Active Cohorts
                    </p>

                    <button
                        type="button"
                        onClick={toggleSelectAll}
                        className={cx(
                            "h-7 w-12 rounded-full p-0.5 transition",
                            allSelected ? "bg-[var(--primary)]" : "bg-slate-200"
                        )}
                        aria-pressed={allSelected}
                    >
                        <span
                            className={cx(
                                "block h-6 w-6 rounded-full bg-white shadow-sm transition",
                                allSelected ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>

                {/* list */}
                <div className="mt-4 space-y-3">
                    {cohorts.map((c) => {
                        const checked = selected.includes(c.name);

                        return (
                            <div
                                key={c.name}
                                className={cx(
                                    "flex items-center gap-4 rounded-xl border bg-white px-4 py-4",
                                    "border-slate-200"
                                )}
                            >
                                {/* checkbox */}
                                <button
                                    type="button"
                                    onClick={() => toggleOne(c.name)}
                                    aria-label={checked ? "Selected" : "Not selected"}
                                    aria-pressed={checked}
                                    className={cx(
                                        "grid h-6 w-6 place-items-center rounded-md border transition",
                                        checked
                                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                            : "border-slate-300 bg-white text-transparent"
                                    )}
                                >
                                    <Check size={14} className="text-white" />
                                </button>

                                {/* left accent bar */}
                                <span className={cx("h-10 w-1 rounded-full", toneBar(c.tone))} />

                                {/* text */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-extrabold text-slate-900">
                                        {c.name}
                                    </p>

                                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                        <span className="inline-flex items-center gap-2">
                                            <CalendarDays size={14} className="text-slate-400" />
                                            {c.date}
                                        </span>

                                        <span className="inline-flex items-center gap-2">
                                            <Users size={14} className="text-slate-400" />
                                            {c.students} Students
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* footer */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                    <button
                        type="button"
                        onClick={onBack}
                        className="h-11 w-[120px] rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                    >
                        ← Back
                    </button>

                    <button
                        type="button"
                        onClick={onProceed}
                        disabled={selected.length === 0}
                        className={cx(
                            "h-11 rounded-md px-7 text-sm font-semibold text-white transition",
                            selected.length === 0
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                        )}
                    >
                        Proceed to Broadcast →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BlogCreateClient() {
    const router = useRouter();
    const [draftOpen, setDraftOpen] = useState(false);
    const [newsletterAddedOpen, setNewsletterAddedOpen] = useState(false);
    const [newsletterLabel] = useState("Nov 2026 Clinical Digest");
    const [queuePosition] = useState("#5");
    const NEWSLETTER_MANAGER_PATH = "/newsletters";
    const [liveOpen, setLiveOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareStep, setShareStep] = useState<
        "pick" | "email_blast" | "newsletter" | "cohorts" | "newsletter_added"
    >("pick");
    const [author, setAuthor] = useState("Dr. Sarah Miller");
    const [publishOpen, setPublishOpen] = useState(false);
    const [discardOpen, setDiscardOpen] = useState(false);
    const [scheduleDate] = useState("Oct 24, 2023");
    const [scheduleTime] = useState("10:00 AM (EST)");
    const [title, setTitle] = useState("New Approaches in Pediatric Airway");
    const [excerpt, setExcerpt] = useState("");
    const [metaTitle, setMetaTitle] = useState("New Approaches in Pediatric Airway Management");
    const [metaDesc, setMetaDesc] = useState(
        "An overview of the latest anatomical considerations and guidelines for pediatric airway management."
    );

    const [cats, setCats] = useState<string[]>([
        "Airway Management",
        "Clinical Research",
        "Pediatrics",
        "Emergency Medicine",
    ]);
    const [checkedCats, setCheckedCats] = useState<string[]>(["Airway Management", "Pediatrics"]);

    const [tags, setTags] = useState<string[]>(["Laryngoscopy", "Intubation"]);

    const words = useMemo(() => {
        // simple preview metric (dummy)
        const base = (title + " " + excerpt + " " + metaDesc).trim();
        if (!base) return 0;
        return base.split(/\s+/).filter(Boolean).length;
    }, [title, excerpt, metaDesc]);

    useEffect(() => {
        const open =
            publishOpen ||
            draftOpen ||
            discardOpen ||
            liveOpen ||
            shareOpen ||
            newsletterAddedOpen;
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [publishOpen, draftOpen, discardOpen, liveOpen, shareOpen]);

    return (
        <div className="flex min-h-[calc(100vh-72px)] gap-6">
            {/* LEFT: editor */}
            <div className="min-w-0 flex-1">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => router.push("/blogs")}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <span className="text-xs text-slate-300">/</span>
                        <p className="text-xs font-semibold text-slate-700">Post Editor</p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* toolbar */}
                    <div className="mx-auto mb-5 flex w-full max-w-[560px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                        <ToolBtn icon={<Bold size={16} />} />
                        <ToolBtn icon={<Italic size={16} />} />
                        <ToolBtn icon={<Underline size={16} />} />
                        <div className="mx-1 h-6 w-px bg-slate-200" />
                        <ToolBtn icon={<Heading1 size={16} />} />
                        <ToolBtn icon={<Heading2 size={16} />} />
                        <ToolBtn icon={<Quote size={16} />} />
                        <div className="mx-1 h-6 w-px bg-slate-200" />
                        <ToolBtn icon={<LinkIcon size={16} />} />
                        <ToolBtn icon={<ImageIcon size={16} />} />
                    </div>

                    {/* cover image */}
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                        <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500">
                            <ImageIcon size={18} />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-600">Add Cover Image</p>
                    </div>

                    {/* title */}
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-[720px] text-sm leading-6 text-slate-600">
                        Effective airway management in pediatric patients remains one of the most critical skills
                        for emergency physicians and anesthesiologists. Unlike adults, children present unique
                        anatomical and physiological challenges that require specialized approaches and equipment.
                    </p>

                    {/* content preview section placeholder */}
                    <div className="mt-6 space-y-5">
                        <h2 className="text-base font-extrabold text-slate-900">Anatomical Considerations</h2>
                        <p className="text-sm leading-6 text-slate-600">
                            The pediatric airway is situated higher in the neck, typically at the level of C3–C4 in
                            infants, compared to C4–C5 in adults. This anterior and superior position can make
                            visualization of the glottic opening more difficult during direct laryngoscopy.
                        </p>

                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="relative h-[220px] w-full bg-slate-100">
                                <Image
                                    src="/photos/diagnostic-pen.png"
                                    alt="cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="border-t border-slate-200 px-4 py-2 text-center text-[11px] text-slate-500">
                                Figure 1: Advanced pediatric airway equipment set layout.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: settings panel */}
            <aside className="w-[340px] shrink-0">
                <div className="sticky top-[84px] space-y-4">

                    {/* Save + Publish */}
                    <div className="flex items-center gap-2">
                        <GhostBtn className="flex-1" onClick={() => setDraftOpen(true)}>
                            Save Draft
                        </GhostBtn>

                        <PrimaryBtn className="flex-1" onClick={() => setPublishOpen(true)}>
                            Publish
                        </PrimaryBtn>
                    </div>

                    {/* Preview */}
                    <GhostBtn className="w-full">
                        <Eye size={16} />
                        Preview Article
                    </GhostBtn>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-extrabold text-slate-900">Post Settings</p>

                        {/* Publishing status */}
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between">
                                <FieldLabel>Publishing Status</FieldLabel>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>

                            <div className="mt-3 space-y-3">
                                <div>
                                    <FieldLabel>Author</FieldLabel>
                                    <div className="mt-2">
                                        <Input value={author} onChange={setAuthor} />
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel>Enter Author name…</FieldLabel>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input value={author} onChange={setAuthor} />
                                        <div className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-[var(--primary)]">
                                            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel>Schedule Publish</FieldLabel>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600">
                                            <CalendarDays size={16} className="text-slate-400" />
                                            Oct 24, 2023
                                        </div>
                                        <div className="flex h-9 w-[92px] items-center justify-center rounded-md border border-slate-200 bg-white text-xs text-slate-600">
                                            10:00 AM
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <FieldLabel>Featured Post</FieldLabel>
                                    <button
                                        type="button"
                                        className="h-5 w-9 rounded-full bg-slate-200 p-0.5 transition"
                                    >
                                        <span className="block h-4 w-4 rounded-full bg-white shadow-sm" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>≈ {words} words</span>
                                    <span>12 min read</span>
                                </div>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between">
                                <FieldLabel>Organization</FieldLabel>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>

                            <div className="mt-3">
                                <FieldLabel>Categories</FieldLabel>
                                <div className="mt-2 space-y-2">
                                    {cats.map((c) => {
                                        const checked = checkedCats.includes(c);
                                        return (
                                            <label
                                                key={c}
                                                className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => {
                                                        setCheckedCats((prev) =>
                                                            checked ? prev.filter((x) => x !== c) : [...prev, c]
                                                        );
                                                    }}
                                                    className="h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
                                                />
                                                {c}
                                            </label>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    className="mt-3 text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                                >
                                    + Add New Category
                                </button>
                            </div>

                            <div className="mt-4">
                                <FieldLabel>Tags</FieldLabel>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tags.map((t) => (
                                        <span
                                            key={t}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                                        >
                                            {t}
                                            <button
                                                type="button"
                                                onClick={() => setTags((p) => p.filter((x) => x !== t))}
                                                className="text-slate-400 hover:text-slate-600"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}

                                    <button
                                        type="button"
                                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600"
                                    >
                                        + Add tag...
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between">
                                <FieldLabel>Excerpt</FieldLabel>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>

                            <div className="mt-2">
                                <TextArea
                                    value={excerpt}
                                    onChange={setExcerpt}
                                    placeholder="Write a summary for the blog grid..."
                                    rows={4}
                                />
                                <p className="mt-1 text-right text-[10px] text-slate-400">0/150 characters</p>
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="mt-4 border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between">
                                <FieldLabel>SEO Settings</FieldLabel>
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>

                            <div className="mt-3 space-y-3">
                                <div>
                                    <FieldLabel>Meta Title</FieldLabel>
                                    <div className="mt-2">
                                        <Input value={metaTitle} onChange={setMetaTitle} />
                                    </div>
                                </div>

                                <div>
                                    <FieldLabel>Meta Description</FieldLabel>
                                    <div className="mt-2">
                                        <TextArea value={metaDesc} onChange={setMetaDesc} rows={4} />
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        Search Preview
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--primary-hover)]">
                                        {metaTitle}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {metaDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>


            {publishOpen && (
                <PublishScheduledModal
                    title={title}
                    publishDate={scheduleDate}
                    publishTime={scheduleTime}
                    onClose={() => setPublishOpen(false)}
                    onViewSchedule={() => {
                        setPublishOpen(false);
                        setLiveOpen(true);
                    }}
                    onReturnDashboard={() => {
                        setPublishOpen(false);
                        router.push("/admin-dashboard");
                    }}
                />
            )}

            {liveOpen && (
                <LiveNowModal
                    title={metaTitle}
                    author={author}
                    category={checkedCats[0] ?? "—"}
                    readTime="12 min"
                    onClose={() => setLiveOpen(false)}
                    onViewLive={() => setLiveOpen(false)}
                    onShare={() => {
                        setLiveOpen(false);
                        setShareStep("pick");
                        setShareOpen(true);
                    }}
                    onDone={() => setLiveOpen(false)}
                />
            )}

            {draftOpen && (
                <DraftSavedModal
                    title={title}
                    onClose={() => setDraftOpen(false)}
                    onContinue={() => setDraftOpen(false)}
                    onReturn={() => {
                        setDraftOpen(false);
                        setDiscardOpen(true);
                    }}
                />
            )}

            {discardOpen && (
                <DiscardUnsavedModal
                    onClose={() => setDiscardOpen(false)}
                    onSaveAsDraft={() => {
                        // draft is already “saved” in your current UI flow,
                        // so we just navigate after confirming.
                        setDiscardOpen(false);
                        router.push("/blogs");
                    }}
                    onDiscard={() => {
                        setDiscardOpen(false);
                        router.push("/blogs");
                    }}
                />
            )}

            {shareOpen && shareStep === "pick" && (
                <ShareDistributionModal
                    onClose={() => setShareOpen(false)}
                    onProceed={(channel) => {
                        if (channel === "trainees") setShareStep("cohorts");
                        else setShareStep(channel); // email_blast | newsletter
                    }}
                />
            )}

            {shareOpen && shareStep === "email_blast" && (
                <EmailBlastModal
                    onBack={() => setShareStep("pick")}
                    onClose={() => setShareOpen(false)}
                    onSend={() => setShareOpen(false)}
                    title={metaTitle}
                />
            )}

            {shareOpen && shareStep === "newsletter" && (
                <NewsletterQueueModal
                    onBack={() => setShareStep("pick")}
                    onClose={() => setShareOpen(false)}
                    onConfirm={() => {
                        // close the queue modal
                        setShareOpen(false);

                        // open success popup (pic-1/pic-3)
                        setNewsletterAddedOpen(true);
                    }}
                />
            )}

            {shareOpen && shareStep === "cohorts" && (
                <CohortsModal
                    onBack={() => setShareStep("pick")}
                    onClose={() => setShareOpen(false)}
                    onProceed={() => setShareStep("email_blast")} // ✅ matches your “Proceed to Broadcast” -> Email Blast popup
                />
            )}

            {newsletterAddedOpen && (
                <AddedToNewsletterModal
                    articleTitle="Advanced Airway Management Protocols: 2026 Clinical Updates"
                    newsletterLabel={newsletterLabel}
                    queuePosition={queuePosition}
                    onClose={() => setNewsletterAddedOpen(false)}
                    onGoManager={() => {
                        setNewsletterAddedOpen(false);
                        router.push(NEWSLETTER_MANAGER_PATH);
                    }}
                    onDone={() => setNewsletterAddedOpen(false)}
                />
            )}

        </div>
    );
}