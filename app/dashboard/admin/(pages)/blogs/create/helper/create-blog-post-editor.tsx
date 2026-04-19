"use client";

import { FilePenLine, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import CreateBlogPostToolbar from "./create-blog-post-toolbar";

type CreateBlogPostEditorProps = {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  secondImageUrl: string;
  isUploadingCoverImage: boolean;
  isUploadingSecondImage: boolean;
  coverImageError?: string;
  secondImageError?: string;
  titleError?: string;
  contentError?: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSelectCoverImage: (file: File) => Promise<void> | void;
  onSelectSecondImage: (file: File) => Promise<void> | void;
  onRemoveCoverImage: () => void;
  onRemoveSecondImage: () => void;
};

type ImageUploadCardProps = {
  label: string;
  imageUrl: string;
  title: string;
  isUploading: boolean;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onOpenPicker: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: () => void;
  emptyHeightClassName?: string;
};

function ImageUploadCard({
  label,
  imageUrl,
  title,
  isUploading,
  error,
  inputRef,
  onOpenPicker,
  onFileChange,
  onRemove,
  emptyHeightClassName = "h-[260px] md:h-[340px]",
}: ImageUploadCardProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative h-[260px] w-full bg-slate-100 md:h-[340px]">
            <img
              src={imageUrl}
              alt={title || label}
              className="h-full w-full object-cover"
            />

            {isUploading ? (
              <div className="absolute inset-0 grid place-items-center bg-white/75">
                <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow">
                  <Loader2 size={16} className="animate-spin" />
                  Uploading image...
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
            <button
              type="button"
              onClick={onOpenPicker}
              disabled={isUploading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Upload size={16} />
              Change Image
            </button>

            <button
              type="button"
              onClick={onRemove}
              disabled={isUploading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-medium text-rose-500 transition hover:bg-rose-50 disabled:opacity-60"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onOpenPicker}
          disabled={isUploading}
          className={`grid w-full place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100 disabled:opacity-60 ${emptyHeightClassName}`}
        >
          <div>
            {isUploading ? (
              <>
                <Loader2
                  size={28}
                  className="mx-auto animate-spin text-slate-500"
                />
                <p className="mt-3 text-sm text-slate-500">
                  Uploading image...
                </p>
              </>
            ) : (
              <>
                <ImageIcon size={28} className="mx-auto text-slate-500" />
                <p className="mt-3 text-sm text-slate-500">{label}</p>
              </>
            )}
          </div>
        </button>
      )}

      {error ? <p className="mt-3 text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

export default function CreateBlogPostEditor({
  title,
  content,
  excerpt,
  coverImageUrl,
  secondImageUrl,
  isUploadingCoverImage,
  isUploadingSecondImage,
  coverImageError,
  secondImageError,
  titleError,
  contentError,
  onTitleChange,
  onContentChange,
  onSelectCoverImage,
  onSelectSecondImage,
  onRemoveCoverImage,
  onRemoveSecondImage,
}: CreateBlogPostEditorProps) {
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const secondImageInputRef = useRef<HTMLInputElement | null>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleOpenCoverPicker = () => {
    coverImageInputRef.current?.click();
  };

  const handleOpenSecondImagePicker = () => {
    secondImageInputRef.current?.click();
  };

  const handleCoverFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await onSelectCoverImage(file);
    event.target.value = "";
  };

  const handleSecondImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await onSelectSecondImage(file);
    event.target.value = "";
  };

  const applyTagToSelection = (
    openTag: string,
    closeTag: string,
    defaultText: string,
  ) => {
    const textarea = contentTextareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = content.slice(start, end);
    const textToWrap = selectedText || defaultText;

    const nextValue =
      content.slice(0, start) +
      openTag +
      textToWrap +
      closeTag +
      content.slice(end);

    onContentChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const selectionStart = start + openTag.length;
      const selectionEnd = selectionStart + textToWrap.length;

      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <FilePenLine size={14} />
        Post Editor
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-8 md:py-8 xl:px-10">
        <div className="mb-8">
          <ImageUploadCard
            label="Add Cover Image"
            imageUrl={coverImageUrl}
            title={title}
            isUploading={isUploadingCoverImage}
            error={coverImageError}
            inputRef={coverImageInputRef}
            onOpenPicker={handleOpenCoverPicker}
            onFileChange={handleCoverFileChange}
            onRemove={onRemoveCoverImage}
            emptyHeightClassName="h-[240px] md:h-[320px]"
          />
        </div>

        <div className="mb-6">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Write your article title..."
            className={`w-full border-0 bg-transparent text-3xl font-black leading-tight tracking-[-0.03em] text-slate-700 outline-none placeholder:text-slate-300 md:text-4xl ${
              titleError ? "text-rose-500 placeholder:text-rose-300" : ""
            }`}
          />

          {titleError ? (
            <p className="mt-3 text-xs text-rose-500">{titleError}</p>
          ) : null}
        </div>

        {excerpt ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm leading-7 text-slate-600">{excerpt}</p>
          </div>
        ) : null}

        <div className="mb-5 overflow-hidden rounded-lg flex items-center justify-center">
          <div className="border rounded-lg">
            <CreateBlogPostToolbar
              onBold={() =>
                applyTagToSelection("<strong>", "</strong>", "bold text")
              }
              onItalic={() =>
                applyTagToSelection("<em>", "</em>", "italic text")
              }
              onUnderline={() =>
                applyTagToSelection("<u>", "</u>", "underlined text")
              }
              onH1={() => applyTagToSelection("<h1>", "</h1>", "Heading 1")}
              onH2={() => applyTagToSelection("<h2>", "</h2>", "Heading 2")}
              onQuote={() =>
                applyTagToSelection(
                  "<blockquote>",
                  "</blockquote>",
                  "Quote text",
                )
              }
            />
          </div>
        </div>

        <div>
          <textarea
            ref={contentTextareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            rows={14}
            placeholder="Write your blog content here..."
            className={`min-h-[280px] w-full resize-none border border-slate-100 rounded-lg p-2 bg-transparent text-sm leading-7 text-slate-700 outline-none placeholder:text-slate-400 md:text-base ${
              contentError ? "text-rose-500 placeholder:text-rose-300" : ""
            }`}
          />
          {contentError ? (
            <p className="mt-3 text-xs text-rose-500">{contentError}</p>
          ) : null}
        </div>

        <div className="mt-8">
          <ImageUploadCard
            label="Add Article Image"
            imageUrl={secondImageUrl}
            title={title}
            isUploading={isUploadingSecondImage}
            error={secondImageError}
            inputRef={secondImageInputRef}
            onOpenPicker={handleOpenSecondImagePicker}
            onFileChange={handleSecondImageFileChange}
            onRemove={onRemoveSecondImage}
            emptyHeightClassName="h-[220px] md:h-[300px]"
          />
        </div>
      </div>
    </div>
  );
}
