"use client";

import React, { useState } from "react";
import { CalendarDays, Search } from "lucide-react";

export type DraftItem = {
    id: string;
    tag: string;
    title: string;
    author: string;
};

export default function PublicationWeekDraftsPanel({ drafts }: { drafts: DraftItem[] }) {
    const [q, setQ] = useState("");

    const filtered = drafts.filter((d) => {
        const s = `${d.tag} ${d.title} ${d.author}`.toLowerCase();
        return s.includes(q.trim().toLowerCase());
    });

    return (
        <aside className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-extrabold text-slate-900">Unscheduled Drafts</p>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                    {filtered.length} TOTAL
                </span>
            </div>

            <div className="p-4">
                <div className="mb-3 flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-slate-500">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        placeholder="Search drafts..."
                    />
                </div>

                <div className="space-y-3">
                    {filtered.map((d) => (
                        <div
                            key={d.id}
                            className="rounded-xl border border-slate-200 bg-white p-3 hover:bg-slate-50 transition"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {d.tag}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-900">{d.title}</p>

                            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-slate-300" />
                                {d.author}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500 ring-1 ring-slate-100">
                    <CalendarDays size={14} className="text-slate-400" />
                    Drag drafts to any time slot to schedule
                </div>
            </div>
        </aside>
    );
}