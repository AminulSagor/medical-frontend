"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { createBlog, getBlogById, updateBlog } from "@/service/admin/blogs/admin-blog.service";
import type { BlogPostResponse, CreateBlogRequest } from "@/types/blogs/admin-blog.types";
import { axiosErrorMessage } from "@/utils/errors/axiosErrorMessage";
import { decodeJwtPayload } from "@/utils/jwt/decodeJwtPayload";
import { getToken } from "@/utils/token/cookie_utils";

import type { BlogCreateInput } from "../_lib/blog-create-schema";
import { BlogCreateSchema } from "../_lib/blog-create-schema";

import PostEditor from "./editor/post-editor";
import DraftSavedModal from "./modals/draft-saved-modal";
import PublishScheduledModal from "./modals/publish-scheduled-modal";
import DiscardUnsavedModal from "./modals/discard-unsaved-modal";
import LiveNowModal from "./modals/live-now-modal";
import ShareModal from "./modals/share-modal";
import AddedToNewsletterModal from "./added-to-newsletter-modal";
import PreviewArticleModal from "./modals/preview-article-modal";
import PostSettingsPanel from "./settings/post-settings-panel";

function buildBlogCreatePayload(values: BlogCreateInput): CreateBlogRequest {
  const cover = values.coverImageUrl?.trim();
  return {
    title: values.title,
    content: values.content,
    coverImageUrl: cover && cover.length > 0 ? cover : null,
    publishingStatus: values.publishingStatus,
    scheduledPublishDate:
      values.publishingStatus === "scheduled" ? (values.scheduledPublishDate ?? null) : null,
    isFeatured: values.isFeatured,
    excerpt: values.excerpt,
    authorIds: values.authorIds,
    categoryIds: values.categoryIds,
    tagIds: values.tagIds,
    seoMetaTitle: values.seoMetaTitle,
    seoMetaDescription: values.seoMetaDescription,
  };
}

type BlogCreateClientProps = {
  mode?: "create" | "edit";
  blogId?: string;
};

export default function BlogCreateClient({ mode = "create", blogId }: BlogCreateClientProps) {
  const router = useRouter();
  const [sessionAuthorId, setSessionAuthorId] = useState<string | null>(null);

  const form = useForm<BlogCreateInput>({
    resolver: zodResolver(BlogCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "<p></p>",
      coverImageUrl: "",
      publishingStatus: "draft",
      scheduledPublishDate: undefined,
      isFeatured: false,
      excerpt: "",
      authorIds: [],
      categoryIds: [],
      tagIds: [],
      seoMetaTitle: "",
      seoMetaDescription: "",
    },
  });

  const [authorDisplayById, setAuthorDisplayById] = useState<Record<string, string>>({});
  const [createdPost, setCreatedPost] = useState<BlogPostResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [bootLoading, setBootLoading] = useState(mode === "edit");

  useEffect(() => {
    const token = getToken();
    const p = decodeJwtPayload(token);
    if (!p?.sub) return;
    setSessionAuthorId(p.sub);
    const label = p.medicalEmail ?? "Signed-in account";
    setAuthorDisplayById((m) => (m[p.sub!] ? m : { ...m, [p.sub!]: label }));
    const cur = form.getValues("authorIds");
    if (cur.length === 0) {
      form.setValue("authorIds", [p.sub], { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time bootstrap from session token
  }, []);

  useEffect(() => {
    if (!createdPost?.authors?.length) return;
    setAuthorDisplayById((m) => {
      const next = { ...m };
      for (const a of createdPost.authors) {
        next[a.id] = a.fullLegalName;
      }
      return next;
    });
  }, [createdPost]);

  const {
    formState: { isDirty },
    watch,
  } = form;

  const [draftOpen, setDraftOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [liveOpen, setLiveOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [newsletterAddedOpen, setNewsletterAddedOpen] = useState(false);

  const articleTitle = watch("title");
  const authorIds = watch("authorIds");
  const categoryIds = watch("categoryIds");
  const seoMetaTitle = watch("seoMetaTitle");
  const scheduledPublishDate = watch("scheduledPublishDate");

  const firstAuthorLabel = useMemo(() => {
    const id = authorIds?.[0];
    if (!id) return "—";
    return authorDisplayById[id] ?? createdPost?.authors?.[0]?.fullLegalName ?? id;
  }, [authorIds, authorDisplayById, createdPost]);

  const firstCategoryLabel = useMemo(() => {
    const id = categoryIds?.[0];
    if (!id) return "—";
    return createdPost?.categories?.find((c) => c.id === id)?.name ?? id;
  }, [categoryIds, createdPost]);

  const liveReadTime = useMemo(() => {
    const m = createdPost?.readTimeMinutes;
    if (m == null) return "—";
    return `${m} min`;
  }, [createdPost]);

  const scheduleDate = useMemo(() => {
    if (!scheduledPublishDate) return "—";
    const d = new Date(scheduledPublishDate);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  }, [scheduledPublishDate]);

  useEffect(() => {
    if (mode !== "edit" || !blogId) {
      setBootLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setBootLoading(true);
      setApiError(null);
      try {
        const post = await getBlogById(blogId);
        if (!mounted) return;

        setCreatedPost(post);
        setAuthorDisplayById((m) => {
          const next = { ...m };
          for (const a of post.authors) {
            next[a.id] = a.fullLegalName || a.medicalEmail;
          }
          return next;
        });

        form.reset({
          title: post.title ?? "",
          content: post.content ?? "<p></p>",
          coverImageUrl: post.coverImageUrl ?? "",
          publishingStatus: post.publishingStatus,
          scheduledPublishDate: post.scheduledPublishDate ?? undefined,
          isFeatured: Boolean(post.isFeatured),
          excerpt: post.excerpt ?? "",
          authorIds: post.authors.map((a) => a.id).slice(0, 1),
          categoryIds: post.categories.map((c) => c.id),
          tagIds: post.tags.map((t) => t.id),
          seoMetaTitle: post.seo?.metaTitle ?? "",
          seoMetaDescription: post.seo?.metaDescription ?? "",
        });
      } catch (e: unknown) {
        if (!mounted) return;
        setApiError(axiosErrorMessage(e, "Could not load blog details for editing."));
      } finally {
        if (mounted) setBootLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [mode, blogId, form]);

  const scheduleTime = useMemo(() => {
    if (!scheduledPublishDate) return "—";
    const d = new Date(scheduledPublishDate);
    return isNaN(d.getTime()) ? "—" : d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }, [scheduledPublishDate]);

  const anyModalOpen =
    draftOpen || publishOpen || discardOpen || liveOpen || shareOpen || previewOpen || newsletterAddedOpen;

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  const handleBack = () => {
    if (isDirty) setDiscardOpen(true);
    else router.push("/blogs");
  };

  const saveDraftAndOpenModal = async () => {
    form.setValue("publishingStatus", "draft", { shouldDirty: true, shouldValidate: true });
    form.setValue("scheduledPublishDate", undefined, { shouldDirty: true });
    const ok = await form.trigger();
    if (!ok) return false;
    setSubmitting(true);
    setApiError(null);
    try {
      const payload = buildBlogCreatePayload(form.getValues());
      const post =
        mode === "edit" && blogId
          ? await updateBlog(blogId, payload)
          : await createBlog(payload);
      setCreatedPost(post);
      setDraftOpen(true);
      return true;
    } catch (e: unknown) {
      setApiError(axiosErrorMessage(e, "Could not save draft."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    await saveDraftAndOpenModal();
  };

  const handlePublish = async () => {
    const isScheduled = form.getValues("publishingStatus") === "scheduled";

    if (isScheduled) {
      form.setValue("publishingStatus", "scheduled", { shouldDirty: true, shouldValidate: true });
    } else {
      form.setValue("publishingStatus", "published", { shouldDirty: true, shouldValidate: true });
      form.setValue("scheduledPublishDate", undefined, { shouldDirty: true });
    }

    const ok = await form.trigger();
    if (!ok) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const payload = buildBlogCreatePayload(form.getValues());
      const post =
        mode === "edit" && blogId
          ? await updateBlog(blogId, payload)
          : await createBlog(payload);
      setCreatedPost(post);
      if (post.publishingStatus === "scheduled") {
        setPublishOpen(true);
      } else {
        if (mode === "create") {
          form.reset({
            title: "",
            content: "<p></p>",
            coverImageUrl: "",
            publishingStatus: "draft",
            scheduledPublishDate: undefined,
            isFeatured: false,
            excerpt: "",
            authorIds: sessionAuthorId ? [sessionAuthorId] : [],
            categoryIds: [],
            tagIds: [],
            seoMetaTitle: "",
            seoMetaDescription: "",
          });
        }
        setLiveOpen(true);
      }
    } catch (e: unknown) {
      setApiError(axiosErrorMessage(e, "Could not publish."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      {bootLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
          Loading blog data...
        </div>
      ) : null}
      {apiError ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {apiError}
        </div>
      ) : null}
      <div className="flex min-h-[calc(100vh-72px)] gap-6">
        <PostEditor onBack={handleBack} disabled={submitting || bootLoading} />

        <PostSettingsPanel
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onPreview={() => setPreviewOpen(true)}
          disabled={submitting || bootLoading}
          authorDisplayById={authorDisplayById}
        />
      </div>

      {publishOpen ? (
        <PublishScheduledModal
          title={articleTitle}
          publishDate={scheduleDate}
          publishTime={scheduleTime}
          onClose={() => setPublishOpen(false)}
          onViewSchedule={() => {
            setPublishOpen(false);
            setLiveOpen(true);
          }}
          onReturnDashboard={() => {
            setPublishOpen(false);
            router.push("/admin-dashboard");
          }}
        />
      ) : null}

      {liveOpen ? (
        <LiveNowModal
          title={seoMetaTitle}
          author={firstAuthorLabel}
          category={firstCategoryLabel}
          readTime={liveReadTime}
          onClose={() => setLiveOpen(false)}
          onViewLive={() => {
            setLiveOpen(false);
            // Preview-only in this UI demo.
          }}
          onShare={() => {
            setLiveOpen(false);
            setShareOpen(true);
          }}
          onDone={() => {
            setLiveOpen(false);
            router.push("/blogs");
          }}
        />
      ) : null}

      {draftOpen ? (
        <DraftSavedModal
          title={articleTitle}
          onClose={() => setDraftOpen(false)}
          onContinue={() => setDraftOpen(false)}
          onReturn={() => {
            setDraftOpen(false);
            router.push("/blogs");
          }}
        />
      ) : null}

      {discardOpen ? (
        <DiscardUnsavedModal
          onClose={() => setDiscardOpen(false)}
          onSaveAsDraft={async () => {
            const ok = await saveDraftAndOpenModal();
            if (ok) setDiscardOpen(false);
          }}
          onDiscard={() => {
            setDiscardOpen(false);
            router.push("/blogs");
          }}
        />
      ) : null}

      {shareOpen ? (
        <ShareModal
          onClose={() => setShareOpen(false)}
          onNewsletter={() => {
            setShareOpen(false);
            setNewsletterAddedOpen(true);
          }}
          onDone={() => {
            setShareOpen(false);
          }}
        />
      ) : null}

      {previewOpen ? (
        <PreviewArticleModal
          title={articleTitle}
          author={firstAuthorLabel}
          excerpt={watch("excerpt")}
          contentPreview={watch("content")}
          metaTitle={watch("seoMetaTitle")}
          metaDesc={watch("seoMetaDescription")}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}

      {newsletterAddedOpen ? (
        <AddedToNewsletterModal
          articleTitle={articleTitle}
          newsletterLabel="Nov 2026 Clinical Digest"
          queuePosition="#5"
          onClose={() => setNewsletterAddedOpen(false)}
          onGoManager={() => {
            setNewsletterAddedOpen(false);
            router.push("/newsletters");
          }}
          onDone={() => setNewsletterAddedOpen(false)}
        />
      ) : null}
    </FormProvider>
  );
}

