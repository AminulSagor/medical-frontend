"use client";

import React from "react";
import NewsletterMetrics from "./newsletter-metrics";
import NewsletterActions from "./newsletter-actions";
import TransmissionTable from "./transmission-table";
import BulkSubscriberUpload from "./bulk-subscriber-upload";

export default function NewslettersPageClient() {
    const [refreshKey, setRefreshKey] = React.useState(0);

    return (
        <div className="space-y-6">
            <div className="pt-2">
                <h1 className="text-2xl font-semibold text-slate-900">Newsletter</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your newsletter in one unified system
                </p>
            </div>

            <NewsletterMetrics />

            <NewsletterActions refreshKey={refreshKey} />

            <BulkSubscriberUpload onSubscribed={() => setRefreshKey((prev) => prev + 1)} />

            <TransmissionTable />
        </div>
    );
}