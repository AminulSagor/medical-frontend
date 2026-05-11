"use client";

import React from "react";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { bulkSubscribeService } from "@/service/admin/newsletter/subscribers/bulk-subscribe.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BulkSubscriberUpload({
    onSubscribed,
}: {
    onSubscribed?: () => void;
}) {
    const [emails, setEmails] = React.useState<string[]>([]);
    const [invalidEmails, setInvalidEmails] = React.useState<string[]>([]);

    const handleFile = async (file: File) => {
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            if (!sheet) {
                toast.error("No sheet found in this file.");
                return;
            }

            const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
            const hasEmailColumn = rows.some((row) =>
                Object.keys(row).some((key) => key.trim().toLowerCase() === "email"),
            );

            if (!hasEmailColumn) {
                setEmails([]);
                setInvalidEmails([]);
                toast.error('Excel file must contain a column named "email".');
                return;
            }

            const extractedEmails = rows
                .map((row) => String(row.email ?? "").trim().toLowerCase())
                .filter(Boolean);

            const valid = extractedEmails.filter((email) => EMAIL_REGEX.test(email));
            const invalid = extractedEmails.filter((email) => !EMAIL_REGEX.test(email));
            const uniqueValidEmails = [...new Set(valid)];
            const duplicateCount = valid.length - uniqueValidEmails.length;

            setEmails(uniqueValidEmails);
            setInvalidEmails(invalid);

            if (!uniqueValidEmails.length) {
                toast.error("File uploaded, but no valid email found.");
                return;
            }

            toast.success(
                `${extractedEmails.length} emails found • ${uniqueValidEmails.length} valid • ${duplicateCount} duplicate removed • ${invalid.length} invalid`,
            );
        } catch (error) {
            console.error("Failed to read Excel file:", error);
            toast.error("Failed to read Excel file.");
        }
    };

    const [isSubscribing, setIsSubscribing] = React.useState(false);

    const handleSubscribe = async () => {
        try {
            setIsSubscribing(true);

            const response = await bulkSubscribeService({ emails });

            toast.success(response.message);
            onSubscribed?.();
            setEmails([]);
            setInvalidEmails([]);
        } catch (error) {
            console.error("Failed to bulk subscribe:", error);
            toast.error("Failed to subscribe emails.");
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Bulk Subscribe
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Upload an Excel file with an email column to subscribe users.
                    </p>
                </div>

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                    <Upload size={16} />
                    Upload Excel
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleFile(file);
                            event.target.value = "";
                        }}
                    />
                </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                    Valid: {emails.length}
                </span>
                <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
                    Invalid: {invalidEmails.length}
                </span>
            </div>

            <button
                type="button"
                disabled={!emails.length || isSubscribing}
                onClick={handleSubscribe}
                className="mt-5 h-11 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
            </button>
        </div>
    );
}