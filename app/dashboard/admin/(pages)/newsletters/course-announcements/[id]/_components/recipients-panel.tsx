"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { Recipient } from "../_lib/compose-types";
import RecipientsList from "./recipients-list";

const INITIAL_VISIBLE = 6;

type RecipientsPanelProps = {
  recipients: Recipient[];
};

function buildSelectedState(recipients: Recipient[]): Record<string, boolean> {
  return Object.fromEntries(
    recipients.map((recipient) => [recipient.id, true]),
  );
}

export default function RecipientsPanel({ recipients }: RecipientsPanelProps) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    buildSelectedState(recipients),
  );

  useEffect(() => {
    setSelected(buildSelectedState(recipients));
  }, [recipients]);

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) return recipients;

    return recipients.filter((recipient) => {
      const name = recipient.name?.toLowerCase() ?? "";
      const email = recipient.email?.toLowerCase() ?? "";

      return name.includes(search) || email.includes(search);
    });
  }, [q, recipients]);

  const visibleRecipients = useMemo(() => {
    if (expanded) return filtered;
    return filtered.slice(0, INITIAL_VISIBLE);
  }, [expanded, filtered]);

  const allSelected =
    filtered.length > 0 &&
    filtered.every((recipient) => selected[recipient.id]);

  const selectedCount = useMemo(() => {
    return recipients.filter((recipient) => selected[recipient.id]).length;
  }, [recipients, selected]);

  const toggleAll = () => {
    setSelected((prev) => {
      const next = { ...prev };

      filtered.forEach((recipient) => {
        next[recipient.id] = !allSelected;
      });

      return next;
    });
  };

  const handleToggleRecipient = (id: string) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/60">
            <Users size={18} />
          </div>

          <div>
            <p className="text-[14px] font-bold text-slate-900">Recipients</p>
            <p className="text-xs text-slate-500">
              Select specific students or broadcast to all
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            type="button"
            onClick={toggleAll}
            disabled={filtered.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="h-px bg-slate-100" />

      {visibleRecipients.length > 0 ? (
        <RecipientsList
          recipients={visibleRecipients}
          selected={selected}
          onToggle={handleToggleRecipient}
        />
      ) : (
        <div className="px-6 py-10 text-center text-sm text-slate-500">
          No recipients found.
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 text-xs">
        <span className="font-semibold uppercase tracking-[0.1em] text-slate-400">
          SHOWING {visibleRecipients.length} OF {filtered.length} STUDENTS •{" "}
          {selectedCount} SELECTED
        </span>

        {filtered.length > INITIAL_VISIBLE && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
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
