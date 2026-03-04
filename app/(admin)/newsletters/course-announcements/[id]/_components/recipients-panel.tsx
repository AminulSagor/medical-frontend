"use client";

import { useMemo, useState } from "react";
import { Search, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { Recipient } from "../_lib/compose-types";
import RecipientsList from "./recipients-list";

const INITIAL_VISIBLE = 6;

export default function RecipientsPanel({
  recipients,
}: {
  recipients: Recipient[];
}) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);

  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(recipients.map((r) => [r.id, true]))
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipients;
    return recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s)
    );
  }, [q, recipients]);

  const visibleRecipients = expanded
    ? filtered
    : filtered.slice(0, INITIAL_VISIBLE);

  const allSelected = filtered.every((r) => selected[r.id]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next = { ...prev };
      filtered.forEach((r) => (next[r.id] = !allSelected));
      return next;
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 py-5">

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/60">
            <Users size={18} />
          </div>

          <div>
            <p className="text-[14px] font-bold text-slate-900">
              Recipients
            </p>
            <p className="text-xs text-slate-500">
              Select specific students or broadcast to all
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search students..."
              className="h-10 w-[220px] rounded-xl bg-slate-50 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-slate-200/60 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Select All */}
          <button
            onClick={toggleAll}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-50"
          >
            <span
              className={[
                "grid h-5 w-5 place-items-center rounded-md text-[12px] font-black",
                allSelected
                  ? "bg-teal-500 text-white"
                  : "bg-white text-transparent ring-1 ring-slate-300",
              ].join(" ")}
            >
              ✓
            </span>
            SELECT ALL
          </button>

        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* List */}
      <RecipientsList
        recipients={visibleRecipients}
        selected={selected}
        onToggle={(id) =>
          setSelected((p) => ({
            ...p,
            [id]: !p[id],
          }))
        }
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 text-xs">

        <span className="font-semibold tracking-[0.1em] text-slate-400 uppercase">
          SHOWING {visibleRecipients.length} OF {filtered.length} STUDENTS
        </span>

        {filtered.length > INITIAL_VISIBLE && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-semibold text-teal-600 hover:underline"
          >
            {expanded ? "See Less" : "See More"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

      </div>

    </section>
  );
}