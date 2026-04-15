"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import type { ComposeBroadcastInput } from "../_lib/compose-schema";
import type {
  CourseAnnouncementBroadcastDetails,
  CourseAnnouncementBroadcastRecipientItem,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";
import {
  getCourseAnnouncementBroadcastDetails,
  getCourseAnnouncementBroadcastRecipients,
  upsertCourseAnnouncementDraft,
} from "@/service/admin/newsletter/course-announcements/course-announcement-broadcast.service";

import CohortPillBar from "./cohort-pill-bar";
import RecipientsPanel from "./recipients-panel";
import PrioritySubjectPanel from "./priority-subject-panel";
import MessageContentPanel from "./message-panel";
import AttachmentsPanel from "./attachments-panel";
import PushToggleRow from "./push-toggle-row";
import SendBar from "./send-bar";
import ComposeFormProvider from "./compose-form-provider";
import { mapBroadcastDetailsToComposeDefaults } from "../_utils/compose-broadcast.mapper";
import BroadcastAnnouncementHeader from "@/app/dashboard/admin/(pages)/newsletters/course-announcements/[id]/_components/broadcast-announcement-header";
import ComposeShellLoading from "./compose-shell-loading";
import {
  sendCourseAnnouncementBroadcast,
  setCourseAnnouncementBroadcastRecipients,
} from "@/service/admin/newsletter/course-announcements/course-announcement-broadcast-update.service";

type ComposeShellProps = {
  id: string; // this is cohort id
};

function getReadableErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 404) {
      return "Broadcast details were not found. Please check the broadcast ID or try again.";
    }

    if (status === 403) {
      return "You do not have permission to view this broadcast.";
    }

    if (status === 401) {
      return "Your session has expired. Please sign in again.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again shortly.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to load broadcast details.";
}

export default function ComposeShell({ id }: ComposeShellProps) {
  const [broadcastId, setBroadcastId] = useState<string | null>(null);
  const [data, setData] = useState<CourseAnnouncementBroadcastDetails | null>(
    null,
  );
  const [recipientsData, setRecipientsData] = useState<
    CourseAnnouncementBroadcastRecipientItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const upsertResponse = await upsertCourseAnnouncementDraft(id);
        const resolvedBroadcastId = upsertResponse.id;

        if (!isMounted) return;

        setBroadcastId(resolvedBroadcastId);

        const [detailsResponse, recipientsResponse] = await Promise.all([
          getCourseAnnouncementBroadcastDetails(resolvedBroadcastId),
          getCourseAnnouncementBroadcastRecipients(resolvedBroadcastId, {
            page: 1,
            limit: 50,
          }),
        ]);

        if (!isMounted) return;

        setData(detailsResponse);
        setRecipientsData(recipientsResponse.items ?? []);
      } catch (err) {
        if (!isMounted) return;
        setError(getReadableErrorMessage(err));
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const defaults: ComposeBroadcastInput | null = useMemo(() => {
    if (!data) return null;
    return mapBroadcastDetailsToComposeDefaults(data);
  }, [data]);

  const recipients = useMemo(() => {
    return recipientsData.map((recipient, index) => ({
      id: recipient.id ?? `recipient-${index}`,
      name: recipient.name ?? "",
      email: recipient.email ?? "",
      avatarUrl: recipient.avatarUrl ?? undefined,
    }));
  }, [recipientsData]);

  const cohort = useMemo(() => {
    const scheduledDateLabel = data?.header.scheduledDate
      ? new Date(data.header.scheduledDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Not scheduled";

    return {
      id: data?.header.cohort?.id ?? "",
      name: data?.header.cohort?.name ?? "Unknown Cohort",
      scheduledDateLabel,
      systemReady: data?.header.systemReady ?? false,
    };
  }, [data]);

  if (isLoading) {
    return <ComposeShellLoading />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BroadcastAnnouncementHeader
          title="Broadcast Announcement"
          subtitle="Authoritative clinical communication"
        />

        <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-6">
          <h3 className="text-sm font-semibold text-red-700">
            Unable to load this broadcast
          </h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !defaults || !broadcastId) {
    return (
      <div className="space-y-6">
        <BroadcastAnnouncementHeader
          title="Broadcast Announcement"
          subtitle="Authoritative clinical communication"
        />

        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-6">
          <h3 className="text-sm font-semibold text-slate-900">
            No data found
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            We could not find broadcast details for this item.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BroadcastAnnouncementHeader
        title="Broadcast Announcement"
        subtitle={`Authoritative clinical communication for Cohort: ${cohort.name}`}
      />

      <CohortPillBar cohort={cohort} />

      <ComposeFormProvider defaultValues={defaults}>
        <RecipientsPanel recipients={recipients} />
        <PrioritySubjectPanel canEdit={data.actionsAllowed?.edit ?? false} />
        <MessageContentPanel />
        <AttachmentsPanel broadcastId={broadcastId} />
        <PushToggleRow />
        <SendBar
          broadcastId={broadcastId}
          onSend={async (values) => {
            const recipientsResponse =
              await setCourseAnnouncementBroadcastRecipients(broadcastId, {
                recipientMode: "SELECTED",
                recipientIds: values.recipientIds,
              });

            console.log("SET_RECIPIENTS_API_RESPONSE:", recipientsResponse);

            const sendBroadcastResponse =
              await sendCourseAnnouncementBroadcast(broadcastId);

            console.log(
              "FINAL_SEND_BROADCAST_API_RESPONSE:",
              sendBroadcastResponse,
            );

            return {
              recipientsResponse,
              sendBroadcastResponse,
            };
          }}
        />
      </ComposeFormProvider>
    </div>
  );
}
