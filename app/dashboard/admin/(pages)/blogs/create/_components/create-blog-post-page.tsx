"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  EllipsisVertical,
  Save,
  TriangleAlert,
} from "lucide-react";

import CreateBlogPostEditor from "../helper/create-blog-post-editor";
import CreateBlogPostPreview from "../helper/create-blog-post-preview";
import CreateBlogPostSettingsSidebar from "../helper/create-blog-post-settings-sidebar";
import DraftSavedModal from "../modals/draft-saved-modal";
import LiveNowModal from "../modals/live-now-modal";
import PublishScheduledModal from "../modals/publish-scheduled-modal";
import ShareDistributionModal from "../modals/share-distribution-modal";
import NewsletterQueueModal from "../modals/newsletter-queue-modal";
import CohortsModal from "../modals/cohorts-modal";
import AddedToNewsletterSuccessModal from "../modals/added-to-newsletter-success-modal";

import { BLOG_MANAGEMENT_PATH } from "../_utils/create-blog-post.constants";
import { useCreateBlogPost } from "@/app/dashboard/admin/(pages)/blogs/create/_utils/use-create-blog-post";
import { useBlogPreviewStore } from "@/store/blog-preview.store";
import { blogDistributionService } from "@/service/admin/blogs/blog-distribution.service";

import type {
  BlogNewsletterFrequencyType,
  GetBlogDistributionOptionsResponse,
} from "@/types/admin/blogs/blog-distribution.types";
import type { DistributionChannel } from "../_utils/create-blog-post.types";

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
    isDraftSavedModalOpen,
    createdDraftModalData,
    isPublishScheduledModalOpen,
    scheduledBlogModalData,
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
    handleCloseDraftSavedModal,
    handleContinueEditingDraft,
    handleReturnToBlogManagement,
    handleClosePublishScheduledModal,
    handleViewScheduledArticles,
    handleReturnDashboardAfterSchedule,
    clearAuthorError,
    clearTitleError,
    clearContentError,
    clearScheduleError,
    clearCategoryError,
    clearCreateTagError,
  } = useCreateBlogPost();

  const setDraftPreview = useBlogPreviewStore((state) => state.setDraftPreview);

  const [isShareDistributionModalOpen, setIsShareDistributionModalOpen] =
    useState(false);
  const [isNewsletterQueueModalOpen, setIsNewsletterQueueModalOpen] =
    useState(false);
  const [isCohortsModalOpen, setIsCohortsModalOpen] = useState(false);
  const [isAddedToNewsletterModalOpen, setIsAddedToNewsletterModalOpen] =
    useState(false);

  const [distributionOptions, setDistributionOptions] =
    useState<GetBlogDistributionOptionsResponse | null>(null);
  const [isLoadingDistributionOptions, setIsLoadingDistributionOptions] =
    useState(false);
  const [isDistributionSubmitting, setIsDistributionSubmitting] =
    useState(false);

  const [lastNewsletterFrequency, setLastNewsletterFrequency] =
    useState<BlogNewsletterFrequencyType>("MONTHLY");

  const createdBlogId =
    createdBlogModalData &&
    typeof createdBlogModalData === "object" &&
    "id" in createdBlogModalData
      ? String(createdBlogModalData.id)
      : "";

  const newsletterName = useMemo(() => {
    return lastNewsletterFrequency === "WEEKLY"
      ? "Weekly Clinical Digest"
      : "Monthly Clinical Digest";
  }, [lastNewsletterFrequency]);

  const queuePosition = useMemo(() => {
    if (!distributionOptions) {
      return 1;
    }

    const queueInfo =
      lastNewsletterFrequency === "WEEKLY"
        ? distributionOptions.newsletterQueueDetails.weekly
        : distributionOptions.newsletterQueueDetails.monthly;

    return queueInfo.articlesInQueue + 1;
  }, [distributionOptions, lastNewsletterFrequency]);

  const handlePreview = () => {
    if (
      !title.trim() ||
      !content.trim() ||
      !selectedAuthorId ||
      selectedCategoryIds.length === 0
    ) {
      return;
    }

    const selectedAuthor = authorOptions.find(
      (author) => author.id === selectedAuthorId,
    );

    const selectedCategory = categoryOptions.find((category) =>
      selectedCategoryIds.includes(category.id),
    );

    setDraftPreview({
      id: "",
      title: title.trim(),
      content,
      coverImageUrl,
      excerpt,
      readTimeMinutes: Number.parseInt(readTimeLabel, 10) || 0,
      authors: selectedAuthor
        ? [
            {
              id: selectedAuthor.id,
              fullLegalName: selectedAuthor.name,
              medicalEmail: "",
              professionalRole: "",
            },
          ]
        : [],
      categories: selectedCategory
        ? [
            {
              id: selectedCategory.id,
              name: selectedCategory.name,
              slug: "",
              description: null,
              isActive: true,
              createdAt: "",
              updatedAt: "",
            },
          ]
        : [],
      tags: tagOptions
        .filter((tag) => selectedTagIds.includes(tag.id))
        .map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: "",
          createdAt: "",
        })),
      publishingStatus: "draft",
      scheduledPublishDate: null,
      isFeatured,
      publishedAt: null,
      seo: {
        id: "",
        postId: "",
        metaTitle,
        metaDescription,
        createdAt: "",
        updatedAt: "",
      },
      createdAt: "",
      updatedAt: "",
    });

    router.push("/dashboard/admin/blogs/preview?source=draft");
  };

  const ensureDistributionOptions = async () => {
    if (!createdBlogId) {
      return null;
    }

    if (distributionOptions) {
      return distributionOptions;
    }

    setIsLoadingDistributionOptions(true);

    try {
      const response =
        await blogDistributionService.getDistributionOptions(createdBlogId);

      setDistributionOptions(response);

      return response;
    } finally {
      setIsLoadingDistributionOptions(false);
    }
  };

  const handleOpenShareDistribution = async () => {
    handleShareArticle();

    const options = await ensureDistributionOptions();

    if (!options) {
      return;
    }

    setIsShareDistributionModalOpen(true);
  };

  const handleCloseShareDistribution = () => {
    setIsShareDistributionModalOpen(false);
  };

  const handleProceedDistribution = async (channel: DistributionChannel) => {
    if (!createdBlogId) {
      return;
    }

    if (channel === "email_blast") {
      setIsDistributionSubmitting(true);

      try {
        await blogDistributionService.distributeBlast(createdBlogId, {
          sendAdminCopy: true,
        });

        setIsShareDistributionModalOpen(false);
      } finally {
        setIsDistributionSubmitting(false);
      }

      return;
    }

    if (channel === "newsletter") {
      await ensureDistributionOptions();
      setIsShareDistributionModalOpen(false);
      setIsNewsletterQueueModalOpen(true);
      return;
    }

    if (channel === "trainees") {
      await ensureDistributionOptions();
      setIsShareDistributionModalOpen(false);
      setIsCohortsModalOpen(true);
    }
  };

  const handleCloseNewsletterQueueModal = () => {
    setIsNewsletterQueueModalOpen(false);
  };

  const handleBackToDistributionFromNewsletter = () => {
    setIsNewsletterQueueModalOpen(false);
    setIsShareDistributionModalOpen(true);
  };

  const handleConfirmNewsletterQueue = async (
    frequencyType: BlogNewsletterFrequencyType,
  ) => {
    if (!createdBlogId) {
      return;
    }

    setIsDistributionSubmitting(true);

    try {
      await blogDistributionService.distributeNewsletter(createdBlogId, {
        frequencyType,
      });

      setLastNewsletterFrequency(frequencyType);
      setIsNewsletterQueueModalOpen(false);
      setIsAddedToNewsletterModalOpen(true);
    } finally {
      setIsDistributionSubmitting(false);
    }
  };

  const handleCloseCohortsModal = () => {
    setIsCohortsModalOpen(false);
  };

  const handleBackToDistributionFromCohorts = () => {
    setIsCohortsModalOpen(false);
    setIsShareDistributionModalOpen(true);
  };

  const handleProceedCohortsBroadcast = async (cohortIds: string[]) => {
    if (!createdBlogId || cohortIds.length === 0) {
      return;
    }

    setIsDistributionSubmitting(true);

    try {
      await blogDistributionService.distributeCohorts(createdBlogId, {
        cohortIds,
      });

      setIsCohortsModalOpen(false);
    } finally {
      setIsDistributionSubmitting(false);
    }
  };

  const handleCloseAddedToNewsletterModal = () => {
    setIsAddedToNewsletterModalOpen(false);
  };

  const handleGoToNewsletterManager = () => {
    router.push("/dashboard/admin/newsletters/general-newsletter");
  };

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

          <div className="flex flex-wrap items-center gap-3">
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
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <CalendarDays size={16} />
              Schedule
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("published")}
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
              <CreateBlogPostPreview
                disabled={
                  !title ||
                  !content ||
                  !selectedAuthorId ||
                  selectedCategoryIds.length === 0
                }
                onClick={handlePreview}
              />

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

      {isDraftSavedModalOpen && createdDraftModalData ? (
        <DraftSavedModal
          title={createdDraftModalData.title}
          onClose={handleCloseDraftSavedModal}
          onContinue={handleContinueEditingDraft}
          onReturn={handleReturnToBlogManagement}
        />
      ) : null}

      {isPublishScheduledModalOpen && scheduledBlogModalData ? (
        <PublishScheduledModal
          title={scheduledBlogModalData.title}
          publishDate={scheduledBlogModalData.publishDate}
          publishTime={scheduledBlogModalData.publishTime}
          onClose={handleClosePublishScheduledModal}
          onViewSchedule={handleViewScheduledArticles}
          onReturnDashboard={handleReturnDashboardAfterSchedule}
        />
      ) : null}

      {isLiveNowModalOpen && createdBlogModalData ? (
        <LiveNowModal
          title={createdBlogModalData.title}
          author={createdBlogModalData.author}
          category={createdBlogModalData.category}
          readTime={createdBlogModalData.readTime}
          onClose={handleDoneAfterPublish}
          onViewLive={handleViewLiveArticle}
          onShare={handleOpenShareDistribution}
          onDone={handleDoneAfterPublish}
        />
      ) : null}

      {isShareDistributionModalOpen ? (
        <ShareDistributionModal
          options={distributionOptions}
          isLoadingOptions={
            isLoadingDistributionOptions || isDistributionSubmitting
          }
          onClose={handleCloseShareDistribution}
          onProceed={handleProceedDistribution}
        />
      ) : null}

      {isNewsletterQueueModalOpen && distributionOptions ? (
        <NewsletterQueueModal
          options={distributionOptions}
          isSubmitting={isDistributionSubmitting}
          onBack={handleBackToDistributionFromNewsletter}
          onClose={handleCloseNewsletterQueueModal}
          onConfirm={handleConfirmNewsletterQueue}
        />
      ) : null}

      {isCohortsModalOpen && distributionOptions ? (
        <CohortsModal
          cohorts={distributionOptions.courseCohorts}
          isSubmitting={isDistributionSubmitting}
          onBack={handleBackToDistributionFromCohorts}
          onClose={handleCloseCohortsModal}
          onProceed={handleProceedCohortsBroadcast}
        />
      ) : null}

      {isAddedToNewsletterModalOpen && createdBlogModalData ? (
        <AddedToNewsletterSuccessModal
          articleTitle={createdBlogModalData.title}
          newsletterName={newsletterName}
          queuePosition={queuePosition}
          onGoToNewsletterManager={handleGoToNewsletterManager}
          onDone={handleCloseAddedToNewsletterModal}
        />
      ) : null}
    </div>
  );
}
