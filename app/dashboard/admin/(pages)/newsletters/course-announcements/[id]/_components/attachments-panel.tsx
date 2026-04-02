"use client";

import { UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

type UploadFile = {
  file: File;
  id: string;
};

export default function AttachmentsPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);

  const MAX_SIZE = 50 * 1024 * 1024;

  const addFiles = (list: FileList | null) => {
    if (!list) return;

    const newFiles: UploadFile[] = [];

    Array.from(list).forEach((file) => {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 50MB limit`);
        return;
      }

      newFiles.push({
        file,
        id: crypto.randomUUID(),
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">

      {/* HEADER */}
      <div className="flex items-start gap-3">

        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/60">
          <UploadCloud size={18} />
        </div>

        <div>
          <p className="text-[14px] font-bold text-slate-900">
            Attachments
          </p>

          <p className="text-xs text-slate-500">
            Include clinical PDFs or slide decks
          </p>
        </div>

      </div>

      {/* DROP AREA */}
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
          onChange={(e) => addFiles(e.target.files)}
        />

      </div>

      {/* FILE LIST */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">

          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >

              <span className="truncate text-slate-700">
                {f.file.name}
              </span>

              <button
                onClick={() => removeFile(f.id)}
                className="text-slate-400 hover:text-red-500"
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