import React from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import { AttachmentItem } from "@/app/(admin)/newsletters/view-scheduled-broadcast/types/scheduled-broadcast-view.type";
import ScheduledBroadcastSectionShell from "@/app/(admin)/newsletters/view-scheduled-broadcast/_components/scheduled-broadcast-section-shell";

type Props = {
  items: AttachmentItem[];
};

function AttachmentTypeIcon({ type }: { type: AttachmentItem["type"] }) {
  if (type === "pdf") {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
        <FileText size={18} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
      <ImageIcon size={18} />
    </span>
  );
}

export default function ScheduledBroadcastAttachmentsCard({ items }: Props) {
  return (
    <ScheduledBroadcastSectionShell title="Attachments">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <AttachmentTypeIcon type={item.type} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-700">
                {item.fileName}
              </p>
              <p className="text-xs text-slate-400">{item.meta}</p>
            </div>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label={`Download ${item.fileName}`}
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </ScheduledBroadcastSectionShell>
  );
}
