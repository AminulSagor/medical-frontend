"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import type {
  BlogCategoryOption,
  BlogTagOption,
} from "@/types/admin/blogs/blog-create.types";
import { cx } from "../_utils/create-blog-post.helpers";
import CreateBlogPostSettingsSection from "./create-blog-post-settings-section";

type CreateBlogPostSettingsOrganizationSectionProps = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  titleError?: string;
  contentError?: string;
  categoryOptions: BlogCategoryOption[];
  selectedCategoryIds: string[];
  onToggleCategory: (value: string) => void;
  categoryError?: string;
  categoryLoadError?: string;
  isLoadingCategories?: boolean;
  newCategoryName: string;
  onNewCategoryNameChange: (value: string) => void;
  onCreateCategory: () => void;
  isCreatingCategory?: boolean;
  createCategoryError?: string;
  tagOptions: BlogTagOption[];
  selectedTagIds: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (value: string) => void;
  isLoadingTags?: boolean;
  tagLoadError?: string;
  isCreatingTag?: boolean;
  createTagError?: string;
};

export default function CreateBlogPostSettingsOrganizationSection({
  title,
  content,
  onTitleChange,
  onContentChange,
  titleError,
  contentError,
  categoryOptions,
  selectedCategoryIds,
  onToggleCategory,
  categoryError,
  categoryLoadError,
  isLoadingCategories = false,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  isCreatingCategory = false,
  createCategoryError,
  tagOptions,
  selectedTagIds,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  isLoadingTags = false,
  tagLoadError,
  isCreatingTag = false,
  createTagError,
}: CreateBlogPostSettingsOrganizationSectionProps) {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);

  const selectedTagOptions = tagOptions.filter((tag) =>
    selectedTagIds.includes(tag.id),
  );

  return (
    <CreateBlogPostSettingsSection title="Organization">
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Title
        </p>

        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter post title..."
          className={cx(
            "h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400",
            titleError ? "border-rose-300" : "border-slate-200",
          )}
        />

        {titleError ? (
          <p className="mt-2 text-xs text-rose-500">{titleError}</p>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Content
        </p>

        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={8}
          placeholder="Write your blog content here..."
          className={cx(
            "w-full resize-none rounded-xl border bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400",
            contentError ? "border-rose-300" : "border-slate-200",
          )}
        />

        {contentError ? (
          <p className="mt-2 text-xs text-rose-500">{contentError}</p>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Categories
        </p>

        <div
          className={cx(
            "rounded-xl border p-3",
            categoryError ? "border-rose-300" : "border-slate-200",
          )}
        >
          {isLoadingCategories ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Loading categories...
            </div>
          ) : categoryOptions.length === 0 ? (
            <p className="text-sm text-slate-500">No categories found.</p>
          ) : (
            <div className="space-y-3">
              {categoryOptions.map((category) => {
                const checked = selectedCategoryIds.includes(category.id);

                return (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleCategory(category.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-[var(--primary)]"
                    />
                    <span className="text-sm text-slate-800">
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {categoryError ? (
          <p className="mt-2 text-xs text-rose-500">{categoryError}</p>
        ) : null}

        {categoryLoadError ? (
          <p className="mt-2 text-xs text-rose-500">{categoryLoadError}</p>
        ) : null}

        <button
          type="button"
          onClick={() => setIsCreateCategoryOpen((prev) => !prev)}
          className="mt-3 text-sm font-medium text-[var(--primary)] transition hover:opacity-80"
        >
          {isCreateCategoryOpen ? "− Hide Category Form" : "+ Add New Category"}
        </button>

        {isCreateCategoryOpen ? (
          <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <input
              value={newCategoryName}
              onChange={(e) => onNewCategoryNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onCreateCategory();
                }
              }}
              placeholder="Enter category name..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCreateCategory}
                disabled={isCreatingCategory}
                className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
              >
                {isCreatingCategory ? "Creating..." : "Create Category"}
              </button>
            </div>

            {createCategoryError ? (
              <p className="text-xs text-rose-500">{createCategoryError}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Tags
        </p>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          {isLoadingTags ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Loading tags...
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {selectedTagOptions.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(tag.id)}
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      ×
                    </button>
                  </span>
                ))}

                {selectedTagOptions.length === 0 ? (
                  <span className="text-sm text-slate-400">
                    No tags selected yet.
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <input
                  value={tagInput}
                  onChange={(e) => onTagInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={onAddTag}
                  disabled={isCreatingTag || !tagInput.trim()}
                  className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
                >
                  {isCreatingTag ? "Adding..." : "Add"}
                </button>
              </div>
            </>
          )}
        </div>

        {tagLoadError ? (
          <p className="mt-2 text-xs text-rose-500">{tagLoadError}</p>
        ) : null}

        {createTagError ? (
          <p className="mt-2 text-xs text-rose-500">{createTagError}</p>
        ) : null}
      </div>
    </CreateBlogPostSettingsSection>
  );
}
