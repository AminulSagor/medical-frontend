"use client";

import {
  Bold,
  CheckCircle2,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Search,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyEditorCommand,
  htmlToPlainText,
  normalizeEditorHtml,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-editor.utils";
import { generalBroadcastCreateService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.service";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
  GeneralBroadcastArticleSourceItem,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

type Props = {
  form: CreateBroadcastFormState;
  errors: CreateBroadcastFormErrors;
  onChange: <K extends keyof CreateBroadcastFormState>(
    key: K,
    value: CreateBroadcastFormState[K],
  ) => void;
  onUploadAttachments: (files: FileList | null) => Promise<void>;
  onRemoveAttachment: (fileKey: string) => void;
};

export default function CreateBroadcastContentSection({
  form,
  errors,
  onChange,
  onUploadAttachments,
  onRemoveAttachment,
}: Props) {
  const isCustomMessage = form.contentType === "CUSTOM_MESSAGE";
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [articleOptions, setArticleOptions] = useState<
    GeneralBroadcastArticleSourceItem[]
  >([]);
  const [isSearchingArticles, setIsSearchingArticles] = useState(false);
  const [showArticleDropdown, setShowArticleDropdown] = useState(false);

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

    if (editorRef.current.innerHTML !== form.messageBodyHtml) {
      editorRef.current.innerHTML = form.messageBodyHtml;
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
    const html = normalizeEditorHtml(editorRef.current?.innerHTML || "");
    onChange("messageBodyHtml", html);
    onChange("messageBodyText", htmlToPlainText(html));
  };

  const handleToolbarCommand = (command: string) => {
    editorRef.current?.focus();
    applyEditorCommand(command);
    syncEditorValue();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;

    editorRef.current?.focus();
    applyEditorCommand("createLink", url);
    syncEditorValue();
  };

  const handleInsertTag = () => {
    editorRef.current?.focus();
    applyEditorCommand("insertText", "{{Student_Name}}");
    syncEditorValue();
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectableCard
            title="Link Clinical Article"
            description="Select from published research, surgical insights, and peer-reviewed journals."
            icon={<FileText size={20} />}
            selected={form.contentType === "ARTICLE_LINK"}
            onClick={() => onChange("contentType", "ARTICLE_LINK")}
          />

          <SelectableCard
            title="Compose Custom Message"
            description="Write a standalone announcement, update, or personalized clinical memo."
            icon={<Link2 size={20} />}
            selected={form.contentType === "CUSTOM_MESSAGE"}
            onClick={() => onChange("contentType", "CUSTOM_MESSAGE")}
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
                  Selected sourceRefId: {form.selectedArticle.sourceRefId}
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
              <EditorTool
                icon={<Bold size={15} />}
                onClick={() => handleToolbarCommand("bold")}
              />
              <EditorTool
                icon={<Italic size={15} />}
                onClick={() => handleToolbarCommand("italic")}
              />
              <div className="mx-1 h-5 w-px bg-slate-200" />
              <EditorTool
                icon={<List size={15} />}
                onClick={() => handleToolbarCommand("insertUnorderedList")}
              />
              <EditorTool
                icon={<ListOrdered size={15} />}
                onClick={() => handleToolbarCommand("insertOrderedList")}
              />
              <div className="mx-1 h-5 w-px bg-slate-200" />
              <EditorTool
                icon={<Link2 size={15} />}
                onClick={handleInsertLink}
              />
              <EditorTool
                icon={<Paperclip size={15} />}
                onClick={() => fileInputRef.current?.click()}
              />

              <div className="ml-auto rounded-md bg-[#eafbf8] px-2.5 py-1 text-xs font-semibold text-[#14b8a6]">
                {`{{Student_Name}}`} Tag
              </div>
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorValue}
              className="min-h-[300px] px-5 py-6 text-sm leading-8 text-slate-600 outline-none"
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
                    onClick={() => onRemoveAttachment(attachment.fileKey)}
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
  onClick: () => void;
};

function SelectableCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative rounded-[24px] border p-6 text-left transition",
        selected
          ? "border-[#18c3b2] bg-[#f3fffd] shadow-[0_8px_24px_rgba(24,195,178,0.12)]"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      {selected ? (
        <CheckCircle2
          size={18}
          className="absolute right-4 top-4 text-[#18c3b2]"
        />
      ) : null}

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

      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-3 text-xs leading-6 text-slate-500">{description}</p>
    </button>
  );
}

function EditorTool({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-slate-500 transition hover:bg-slate-100"
    >
      {icon}
    </button>
  );
}
