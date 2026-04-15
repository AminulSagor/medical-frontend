"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { ComposeBroadcastInput } from "../_lib/compose-schema";
import type { CourseAnnouncementPriority } from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";
import { updateCourseAnnouncementBroadcast } from "@/service/admin/newsletter/course-announcements/course-announcement-broadcast-update.service";

type Props = {
  broadcastId: string;
  onSend: (values: ComposeBroadcastInput) => Promise<unknown>;
};

function mapFormPriorityToApiPriority(
  value: ComposeBroadcastInput["priority"],
): CourseAnnouncementPriority {
  switch (value) {
    case "material":
      return "MATERIAL_SHARE";
    case "urgent":
      return "URGENT_ALERT";
    case "general":
    default:
      return "GENERAL_UPDATE";
  }
}

function convertMessageToHtml(message: string): string {
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");
}

export default function SendBar({ broadcastId, onSend }: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useFormContext<ComposeBroadcastInput>();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onSubmit = async (values: ComposeBroadcastInput) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);

      // console.log("SEND_BROADCAST_CLICKED_VALUES:", values);

      const updatePayload = {
        priority: mapFormPriorityToApiPriority(values.priority),
        subjectLine: values.subject.trim(),
        messageBodyHtml: convertMessageToHtml(values.message),
        messageBodyText: values.message.trim(),
        pushToStudentPanel: values.pushToStudentPanel,
      };

      // console.log("UPDATE_BROADCAST_REQUEST_PAYLOAD:", updatePayload);

      const updateBroadcastResponse = await updateCourseAnnouncementBroadcast(
        broadcastId,
        updatePayload,
      );

      // console.log("UPDATE_BROADCAST_API_RESPONSE:", updateBroadcastResponse);

      const sendResponse = await onSend(values);

      // console.log("SEND_BROADCAST_API_RESPONSE:", sendResponse);

      setSubmitSuccess("Broadcast sent successfully.");
    } catch (error) {
      console.error("FAILED_TO_SEND_BROADCAST:", error);
      setSubmitError("Failed to send broadcast. Please try again.");
      setSubmitSuccess(null);
    }
  };

  return (
    <div className="pb-10 pt-8">
      {submitSuccess ? (
        <p className="mb-3 text-center text-sm font-medium text-green-600">
          {submitSuccess}
        </p>
      ) : null}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="inline-flex h-16 w-[448px] max-w-[448px] items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-[18px] text-[12px] font-bold tracking-[0.28em] text-white shadow-[0_18px_45px_rgba(15,23,42,0.25)] transition hover:bg-slate-950 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} className="opacity-90" />
          {isSubmitting ? "SENDING..." : "SEND BROADCAST"}
        </button>
      </div>

      {(errors.subject || errors.message || errors.recipientIds) && (
        <p className="mt-3 text-center text-xs text-rose-600">
          Please complete required fields before sending.
        </p>
      )}

      {submitError ? (
        <p className="mt-3 text-center text-xs text-rose-600">{submitError}</p>
      ) : null}

      <p className="mt-6 text-center text-[10px] font-bold tracking-[0.35em] text-slate-300">
        CERTIFIED MEDICAL COMMUNICATION HUB
      </p>
    </div>
  );
}
