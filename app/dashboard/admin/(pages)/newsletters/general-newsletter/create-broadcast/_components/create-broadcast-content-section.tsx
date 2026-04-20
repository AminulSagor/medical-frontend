"use client";

import { CheckCircle2, FileText, Link2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { generalBroadcastCreateService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.service";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
  GeneralBroadcastArticleSourceItem,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";
import CreateBroadcastAttachmentsSection from "./create-broadcast-attachments-section";
import CreateBroadcastMessageBodySection from "./create-broadcast-message-body-section";

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
        <CreateBroadcastMessageBodySection
          form={form}
          errors={errors}
          onChange={onChange}
        />
      )}

      {isCustomMessage && (
        <CreateBroadcastAttachmentsSection
          form={form}
          onUploadAttachments={onUploadAttachments}
          onRemoveAttachment={onRemoveAttachment}
        />
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
