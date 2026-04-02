"use client";

import { Mail, Users, GraduationCap, UserMinus } from "lucide-react";

function CardShell({
    title,
    children,
    icon,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {title}
                    </p>
                    {children}
                </div>

                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-slate-200/40">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function NewsletterMetrics() {
    // dummy values (replace later)
    const totalSent = 158;
    const generalBlasts = 112;
    const courseUpdates = 46;
    const pendingUnsubs = 14;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <CardShell title="Newsletter Metrics" icon={<Mail size={16} />}>
                <p className="mt-2 text-xs text-slate-500">Total Sent</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{totalSent}</p>
            </CardShell>

            <CardShell title="Audience Reach" icon={<Users size={16} />}>
                <p className="mt-2 text-xs text-slate-500">General Blasts</p>
                <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">{generalBlasts}</p>
                    <span className="text-xs font-semibold text-emerald-600">+12%</span>
                </div>
            </CardShell>

            <CardShell title="Trainee Comms" icon={<GraduationCap size={16} />}>
                <p className="mt-2 text-xs text-slate-500">Course Updates</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{courseUpdates}</p>
            </CardShell>

            <CardShell title="Unsubscription Requests" icon={<UserMinus size={16} />}>
                <p className="mt-2 text-sm font-semibold text-red-500">Pending action</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{pendingUnsubs}</p>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-50)] px-4 py-2 text-xs font-semibold text-[var(--primary)] hover:bg-slate-100"
                    >
                        Manage <span aria-hidden>→</span>
                    </button>
                </div>
            </CardShell>
        </div>
    );
}