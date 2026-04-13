"use client";

import { useEffect, useState } from "react";
import { getAdminBlogLiveById } from "@/service/admin/blogs/blog-live.service";
import { getBlogCategories } from "@/service/admin/blogs/blog-category.service";
import { getBlogTags } from "@/service/admin/blogs/blog-tag.service";
import { getAdminUsers } from "@/service/admin/users/admin-user.service";
import type {
  BlogAuthorOption,
  BlogCategoryOption,
  BlogCreatePublishingStatus,
} from "@/types/admin/blogs/blog-create.types";
import type { BlogTagItem } from "@/types/admin/blogs/blog-tag.types";
import {
  updateBlogRelations,
  updateBlogSeoAndExcerpt,
  updateBlogStatus,
} from "./edit-blog-post.service";
import type { BlogLivePost } from "@/types/admin/blogs/blog-live.types";

export function useEditBlogPost(blogId: string) {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [blog, setBlog] = useState<BlogLivePost | null>(null);

  const [authorOptions, setAuthorOptions] = useState<BlogAuthorOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<BlogCategoryOption[]>(
    [],
  );
  const [tagOptions, setTagOptions] = useState<BlogTagItem[]>([]);

  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [publishingStatus, setPublishingStatus] =
    useState<BlogCreatePublishingStatus>("draft");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [blogData, usersResponse, categoriesData, tagsData] =
          await Promise.all([
            getAdminBlogLiveById(blogId),
            getAdminUsers(),
            getBlogCategories(),
            getBlogTags(),
          ]);

        if (!isMounted) return;

        const mappedAuthors: BlogAuthorOption[] = usersResponse.data
          .filter(
            (user) =>
              (user.status === "active" && user.type === "faculty") ||
              user.type === "student",
          )
          .map((user) => ({
            id: user.id,
            name: user.name,
          }));

        setBlog(blogData);
        setAuthorOptions(mappedAuthors);
        setCategoryOptions(categoriesData);
        setTagOptions(tagsData);

        setExcerpt(blogData.excerpt || "");
        setMetaTitle(blogData.seo?.metaTitle || "");
        setMetaDescription(blogData.seo?.metaDescription || "");

        setAuthorIds(blogData.authors.map((a) => a.id));
        setCategoryIds(blogData.categories.map((c) => c.id));
        setTagIds(blogData.tags.map((t) => t.id));
        setPublishingStatus(
          (blogData.publishingStatus?.toLowerCase() as BlogCreatePublishingStatus) ||
            "draft",
        );
      } catch (err) {
        console.error("Failed to load blog details:", err);
        if (isMounted) {
          setError("Failed to load blog details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const handleAuthorChange = (authorId: string) => {
    setAuthorIds(authorId ? [authorId] : []);
  };

  const handleToggleCategory = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleToggleTag = (tagId: string) => {
    setTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccessMessage("");

      await updateBlogSeoAndExcerpt(blogId, {
        excerpt,
        seoMetaTitle: metaTitle,
        seoMetaDescription: metaDescription,
      });

      await updateBlogRelations(blogId, {
        authorIds,
        categoryIds,
        tagIds,
      });

      await updateBlogStatus(blogId, {
        publishingStatus,
      });

      setBlog((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          excerpt,
          publishingStatus,
          authors: authorOptions
            .filter((item) => authorIds.includes(item.id))
            .map((item) => ({
              id: item.id,
              fullLegalName: item.name,
              medicalEmail: "",
              professionalRole: "",
            })),
          categories: categoryOptions
            .filter((item) => categoryIds.includes(item.id))
            .map((item) => ({
              id: item.id,
              name: item.name,
              slug: "",
              description: null,
              isActive: true,
              createdAt: "",
              updatedAt: "",
            })),
          tags: tagOptions
            .filter((item) => tagIds.includes(item.id))
            .map((item) => ({
              id: item.id,
              name: item.name,
              slug: "",
              createdAt: "",
            })),
          seo: prev.seo
            ? {
                ...prev.seo,
                metaTitle,
                metaDescription,
              }
            : {
                id: "",
                postId: prev.id,
                metaTitle,
                metaDescription,
                createdAt: "",
                updatedAt: "",
              },
        };
      });

      setSuccessMessage("Blog updated successfully.");
    } catch (err) {
      console.error("Failed to update blog:", err);
      setError("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    loading,
    isSaving,
    error,
    successMessage,
    blog,

    authorOptions,
    categoryOptions,
    tagOptions,

    excerpt,
    setExcerpt,

    metaTitle,
    setMetaTitle,

    metaDescription,
    setMetaDescription,

    authorIds,
    categoryIds,
    tagIds,
    publishingStatus,
    setPublishingStatus,

    handleAuthorChange,
    handleToggleCategory,
    handleToggleTag,
    handleSave,
  };
}
