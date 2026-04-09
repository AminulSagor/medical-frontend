import TransmissionDetailsTable from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-details-table";
import TransmissionHistoryHeader from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-history-header";
import TransmissionMetrics from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-metrics";
import TransmissionToolbar from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/_components/transmission-toolbar";
import { transmissionHistoryMock } from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/data/transmission-history.mock";

export default function TransmissionHistoryPage() {
  const data = transmissionHistoryMock;

  return (
    <div>
      <TransmissionHistoryHeader title={data.title} subtitle={data.subtitle} />

      <div className="mt-5 space-y-5">
        <TransmissionMetrics items={data.metrics} />
        <TransmissionToolbar />
        <TransmissionDetailsTable rows={data.rows} />
      </div>
    </div>
  );
}
