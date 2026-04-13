import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import { stripHtml } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";
import type { BroadcastCustomContent } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

type Props = {
  customContent: BroadcastCustomContent | null;
};

export default function ScheduledBroadcastMessageContentCard({
  customContent,
}: Props) {
  const text =
    customContent?.messageBodyText?.trim() ||
    stripHtml(customContent?.messageBodyHtml) ||
    "No message content available.";

  const personalizationTokens = customContent?.personalizationTokens ?? [];

  return (
    <ScheduledBroadcastSectionShell title="Message Content">
      <div className="rounded-2xl border border-slate-200 bg-white p-7">
        {personalizationTokens.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {personalizationTokens.map((token) => (
              <span
                key={token}
                className="inline-flex items-center rounded-md bg-[#e9fbf8] px-2.5 py-1 text-xs font-semibold text-[#14b8ad]"
              >
                {token}
              </span>
            ))}
          </div>
        )}

        <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-600">
          {text}
        </div>
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
