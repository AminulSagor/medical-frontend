"use client";

import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

import {
  addCourseAnnouncementAttachment,
  removeCourseAnnouncementAttachment,
} from "@/service/admin/newsletter/course-announcements/course-announcement-broadcast.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";

type UploadFile = {
  id: string;
  fileName: string;
  fileKey?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  isUploading?: boolean;
};

type Props = {
  broadcastId: string;
};

export default function AttachmentsPanel({ broadcastId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const MAX_SIZE = 50 * 1024 * 1024;

  const openPicker = () => {
    inputRef.current?.click();
  };

  const uploadSingleFile = async (file: File, sortOrder: number) => {
    const tempId = crypto.randomUUID();

    setFiles((prev) => [
      ...prev,
      {
        id: tempId,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type,
        isUploading: true,
      },
    ]);

    try {
      const uploadMeta = await getUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder: "course-announcements",
      });

      await uploadFileToSignedUrl(uploadMeta.signedUrl, file);

      const attachment = await addCourseAnnouncementAttachment(broadcastId, {
        fileKey: uploadMeta.fileKey,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
        sortOrder,
      });

      setFiles((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? {
                id: attachment.id,
                fileName: file.name,
                fileKey: uploadMeta.fileKey,
                mimeType: file.type || "application/octet-stream",
                fileSizeBytes: file.size,
                isUploading: false,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      setFiles((prev) => prev.filter((item) => item.id !== tempId));
      window.alert(`Failed to upload ${file.name}. Please try again.`);
    }
  };

  const addFiles = async (list: FileList | null) => {
    if (!list || isBusy) return;

    const selectedFiles = Array.from(list);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_SIZE) {
        window.alert(`${file.name} exceeds 50MB limit`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setIsBusy(true);

      for (let index = 0; index < validFiles.length; index += 1) {
        await uploadSingleFile(validFiles[index], files.length + index);
      }
    } finally {
      setIsBusy(false);
    }
  };

  const removeFile = async (id: string) => {
    const target = files.find((item) => item.id === id);
    if (!target || target.isUploading) return;

    try {
      await removeCourseAnnouncementAttachment(broadcastId, id);
      setFiles((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove attachment:", error);
      window.alert("Failed to remove attachment. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void addFiles(e.dataTransfer.files);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/60">
          <UploadCloud size={18} />
        </div>

        <div>
          <p className="text-[14px] font-bold text-slate-900">Attachments</p>

          <p className="text-xs text-slate-500">
            Include clinical PDFs or slide decks
          </p>
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={openPicker}
        className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-14 text-center hover:bg-slate-100"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
          <UploadCloud size={20} className="text-slate-500" />
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-700">
          Drop clinical resources here
        </p>

        <p className="text-xs text-slate-500">
          Maximum file size: 50MB (PDF, PPTX, JPG)
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.pptx,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              <span className="truncate text-slate-700">
                {f.fileName}
                {f.isUploading ? " (Uploading...)" : ""}
              </span>

              <button
                type="button"
                onClick={() => void removeFile(f.id)}
                disabled={f.isUploading}
                className="text-slate-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
