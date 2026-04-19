"use client";

import {
  Bold,
  CheckCircle2,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyEditorCommand,
  htmlToPlainText,
  normalizeEditorHtml,
  sanitizeBroadcastHtml,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-editor.utils";
import { generalBroadcastCreateService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.service";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
  GeneralBroadcastArticleSourceItem,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

type Props = {
  mode: "create" | "edit";
  form: CreateBroadcastFormState;
  errors: CreateBroadcastFormErrors;
  onChange: <K extends keyof CreateBroadcastFormState>(
    key: K,
    value: CreateBroadcastFormState[K],
  ) => void;
  onUploadAttachments: (files: FileList | null) => Promise<void>;
  onRemoveAttachment: (fileKey: string) => Promise<void>;
};

export default function CreateBroadcastContentSection({
  mode,
  form,
  errors,
  onChange,
  onUploadAttachments,
  onRemoveAttachment,
}: Props) {
  const isCustomMessage = form.contentType === "CUSTOM_MESSAGE";
  const isEditMode = mode === "edit";
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [articleOptions, setArticleOptions] = useState<
    GeneralBroadcastArticleSourceItem[]
  >([]);
  const [isSearchingArticles, setIsSearchingArticles] = useState(false);
  const [showArticleDropdown, setShowArticleDropdown] = useState(false);

  const isArticleCardDisabled =
    isEditMode && form.contentType === "CUSTOM_MESSAGE";
  const isCustomCardDisabled =
    isEditMode && form.contentType === "ARTICLE_LINK";

  useEffect(() => {
    if (form.contentType !== "ARTICLE_LINK") return;

    const searchText = form.articleSearch.trim();

    if (searchText.length < 2) {
      setArticleOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingArticles(true);
        const response =
          await generalBroadcastCreateService.searchArticleSources(
            searchText,
            1,
            10,
          );
        setArticleOptions(response.items);
        setShowArticleDropdown(true);
      } catch (error) {
        console.error("Failed to search article sources", error);
      } finally {
        setIsSearchingArticles(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [form.articleSearch, form.contentType]);

  useEffect(() => {
    if (!isCustomMessage || !editorRef.current) return;

    const sanitizedHtml = sanitizeBroadcastHtml(form.messageBodyHtml || "");

    if (editorRef.current.innerHTML !== sanitizedHtml) {
      editorRef.current.innerHTML = sanitizedHtml;
    }
  }, [form.messageBodyHtml, isCustomMessage]);

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

  const syncEditorValue = () => {
    if (!editorRef.current) return;

    const rawHtml = editorRef.current.innerHTML || "";
    const sanitizedHtml = normalizeEditorHtml(rawHtml);

    if (form.messageBodyHtml !== sanitizedHtml) {
      onChange("messageBodyHtml", sanitizedHtml);
      onChange("messageBodyText", htmlToPlainText(sanitizedHtml));
    }
  };

  const handleToolbarCommand = (command: string) => {
    editorRef.current?.focus();
    applyEditorCommand(command);
    syncEditorValue();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;

    const textarea = document.querySelector(
      "#message-body-textarea",
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      const before = text.substring(0, start);
      const after = text.substring(end);
      const linkText = selectedText || "link text";
      const linkMarkdown = `[${linkText}](${url.trim()})`;

      textarea.value = before + linkMarkdown + after;
      onChange("messageBodyText", textarea.value);
      onChange("messageBodyHtml", textarea.value);
      textarea.focus();
      textarea.setSelectionRange(
        start + linkMarkdown.length,
        start + linkMarkdown.length,
      );
    }
  };

  const handleInsertTag = () => {
    const textarea = document.querySelector(
      "#message-body-textarea",
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const tag = "{{Student_Name}}";

      textarea.value = before + tag + after;
      onChange("messageBodyText", textarea.value);
      onChange("messageBodyHtml", textarea.value);
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }
  };

  const handleSelectArticle = (article: GeneralBroadcastArticleSourceItem) => {
    onChange("selectedArticle", article);
    onChange("articleSearch", article.title);
    setShowArticleDropdown(false);
  };

  return (
    <>
      <section className="rounded-[28px] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Content Type Selection
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Select your primary newsletter format
          </p>
          {isEditMode ? (
            <p className="mt-2 text-xs text-amber-600">
              Content type cannot be changed after creation.
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectableCard
            title="Link Clinical Article"
            description="Select from published research, surgical insights, and peer-reviewed journals."
            icon={<FileText size={20} />}
            selected={form.contentType === "ARTICLE_LINK"}
            disabled={isArticleCardDisabled}
            onClick={() => {
              if (isArticleCardDisabled) return;
              onChange("contentType", "ARTICLE_LINK");
            }}
          />

          <SelectableCard
            title="Compose Custom Message"
            description="Write a standalone announcement, update, or personalized clinical memo."
            icon={<Link2 size={20} />}
            selected={form.contentType === "CUSTOM_MESSAGE"}
            disabled={isCustomCardDisabled}
            onClick={() => {
              if (isCustomCardDisabled) return;
              onChange("contentType", "CUSTOM_MESSAGE");
            }}
          />
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            Content Details
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Configure the email metadata and source
          </p>
        </div>

        <div className="space-y-4">
          {form.contentType === "ARTICLE_LINK" && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Select Published Article
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={form.articleSearch}
                  onChange={(e) => {
                    onChange("articleSearch", e.target.value);
                    onChange("selectedArticle", null);
                  }}
                  onFocus={() => setShowArticleDropdown(true)}
                  placeholder="Search and select a published article"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#18c3b2]"
                />

                {showArticleDropdown &&
                (form.articleSearch.trim().length >= 2 ||
                  articleOptions.length > 0) ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    {isSearchingArticles ? (
                      <div className="px-3 py-3 text-xs text-slate-500">
                        Searching articles...
                      </div>
                    ) : articleOptions.length ? (
                      articleOptions.map((article) => (
                        <button
                          key={article.sourceRefId}
                          type="button"
                          onClick={() => handleSelectArticle(article)}
                          className="flex w-full flex-col rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                        >
                          <span className="text-sm font-semibold text-slate-700">
                            {article.title}
                          </span>
                          <span className="mt-1 text-xs text-slate-500">
                            {article.kindLabel} • {article.authorName}
                          </span>
                          <span className="mt-1 line-clamp-2 text-xs text-slate-400">
                            {article.excerpt}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-xs text-slate-500">
                        No article found.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {errors.articleSearch ? (
                <p className="mt-2 text-xs text-red-500">
                  {errors.articleSearch}
                </p>
              ) : form.selectedArticle ? (
                <p className="mt-2 text-xs text-emerald-600">
                  {form.selectedArticle.title}
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Subject Line
            </label>
            <input
              type="text"
              value={form.subjectLine}
              onChange={(e) => onChange("subjectLine", e.target.value)}
              placeholder="Enter subject line"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#18c3b2]"
            />
            {errors.subjectLine ? (
              <p className="mt-2 text-xs text-red-500">{errors.subjectLine}</p>
            ) : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-xs font-semibold text-slate-600">
                Pre-header (Preview Text)
              </label>
              <span className="text-xs text-slate-400">
                {form.preHeader.length}/150
              </span>
            </div>

            <input
              type="text"
              maxLength={150}
              value={form.preHeader}
              onChange={(e) => onChange("preHeader", e.target.value)}
              placeholder="Enter pre-header text"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#18c3b2]"
            />
            {errors.preHeader ? (
              <p className="mt-2 text-xs text-red-500">{errors.preHeader}</p>
            ) : null}
          </div>
        </div>
      </section>

      {isCustomMessage && (
        <section className="rounded-[28px] bg-[#f8fafc] p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Message Body
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Compose your custom clinical message
              </p>
            </div>

            <button
              type="button"
              onClick={handleInsertTag}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-500 shadow-sm hover:bg-slate-50"
            >
              @ Insert Personalization Tag
            </button>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-4 py-4">
              <button
                type="button"
                onClick={() => {
                  const textarea = document.querySelector(
                    "#message-body-textarea",
                  ) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(textarea.selectionEnd);

                    textarea.value = before + "**bold**" + after;
                    onChange("messageBodyText", textarea.value);
                    onChange("messageBodyHtml", textarea.value);
                    textarea.focus();
                    textarea.setSelectionRange(start + 7, start + 7);
                  }
                }}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
              >
                <Bold size={15} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const textarea = document.querySelector(
                    "#message-body-textarea",
                  ) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(textarea.selectionEnd);

                    textarea.value = before + "*italic*" + after;
                    onChange("messageBodyText", textarea.value);
                    onChange("messageBodyHtml", textarea.value);
                    textarea.focus();
                    textarea.setSelectionRange(start + 8, start + 8);
                  }
                }}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
              >
                <Italic size={15} />
              </button>

              <div className="mx-1 h-5 w-px bg-slate-200" />

              <button
                type="button"
                onClick={() => {
                  const textarea = document.querySelector(
                    "#message-body-textarea",
                  ) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(textarea.selectionEnd);

                    textarea.value = before + "\n- item\n- item\n" + after;
                    onChange("messageBodyText", textarea.value);
                    onChange("messageBodyHtml", textarea.value);
                  }
                }}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
              >
                <List size={15} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const textarea = document.querySelector(
                    "#message-body-textarea",
                  ) as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const text = textarea.value;
                    const before = text.substring(0, start);
                    const after = text.substring(textarea.selectionEnd);

                    textarea.value = before + "\n1. item\n2. item\n" + after;
                    onChange("messageBodyText", textarea.value);
                    onChange("messageBodyHtml", textarea.value);
                  }
                }}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
              >
                <ListOrdered size={15} />
              </button>

              <div className="mx-1 h-5 w-px bg-slate-200" />

              <button
                type="button"
                onClick={handleInsertLink}
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
              >
                <Link2 size={15} />
              </button>

              <div className="ml-auto rounded-md bg-[#eafbf8] px-2.5 py-1 text-xs font-semibold text-[#14b8a6]">
                {`{{Student_Name}}`} Tag
              </div>
            </div>

            <textarea
              id="message-body-textarea"
              value={form.messageBodyText || ""}
              onChange={(e) => {
                onChange("messageBodyText", e.target.value);
                onChange("messageBodyHtml", e.target.value);
              }}
              placeholder="Write your message here..."
              className="min-h-[300px] w-full resize-y px-5 py-6 text-sm leading-8 text-slate-600 outline-none focus:ring-0"
            />
          </div>

          {errors.messageBody ? (
            <p className="mt-2 text-xs text-red-500">{errors.messageBody}</p>
          ) : null}
        </section>
      )}

      {isCustomMessage && (
        <section className="rounded-[28px] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-800">
              Attachments
            </h2>
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
                    <p className="text-xs text-slate-400">
                      {attachment.sizeLabel}
                    </p>
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
      )}
    </>
  );
}

type SelectableCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function SelectableCard({
  title,
  description,
  icon,
  selected,
  disabled = false,
  onClick,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? "Content type cannot be changed in edit mode" : title}
      className={[
        "relative rounded-[24px] border p-6 text-left transition",
        selected
          ? "border-[#18c3b2] bg-[#f3fffd] shadow-[0_8px_24px_rgba(24,195,178,0.12)]"
          : "border-slate-200 bg-white hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-55 hover:bg-white" : "",
      ].join(" ")}
    >
      {selected ? (
        <CheckCircle2
          size={18}
          className="absolute right-4 top-4 text-[#18c3b2]"
        />
      ) : null}

      <div className="flex w-full items-center justify-center">
        <div
          className={[
            "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
            selected
              ? "bg-[#dff8f4] text-[#18c3b2]"
              : "bg-slate-50 text-slate-400",
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <h3 className="text-center text-sm font-semibold text-slate-800">
        {title}
      </h3>
      <p className="mt-3 text-center text-xs leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}
