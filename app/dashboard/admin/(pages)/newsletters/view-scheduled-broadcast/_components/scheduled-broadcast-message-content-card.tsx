import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-section-shell";
import { MessageContentData } from "@/app/dashboard/admin/(pages)/newsletters/view-scheduled-broadcast/types/scheduled-broadcast-view.type";

type Props = {
  data: MessageContentData;
};

export default function ScheduledBroadcastMessageContentCard({ data }: Props) {
  return (
    <ScheduledBroadcastSectionShell title="Message Content">
      <div className="rounded-2xl border border-slate-200 bg-white p-7">
        <p className="text-[15px] leading-8 text-slate-600">
          {data.greetingPrefix}
          <span className="inline-flex items-center rounded-md bg-[#e9fbf8] px-2 py-0.5 text-xs font-semibold text-[#14b8ad]">
            {data.personalizationTag}
          </span>
          <span className="ml-1">{data.greetingSuffix}</span>
        </p>

        <p className="mt-5 text-[15px] leading-8 text-slate-600">
          {data.introParagraph}
        </p>

        <h3 className="mt-5 text-[15px] font-semibold text-slate-800">
          {data.sectionTitle}
        </h3>

        <p className="mt-2 text-[15px] leading-8 text-slate-600">
          {data.sectionParagraph}
        </p>

        <div className="mt-6 rounded-xl border-l-[3px] border-[#14b8ad] bg-slate-50 px-6 py-5">
          <p className="text-[15px] italic leading-8 text-slate-500">
            {data.quote}
          </p>
        </div>

        <p className="mt-8 text-[15px] leading-8 text-slate-600">
          {data.closingLine}
        </p>
        <p className="text-[15px] font-semibold leading-8 text-slate-700">
          {data.signature}
        </p>
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
