"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import CreateBroadcastHeader from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-header";
import CreateBroadcastContentSection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-content-section";
import CreateBroadcastDeliverySection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/create-broadcast-delivery-section";
import BroadcastScheduledSuccessDialog from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_components/broadcast-scheduled-success-dialog";

import { mapBroadcastResponseToForm } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/create-broadcast/_utils/general-broadcast-form.mapper";
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
import { generalBroadcastGetService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.service";
import { generalBroadcastUpdateService } from "@/service/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-update.service";
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
import type { GetGeneralBroadcastResponse } from "@/types/admin/newsletter/general-newsletter/general-broadcast/general-broadcast-get.types";

import BroadcastEditPageShell from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/BroadcastEditPageShell";

type Props = {
  mode: "create" | "edit";
  broadcastId?: string;
};

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
  scheduledTime: "",
  targetAudience: "ALL_SUBSCRIBERS",
  attachments: [],
};

export default function GeneralBroadcastFormPage({ mode, broadcastId }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<CreateBroadcastFormState>(initialForm);
  const [initialEditForm, setInitialEditForm] =
    useState<CreateBroadcastFormState | null>(null);
  const [errors, setErrors] = useState<CreateBroadcastFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(mode === "edit");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [broadcastDetails, setBroadcastDetails] =
    useState<GetGeneralBroadcastResponse | null>(null);

  const isCustomMessage = useMemo(
    () => form.contentType === "CUSTOM_MESSAGE",
    [form.contentType],
  );

  const scheduleTimezone =
    broadcastDetails?.timezone?.trim() || BROADCAST_TIMEZONE;

  const recipientCount = broadcastDetails?.estimatedRecipientsCount ?? 0;

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

  useEffect(() => {
    if (mode !== "edit" || !broadcastId) return;

    const loadData = async () => {
      try {
        setIsLoadingInitial(true);

        const data: GetGeneralBroadcastResponse =
          await generalBroadcastGetService.getBroadcastById(broadcastId);

        const mappedForm = mapBroadcastResponseToForm(data);

        setBroadcastDetails(data);
        setForm(mappedForm);
        setInitialEditForm(mappedForm);
      } catch (error) {
        console.error("Failed to load broadcast", error);
        toast.error("Failed to load broadcast");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadData();
  }, [mode, broadcastId]);

  const handleDiscard = () => {
    if (mode === "edit" && initialEditForm) {
      setForm(initialEditForm);
    } else {
      setForm(initialForm);
    }

    setErrors({});
    toast("Form reset");
  };

  const validateForm = (isDraft: boolean): boolean => {
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

    // ✅ ONLY validate schedule when NOT draft
    if (!isDraft) {
      if (!form.cadenceDate) {
        nextErrors.cadenceDate = "Please select a date.";
      }

      if (!form.scheduledTime) {
        nextErrors.scheduledTime = "Please select a time.";
      }

      if (!form.targetAudience) {
        nextErrors.targetAudience = "Please select an audience.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): CreateGeneralBroadcastPayload => {
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

    try {
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
          isExisting: false,
        });
      }

      setForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles],
      }));

      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("File upload failed", error);
      toast.error("File upload failed");
    }
  };

  const removeAttachment = (fileKey: string) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((item) => item.fileKey !== fileKey),
    }));
  };

  const formatScheduledText = (date: string, time: string) => {
    if (!date || !time) return "";
    return `${date} at ${time}`;
  };

  const hasArticleLinkContentChanges = (
    current: CreateBroadcastFormState,
    initial: CreateBroadcastFormState,
  ) => {
    return (
      current.subjectLine.trim() !== initial.subjectLine.trim() ||
      current.preHeader.trim() !== initial.preHeader.trim() ||
      (current.selectedArticle?.sourceRefId || "") !==
        (initial.selectedArticle?.sourceRefId || "")
    );
  };

  const hasCustomMessageContentChanges = (
    current: CreateBroadcastFormState,
    initial: CreateBroadcastFormState,
  ) => {
    return (
      current.subjectLine.trim() !== initial.subjectLine.trim() ||
      current.preHeader.trim() !== initial.preHeader.trim() ||
      current.messageBodyHtml.trim() !== initial.messageBodyHtml.trim() ||
      current.messageBodyText.trim() !== initial.messageBodyText.trim()
    );
  };

  const hasLogisticsChanges = (
    current: CreateBroadcastFormState,
    initial: CreateBroadcastFormState,
  ) => {
    return (
      current.frequency !== initial.frequency ||
      current.cadenceDate !== initial.cadenceDate ||
      current.scheduledTime !== initial.scheduledTime ||
      current.targetAudience !== initial.targetAudience
    );
  };

  const handleSubmit = async () => {
    const isDraft = !isScheduleComplete();

    if (!validateForm(isDraft)) return;

    try {
      setIsSubmitting(true);

      if (mode === "create") {
        const payload = buildPayload();

        const createResponse =
          await generalBroadcastCreateService.createBroadcastDraft(payload);

        const id = createResponse.id;

        const newAttachments = form.attachments.filter((a) => !a.isExisting);

        if (newAttachments.length) {
          await Promise.all(
            newAttachments.map((a) =>
              generalBroadcastCreateService.addAttachment(id, {
                fileKey: a.fileKey,
                fileName: a.fileName,
                mimeType: a.mimeType,
                fileSizeBytes: a.fileSizeBytes,
              }),
            ),
          );
        }

        // ✅ FULL CREATE FLOW
        if (!isDraft) {
          const scheduledAtUtc = zonedDateAndTimeToUtcIso(
            form.cadenceDate,
            form.scheduledTime,
            scheduleTimezone,
          );

          await generalBroadcastCreateService.updateScheduleSettings(id, {
            frequencyType: form.frequency,
            scheduledAtUtc,
            timezone: scheduleTimezone,
          });

          await generalBroadcastCreateService.scheduleBroadcast(id);

          // ✅ ONLY dialog (no toast)
          setIsSuccessDialogOpen(true);
        } else {
          // ✅ ONLY toast (no dialog)
          toast.success("Draft saved successfully");
        }

        return;
      }

      if (mode === "edit" && broadcastId && initialEditForm) {
        const contentChanged =
          form.contentType === "ARTICLE_LINK"
            ? hasArticleLinkContentChanges(form, initialEditForm)
            : hasCustomMessageContentChanges(form, initialEditForm);

        const logisticsChanged = hasLogisticsChanges(form, initialEditForm);

        const newAttachments = form.attachments.filter((a) => !a.isExisting);
        const attachmentsChanged = newAttachments.length > 0;

        // ✅ detect draft → scheduled case
        const shouldOpenSuccessDialog =
          broadcastDetails?.status === "DRAFT" &&
          logisticsChanged &&
          Boolean(form.cadenceDate && form.scheduledTime);

        if (!contentChanged && !logisticsChanged && !attachmentsChanged) {
          toast("No changes detected");
          return;
        }

        if (form.contentType === "ARTICLE_LINK" && contentChanged) {
          try {
            await generalBroadcastUpdateService.updateArticleLinkBroadcast(
              broadcastId,
              {
                subjectLine: form.subjectLine.trim(),
                preheaderText: form.preHeader.trim(),
                articleLink: {
                  sourceRefId: form.selectedArticle?.sourceRefId || "",
                  ctaLabel: "Read the Full Report",
                },
              },
            );
          } catch (error) {
            console.error(
              "Article link content update failed",
              (error as any)?.response?.data || error,
            );
            toast.error("Failed to update article content");
            return;
          }
        }

        if (form.contentType === "CUSTOM_MESSAGE" && contentChanged) {
          console.info(
            "Custom message edit API is not available yet. Skipping content update.",
          );
          toast("Custom message content update is not available yet");
        }

        if (attachmentsChanged) {
          try {
            await Promise.all(
              newAttachments.map((a) =>
                generalBroadcastUpdateService.addAttachment(broadcastId, {
                  fileKey: a.fileKey,
                  fileName: a.fileName,
                  mimeType: a.mimeType,
                  fileSizeBytes: a.fileSizeBytes,
                }),
              ),
            );
          } catch (error) {
            console.error(
              "Attachment upload failed",
              (error as any)?.response?.data || error,
            );
            toast.error("Failed to upload attachment");
            return;
          }
        }

        if (logisticsChanged) {
          const scheduledAtUtc = zonedDateAndTimeToUtcIso(
            form.cadenceDate,
            form.scheduledTime,
            scheduleTimezone,
          );

          try {
            await generalBroadcastUpdateService.updateScheduleSettings(
              broadcastId,
              {
                frequencyType: form.frequency,
                scheduledAtUtc,
                timezone: scheduleTimezone,
              },
            );

            // ✅ IMPORTANT: if draft → now scheduling → call schedule API
            if (shouldOpenSuccessDialog) {
              await generalBroadcastCreateService.scheduleBroadcast(
                broadcastId,
              );
            }
          } catch (error) {
            console.error(
              "Schedule settings update failed",
              (error as any)?.response?.data || error,
            );
            toast.error("Failed to update delivery logistics");
            return;
          }
        }

        setInitialEditForm(form);

        // ✅ final UI decision
        if (shouldOpenSuccessDialog) {
          setIsSuccessDialogOpen(true);
        } else {
          toast.success("Broadcast updated successfully");
        }
      }
    } catch (error) {
      console.error(
        "Unexpected submit error",
        (error as any)?.response?.data || error,
      );
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitial) {
    return <BroadcastEditPageShell />;
  }

  const isContentCompleteForCreate = () => {
    if (!form.subjectLine.trim()) return false;
    if (!form.preHeader.trim()) return false;

    if (form.contentType === "ARTICLE_LINK") {
      return Boolean(form.selectedArticle?.sourceRefId);
    }

    return Boolean(htmlToPlainText(form.messageBodyHtml).trim());
  };

  const isScheduleComplete = () => {
    return Boolean(
      form.frequency && form.cadenceDate.trim() && form.scheduledTime.trim(),
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CreateBroadcastHeader
        mode={mode}
        onDiscard={handleDiscard}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isDraftReady={mode === "create" ? isContentCompleteForCreate() : true}
        isCreateReady={
          mode === "create"
            ? isContentCompleteForCreate() && isScheduleComplete()
            : false
        }
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8">
        <CreateBroadcastContentSection
          mode={mode}
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

      <BroadcastScheduledSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onReturnToDashboard={() =>
          router.push("/dashboard/admin/newsletters/general-newsletter")
        }
        recipientCount={recipientCount}
        scheduledDateText={formatScheduledText(
          form.cadenceDate,
          form.scheduledTime,
        )}
        articleTitle={form.selectedArticle?.title || "Custom Message"}
      />
    </div>
  );
}
