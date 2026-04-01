"use client";

import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";
import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { uploadFileViaSignedUrl } from "@/service/upload/upload.service";
import { axiosErrorMessage } from "@/utils/errors/axiosErrorMessage";
import { cx } from "../ui/shared";

export default function PostCoverImage({ disabled }: { disabled?: boolean }) {
  const { watch, setValue, formState } = useFormContext<BlogCreateInput>();
  const coverImageUrl = watch("coverImageUrl");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const coverErr = formState.errors.coverImageUrl?.message;
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="w-full disabled:opacity-60"
      >
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500">
          {coverImageUrl ? (
            <span className="grid h-8 w-8 place-items-center rounded-md text-[var(--primary)]">
              <ImageIcon size={18} />
            </span>
          ) : (
            <ImageIcon size={18} />
          )}
        </div>

        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="Cover preview"
            className={cx("mx-auto mt-4 h-[220px] w-full max-w-[540px] rounded-xl border object-cover", "shadow-sm")}
          />
        ) : (
          <p className="mt-2 text-xs font-semibold text-slate-600">Add Cover Image</p>
        )}

        {coverImageUrl ? (
          <p className="mt-3 text-xs font-semibold text-slate-600 underline">Change cover</p>
        ) : null}
        {uploading ? <p className="mt-2 text-xs text-slate-500">Uploading…</p> : null}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setUploadErr(null);
          setUploading(true);
          try {
            const { readUrl } = await uploadFileViaSignedUrl(file, "blogs");
            setValue("coverImageUrl", readUrl, { shouldDirty: true, shouldValidate: true });
          } catch (err: unknown) {
            setUploadErr(axiosErrorMessage(err, "Cover upload failed."));
          } finally {
            setUploading(false);
          }
        }}
      />

      {uploadErr ? <p className="mt-2 text-xs font-medium text-rose-600">{uploadErr}</p> : null}
      {coverErr ? <p className="mt-2 text-xs font-medium text-rose-600">{coverErr}</p> : null}
    </div>
  );
}
