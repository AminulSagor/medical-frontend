"use client";

import { EllipsisVertical, Save, TriangleAlert } from "lucide-react";
import CreateBlogPostEditor from "../helper/create-blog-post-editor";
import CreateBlogPostPreview from "../helper/create-blog-post-preview";
import CreateBlogPostSettingsSidebar from "../helper/create-blog-post-settings-sidebar";
import LiveNowModal from "../modals/live-now-modal";
import { BLOG_MANAGEMENT_PATH } from "../_utils/create-blog-post.constants";
import { useCreateBlogPost } from "@/app/dashboard/admin/(pages)/blogs/create/_utils/use-create-blog-post";

export default function CreateBlogPostPage() {
  const {
    router,
    title,
    setTitle,
    content,
    setContent,
    excerpt,
    setExcerpt,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
    coverImageUrl,
    isUploadingCoverImage,
    coverImageError,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    authorOptions,
    selectedAuthorId,
    setSelectedAuthorId,
    authorSearch,
    setAuthorSearch,
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
    bannerError,
    isSubmitting,
    wordCount,
    readTimeLabel,
    isLiveNowModalOpen,
    createdBlogModalData,
    handleSelectCoverImage,
    handleRemoveCoverImage,
    handleAddTag,
    handleApplyAuthorSearch,
    handleClearAuthorSelection,
    handleCreateCategory,
    handleSubmit,
    handleViewLiveArticle,
    handleShareArticle,
    handleDoneAfterPublish,
    clearAuthorError,
    clearTitleError,
    clearContentError,
    clearScheduleError,
    clearCategoryError,
    clearCreateTagError,
  } = useCreateBlogPost();

  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => router.push(BLOG_MANAGEMENT_PATH)}
              className="font-medium text-slate-600 transition hover:text-slate-900"
            >
              ← Back to Posts
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting || isUploadingCoverImage}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("scheduled")}
              disabled={isSubmitting || isUploadingCoverImage}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              ▷ Publish
            </button>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100"
            >
              <EllipsisVertical />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-6">
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
            isUploadingCoverImage={isUploadingCoverImage}
            coverImageError={coverImageError}
            onSelectCoverImage={handleSelectCoverImage}
            onRemoveCoverImage={handleRemoveCoverImage}
          />

          <aside className="min-w-0 xl:w-[320px]">
            <div className="sticky top-6 space-y-4">
              <CreateBlogPostPreview />

              <CreateBlogPostSettingsSidebar
                title={title}
                content={content}
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
                titleError={errors.title}
                contentError={errors.content}
                authorOptions={authorOptions}
                selectedAuthorId={selectedAuthorId}
                authorSearch={authorSearch}
                onAuthorSelect={(value) => {
                  setSelectedAuthorId(value);
                  if (value) {
                    clearAuthorError();
                  }
                }}
                onAuthorSearchChange={(value) => {
                  setAuthorSearch(value);
                  clearAuthorError();
                }}
                onApplyAuthorSearch={handleApplyAuthorSearch}
                onClearAuthorSelection={handleClearAuthorSelection}
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
                onExcerptChange={setExcerpt}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                onMetaTitleChange={setMetaTitle}
                onMetaDescriptionChange={setMetaDescription}
                authorError={errors.author}
              />
            </div>
          </aside>
        </div>
      </div>

      {isLiveNowModalOpen && createdBlogModalData ? (
        <LiveNowModal
          title={createdBlogModalData.title}
          author={createdBlogModalData.author}
          category={createdBlogModalData.category}
          readTime={createdBlogModalData.readTime}
          onClose={handleDoneAfterPublish}
          onViewLive={handleViewLiveArticle}
          onShare={handleShareArticle}
          onDone={handleDoneAfterPublish}
        />
      ) : null}
    </div>
  );
}
