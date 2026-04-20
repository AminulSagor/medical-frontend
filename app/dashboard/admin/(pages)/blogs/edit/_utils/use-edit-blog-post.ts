"use client";

import { useEffect, useState } from "react";
import { getAdminBlogLiveById } from "@/service/admin/blogs/blog-live.service";
import { updateBlogPost } from "@/service/admin/blogs/blog-edit.service";
import type { BlogCreatePublishingStatus } from "@/types/admin/blogs/blog-create.types";
import toast from "react-hot-toast";
import { useCreateBlogPost } from "@/app/dashboard/admin/(pages)/blogs/create/_utils/use-create-blog-post";
import { buildScheduledPublishDateFromInputs } from "@/app/dashboard/admin/(pages)/blogs/create/_utils/create-blog-post.helpers";

type EditCreatedBlogModalData = {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
};

export function useEditBlogPost(blogId: string) {
  const create = useCreateBlogPost();
  const [loading, setLoading] = useState(true);
  const [initialPublishingStatus, setInitialPublishingStatus] =
    useState<BlogCreatePublishingStatus | null>(null);
  const [isLiveNowModalOpen, setIsLiveNowModalOpen] = useState(false);
  const [createdBlogModalData, setCreatedBlogModalData] =
    useState<EditCreatedBlogModalData | null>(null);

  const {
    setTitle,
    setContent,
    setAuthorName,
    setExcerpt,
    setMetaTitle,
    setMetaDescription,
    setCoverImageUrl,
    setSelectedCategoryIds,
    setSelectedTagIds,
    setIsFeatured,
    setScheduleDate,
    setScheduleTime,
    setBannerError,
    setIsSubmitting,
    setErrors,
    setArticleImages,
  } = create;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const blog = await getAdminBlogLiveById(blogId);

        setTitle(blog.title || "");
        setContent(blog.content || "");
        setAuthorName(blog.authorName || "");

        setExcerpt(blog.excerpt || "");
        setMetaTitle(blog.seo?.metaTitle || "");
        setMetaDescription(blog.seo?.metaDescription || "");

        setIsFeatured(blog.isFeatured || false);

        setSelectedCategoryIds(blog.categories.map((c) => c.id));
        setSelectedTagIds(blog.tags.map((t) => t.id));

        setInitialPublishingStatus(
          (blog.publishingStatus as BlogCreatePublishingStatus) || "draft",
        );

        const hero = blog.coverImages.find((i) => i.imageType === "hero");
        const thumbnail = blog.coverImages.find(
          (i) => i.imageType === "thumbnail",
        );
        const inlineImages = blog.coverImages
          .filter((i) => i.imageType === "article_inline")
          .map((i) => i.imageUrl);

        setCoverImageUrl(hero?.imageUrl || "");
        setArticleImages([
          ...(thumbnail?.imageUrl ? [thumbnail.imageUrl] : []),
          ...inlineImages,
        ]);

        if (blog.scheduledPublishDate) {
          const d = new Date(blog.scheduledPublishDate);

          setScheduleDate(d.toISOString().split("T")[0]);
          setScheduleTime(d.toTimeString().slice(0, 5));
        } else {
          setScheduleDate("");
          setScheduleTime("");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [
    blogId,
    setTitle,
    setContent,
    setAuthorName,
    setExcerpt,
    setMetaTitle,
    setMetaDescription,
    setCoverImageUrl,
    setSelectedCategoryIds,
    setSelectedTagIds,
    setIsFeatured,
    setScheduleDate,
    setScheduleTime,
    setArticleImages,
  ]);

  const validateForEdit = (status: BlogCreatePublishingStatus) => {
    const nextErrors: {
      title?: string;
      content?: string;
      authorName?: string;
      categories?: string;
      excerpt?: string;
      coverImage?: string;
      secondImage?: string;
      schedule?: string;
      metaTitle?: string;
      metaDescription?: string;
    } = {};

    if (!create.title.trim()) {
      nextErrors.title = "Post title is required";
    }

    if (!create.content.trim()) {
      nextErrors.content = "Post content is required";
    }

    if (!create.authorName.trim()) {
      nextErrors.authorName = "Author name is required";
    }

    if (status === "scheduled") {
      if (!create.scheduleDate) {
        nextErrors.schedule = "Publish date is required";
      } else if (!create.scheduleTime) {
        nextErrors.schedule = "Publish time is required";
      }
    }

    if (status === "published") {
      if (!create.coverImageUrl) {
        nextErrors.coverImage = "Cover image is required";
      }

      if (!create.secondImageUrl) {
        nextErrors.secondImage = "Second image is required";
      }

      if (create.selectedCategoryIds.length === 0) {
        nextErrors.categories = "At least one category must be selected";
      }

      if (!create.excerpt.trim()) {
        nextErrors.excerpt = "Excerpt is required";
      }

      if (!create.metaTitle.trim()) {
        nextErrors.metaTitle = "Meta title is required";
      }

      if (!create.metaDescription.trim()) {
        nextErrors.metaDescription = "Meta description is required";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (status === "published") {
        setBannerError(
          "Cannot publish. Please fill in all required fields first.",
        );
      } else if (status === "scheduled") {
        setBannerError(
          "Cannot schedule. Please complete title, content, author, date, and time.",
        );
      }

      return false;
    }

    setBannerError("");
    return true;
  };

  const handleCloseLiveNowModal = () => {
    setIsLiveNowModalOpen(false);
  };

  const handleDoneAfterPublish = () => {
    setIsLiveNowModalOpen(false);
    setCreatedBlogModalData(null);
  };

  const handleViewLiveArticle = () => {
    if (!createdBlogModalData?.id) return;

    window.location.assign(
      `/dashboard/admin/blogs/live/${createdBlogModalData.id}`,
    );
  };

  const handleShareArticle = () => {
    if (!createdBlogModalData?.id) return;
  };

  const handleUpdate = async (status: BlogCreatePublishingStatus) => {
    if (
      create.isUploadingCoverImage ||
      create.isUploadingSecondImage ||
      create.uploadingArticleImageIndexes.length > 0
    ) {
      setBannerError("Please wait for the image upload to finish.");
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    const hasAnyDraftContent = Boolean(
      create.title.trim() ||
      create.content.trim() ||
      create.authorName.trim() ||
      create.coverImageUrl ||
      create.articleImages.some(Boolean) ||
      create.excerpt.trim() ||
      create.metaTitle.trim() ||
      create.metaDescription.trim() ||
      create.selectedCategoryIds.length > 0 ||
      create.selectedTagIds.length > 0 ||
      create.scheduleDate ||
      create.scheduleTime,
    );

    if (status === "draft" && !hasAnyDraftContent) {
      setBannerError("Add at least one field before saving a draft.");
      return;
    }

    if (status !== "draft" && !validateForEdit(status)) {
      return;
    }

    try {
      setIsSubmitting(true);
      setBannerError("");

      const normalizedArticleImages = create.articleImages.filter(Boolean);

      const payload = {
        title: create.title.trim(),
        content: create.content.trim(),
        authorName: create.authorName.trim(),
        coverImageUrl: [
          ...(create.coverImageUrl
            ? [{ imageUrl: create.coverImageUrl, imageType: "hero" as const }]
            : []),
          ...(normalizedArticleImages[0]
            ? [
                {
                  imageUrl: normalizedArticleImages[0],
                  imageType: "thumbnail" as const,
                },
              ]
            : []),
          ...normalizedArticleImages.slice(1).map((imageUrl) => ({
            imageUrl,
            imageType: "article_inline" as const,
          })),
        ],
        categoryIds: create.selectedCategoryIds,
        tagIds: create.selectedTagIds,
        publishingStatus: status,
        scheduledPublishDate:
          status === "scheduled"
            ? buildScheduledPublishDateFromInputs(
                create.scheduleDate,
                create.scheduleTime,
              )
            : undefined,
        isFeatured: create.isFeatured,
        excerpt: create.excerpt.trim(),
        seoMetaTitle: create.metaTitle.trim(),
        seoMetaDescription: create.metaDescription.trim(),
      };

      await updateBlogPost(blogId, payload);

      const shouldOpenPublishFlow =
        status === "published" &&
        (initialPublishingStatus === "draft" ||
          initialPublishingStatus === "scheduled");

      if (shouldOpenPublishFlow) {
        setInitialPublishingStatus("published");
        const modalCategory =
          create.categoryOptions.find((category) =>
            create.selectedCategoryIds.includes(category.id),
          )?.name || "Uncategorized";

        setCreatedBlogModalData({
          id: blogId,
          title: create.title.trim(),
          author: create.authorName.trim(),
          category: modalCategory,
          readTime: create.readTimeLabel,
        });
        setIsLiveNowModalOpen(true);
        // toast.success("Blog published successfully");
        return;
      }

      toast.success("Blog updated successfully");
    } catch (err) {
      console.error(err);
      setBannerError("Failed to save the post. Please try again.");
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    ...create,
    initialPublishingStatus,
    isLiveNowModalOpen,
    createdBlogModalData,
    handleCloseLiveNowModal,
    handleSubmit: handleUpdate,
    handleViewLiveArticle,
    handleShareArticle,
    handleDoneAfterPublish,
  };
}
