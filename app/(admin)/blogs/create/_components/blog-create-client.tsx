"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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


function buildBlogCreatePayload(values: BlogCreateInput) {
  return {
    title: values.title,
    content: values.content, // backend expects HTML string
    coverImageUrl: values.coverImageUrl ?? "",
    publishingStatus: values.publishingStatus,
    scheduledPublishDate:
      values.publishingStatus === "scheduled" ? values.scheduledPublishDate : undefined,
    isFeatured: values.isFeatured,
    excerpt: values.excerpt,
    authorIds: values.authorIds,
    categoryIds: values.categoryIds,
    tagIds: values.tagIds,
    seoMetaTitle: values.seoMetaTitle,
    seoMetaDescription: values.seoMetaDescription,
  };
}

export default function BlogCreateClient() {
  const router = useRouter();

  const form = useForm<BlogCreateInput>({
    resolver: zodResolver(BlogCreateSchema),
    mode: "onChange",
    defaultValues: {
      title: "New Approaches in Pediatric Airway",
      content:
        "<h1>New Approaches in Pediatric Airway</h1><p>Effective airway management in pediatric patients remains one of the most critical skills for emergency physicians and anesthesiologists.</p><h2>Anatomical Considerations</h2><p>The pediatric airway is situated higher in the neck, typically at the level of C3–C4 in infants, compared to C4–C5 in adults.</p><figure style=\"margin:16px 0; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff;\"><img src=\"/photos/diagnostic-pen.png\" alt=\"Advanced pediatric airway equipment\" style=\"display:block; width:100%; height:auto;\" /><figcaption style=\"font-size:11px; color:#64748b; padding:8px 16px; text-align:center; border-top:1px solid #e2e8f0;\">Figure: Advanced pediatric airway equipment</figcaption></figure><h2>Recent Clinical Guidelines</h2><p>The latest guidelines emphasize the importance of early recognition of difficult airway conditions and updated surgical and medical protocols.</p>",

      coverImageUrl: "",
      publishingStatus: "draft",
      scheduledPublishDate: new Date("2023-10-24T10:00:00.000Z").toISOString(),
      isFeatured: false,

      excerpt: "An overview of the latest anatomical considerations and guidelines for pediatric airway management.",
      authorIds: ["Dr. Sarah Miller"],
      categoryIds: ["Airway Management", "Pediatrics"],
      tagIds: ["Laryngoscopy", "Intubation"],

      seoMetaTitle: "New Approaches in Pediatric Airway Management",
      seoMetaDescription:
        "An overview of the latest anatomical considerations and guidelines for pediatric airway management.",
    },
  });

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

  const scheduleDate = useMemo(() => "Oct 24, 2023", []);
  const scheduleTime = useMemo(() => "10:00 AM (EST)", []);

  const articleTitle = watch("title");
  const authorIds = watch("authorIds");
  const categoryIds = watch("categoryIds");
  const seoMetaTitle = watch("seoMetaTitle");

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
    form.setValue("publishingStatus", "draft", { shouldValidate: true });
    const ok = await form.trigger(["title", "authorIds"]);
    if (!ok) return false;
    const payload = buildBlogCreatePayload(form.getValues());
    // eslint-disable-next-line no-console
    console.log("BLOG_CREATE_PAYLOAD (draft)", payload);
    setDraftOpen(true);
    return true;
  };

  const handleSaveDraft = async () => {
    await saveDraftAndOpenModal();
  };

  const handlePublish = async () => {
    form.setValue("publishingStatus", "scheduled", { shouldValidate: true });
    // If user didn't touch scheduling controls, keep the default iso we set in defaults.
    form.setValue("scheduledPublishDate", form.getValues("scheduledPublishDate")!, {
      shouldValidate: true,
    });
    const ok = await form.trigger();
    if (!ok) return;
    const payload = buildBlogCreatePayload(form.getValues());
    // eslint-disable-next-line no-console
    console.log("BLOG_CREATE_PAYLOAD (publish)", payload);
    setPublishOpen(true);
  };

  return (
    <FormProvider {...form}>
      <div className="flex min-h-[calc(100vh-72px)] gap-6">
        <PostEditor onBack={handleBack} />

        <PostSettingsPanel
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onPreview={() => setPreviewOpen(true)}
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
          author={authorIds?.[0] ?? "—"}
          category={categoryIds?.[0] ?? "—"}
          readTime="12 min"
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
          author={authorIds?.[0] ?? "—"}
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

