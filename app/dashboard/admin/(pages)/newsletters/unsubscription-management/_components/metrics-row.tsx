import type { UnsubMetric } from "../_lib/unsubscription-management-types";
import MetricCard from "./metric-card";

export default function MetricsRow({ metrics }: { metrics: UnsubMetric }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        label="PENDING REQUESTS"
        value={metrics.pendingRequests}
        subLabel={metrics.pendingSubLabel}
        iconTone="teal"
      />
      <MetricCard
        label="TOTAL UNSUBSCRIBED"
        value={metrics.totalUnsubscribed}
        subLabel={metrics.totalUnsubscribedSubLabel}
        iconTone="teal"
      />
      <MetricCard
        label="AVG. RESPONSE TIME"
        value={metrics.avgResponseTimeLabel}
        subLabel={metrics.avgResponseTimeSubLabel}
        iconTone="blue"
      />
    </div>
  );
}