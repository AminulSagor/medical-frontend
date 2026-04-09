import ScheduledBroadcastAttachmentsCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-attachments-card";
import ScheduledBroadcastAudienceTargetCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-audience-target-card";
import ScheduledBroadcastContentOverviewCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-content-overview-card";
import ScheduledBroadcastDeliveryLogisticsCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-delivery-logistics-card";
import ScheduledBroadcastMessageContentCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-message-content-card";
import ScheduledBroadcastViewHeader from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-view-header";
import ScheduledBroadcastViewStatsOverview from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-view-stats-overview";
import { scheduledBroadcastViewData } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/data/scheduled-broadcast-view.data";

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
