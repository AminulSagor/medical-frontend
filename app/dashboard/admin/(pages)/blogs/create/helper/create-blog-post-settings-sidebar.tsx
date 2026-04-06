"use client";

import type {
  BlogAuthorOption,
  BlogCategoryOption,
  BlogTagOption,
} from "@/types/admin/blogs/blog-create.types";
import CreateBlogPostSettingsExcerptSection from "./create-blog-post-settings-excerpt-section";
import CreateBlogPostSettingsOrganizationSection from "./create-blog-post-settings-organization-section";
import CreateBlogPostSettingsPublishingSection from "./create-blog-post-settings-publishing-section";
import CreateBlogPostSettingsSeoSection from "./create-blog-post-settings-seo-section";

type CreateBlogPostSettingsSidebarProps = {
  authorOptions: BlogAuthorOption[];
  selectedAuthorId: string;
  authorSearch: string;
  onAuthorSelect: (value: string) => void;
  onAuthorSearchChange: (value: string) => void;
  onApplyAuthorSearch: () => void;
  onClearAuthorSelection: () => void;
  scheduleDate: string;
  scheduleTime: string;
  onScheduleDateChange: (value: string) => void;
  onScheduleTimeChange: (value: string) => void;
  scheduleError?: string;
  isFeatured: boolean;
  onToggleFeatured: () => void;
  wordCount: number;
  readTimeLabel: string;
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
  excerpt: string;
  onExcerptChange: (value: string) => void;
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  authorError?: string;
};

export default function CreateBlogPostSettingsSidebar({
  authorOptions,
  selectedAuthorId,
  authorSearch,
  onAuthorSelect,
  onAuthorSearchChange,
  onApplyAuthorSearch,
  onClearAuthorSelection,
  scheduleDate,
  scheduleTime,
  onScheduleDateChange,
  onScheduleTimeChange,
  scheduleError,
  isFeatured,
  onToggleFeatured,
  wordCount,
  readTimeLabel,
  categoryOptions,
  selectedCategoryIds,
  onToggleCategory,
  categoryError,
  categoryLoadError,
  isLoadingCategories,
  newCategoryName,
  onNewCategoryNameChange,
  onCreateCategory,
  isCreatingCategory,
  createCategoryError,
  tagOptions,
  selectedTagIds,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  excerpt,
  onExcerptChange,
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
  authorError,
}: CreateBlogPostSettingsSidebarProps) {
  return (
    <div className="overflow-hidden rounded-none border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-[17px] font-bold text-slate-900">Post Settings</h2>
      </div>

      <CreateBlogPostSettingsPublishingSection
        authorOptions={authorOptions}
        selectedAuthorId={selectedAuthorId}
        authorSearch={authorSearch}
        onAuthorSelect={onAuthorSelect}
        onAuthorSearchChange={onAuthorSearchChange}
        onApplyAuthorSearch={onApplyAuthorSearch}
        onClearAuthorSelection={onClearAuthorSelection}
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        onScheduleDateChange={onScheduleDateChange}
        onScheduleTimeChange={onScheduleTimeChange}
        scheduleError={scheduleError}
        isFeatured={isFeatured}
        onToggleFeatured={onToggleFeatured}
        wordCount={wordCount}
        readTimeLabel={readTimeLabel}
        authorError={authorError}
      />

      <CreateBlogPostSettingsOrganizationSection
        categoryOptions={categoryOptions}
        selectedCategoryIds={selectedCategoryIds}
        onToggleCategory={onToggleCategory}
        categoryError={categoryError}
        categoryLoadError={categoryLoadError}
        isLoadingCategories={isLoadingCategories}
        newCategoryName={newCategoryName}
        onNewCategoryNameChange={onNewCategoryNameChange}
        onCreateCategory={onCreateCategory}
        isCreatingCategory={isCreatingCategory}
        createCategoryError={createCategoryError}
        tagOptions={tagOptions}
        selectedTagIds={selectedTagIds}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

      <CreateBlogPostSettingsExcerptSection
        excerpt={excerpt}
        onExcerptChange={onExcerptChange}
      />

      <CreateBlogPostSettingsSeoSection
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        onMetaTitleChange={onMetaTitleChange}
        onMetaDescriptionChange={onMetaDescriptionChange}
      />
    </div>
  );
}
