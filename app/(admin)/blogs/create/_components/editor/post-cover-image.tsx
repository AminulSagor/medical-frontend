"use client";

import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Image as ImageIcon } from "lucide-react";
import type { BlogCreateInput } from "../../_lib/blog-create-schema";
import { cx } from "../ui/shared";

async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function PostCoverImage() {
  const { watch, setValue, formState } = useFormContext<BlogCreateInput>();
  const coverImageUrl = watch("coverImageUrl");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const coverErr = formState.errors.coverImageUrl?.message;

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full"
      >
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500">
            {coverImageUrl ? (
            // Simple fallback if we already have an image.
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
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const dataUrl = await readFileAsDataUrl(file);
            setValue("coverImageUrl", dataUrl, { shouldDirty: true, shouldValidate: true });
        }}
      />

      {coverErr ? <p className="mt-2 text-xs font-medium text-rose-600">{coverErr}</p> : null}
    </div>
  );
}

