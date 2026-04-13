"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ScheduledBroadcastAttachmentsCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-attachments-card";
import ScheduledBroadcastAudienceTargetCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-audience-target-card";
import ScheduledBroadcastContentOverviewCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-content-overview-card";
import ScheduledBroadcastDeliveryLogisticsCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-delivery-logistics-card";
import ScheduledBroadcastMessageContentCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-message-content-card";
import ScheduledBroadcastViewHeader from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-view-header";
import ScheduledBroadcastViewStatsOverview from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-view-stats-overview";
import ScheduledBroadcastArticleLinkPreviewCard from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-article-link-preview-card";
import { generalBroadcastGetService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.service";
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";
import ViewScheduledBroadcastPageSkeleton from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/ViewScheduledBroadcastPageSkeleton";

export default function Page() {
  const params = useParams<{ broadcastId: string }>();
  const broadcastId = params?.broadcastId;

  const [data, setData] = useState<GetGeneralBroadcastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadBroadcast = useCallback(async () => {
    if (!broadcastId) return;

    try {
      setIsLoading(true);
      setIsError(false);

      const response =
        await generalBroadcastGetService.getBroadcastById(broadcastId);

      setData(response);
    } catch (error) {
      console.error("Failed to load broadcast details:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [broadcastId]);

  useEffect(() => {
    void loadBroadcast();
  }, [loadBroadcast]);

  if (isLoading) {
    return <ViewScheduledBroadcastPageSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="py-8">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          Failed to load broadcast details.
        </div>
      </div>
    );
  }

  const isCustomMessage = data.contentType === "CUSTOM_MESSAGE";
  const isArticleLink = data.contentType === "ARTICLE_LINK";
  const hasAttachments = isCustomMessage && data.attachments.length > 0;

  return (
    <div>
      <ScheduledBroadcastViewHeader data={data} onCancelled={loadBroadcast} />

      <main className="mx-auto w-full py-6">
        <div className="space-y-6">
          <ScheduledBroadcastViewStatsOverview data={data} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {isCustomMessage && (
                <>
                  <ScheduledBroadcastContentOverviewCard data={data} />
                  <ScheduledBroadcastMessageContentCard
                    customContent={data.customContent}
                  />
                </>
              )}

              {isArticleLink && (
                <ScheduledBroadcastArticleLinkPreviewCard data={data} />
              )}
            </div>

            <div className="space-y-6">
              <ScheduledBroadcastDeliveryLogisticsCard data={data} />
              <ScheduledBroadcastAudienceTargetCard audience={data.audience} />

              {hasAttachments && (
                <ScheduledBroadcastAttachmentsCard items={data.attachments} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
