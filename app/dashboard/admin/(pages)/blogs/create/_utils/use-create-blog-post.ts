"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createBlogCategories,
  getBlogCategories,
} from "@/service/admin/blogs/blog-category.service";
import { createBlogPost } from "@/service/admin/blogs/blog-create.service";
import {
  createBlogTags,
  getBlogTags,
} from "@/service/admin/blogs/blog-tag.service";
import { getAdminUsers } from "@/service/admin/users/admin-user.service";
import { useBlogPreviewStore } from "@/store/blog-preview.store";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import type {
  BlogAuthorOption,
  BlogCategoryOption,
  BlogCreatePublishingStatus,
  BlogTagOption,
} from "@/types/admin/blogs/blog-create.types";
import { BLOG_MANAGEMENT_PATH } from "./create-blog-post.constants";
import {
  buildScheduledPublishDateFromInputs,
  countWords,
  estimateReadTime,
} from "./create-blog-post.helpers";
import {
  DEFAULT_BLOG_CREATE_EXCERPT,
  DEFAULT_BLOG_CREATE_META_DESCRIPTION,
  DEFAULT_BLOG_CREATE_META_TITLE,
} from "./create-blog-post.constants";

type ValidationErrors = {
  title?: string;
  content?: string;
  author?: string;
  categories?: string;
  schedule?: string;
};

type CreatedBlogModalData = {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
};

type DraftSavedModalData = {
  title: string;
};

type ScheduledBlogModalData = {
  title: string;
  publishDate: string;
  publishTime: string;
};

type CreatedBlogPostResponse = {
  id?: string;
  title?: string;
  readTimeMinutes?: number;
  authors?: Array<{
    id: string;
    fullLegalName?: string;
    name?: string;
  }>;
  categories?: Array<{
    id: string;
    name: string;
  }>;
};

const BLOG_COVER_UPLOAD_FOLDER = "vendors";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildBlogContentHtml(content: string) {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return "";
  }

  return trimmedContent
    .split(/\n\s*\n/)
    .map((block) => {
      const safeBlock = escapeHtml(block.trim()).replace(/\n/g, "<br />");
      return `<p>${safeBlock}</p>`;
    })
    .join("");
}

function buildLocalDateInputValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildLocalTimeInputValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function useCreateBlogPost() {
  const router = useRouter();
  const previewBlog = useBlogPreviewStore((state) => state.previewBlog);
  const clearPreview = useBlogPreviewStore((state) => state.clearPreview);

  const didHydrateFromPreviewRef = useRef(false);
  const isInitialMountRef = useRef(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState(DEFAULT_BLOG_CREATE_EXCERPT);
  const [metaTitle, setMetaTitle] = useState(DEFAULT_BLOG_CREATE_META_TITLE);
  const [metaDescription, setMetaDescription] = useState(
    DEFAULT_BLOG_CREATE_META_DESCRIPTION,
  );

  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const [coverImageError, setCoverImageError] = useState("");

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [authorOptions, setAuthorOptions] = useState<BlogAuthorOption[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");

  const [categoryOptions, setCategoryOptions] = useState<BlogCategoryOption[]>(
    [],
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryLoadError, setCategoryLoadError] = useState("");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryCreateError, setCategoryCreateError] = useState("");

  const [tagOptions, setTagOptions] = useState<BlogTagOption[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [tagLoadError, setTagLoadError] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [createTagError, setCreateTagError] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [bannerError, setBannerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLiveNowModalOpen, setIsLiveNowModalOpen] = useState(false);
  const [createdBlogModalData, setCreatedBlogModalData] =
    useState<CreatedBlogModalData | null>(null);

  const [isDraftSavedModalOpen, setIsDraftSavedModalOpen] = useState(false);
  const [createdDraftModalData, setCreatedDraftModalData] =
    useState<DraftSavedModalData | null>(null);

  const [isPublishScheduledModalOpen, setIsPublishScheduledModalOpen] =
    useState(false);
  const [scheduledBlogModalData, setScheduledBlogModalData] =
    useState<ScheduledBlogModalData | null>(null);

  const wordCount = useMemo(() => {
    return countWords([title, content, excerpt, metaTitle, metaDescription]);
  }, [title, content, excerpt, metaTitle, metaDescription]);

  const readTimeLabel = useMemo(() => {
    return estimateReadTime(wordCount);
  }, [wordCount]);

  // Reset all form fields to default values
  const resetFormState = () => {
    setTitle("");
    setContent("");
    setExcerpt(DEFAULT_BLOG_CREATE_EXCERPT);
    setMetaTitle(DEFAULT_BLOG_CREATE_META_TITLE);
    setMetaDescription(DEFAULT_BLOG_CREATE_META_DESCRIPTION);
    setCoverImageUrl("");
    setCoverImageError("");
    setScheduleDate("");
    setScheduleTime("");
    setAuthorSearch("");
    setSelectedCategoryIds([]);
    setNewCategoryName("");
    setSelectedTagIds([]);
    setTagInput("");
    setIsFeatured(false);
    setErrors({});
    setBannerError("");
    setCreateTagError("");
    setCategoryCreateError("");

    // Reset author to first available if exists, otherwise empty
    if (authorOptions.length > 0) {
      setSelectedAuthorId(authorOptions[0]?.id ?? "");
    } else {
      setSelectedAuthorId("");
    }

    // Clear preview store
    clearPreview();

    // Reset the hydration flag
    didHydrateFromPreviewRef.current = false;
  };

  const clearTitleError = () => {
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const clearContentError = () => {
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const clearAuthorError = () => {
    setErrors((prev) => ({ ...prev, author: undefined }));
  };

  const clearScheduleError = () => {
    setErrors((prev) => ({ ...prev, schedule: undefined }));
  };

  const clearCategoryError = () => {
    setErrors((prev) => ({ ...prev, categories: undefined }));
  };

  const clearCreateTagError = () => {
    if (createTagError) {
      setCreateTagError("");
    }
  };

  const loadAuthors = async (): Promise<BlogAuthorOption[]> => {
    try {
      const response = await getAdminUsers();

      const mappedAuthors: BlogAuthorOption[] = response.data
        .filter((user) => user.status === "active" && user.type === "faculty")
        .map((user) => ({
          id: user.id,
          name: user.name,
        }));

      setAuthorOptions(mappedAuthors);

      setSelectedAuthorId((currentSelectedAuthorId) => {
        if (
          currentSelectedAuthorId &&
          mappedAuthors.some((author) => author.id === currentSelectedAuthorId)
        ) {
          return currentSelectedAuthorId;
        }

        return mappedAuthors[0]?.id ?? "";
      });

      return mappedAuthors;
    } catch (error) {
      console.error("Failed to load authors:", error);
      return [];
    }
  };

  const loadCategories = async (): Promise<BlogCategoryOption[]> => {
    try {
      setIsLoadingCategories(true);
      setCategoryLoadError("");

      const categories = await getBlogCategories();
      setCategoryOptions(categories);

      return categories;
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategoryLoadError("Failed to load categories.");
      return [];
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadTags = async (): Promise<BlogTagOption[]> => {
    try {
      setIsLoadingTags(true);
      setTagLoadError("");

      const tags = await getBlogTags();

      const mappedTags: BlogTagOption[] = tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));

      setTagOptions(mappedTags);

      return mappedTags;
    } catch (error) {
      console.error("Failed to load tags:", error);
      setTagLoadError("Failed to load tags.");
      return [];
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    void loadAuthors();
    void loadCategories();
    void loadTags();
  }, []);

  // Reset form on mount (for new post creation)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Only reset if there's no preview data
      if (!previewBlog) {
        resetFormState();
      }
    }
  }, []);

  useEffect(() => {
    if (!previewBlog || didHydrateFromPreviewRef.current) {
      return;
    }

    didHydrateFromPreviewRef.current = true;

    setTitle(previewBlog.title || "");
    setContent(previewBlog.content || "");
    setExcerpt(previewBlog.excerpt || "");
    setCoverImageUrl(previewBlog.coverImageUrl || "");
    setIsFeatured(Boolean(previewBlog.isFeatured));

    setMetaTitle(previewBlog.seo?.metaTitle || DEFAULT_BLOG_CREATE_META_TITLE);
    setMetaDescription(
      previewBlog.seo?.metaDescription || DEFAULT_BLOG_CREATE_META_DESCRIPTION,
    );

    setSelectedAuthorId(previewBlog.authors?.[0]?.id || "");
    setSelectedCategoryIds(
      previewBlog.categories?.map((category) => category.id) || [],
    );
    setSelectedTagIds(previewBlog.tags?.map((tag) => tag.id) || []);

    setScheduleDate(
      buildLocalDateInputValue(previewBlog.scheduledPublishDate || null),
    );
    setScheduleTime(
      buildLocalTimeInputValue(previewBlog.scheduledPublishDate || null),
    );
  }, [previewBlog]);

  const handleSelectCoverImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setCoverImageError("Please select a valid image file.");
      return;
    }

    try {
      setIsUploadingCoverImage(true);
      setCoverImageError("");

      const uploadMeta = await getUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder: BLOG_COVER_UPLOAD_FOLDER,
      });

      await uploadFileToSignedUrl(uploadMeta.signedUrl, file);

      setCoverImageUrl(uploadMeta.readUrl);
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      setCoverImageError("Failed to upload cover image. Please try again.");
    } finally {
      setIsUploadingCoverImage(false);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImageUrl("");
    setCoverImageError("");
  };

  const handleAddTag = async () => {
    const trimmedName = tagInput.trim();

    if (!trimmedName) return;

    const existingTag = tagOptions.find(
      (tag) => tag.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingTag) {
      setSelectedTagIds((prev) =>
        prev.includes(existingTag.id) ? prev : [...prev, existingTag.id],
      );
      setTagInput("");
      setCreateTagError("");
      return;
    }

    try {
      setIsCreatingTag(true);
      setCreateTagError("");

      await createBlogTags({
        tags: [{ name: trimmedName }],
      });

      const refreshedTags = await loadTags();

      const createdTag = refreshedTags.find(
        (tag) => tag.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      );

      if (createdTag) {
        setSelectedTagIds((prev) =>
          prev.includes(createdTag.id) ? prev : [...prev, createdTag.id],
        );
      }

      setTagInput("");
    } catch (error) {
      console.error("Failed to create tag:", error);
      setCreateTagError("Failed to create tag. Please try again.");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleApplyAuthorSearch = () => {
    const nextValue = authorSearch.trim().toLowerCase();

    if (!nextValue) {
      setErrors((prev) => ({
        ...prev,
        author: "Author not found.",
      }));
      return;
    }

    const found = authorOptions.find((author) =>
      author.name.toLowerCase().includes(nextValue),
    );

    if (!found) {
      setErrors((prev) => ({
        ...prev,
        author: "Author not found.",
      }));
      return;
    }

    setSelectedAuthorId(found.id);
    clearAuthorError();
  };

  const handleClearAuthorSelection = () => {
    setAuthorSearch("");
    setSelectedAuthorId("");
    clearAuthorError();
  };

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryCreateError("Category name is required.");
      return;
    }

    const existingCategory = categoryOptions.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existingCategory) {
      setSelectedCategoryIds((prev) =>
        prev.includes(existingCategory.id)
          ? prev
          : [...prev, existingCategory.id],
      );
      setNewCategoryName("");
      setCategoryCreateError("");
      clearCategoryError();
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryCreateError("");

      await createBlogCategories({
        categories: [{ name: trimmedName }],
      });

      const refreshedCategories = await loadCategories();

      const createdCategory = refreshedCategories.find(
        (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      );

      if (createdCategory) {
        setSelectedCategoryIds((prev) =>
          prev.includes(createdCategory.id)
            ? prev
            : [...prev, createdCategory.id],
        );
      }

      setNewCategoryName("");
      clearCategoryError();
    } catch (error) {
      console.error("Failed to create category:", error);
      setCategoryCreateError("Failed to create category. Please try again.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const validateForPublish = (status: BlogCreatePublishingStatus) => {
    const nextErrors: ValidationErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Post title is required";
    }

    if (!content.trim()) {
      nextErrors.content = "Post content is required";
    }

    if (!selectedAuthorId) {
      nextErrors.author = "Author selection is required";
    }

    if (selectedCategoryIds.length === 0) {
      nextErrors.categories = "At least one category must be selected";
    }

    if (status === "scheduled") {
      if (!scheduleDate) {
        nextErrors.schedule = "Publish date is required";
      } else if (!scheduleTime) {
        nextErrors.schedule = "Publish time is required";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (status === "published") {
        setBannerError(
          "Cannot publish. Please fill in all required fields including publish date and time.",
        );
      } else if (status === "scheduled") {
        setBannerError(
          "Cannot schedule. Please fill in all required fields including publish date and time.",
        );
      } else {
        setBannerError(
          "Cannot save draft. Please fill in all required fields.",
        );
      }
      return false;
    }

    setBannerError("");
    return true;
  };

  const handleViewLiveArticle = () => {
    if (!createdBlogModalData?.id) return;

    router.push(`/dashboard/admin/blogs/live/${createdBlogModalData.id}`);
  };

  const handleShareArticle = () => {
    if (!createdBlogModalData?.id) return;
  };

  const handleDoneAfterPublish = () => {
    setIsLiveNowModalOpen(false);
    setCreatedBlogModalData(null);
    resetFormState();
    router.push(BLOG_MANAGEMENT_PATH);
    router.refresh();
  };

  const handleCloseDraftSavedModal = () => {
    setIsDraftSavedModalOpen(false);
  };

  const handleContinueEditingDraft = () => {
    setIsDraftSavedModalOpen(false);
  };

  const handleReturnToBlogManagement = () => {
    setIsDraftSavedModalOpen(false);
    setCreatedDraftModalData(null);
    resetFormState();
    router.push(BLOG_MANAGEMENT_PATH);
    router.refresh();
  };

  const handleClosePublishScheduledModal = () => {
    setIsPublishScheduledModalOpen(false);
  };

  const handleViewScheduledArticles = () => {
    setIsPublishScheduledModalOpen(false);
    resetFormState();
    clearPreview();
    router.push(BLOG_MANAGEMENT_PATH);
    router.refresh();
  };

  const handleReturnDashboardAfterSchedule = () => {
    setIsPublishScheduledModalOpen(false);
    resetFormState();
    clearPreview();
    router.push(BLOG_MANAGEMENT_PATH);
    router.refresh();
  };

  const handleSubmit = async (status: BlogCreatePublishingStatus) => {
    if (isUploadingCoverImage) {
      setBannerError("Please wait for the cover image upload to finish.");
      return;
    }

    if (status !== "draft" && !validateForPublish(status)) {
      return;
    }

    try {
      setIsSubmitting(true);
      setBannerError("");

      const payload = {
        title: title.trim(),
        content: buildBlogContentHtml(content),
        coverImageUrl,
        publishingStatus: status,
        scheduledPublishDate:
          status === "scheduled"
            ? buildScheduledPublishDateFromInputs(scheduleDate, scheduleTime)
            : new Date().toISOString(),
        isFeatured,
        excerpt,
        authorIds: selectedAuthorId ? [selectedAuthorId] : [],
        categoryIds: selectedCategoryIds,
        tagIds: selectedTagIds,
        seoMetaTitle: metaTitle,
        seoMetaDescription: metaDescription,
      };

      const createdPost = (await createBlogPost(
        payload,
      )) as CreatedBlogPostResponse;

      if (status === "draft") {
        setCreatedDraftModalData({
          title: createdPost?.title?.trim() || title.trim() || "Untitled Draft",
        });
        setIsDraftSavedModalOpen(true);
        return;
      }

      if (status === "scheduled") {
        setScheduledBlogModalData({
          title:
            createdPost?.title?.trim() || title.trim() || "Untitled Article",
          publishDate: scheduleDate,
          publishTime: scheduleTime,
        });
        setIsPublishScheduledModalOpen(true);
        return;
      }

      const modalAuthor =
        createdPost?.authors?.[0]?.fullLegalName ||
        createdPost?.authors?.[0]?.name ||
        authorOptions.find((author) => author.id === selectedAuthorId)?.name ||
        "Unknown Author";

      const modalCategory =
        createdPost?.categories?.[0]?.name ||
        categoryOptions.find((category) =>
          selectedCategoryIds.includes(category.id),
        )?.name ||
        "Uncategorized";

      const modalReadTime = `${createdPost?.readTimeMinutes ?? 0} min`;

      setCreatedBlogModalData({
        id: createdPost?.id ?? "",
        title: createdPost?.title ?? title.trim(),
        author: modalAuthor,
        category: modalCategory,
        readTime: modalReadTime,
      });

      setIsLiveNowModalOpen(true);
    } catch (error: any) {
      console.error(
        "Failed to create blog post:",
        error?.response?.data || error,
      );
      setBannerError("Failed to save the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
    resetFormState,
  };
}
