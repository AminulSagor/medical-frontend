"use client";

import { Save, SquareMenu, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createBlogCategories,
  getBlogCategories,
} from "@/service/admin/blogs/blog-category.service";
import { createBlogPost } from "@/service/admin/blogs/blog-create.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import type {
  BlogCategoryOption,
  BlogCreatePublishingStatus,
} from "@/types/admin/blogs/blog-create.types";
import CreateBlogPostEditor from "../helper/create-blog-post-editor";
import CreateBlogPostPreview from "../helper/create-blog-post-preview";
import CreateBlogPostSettingsSidebar from "../helper/create-blog-post-settings-sidebar";
import {
  BLOG_CREATE_AUTHOR_OPTIONS,
  BLOG_CREATE_TAG_OPTIONS,
  BLOG_MANAGEMENT_PATH,
  DEFAULT_BLOG_CREATE_EXCERPT,
  DEFAULT_BLOG_CREATE_META_DESCRIPTION,
  DEFAULT_BLOG_CREATE_META_TITLE,
  DEFAULT_BLOG_CREATE_TITLE,
} from "../_utils/create-blog-post.constants";
import {
  buildBlogPostHtmlContent,
  buildScheduledPublishDateFromInputs,
  countWords,
  estimateReadTime,
  toggleStringSelection,
} from "../_utils/create-blog-post.helpers";

type ValidationErrors = {
  author?: string;
  categories?: string;
  schedule?: string;
};

const BLOG_COVER_UPLOAD_FOLDER = "vendors";

export default function CreateBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState(DEFAULT_BLOG_CREATE_TITLE);
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

  const [selectedAuthorId, setSelectedAuthorId] = useState(
    BLOG_CREATE_AUTHOR_OPTIONS[0]?.id ?? "",
  );
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

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([
    BLOG_CREATE_TAG_OPTIONS[0]?.id ?? "",
    BLOG_CREATE_TAG_OPTIONS[1]?.id ?? "",
  ]);
  const [tagInput, setTagInput] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [bannerError, setBannerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = useMemo(() => {
    return countWords([title, excerpt, metaTitle, metaDescription]);
  }, [title, excerpt, metaTitle, metaDescription]);

  const readTimeLabel = useMemo(() => {
    return estimateReadTime(wordCount);
  }, [wordCount]);

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setCategoryLoadError("");

      const categories = await getBlogCategories();
      setCategoryOptions(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategoryLoadError("Failed to load categories.");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

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

  const handleAddTag = () => {
    const nextValue = tagInput.trim().toLowerCase();

    if (!nextValue) return;

    const found = BLOG_CREATE_TAG_OPTIONS.find(
      (tag) => tag.name.toLowerCase() === nextValue,
    );

    if (!found) {
      setTagInput("");
      return;
    }

    setSelectedTagIds((prev) =>
      prev.includes(found.id) ? prev : [...prev, found.id],
    );
    setTagInput("");
  };

  const handleApplyAuthorSearch = () => {
    const nextValue = authorSearch.trim().toLowerCase();

    if (!nextValue) return;

    const found = BLOG_CREATE_AUTHOR_OPTIONS.find((author) =>
      author.name.toLowerCase().includes(nextValue),
    );

    if (!found) return;

    setSelectedAuthorId(found.id);
    setErrors((prev) => ({ ...prev, author: undefined }));
  };

  const handleClearAuthorSelection = () => {
    setAuthorSearch("");
    setSelectedAuthorId("");
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
      setErrors((prev) => ({
        ...prev,
        categories: undefined,
      }));
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryCreateError("");

      await createBlogCategories({
        categories: [{ name: trimmedName }],
      });

      await loadCategories();

      setNewCategoryName("");
    } catch (error) {
      console.error("Failed to create category:", error);
      setCategoryCreateError("Failed to create category. Please try again.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const validateForPublish = (status: BlogCreatePublishingStatus) => {
    const nextErrors: ValidationErrors = {};

    if (!selectedAuthorId) {
      nextErrors.author = "Author selection is required";
    }

    if (selectedCategoryIds.length === 0) {
      nextErrors.categories = "At least one category must be selected";
    }

    if (status === "scheduled" && (!scheduleDate || !scheduleTime)) {
      nextErrors.schedule = "Publish date and time are required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setBannerError(
        "Unable to publish. Please fulfill all required fields before saving.",
      );
      return false;
    }

    setBannerError("");
    return true;
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
        title,
        content: buildBlogPostHtmlContent({
          title,
          excerpt,
          coverImageUrl,
        }),
        coverImageUrl,
        publishingStatus: status,
        scheduledPublishDate:
          status === "scheduled"
            ? buildScheduledPublishDateFromInputs(scheduleDate, scheduleTime)
            : undefined,
        isFeatured,
        excerpt,
        authorIds: selectedAuthorId ? [selectedAuthorId] : [],
        categoryIds: selectedCategoryIds,
        tagIds: selectedTagIds,
        seoMetaTitle: metaTitle,
        seoMetaDescription: metaDescription,
      };

      await createBlogPost(payload);

      router.push(BLOG_MANAGEMENT_PATH);
      router.refresh();
    } catch (error) {
      console.error("Failed to create blog post:", error);
      setBannerError("Failed to save the post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f2]">
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

            <span className="text-slate-200">|</span>

            <span className="text-sm text-slate-500">Draft saved</span>
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
              <SquareMenu />
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
            excerpt={excerpt}
            coverImageUrl={coverImageUrl}
            isUploadingCoverImage={isUploadingCoverImage}
            coverImageError={coverImageError}
            onTitleChange={setTitle}
            onSelectCoverImage={handleSelectCoverImage}
            onRemoveCoverImage={handleRemoveCoverImage}
          />

          <aside className="min-w-0 xl:w-[320px]">
            <div className="sticky top-6 space-y-4">
              <CreateBlogPostPreview />

              <CreateBlogPostSettingsSidebar
                authorOptions={BLOG_CREATE_AUTHOR_OPTIONS}
                selectedAuthorId={selectedAuthorId}
                authorSearch={authorSearch}
                onAuthorSelect={(value) => {
                  setSelectedAuthorId(value);
                  if (value) {
                    setErrors((prev) => ({ ...prev, author: undefined }));
                  }
                }}
                onAuthorSearchChange={setAuthorSearch}
                onApplyAuthorSearch={handleApplyAuthorSearch}
                onClearAuthorSelection={handleClearAuthorSelection}
                scheduleDate={scheduleDate}
                scheduleTime={scheduleTime}
                onScheduleDateChange={(value) => {
                  setScheduleDate(value);
                  if (value && scheduleTime) {
                    setErrors((prev) => ({ ...prev, schedule: undefined }));
                  }
                }}
                onScheduleTimeChange={(value) => {
                  setScheduleTime(value);
                  if (scheduleDate && value) {
                    setErrors((prev) => ({ ...prev, schedule: undefined }));
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
                    const next = toggleStringSelection(prev, value);

                    if (next.length > 0) {
                      setErrors((current) => ({
                        ...current,
                        categories: undefined,
                      }));
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
                tagOptions={BLOG_CREATE_TAG_OPTIONS}
                selectedTagIds={selectedTagIds}
                tagInput={tagInput}
                onTagInputChange={setTagInput}
                onAddTag={handleAddTag}
                onRemoveTag={(value) => {
                  setSelectedTagIds((prev) =>
                    prev.filter((item) => item !== value),
                  );
                }}
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
    </div>
  );
}
