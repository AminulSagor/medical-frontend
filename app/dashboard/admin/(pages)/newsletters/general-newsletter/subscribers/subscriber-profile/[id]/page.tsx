"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SubscriberProfileHeader from "../_components/subscriber-profile-header";
import SubscriberStatsOverview from "../_components/subscriber-stats-overview";
import SubscriberProfileCard from "../_components/subscriber-profile-card";
import SubscriberHistory from "../_components/subscriber-history";
import EditSubscriberProfileDialog from "../_components/edit-subscriber-profile-dialog";
import AddSubscriberNoteDialog from "../_components/add-subscriber-note-dialog";
import {
  mapSubscriberProfileResponseToUi,
  subscriberProfileMock,
} from "../data/subscriber-profile.mock";
import { getSubscriberProfile } from "@/service/admin/newsletter/subscribes/subscriber-profile.service";
import { updateSubscriberProfile } from "@/service/admin/newsletter/subscribes/update-subscriber-profile.service";
import { createSubscriberNote } from "@/service/admin/newsletter/subscribes/create-subscriber-note.service";
import { getSubscriberNewsletterHistory } from "@/service/admin/newsletter/subscribes/subscriber-newsletter-history.service";
import type { SubscriberProfile } from "../types/subscriber-profile.type";
import type { EditSubscriberProfileFormValues } from "@/types/admin/newsletter/general-newsletter/subscribes/update-subscriber-profile.types";
import type {
  SubscriberNewsletterHistoryItem,
  SubscriberNewsletterHistoryResponse,
} from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-newsletter-history.types";

const NEWSLETTER_HISTORY_LIMIT = 10;

function formatNewsletterDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapNewsletterStatus(
  status: string,
): SubscriberProfile["newsletters"][number]["status"] {
  if (status === "DELIVERED") return "delivered";
  if (status === "BOUNCED") return "bounced";
  return "queued";
}

function mapNewsletterHistoryItems(
  items: SubscriberNewsletterHistoryItem[],
): SubscriberProfile["newsletters"] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    sentDateLabel: formatNewsletterDate(item.sentAt),
    status: mapNewsletterStatus(item.deliveryStatus),
    opened: item.opened,
    clicked: item.clicked,
  }));
}

export default function SubscriberProfilePage() {
  const params = useParams<{ id: string }>();
  const subscriberId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<SubscriberProfile>(subscriberProfileMock);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotal, setNewsletterTotal] = useState(0);
  const [isNewsletterLoadingMore, setIsNewsletterLoadingMore] = useState(false);

  const loadSubscriberProfile = async (id: string) => {
    try {
      const response = await getSubscriberProfile(id);
      setData((prev) => ({
        ...prev,
        ...mapSubscriberProfileResponseToUi(response),
        newsletters: prev.newsletters,
      }));
    } catch (error) {
      console.error("Failed to load subscriber profile:", error);
    }
  };

  const loadNewsletterHistory = async (
    id: string,
    page: number,
    append = false,
  ) => {
    try {
      setIsNewsletterLoadingMore(true);

      const response: SubscriberNewsletterHistoryResponse =
        await getSubscriberNewsletterHistory(
          id,
          page,
          NEWSLETTER_HISTORY_LIMIT,
        );

      const mappedRows = mapNewsletterHistoryItems(response.items);

      setNewsletterPage(response.meta.page);
      setNewsletterTotal(response.meta.total);

      setData((prev) => ({
        ...prev,
        newsletters: append ? [...prev.newsletters, ...mappedRows] : mappedRows,
      }));
    } catch (error) {
      console.error("Failed to load newsletter history:", error);
      if (!append) {
        setData((prev) => ({
          ...prev,
          newsletters: [],
        }));
      }
    } finally {
      setIsNewsletterLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!subscriberId) return;

    void loadSubscriberProfile(subscriberId);
    void loadNewsletterHistory(subscriberId, 1, false);
  }, [subscriberId]);

  const initialEditValues = useMemo<EditSubscriberProfileFormValues>(() => {
    return {
      fullName: data.name,
      clinicalRole: data.roleLabel === "—" ? "" : data.roleLabel,
      phone: data.contact.phone === "—" ? "" : data.contact.phone,
      institution:
        data.professionalInfo.institution === "—"
          ? ""
          : data.professionalInfo.institution,
    };
  }, [data]);

  const handleUpdateProfile = async (
    values: EditSubscriberProfileFormValues,
  ) => {
    if (!subscriberId) return;

    try {
      await updateSubscriberProfile(subscriberId, {
        fullName: values.fullName,
        clinicalRole: values.clinicalRole || undefined,
        phone: values.phone || undefined,
        institution: values.institution || undefined,
      });

      await loadSubscriberProfile(subscriberId);
    } catch (error) {
      console.error("Failed to update subscriber profile:", error);
      throw error;
    }
  };

  const handleAddNote = async (note: string) => {
    if (!subscriberId) return;

    try {
      await createSubscriberNote(subscriberId, { note });
      await loadSubscriberProfile(subscriberId);
    } catch (error) {
      console.error("Failed to create subscriber note:", error);
      throw error;
    }
  };

  const handleLoadMoreNewsletters = async () => {
    if (!subscriberId) return;

    const nextPage = newsletterPage + 1;
    await loadNewsletterHistory(subscriberId, nextPage, true);
  };

  const canLoadMoreNewsletters = data.newsletters.length < newsletterTotal;

  return (
    <div>
      <SubscriberProfileHeader data={data} onEdit={() => setIsEditOpen(true)} />

      <div className="py-6">
        <SubscriberStatsOverview data={data} />

        <main className="py-6">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <SubscriberProfileCard
                data={data}
                onAddNote={() => setIsAddNoteOpen(true)}
              />
            </aside>

            <section>
              <SubscriberHistory
                data={data}
                newsletterCanLoadMore={canLoadMoreNewsletters}
                isNewsletterLoadingMore={isNewsletterLoadingMore}
                onLoadMoreNewsletters={handleLoadMoreNewsletters}
              />
            </section>
          </div>
        </main>
      </div>

      <EditSubscriberProfileDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialValues={initialEditValues}
        onSubmit={handleUpdateProfile}
      />

      <AddSubscriberNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        onSubmit={handleAddNote}
      />
    </div>
  );
}
