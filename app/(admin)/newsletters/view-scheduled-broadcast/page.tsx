import ScheduledBroadcastAttachmentsCard from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-attachments-card";
import ScheduledBroadcastAudienceTargetCard from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-audience-target-card";
import ScheduledBroadcastContentOverviewCard from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-content-overview-card";
import ScheduledBroadcastDeliveryLogisticsCard from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-delivery-logistics-card";
import ScheduledBroadcastMessageContentCard from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-message-content-card";
import ScheduledBroadcastViewHeader from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-view-header";
import ScheduledBroadcastViewStatsOverview from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-view-stats-overview";
import { scheduledBroadcastViewData } from "@/app/(admin)/newsletters/view-scheduled-broadcast/data/scheduled-broadcast-view.data";

export default function Page() {
  const data = scheduledBroadcastViewData;

  return (
    <div>
      <ScheduledBroadcastViewHeader data={data.header} />

      <main className="mx-auto w-full   py-6">
        <div className="space-y-6">
          <ScheduledBroadcastViewStatsOverview items={data.overviewStats} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <ScheduledBroadcastContentOverviewCard
                data={data.contentOverview}
              />
              <ScheduledBroadcastMessageContentCard
                data={data.messageContent}
              />
            </div>

            <div className="space-y-6">
              <ScheduledBroadcastDeliveryLogisticsCard
                data={data.deliveryLogistics}
              />
              <ScheduledBroadcastAudienceTargetCard
                items={data.audienceTargets}
              />
              <ScheduledBroadcastAttachmentsCard items={data.attachments} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
