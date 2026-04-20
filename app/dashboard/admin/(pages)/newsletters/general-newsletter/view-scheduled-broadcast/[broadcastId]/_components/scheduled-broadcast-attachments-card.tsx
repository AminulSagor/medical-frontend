import React from "react";
import {
  Download,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
} from "lucide-react";

import ScheduledBroadcastSectionShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_components/scheduled-broadcast-section-shell";
import {
  getAttachmentKind,
  getAttachmentMeta,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/view-scheduled-broadcast/[broadcastId]/_utils/scheduled-broadcast-view.utils";
import type { BroadcastUIAttachment } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-ui-view.types";

type Props = {
  items: BroadcastUIAttachment[];
};

function AttachmentTypeIcon({ mimeType }: { mimeType: string }) {
  const type = getAttachmentKind(mimeType);

  if (type === "pdf") {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
        <FileText size={18} />
      </span>
    );
  }

  if (type === "image") {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
        <ImageIcon size={18} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
      <FileIcon size={18} />
    </span>
  );
}

export default function ScheduledBroadcastAttachmentsCard({ items }: Props) {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ScheduledBroadcastSectionShell title="Attachments">
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          No attachments added.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <AttachmentTypeIcon mimeType={item.mimeType} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {item.filename}
                </p>
                <p className="text-xs text-slate-400">
                  {getAttachmentMeta(item)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleDownload(item.downloadUrl, item.filename)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                aria-label={`Download ${item.filename}`}
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ScheduledBroadcastSectionShell>
  );
}
