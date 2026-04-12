"use client";

import { useMemo, useState } from "react";
import CreateBroadcastHeader from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-header";
import CreateBroadcastContentSection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-content-section";
import CreateBroadcastDeliverySection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-delivery-section";
import {
  DEFAULT_CUSTOM_MESSAGE_HTML,
  DEFAULT_CUSTOM_MESSAGE_TEXT,
  htmlToPlainText,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-editor.utils";
import {
  BROADCAST_TIMEZONE,
  zonedDateAndTimeToUtcIso,
} from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/create-broadcast-schedule.utils";
import { generalBroadcastCreateService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import type {
  CreateBroadcastFormErrors,
  CreateBroadcastFormState,
  CreateGeneralBroadcastPayload,
  UploadedBroadcastAttachment,
} from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-create.types";

const initialForm: CreateBroadcastFormState = {
  contentType: "ARTICLE_LINK",
  articleSearch: "",
  selectedArticle: null,
  subjectLine: "",
  preHeader: "",
  messageBodyHtml: DEFAULT_CUSTOM_MESSAGE_HTML,
  messageBodyText: DEFAULT_CUSTOM_MESSAGE_TEXT,
  frequency: "WEEKLY",
  cadenceDate: "",
  scheduledTime: "09:00",
  targetAudience: "ALL_SUBSCRIBERS",
  attachments: [],
};

export default function CreateBroadcastPage() {
  const [form, setForm] = useState<CreateBroadcastFormState>(initialForm);
  const [errors, setErrors] = useState<CreateBroadcastFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isCustomMessage = useMemo(
    () => form.contentType === "CUSTOM_MESSAGE",
    [form.contentType],
  );

  const updateForm = <K extends keyof CreateBroadcastFormState>(
    key: K,
    value: CreateBroadcastFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
      ...(key === "selectedArticle" ? { articleSearch: undefined } : {}),
      ...(key === "messageBodyHtml" || key === "messageBodyText"
        ? { messageBody: undefined }
        : {}),
    }));
  };

  const handleDiscard = () => {
    setForm(initialForm);
    setErrors({});
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const nextErrors: CreateBroadcastFormErrors = {};

    if (
      form.contentType === "ARTICLE_LINK" &&
      !form.selectedArticle?.sourceRefId
    ) {
      nextErrors.articleSearch = "Please select a published article.";
    }

    if (!form.subjectLine.trim()) {
      nextErrors.subjectLine = "Subject line is required.";
    }

    if (!form.preHeader.trim()) {
      nextErrors.preHeader = "Pre-header is required.";
    }

    if (isCustomMessage && !htmlToPlainText(form.messageBodyHtml).trim()) {
      nextErrors.messageBody = "Message body is required.";
    }

    if (!form.cadenceDate) {
      nextErrors.cadenceDate = "Please select a date.";
    }

    if (!form.scheduledTime) {
      nextErrors.scheduledTime = "Please select a time.";
    }

    if (!form.targetAudience) {
      nextErrors.targetAudience = "Please select an audience.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildCreatePayload = (): CreateGeneralBroadcastPayload => {
    if (form.contentType === "ARTICLE_LINK" && form.selectedArticle) {
      return {
        contentType: "ARTICLE_LINK",
        subjectLine: form.subjectLine.trim(),
        preheaderText: form.preHeader.trim(),
        audienceMode: form.targetAudience,
        articleLink: {
          sourceType: form.selectedArticle.sourceType,
          sourceRefId: form.selectedArticle.sourceRefId,
          ctaLabel: "Read Full Clinical Report",
        },
      };
    }

    return {
      contentType: "CUSTOM_MESSAGE",
      subjectLine: form.subjectLine.trim(),
      preheaderText: form.preHeader.trim(),
      audienceMode: form.targetAudience,
      customContent: {
        messageBodyHtml: form.messageBodyHtml.trim(),
        messageBodyText: htmlToPlainText(form.messageBodyHtml),
      },
    };
  };

  const handleAttachmentFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const uploadedFiles: UploadedBroadcastAttachment[] = [];

    for (const file of selectedFiles) {
      const uploadMeta = await getUploadUrl({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder: "newsletters",
      });

      await uploadFileToSignedUrl(uploadMeta.signedUrl, file);

      uploadedFiles.push({
        file,
        fileKey: uploadMeta.fileKey,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
        readUrl: uploadMeta.readUrl,
      });
    }

    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...uploadedFiles],
    }));
  };

  const removeAttachment = (fileKey: string) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((item) => item.fileKey !== fileKey),
    }));
  };

  const handleSubmit = async () => {
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const createPayload = buildCreatePayload();
      console.log("createPayload", createPayload);
      const createResponse =
        await generalBroadcastCreateService.createBroadcastDraft(createPayload);

      const broadcastId = createResponse.id;

      if (form.attachments.length) {
        await Promise.all(
          form.attachments.map((attachment) =>
            generalBroadcastCreateService.addAttachment(broadcastId, {
              fileKey: attachment.fileKey,
              fileName: attachment.fileName,
              mimeType: attachment.mimeType,
              fileSizeBytes: attachment.fileSizeBytes,
            }),
          ),
        );
      }

      const scheduledAtUtc = zonedDateAndTimeToUtcIso(
        form.cadenceDate,
        form.scheduledTime,
        BROADCAST_TIMEZONE,
      );

      await generalBroadcastCreateService.updateScheduleSettings(broadcastId, {
        frequencyType: form.frequency,
        scheduledAtUtc,
        timezone: BROADCAST_TIMEZONE,
      });

      setSuccessMessage(
        "Broadcast draft, attachments, and schedule saved successfully.",
      );
    } catch (error) {
      console.error("Failed to save broadcast", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CreateBroadcastHeader
        onDiscard={handleDiscard}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8">
        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <CreateBroadcastContentSection
          form={form}
          errors={errors}
          onChange={updateForm}
          onUploadAttachments={handleAttachmentFiles}
          onRemoveAttachment={removeAttachment}
        />

        <CreateBroadcastDeliverySection
          form={form}
          errors={errors}
          onChange={updateForm}
        />
      </div>
    </div>
  );
}
