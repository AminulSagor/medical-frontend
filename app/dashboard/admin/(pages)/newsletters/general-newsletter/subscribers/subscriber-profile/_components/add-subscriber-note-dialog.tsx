"use client";

import { useEffect, useState } from "react";
import Dialog from "@/components/dialogs/dialog";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (note: string) => Promise<void>;
};

export default function AddSubscriberNoteDialog({
    open,
    onOpenChange,
    onSubmit,
}: Props) {
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setNote("");
        }
    }, [open]);

    const handleSubmit = async () => {
        const trimmedNote = note.trim();
        if (!trimmedNote) return;

        try {
            setIsSubmitting(true);
            await onSubmit(trimmedNote);
            onOpenChange(false);
            setNote("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
            size="md"
            className="rounded-2xl"
        >
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Add Internal Note</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Save an internal note for this subscriber.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Note
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={5}
                        placeholder="Write your note here..."
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-teal-500"
                    />
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !note.trim()}
                        className="inline-flex h-11 items-center rounded-2xl bg-[#0e8f86] px-5 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Saving..." : "Add Note"}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}