import MetricsCards from "./_components/metrics-cards";
import PastOrdersTable from "./_components/past-orders-table";

export default function OrderHistoryPage() {
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-6 -mt-6">
            {/* Top text */}
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-slate-900">Order History</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Track your shipments and view receipts for medical equipment.
                </p>
            </div>

            <MetricsCards />
            <PastOrdersTable />
        </main>
    );
}
