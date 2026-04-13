"use client";

import { FilePenLine, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import CreateBlogPostToolbar from "./create-blog-post-toolbar";

type CreateBlogPostEditorProps = {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  isUploadingCoverImage: boolean;
  coverImageError?: string;
  onSelectCoverImage: (file: File) => Promise<void> | void;
  onRemoveCoverImage: () => void;
};

export default function CreateBlogPostEditor({
  title,
  content,
  excerpt,
  coverImageUrl,
  isUploadingCoverImage,
  coverImageError,
  onSelectCoverImage,
  onRemoveCoverImage,
}: CreateBlogPostEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await onSelectCoverImage(file);
    event.target.value = "";
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <FilePenLine size={14} />
        Post Editor
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm md:px-10 md:py-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Toolbar */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-md shadow-slate-200/60">
            {/* <CreateBlogPostToolbar /> */}
          </div>
        </div>

        {/* Cover Image Picker */}
        <div className="relative">
          {coverImageUrl ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative h-[240px] w-full bg-slate-100 md:h-[360px]">
                <img
                  src={coverImageUrl}
                  alt={title || "Cover image"}
                  className="h-full w-full object-cover"
                />

                {isUploadingCoverImage && (
                  <div className="absolute inset-0 grid place-items-center bg-white/70">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow">
                      <Loader2 size={16} className="animate-spin" />
                      Uploading image...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                <button
                  type="button"
                  onClick={handleOpenFilePicker}
                  disabled={isUploadingCoverImage}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Upload size={16} />
                  Change Image
                </button>

                <button
                  type="button"
                  onClick={onRemoveCoverImage}
                  disabled={isUploadingCoverImage}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-medium text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenFilePicker}
              disabled={isUploadingCoverImage}
              className="grid h-[240px] w-full place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 md:h-[360px]"
            >
              <div>
                {isUploadingCoverImage ? (
                  <>
                    <Loader2 size={28} className="mx-auto animate-spin" />
                    <p className="mt-3 text-sm text-slate-500">
                      Uploading image...
                    </p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={28} className="mx-auto text-slate-500" />
                    <p className="mt-3 text-sm text-slate-500">
                      Add Cover Image
                    </p>
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        {coverImageError && (
          <p className="mt-3 text-sm text-rose-500">{coverImageError}</p>
        )}

        {/* Title */}
        <div className="mt-8">
          <h1
            className={`text-[44px] font-black leading-[1.08] tracking-[-0.03em] ${
              title ? "text-slate-900" : "text-slate-300"
            }`}
          >
            {title || "Write article title from the sidebar..."}
          </h1>
        </div>

        {/* Content */}
        <div className="mt-5 max-w-[760px] space-y-5">
          {excerpt && (
            <p className="text-[15px] leading-8 text-slate-700">{excerpt}</p>
          )}

          {/* NEW: Render image inside article body */}
          {coverImageUrl && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white h-96">
              <img
                src={coverImageUrl}
                alt="Article image"
                className="h-full w-full object-cover"
              />
              <p className="px-4 py-2 text-xs text-slate-400 text-center">
                Figure: Article cover image preview
              </p>
            </div>
          )}

          <div
            className={`whitespace-pre-wrap text-[16px] leading-8 ${
              content ? "text-slate-700" : "text-slate-400"
            }`}
          >
            {content ||
              "The content you write from the sidebar will appear here as the article body preview."}
          </div>
        </div>
      </div>
    </div>
  );
}
