import NewsletterMetrics from "./_components/newsletter-metrics";
import NewsletterActions from "./_components/newsletter-actions";
import TransmissionTable from "./_components/transmission-table";

export default function NewslettersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="pt-2">
                <h1 className="text-2xl font-semibold text-slate-900">Newsletter</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your newsletter in one unified system
                </p>
            </div>

            {/* Top metrics */}
            <NewsletterMetrics />

            {/* Two big action cards */}
            <NewsletterActions />

            {/* Table */}
            <TransmissionTable />
        </div>
    );
}