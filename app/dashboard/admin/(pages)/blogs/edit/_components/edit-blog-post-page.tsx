"use client";

import { ArrowLeft, CalendarDays, Save, TriangleAlert } from "lucide-react";

import { useEditBlogPost } from "../_utils/use-edit-blog-post";
import CreateBlogPostEditor from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-editor";
import CreateBlogPostPreview from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-preview";
import CreateBlogPostSettingsSidebar from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-settings-sidebar";

const BLOG_MANAGEMENT_PATH = "/dashboard/admin/blogs";

export default function EditBlogPostPage({ blogId }: { blogId: string }) {
  const {
    loading,
    isSubmitting,
    bannerError,

    title,
    setTitle,
    content,
    setContent,
    authorName,
    setAuthorName,

    excerpt,
    setExcerpt,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,

    coverImageUrl,
    secondImageUrl,

    isUploadingCoverImage,
    isUploadingSecondImage,

    coverImageError,
    secondImageError,

    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,

    categoryOptions,
    isLoadingCategories,
    categoryLoadError,
    selectedCategoryIds,
    setSelectedCategoryIds,
    newCategoryName,
    setNewCategoryName,
    isCreatingCategory,
    categoryCreateError,

    tagOptions,
    selectedTagIds,
    setSelectedTagIds,
    tagInput,
    setTagInput,
    isLoadingTags,
    tagLoadError,
    isCreatingTag,
    createTagError,

    isFeatured,
    setIsFeatured,

    errors,

    wordCount,
    readTimeLabel,

    handleSelectCoverImage,
    handleSelectSecondImage,
    handleRemoveCoverImage,
    handleRemoveSecondImage,

    handleAddTag,
    handleCreateCategory,
    handleSubmit,

    clearAuthorError,
    clearTitleError,
    clearContentError,
    clearScheduleError,
    clearCategoryError,
    clearExcerptError,
    clearCoverImageError,
    clearSecondImageError,
    clearMetaTitleError,
    clearMetaDescriptionError,
    clearCreateTagError,
  } = useEditBlogPost(blogId);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="py-2 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="h-11 w-32 animate-pulse rounded-lg bg-slate-100" />
            <div className="flex gap-3">
              <div className="h-11 w-28 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-11 w-28 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-11 w-28 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-h-[600px] animate-pulse rounded-2xl bg-slate-100" />
            <div className="min-h-[600px] animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateAsDraft = async () => {
    await handleSubmit("draft");
  };

  const handleUpdateAsScheduled = async () => {
    await handleSubmit("scheduled");
  };

  const handleUpdateAsPublished = async () => {
    await handleSubmit("published");
  };

  return (
    <div className="min-h-screen">
      <div className="py-2 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => window.location.assign(BLOG_MANAGEMENT_PATH)}
              className="inline-flex items-center gap-2 font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to Posts
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUpdateAsDraft}
              disabled={
                isSubmitting || isUploadingCoverImage || isUploadingSecondImage
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleUpdateAsScheduled}
              disabled={
                isSubmitting || isUploadingCoverImage || isUploadingSecondImage
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <CalendarDays size={16} />
              Schedule
            </button>

            <button
              type="button"
              onClick={handleUpdateAsPublished}
              disabled={
                isSubmitting || isUploadingCoverImage || isUploadingSecondImage
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              ▷ Publish
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px]">
        {bannerError ? (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-500">
            <TriangleAlert size={18} />
            {bannerError}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <CreateBlogPostEditor
            title={title}
            content={content}
            excerpt={excerpt}
            coverImageUrl={coverImageUrl}
            secondImageUrl={secondImageUrl}
            isUploadingCoverImage={isUploadingCoverImage}
            isUploadingSecondImage={isUploadingSecondImage}
            coverImageError={coverImageError || errors.coverImage}
            secondImageError={secondImageError || errors.secondImage}
            titleError={errors.title}
            contentError={errors.content}
            onTitleChange={(value) => {
              setTitle(value);
              if (value.trim()) {
                clearTitleError();
              }
            }}
            onContentChange={(value) => {
              setContent(value);
              if (value.trim()) {
                clearContentError();
              }
            }}
            onSelectCoverImage={handleSelectCoverImage}
            onSelectSecondImage={handleSelectSecondImage}
            onRemoveCoverImage={handleRemoveCoverImage}
            onRemoveSecondImage={handleRemoveSecondImage}
          />

          <aside className="min-w-0 xl:w-[320px]">
            <div className="sticky top-6 space-y-4">
              <CreateBlogPostPreview
                disabled={
                  !title.trim() ||
                  !content.trim() ||
                  !authorName.trim() ||
                  selectedCategoryIds.length === 0
                }
                onClick={() => {}}
              />

              <CreateBlogPostSettingsSidebar
                authorName={authorName}
                onAuthorNameChange={(value) => {
                  setAuthorName(value);
                  if (value.trim()) {
                    clearAuthorError();
                  }
                }}
                scheduleDate={scheduleDate}
                scheduleTime={scheduleTime}
                onScheduleDateChange={(value) => {
                  setScheduleDate(value);
                  if (value && scheduleTime) {
                    clearScheduleError();
                  }
                }}
                onScheduleTimeChange={(value) => {
                  setScheduleTime(value);
                  if (scheduleDate && value) {
                    clearScheduleError();
                  }
                }}
                scheduleError={errors.schedule}
                isFeatured={isFeatured}
                onToggleFeatured={() => setIsFeatured((prev) => !prev)}
                wordCount={wordCount}
                readTimeLabel={readTimeLabel}
                categoryOptions={categoryOptions}
                selectedCategoryIds={selectedCategoryIds}
                onToggleCategory={(value) => {
                  setSelectedCategoryIds((prev) => {
                    const next = prev.includes(value)
                      ? prev.filter((item) => item !== value)
                      : [...prev, value];

                    if (next.length > 0) {
                      clearCategoryError();
                    }

                    return next;
                  });
                }}
                categoryError={errors.categories}
                categoryLoadError={categoryLoadError}
                isLoadingCategories={isLoadingCategories}
                newCategoryName={newCategoryName}
                onNewCategoryNameChange={setNewCategoryName}
                onCreateCategory={handleCreateCategory}
                isCreatingCategory={isCreatingCategory}
                createCategoryError={categoryCreateError}
                tagOptions={tagOptions}
                selectedTagIds={selectedTagIds}
                tagInput={tagInput}
                onTagInputChange={(value) => {
                  setTagInput(value);
                  clearCreateTagError();
                }}
                onAddTag={handleAddTag}
                onRemoveTag={(value) => {
                  setSelectedTagIds((prev) =>
                    prev.filter((item) => item !== value),
                  );
                }}
                isLoadingTags={isLoadingTags}
                tagLoadError={tagLoadError}
                isCreatingTag={isCreatingTag}
                createTagError={createTagError}
                excerpt={excerpt}
                onExcerptChange={(value) => {
                  setExcerpt(value);
                  if (value.trim()) {
                    clearExcerptError();
                  }
                }}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                onMetaTitleChange={(value) => {
                  setMetaTitle(value);
                  if (value.trim()) {
                    clearMetaTitleError();
                  }
                }}
                onMetaDescriptionChange={(value) => {
                  setMetaDescription(value);
                  if (value.trim()) {
                    clearMetaDescriptionError();
                  }
                }}
                authorError={errors.authorName}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
