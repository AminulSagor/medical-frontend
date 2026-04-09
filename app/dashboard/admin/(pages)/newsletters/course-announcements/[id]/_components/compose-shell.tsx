"use client";

import { useEffect, useMemo, useState } from "react";

import type { ComposeBroadcastInput } from "../_lib/compose-schema";
import type {
  CourseAnnouncementBroadcastDetails,
  CourseAnnouncementBroadcastRecipientItem,
} from "@/types/admin/newsletter/course-announcements/course-announcement-broadcast.types";
import {
  getCourseAnnouncementBroadcastDetails,
  getCourseAnnouncementBroadcastRecipients,
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
import { test } from "@/app/dashboard/admin/(pages)/newsletters/course-announcements/[id]/test/test";

type ComposeShellProps = {
  id: string;
};

export default function ComposeShell({ id }: ComposeShellProps) {
  const [data, setData] = useState<CourseAnnouncementBroadcastDetails | null>(
    test,
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

        // const [detailsResponse, recipientsResponse] = await Promise.all([
        //   getCourseAnnouncementBroadcastDetails(id),
        //   getCourseAnnouncementBroadcastRecipients(id, {
        //     page: 1,
        //     limit: 50,
        //   }),
        // ]);

        // if (!isMounted) return;

        // // setData(detailsResponse);

        // setRecipientsData(recipientsResponse.items ?? []);
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load broadcast details.",
        );
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchData();

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
    return <div className="p-4 text-sm text-slate-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  if (!data || !defaults) {
    return <div className="p-4 text-sm text-slate-500">No data found.</div>;
  }

  return (
    <div className="space-y-6">
      <CohortPillBar cohort={cohort} />

      <ComposeFormProvider defaultValues={defaults}>
        <RecipientsPanel recipients={recipients} />
        <PrioritySubjectPanel
          id={id}
          canEdit={data.actionsAllowed?.edit ?? false}
        />
        <MessageContentPanel />
        <AttachmentsPanel />
        <PushToggleRow />
        <SendBar />
      </ComposeFormProvider>
    </div>
  );
}
