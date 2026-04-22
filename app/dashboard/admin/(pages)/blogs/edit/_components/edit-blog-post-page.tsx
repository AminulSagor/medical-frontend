"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Save, TriangleAlert } from "lucide-react";
import { toast } from "react-hot-toast";

import { useEditBlogPost } from "../_utils/use-edit-blog-post";
import CreateBlogPostEditor from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-editor";
import CreateBlogPostPreview from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-preview";
import CreateBlogPostSettingsSidebar from "@/app/dashboard/admin/(pages)/blogs/create/helper/create-blog-post-settings-sidebar";
import LiveNowModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/live-now-modal";
import ShareDistributionModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/share-distribution-modal";
import EmailBlastModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/email-blast-modal";
import NewsletterQueueModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/newsletter-queue-modal";
import CohortsModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/cohorts-modal";
import AddedToNewsletterSuccessModal from "@/app/dashboard/admin/(pages)/blogs/create/modals/added-to-newsletter-success-modal";
import { blogDistributionService } from "@/service/admin/blogs/blog-distribution.service";
import { useBlogPreviewStore } from "@/store/blog-preview.store";

import type {
  BlogNewsletterFrequencyType,
  GetBlogDistributionOptionsResponse,
} from "@/types/admin/blogs/blog-distribution.types";
import type { DistributionChannel } from "@/app/dashboard/admin/(pages)/blogs/create/_utils/create-blog-post.types";
import { useRouter } from "next/navigation";

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

    articleImages,
    uploadingArticleImageIndexes,
    articleImageError,

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

    isLiveNowModalOpen,
    createdBlogModalData,

    handleSelectCoverImage,
    handleSelectSecondImage,
    handleSelectArticleImage,
    handleRemoveCoverImage,
    handleRemoveSecondImage,
    handleRemoveArticleImage,
    handleAddArticleImage,

    handleAddTag,
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
    clearExcerptError,
    clearCoverImageError,
    clearSecondImageError,
    clearMetaTitleError,
    clearMetaDescriptionError,
    clearCreateTagError,
  } = useEditBlogPost(blogId);

  const setDraftPreview = useBlogPreviewStore((state) => state.setDraftPreview);

  const router = useRouter();

  const [isShareDistributionModalOpen, setIsShareDistributionModalOpen] =
    useState(false);
  const [isEmailBlastModalOpen, setIsEmailBlastModalOpen] = useState(false);
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

  const liveArticleTitle = createdBlogModalData?.title || title.trim();

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

  const isScheduledPublish = useMemo(() => {
    return Boolean(scheduleDate && scheduleTime);
  }, [scheduleDate, scheduleTime]);

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

  const handleSaveChanges = async () => {
    await handleSubmit("draft");
  };

  const handlePrimaryAction = async () => {
    await handleSubmit(isScheduledPublish ? "scheduled" : "published");
  };

  const ensureDistributionOptions = async () => {
    if (!blogId) {
      toast.error("Blog ID is missing.");
      return null;
    }

    if (distributionOptions) {
      return distributionOptions;
    }

    setIsLoadingDistributionOptions(true);

    try {
      const response =
        await blogDistributionService.getDistributionOptions(blogId);

      setDistributionOptions(response);

      return response;
    } catch (error) {
      toast.error("Failed to load distribution options.");
      return null;
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
    if (!blogId) {
      toast.error("Blog ID is missing.");
      return;
    }

    if (channel === "email_blast") {
      const options = await ensureDistributionOptions();

      if (!options) {
        return;
      }

      setIsShareDistributionModalOpen(false);
      setIsEmailBlastModalOpen(true);
      return;
    }

    if (channel === "newsletter") {
      const options = await ensureDistributionOptions();

      if (!options) {
        return;
      }

      setIsShareDistributionModalOpen(false);
      setIsNewsletterQueueModalOpen(true);
      return;
    }

    if (channel === "trainees") {
      const options = await ensureDistributionOptions();

      if (!options) {
        return;
      }

      setIsShareDistributionModalOpen(false);
      setIsCohortsModalOpen(true);
    }
  };

  const handleCloseEmailBlastModal = () => {
    setIsEmailBlastModalOpen(false);
  };

  const handleBackToDistributionFromEmailBlast = () => {
    setIsEmailBlastModalOpen(false);
    setIsShareDistributionModalOpen(true);
  };

  const handleSendEmailBlast = async (sendAdminCopy: boolean) => {
    if (!blogId) {
      toast.error("Blog ID is missing.");
      return;
    }

    setIsDistributionSubmitting(true);

    try {
      await blogDistributionService.distributeBlast(blogId, {
        sendAdminCopy,
      });

      toast.success("Email blast sent successfully.");

      setIsEmailBlastModalOpen(false);
      setIsShareDistributionModalOpen(false);
      setIsNewsletterQueueModalOpen(false);
      setIsCohortsModalOpen(false);
      setIsAddedToNewsletterModalOpen(false);

      window.location.assign("/dashboard/admin/blogs");
    } catch (error) {
      toast.error("Failed to send email blast.");
    } finally {
      setIsDistributionSubmitting(false);
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
    if (!blogId) {
      toast.error("Blog ID is missing.");
      return;
    }

    setIsDistributionSubmitting(true);

    try {
      await blogDistributionService.distributeNewsletter(blogId, {
        frequencyType,
      });

      toast.success("Article added to newsletter queue.");

      setLastNewsletterFrequency(frequencyType);
      setIsNewsletterQueueModalOpen(false);
      setIsAddedToNewsletterModalOpen(true);
    } catch (error) {
      toast.error("Failed to add article to newsletter queue.");
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
    if (!blogId || cohortIds.length === 0) {
      toast.error("Please select at least one cohort.");
      return;
    }

    setIsDistributionSubmitting(true);

    try {
      await blogDistributionService.distributeCohorts(blogId, {
        cohortIds,
      });

      toast.success("Cohort distribution completed.");

      setIsCohortsModalOpen(false);
    } catch (error) {
      toast.error("Failed to distribute to selected cohorts.");
    } finally {
      setIsDistributionSubmitting(false);
    }
  };

  const handleCloseAddedToNewsletterModal = () => {
    setIsAddedToNewsletterModalOpen(false);
  };

  const handleGoToNewsletterManager = () => {
    window.location.assign("/dashboard/admin/newsletters/general-newsletter");
  };

  const handlePreview = () => {
    if (
      !title.trim() ||
      !content.trim() ||
      !authorName.trim() ||
      selectedCategoryIds.length === 0
    ) {
      return;
    }

    const selectedCategories = categoryOptions.filter((category) =>
      selectedCategoryIds.includes(category.id),
    );

    setDraftPreview(
      {
        id: blogId,
        title: title.trim(),
        content,
        authorName: authorName.trim(),
        coverImages: [
          ...(coverImageUrl
            ? [{ imageUrl: coverImageUrl, imageType: "hero" as const }]
            : []),
          ...(secondImageUrl
            ? [{ imageUrl: secondImageUrl, imageType: "thumbnail" as const }]
            : []),
          ...articleImages
            .filter(
              (image): image is string =>
                typeof image === "string" && image.trim().length > 0,
            )
            .map((image) => ({
              imageUrl: image,
              imageType: "article_inline" as const,
            })),
        ],
        publishingStatus: "draft",
        scheduledPublishDate:
          scheduleDate && scheduleTime
            ? new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()
            : null,
        isFeatured,
        excerpt,
        readTimeMinutes: Number.parseInt(readTimeLabel, 10) || 0,
        publishedAt: null,
        seo: {
          id: "",
          postId: "",
          metaTitle,
          metaDescription,
          createdAt: "",
          updatedAt: "",
        },
        categories: selectedCategories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: "",
          description: null,
          isActive: true,
          createdAt: "",
          updatedAt: "",
        })),
        tags: tagOptions
          .filter((tag) => selectedTagIds.includes(tag.id))
          .map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: "",
            createdAt: "",
          })),
        createdAt: "",
        updatedAt: "",
      },
      {
        mode: "edit",
        returnPath: `/dashboard/admin/blogs/edit/${blogId}?fromPreview=true`,
      },
    );

    router.push("/dashboard/admin/blogs/preview?source=draft");
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
              onClick={handleSaveChanges}
              disabled={
                isSubmitting || isUploadingCoverImage || isUploadingSecondImage
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                isSubmitting || isUploadingCoverImage || isUploadingSecondImage
              }
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
            >
              {isScheduledPublish ? (
                <>
                  <CalendarDays size={16} />
                  Schedule
                </>
              ) : (
                <>▷ Publish</>
              )}
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
            articleImages={articleImages}
            uploadingArticleImageIndexes={uploadingArticleImageIndexes}
            isUploadingCoverImage={isUploadingCoverImage}
            isUploadingSecondImage={isUploadingSecondImage}
            coverImageError={coverImageError || errors.coverImage}
            secondImageError={secondImageError || errors.secondImage}
            articleImageError={articleImageError}
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
            onSelectArticleImage={handleSelectArticleImage}
            onRemoveCoverImage={handleRemoveCoverImage}
            onRemoveSecondImage={handleRemoveSecondImage}
            onRemoveArticleImage={handleRemoveArticleImage}
            onAddArticleImage={handleAddArticleImage}
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
                onClick={handlePreview}
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

      {isEmailBlastModalOpen ? (
        <EmailBlastModal
          title={liveArticleTitle}
          audienceLabel={distributionOptions?.blastDetails.targetAudience}
          totalRecipients={distributionOptions?.blastDetails.totalRecipients}
          subjectPreview={liveArticleTitle}
          isSubmitting={isDistributionSubmitting}
          onBack={handleBackToDistributionFromEmailBlast}
          onClose={handleCloseEmailBlastModal}
          onSend={handleSendEmailBlast}
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
