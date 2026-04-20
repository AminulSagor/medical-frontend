"use client";

import { UploadCloud, X } from "lucide-react";
import { useMemo, useRef } from "react";
import type { CreateBroadcastFormState } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

type Props = {
  form: CreateBroadcastFormState;
  onUploadAttachments: (files: FileList | null) => Promise<void>;
  onRemoveAttachment: (fileKey: string) => Promise<void>;
};

export default function CreateBroadcastAttachmentsSection({
  form,
  onUploadAttachments,
  onRemoveAttachment,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const attachmentSummary = useMemo(() => {
    return form.attachments.map((item) => ({
      fileKey: item.fileKey,
      fileName: item.fileName,
      sizeLabel:
        item.fileSizeBytes >= 1024 * 1024
          ? `${(item.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
          : `${Math.ceil(item.fileSizeBytes / 1024)} KB`,
    }));
  }, [form.attachments]);

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-800">Attachments</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Upload clinical reports and references
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.jpeg,.jpg,.png"
        onChange={(e) => {
          void onUploadAttachments(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full rounded-[24px] border border-dashed border-slate-300 px-6 py-12 text-center transition hover:bg-slate-50"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-[#18c3b2]">
          <UploadCloud size={24} />
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Drag and drop clinical reports, PDFs, or images here, or{" "}
          <span className="text-[#18c3b2]">click to browse</span>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Supported formats: PDF, JPEG, PNG (Max 10MB per file)
        </p>
      </button>

      {attachmentSummary.length ? (
        <div className="mt-4 space-y-3">
          {attachmentSummary.map((attachment) => (
            <div
              key={attachment.fileKey}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-slate-400">{attachment.sizeLabel}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  void onRemoveAttachment(attachment.fileKey);
                }}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
