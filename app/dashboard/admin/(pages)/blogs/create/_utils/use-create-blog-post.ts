"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createBlogCategories,
  getBlogCategories,
} from "@/service/admin/blogs/blog-category.service";
import { createBlogPost } from "@/service/admin/blogs/blog-create.service";
import {
  createBlogTags,
  getBlogTags,
} from "@/service/admin/blogs/blog-tag.service";
import { useBlogPreviewStore } from "@/store/blog-preview.store";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import type {
  BlogCategoryOption,
  BlogCreatePublishingStatus,
  BlogTagOption,
  CreateBlogPostResponse,
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
  authorName?: string;
  categories?: string;
  excerpt?: string;
  coverImage?: string;
  secondImage?: string;
  schedule?: string;
  metaTitle?: string;
  metaDescription?: string;
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

const BLOG_COVER_UPLOAD_FOLDER = "vendors";

function buildBlogContentHtml(content: string) {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return "";
  }

  return trimmedContent;
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

function extractImageUrlByType(
  images:
    | Array<{
        imageUrl: string;
        imageType: string;
      }>
    | undefined,
  type: string,
) {
  return images?.find((item) => item.imageType === type)?.imageUrl || "";
}

export function useCreateBlogPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPreview = searchParams.get("fromPreview") === "true";
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
  const [secondImageUrl, setSecondImageUrl] = useState("");

  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const [isUploadingSecondImage, setIsUploadingSecondImage] = useState(false);

  const [coverImageError, setCoverImageError] = useState("");
  const [secondImageError, setSecondImageError] = useState("");

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [authorName, setAuthorName] = useState("");

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

  const readTimeMinutes = useMemo(() => {
    const parsed = Number.parseInt(readTimeLabel, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [readTimeLabel]);

  const isPublishReady = useMemo(() => {
    return Boolean(
      title.trim() &&
      content.trim() &&
      authorName.trim() &&
      coverImageUrl &&
      secondImageUrl &&
      excerpt.trim() &&
      metaTitle.trim() &&
      metaDescription.trim() &&
      selectedCategoryIds.length > 0,
    );
  }, [
    title,
    content,
    authorName,
    coverImageUrl,
    secondImageUrl,
    excerpt,
    metaTitle,
    metaDescription,
    selectedCategoryIds,
  ]);

  const resetFormState = () => {
    setTitle("");
    setContent("");
    setExcerpt(DEFAULT_BLOG_CREATE_EXCERPT);
    setMetaTitle(DEFAULT_BLOG_CREATE_META_TITLE);
    setMetaDescription(DEFAULT_BLOG_CREATE_META_DESCRIPTION);

    setCoverImageUrl("");
    setSecondImageUrl("");
    setCoverImageError("");
    setSecondImageError("");

    setScheduleDate("");
    setScheduleTime("");

    setAuthorName("");

    setSelectedCategoryIds([]);
    setNewCategoryName("");
    setSelectedTagIds([]);
    setTagInput("");

    setIsFeatured(false);
    setErrors({});
    setBannerError("");
    setCreateTagError("");
    setCategoryCreateError("");

    clearPreview();
    didHydrateFromPreviewRef.current = false;
  };

  const clearTitleError = () => {
    setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const clearContentError = () => {
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const clearAuthorError = () => {
    setErrors((prev) => ({ ...prev, authorName: undefined }));
  };

  const clearScheduleError = () => {
    setErrors((prev) => ({ ...prev, schedule: undefined }));
  };

  const clearCategoryError = () => {
    setErrors((prev) => ({ ...prev, categories: undefined }));
  };

  const clearExcerptError = () => {
    setErrors((prev) => ({ ...prev, excerpt: undefined }));
  };

  const clearCoverImageError = () => {
    setErrors((prev) => ({ ...prev, coverImage: undefined }));
  };

  const clearSecondImageError = () => {
    setErrors((prev) => ({ ...prev, secondImage: undefined }));
  };

  const clearMetaTitleError = () => {
    setErrors((prev) => ({ ...prev, metaTitle: undefined }));
  };

  const clearMetaDescriptionError = () => {
    setErrors((prev) => ({ ...prev, metaDescription: undefined }));
  };

  const clearCreateTagError = () => {
    if (createTagError) {
      setCreateTagError("");
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
      toast.error("Failed to load categories.");
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
      toast.error("Failed to load tags.");
      return [];
    } finally {
      setIsLoadingTags(false);
    }
  };

  useEffect(() => {
    void loadCategories();
    void loadTags();
  }, []);

  useEffect(() => {
    if (!isInitialMountRef.current) {
      return;
    }

    isInitialMountRef.current = false;

    if (fromPreview) {
      return;
    }

    resetFormState();
  }, [fromPreview]);

  useEffect(() => {
    if (!previewBlog || didHydrateFromPreviewRef.current) {
      return;
    }

    didHydrateFromPreviewRef.current = true;

    setTitle(previewBlog.title || "");
    setContent(previewBlog.content || "");
    setExcerpt(previewBlog.excerpt || "");
    setIsFeatured(Boolean(previewBlog.isFeatured));

    setMetaTitle(previewBlog.seo?.metaTitle || DEFAULT_BLOG_CREATE_META_TITLE);
    setMetaDescription(
      previewBlog.seo?.metaDescription || DEFAULT_BLOG_CREATE_META_DESCRIPTION,
    );

    setAuthorName(previewBlog.authorName || "");
    setSelectedCategoryIds(
      previewBlog.categories?.map((category) => category.id) || [],
    );
    setSelectedTagIds(previewBlog.tags?.map((tag) => tag.id) || []);

    setCoverImageUrl(extractImageUrlByType(previewBlog.coverImages, "hero"));
    setSecondImageUrl(
      extractImageUrlByType(previewBlog.coverImages, "thumbnail"),
    );

    setScheduleDate(
      buildLocalDateInputValue(previewBlog.scheduledPublishDate || null),
    );
    setScheduleTime(
      buildLocalTimeInputValue(previewBlog.scheduledPublishDate || null),
    );
  }, [previewBlog]);

  const uploadImage = async (
    file: File,
    type: "hero" | "thumbnail",
  ): Promise<void> => {
    if (!file.type.startsWith("image/")) {
      const message = "Please select a valid image file.";

      if (type === "hero") {
        setCoverImageError(message);
      } else {
        setSecondImageError(message);
      }

      toast.error(message);
      return;
    }

    try {
      if (type === "hero") {
        setIsUploadingCoverImage(true);
        setCoverImageError("");
      } else {
        setIsUploadingSecondImage(true);
        setSecondImageError("");
      }

      const uploadMeta = await getUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder: BLOG_COVER_UPLOAD_FOLDER,
      });

      await uploadFileToSignedUrl(uploadMeta.signedUrl, file);

      if (type === "hero") {
        setCoverImageUrl(uploadMeta.readUrl);
        clearCoverImageError();
        toast.success("Cover image uploaded.");
      } else {
        setSecondImageUrl(uploadMeta.readUrl);
        clearSecondImageError();
        toast.success("Article image uploaded.");
      }
    } catch (error) {
      console.error("Failed to upload image:", error);

      if (type === "hero") {
        setCoverImageError("Failed to upload cover image. Please try again.");
        toast.error("Failed to upload cover image.");
      } else {
        setSecondImageError("Failed to upload image. Please try again.");
        toast.error("Failed to upload article image.");
      }
    } finally {
      if (type === "hero") {
        setIsUploadingCoverImage(false);
      } else {
        setIsUploadingSecondImage(false);
      }
    }
  };

  const handleSelectCoverImage = async (file: File) => {
    await uploadImage(file, "hero");
  };

  const handleSelectSecondImage = async (file: File) => {
    await uploadImage(file, "thumbnail");
  };

  const handleRemoveCoverImage = () => {
    setCoverImageUrl("");
    setCoverImageError("");
    clearCoverImageError();
    toast.success("Cover image removed.");
  };

  const handleRemoveSecondImage = () => {
    setSecondImageUrl("");
    setSecondImageError("");
    clearSecondImageError();
    toast.success("Article image removed.");
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
      toast.success("Tag selected.");
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
      toast.success("Tag created successfully.");
    } catch (error) {
      console.error("Failed to create tag:", error);
      setCreateTagError("Failed to create tag. Please try again.");
      toast.error("Failed to create tag.");
    } finally {
      setIsCreatingTag(false);
    }
  };

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryCreateError("Category name is required.");
      toast.error("Category name is required.");
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
      toast.success("Category selected.");
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
      toast.success("Category created successfully.");
    } catch (error) {
      console.error("Failed to create category:", error);
      setCategoryCreateError("Failed to create category. Please try again.");
      toast.error("Failed to create category.");
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

    if (!authorName.trim()) {
      nextErrors.authorName = "Author name is required";
    }

    if (status === "scheduled") {
      if (!scheduleDate) {
        nextErrors.schedule = "Publish date is required";
      } else if (!scheduleTime) {
        nextErrors.schedule = "Publish time is required";
      }
    }

    if (status === "published") {
      if (!coverImageUrl) {
        nextErrors.coverImage = "Cover image is required";
      }

      // if (!secondImageUrl) {
      //   nextErrors.secondImage = "Second image is required";
      // }

      if (selectedCategoryIds.length === 0) {
        nextErrors.categories = "At least one category must be selected";
      }

      if (!excerpt.trim()) {
        nextErrors.excerpt = "Excerpt is required";
      }

      // if (!metaTitle.trim()) {
      //   nextErrors.metaTitle = "Meta title is required";
      // }

      // if (!metaDescription.trim()) {
      //   nextErrors.metaDescription = "Meta description is required";
      // }
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
    if (isUploadingCoverImage || isUploadingSecondImage) {
      setBannerError("Please wait for the image upload to finish.");
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    const hasAnyDraftContent = Boolean(
      title.trim() ||
      content.trim() ||
      authorName.trim() ||
      coverImageUrl ||
      secondImageUrl ||
      excerpt.trim() ||
      metaTitle.trim() ||
      metaDescription.trim() ||
      selectedCategoryIds.length > 0 ||
      selectedTagIds.length > 0 ||
      scheduleDate ||
      scheduleTime,
    );

    if (status === "draft" && !hasAnyDraftContent) {
      setBannerError("Add at least one field before saving a draft.");
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
        authorName: authorName.trim(),
        coverImageUrl: [
          ...(coverImageUrl
            ? [{ imageUrl: coverImageUrl, imageType: "hero" as const }]
            : []),
          ...(secondImageUrl
            ? [{ imageUrl: secondImageUrl, imageType: "thumbnail" as const }]
            : []),
        ],
        categoryIds: selectedCategoryIds,
        tagIds: selectedTagIds,
        publishingStatus: status,
        scheduledPublishDate:
          status === "scheduled"
            ? buildScheduledPublishDateFromInputs(scheduleDate, scheduleTime)
            : undefined,
        isFeatured,
        excerpt: excerpt.trim(),
        readTimeMinutes,
        seoMetaTitle: metaTitle.trim(),
        seoMetaDescription: metaDescription.trim(),
      };

      const createdPost = (await createBlogPost(
        payload,
      )) as CreateBlogPostResponse;

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

      const modalCategory =
        createdPost?.categories?.[0]?.name ||
        categoryOptions.find((category) =>
          selectedCategoryIds.includes(category.id),
        )?.name ||
        "Uncategorized";

      const modalReadTime = `${
        createdPost?.readTimeMinutes ?? readTimeMinutes
      } min`;

      setCreatedBlogModalData({
        id: createdPost?.id ?? "",
        title: createdPost?.title ?? title.trim(),
        author: createdPost?.authorName || authorName.trim(),
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
      toast.error("Failed to save the post.");
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

    authorName,
    setAuthorName,

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
    bannerError,
    isSubmitting,
    isPublishReady,

    wordCount,
    readTimeLabel,
    readTimeMinutes,

    isLiveNowModalOpen,
    createdBlogModalData,
    isDraftSavedModalOpen,
    createdDraftModalData,
    isPublishScheduledModalOpen,
    scheduledBlogModalData,

    handleSelectCoverImage,
    handleSelectSecondImage,
    handleRemoveCoverImage,
    handleRemoveSecondImage,

    handleAddTag,
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
    clearExcerptError,
    clearCoverImageError,
    clearSecondImageError,
    clearMetaTitleError,
    clearMetaDescriptionError,
    clearCreateTagError,

    resetFormState,
  };
}
