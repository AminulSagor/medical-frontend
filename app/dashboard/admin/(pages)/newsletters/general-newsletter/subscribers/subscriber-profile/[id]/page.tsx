"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SubscriberProfileHeader from "../_components/subscriber-profile-header";
import SubscriberStatsOverview from "../_components/subscriber-stats-overview";
import SubscriberProfileCard from "../_components/subscriber-profile-card";
import SubscriberHistory from "../_components/subscriber-history";
import EditSubscriberProfileDialog from "../_components/edit-subscriber-profile-dialog";
import AddSubscriberNoteDialog from "../_components/add-subscriber-note-dialog";
import { mapSubscriberProfileResponseToUi } from "../_utils/subscriber-profile.mock";
import { getSubscriberProfile } from "@/service/admin/newsletter/subscribes/subscriber-profile.service";
import { updateSubscriberProfile } from "@/service/admin/newsletter/subscribes/update-subscriber-profile.service";
import { createSubscriberNote } from "@/service/admin/newsletter/subscribes/create-subscriber-note.service";
import { getSubscriberNewsletterHistory } from "@/service/admin/newsletter/subscribes/subscriber-newsletter-history.service";
import type { SubscriberProfile } from "../types/subscriber-profile.type";
import type { EditSubscriberProfileFormValues } from "@/types/admin/newsletter/general-newsletter/subscribes/update-subscriber-profile.types";
import type { SubscriberNewsletterHistoryResponse } from "@/types/admin/newsletter/general-newsletter/subscribes/subscriber-newsletter-history.types";
import { SubscriberProfilePageSkeleton } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/_components/SubscriberProfilePageSkeleton";
import { mapNewsletterHistoryItems } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/subscriber-profile/_utils/utils";

const NEWSLETTER_HISTORY_LIMIT = 10;

export default function SubscriberProfilePage() {
  const params = useParams<{ id: string }>();
  const subscriberId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [data, setData] = useState<SubscriberProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotal, setNewsletterTotal] = useState(0);
  const [isNewsletterLoadingMore, setIsNewsletterLoadingMore] = useState(false);

  const loadSubscriberProfile = async (id: string) => {
    try {
      setIsProfileLoading(true);

      const response = await getSubscriberProfile(id);
      const mappedProfile = mapSubscriberProfileResponseToUi(response);

      setData((prev) => ({
        ...mappedProfile,
        newsletters: prev?.newsletters ?? [],
      }));
    } catch (error) {
      console.error("Failed to load subscriber profile:", error);
      setData(null);
    } finally {
      setIsProfileLoading(false);
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

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          newsletters: append
            ? [...prev.newsletters, ...mappedRows]
            : mappedRows,
        };
      });
    } catch (error) {
      console.error("Failed to load newsletter history:", error);

      if (!append) {
        setData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            newsletters: [],
          };
        });
      }
    } finally {
      setIsNewsletterLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!subscriberId) return;

    void Promise.all([
      loadSubscriberProfile(subscriberId),
      loadNewsletterHistory(subscriberId, 1, false),
    ]);
  }, [subscriberId]);

  const initialEditValues = useMemo<EditSubscriberProfileFormValues>(() => {
    return {
      fullName: data?.name ?? "",
      clinicalRole: data?.roleLabel === "—" ? "" : (data?.roleLabel ?? ""),
      phone: data?.contact.phone === "—" ? "" : (data?.contact.phone ?? ""),
      institution:
        data?.professionalInfo.institution === "—"
          ? ""
          : (data?.professionalInfo.institution ?? ""),
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

  if (isProfileLoading || !data) {
    return <SubscriberProfilePageSkeleton />;
  }

  return (
    <div>
      <SubscriberProfileHeader data={data} onEdit={() => setIsEditOpen(true)} />

      <div className="py-6">
        <SubscriberStatsOverview data={data} />

        <main className="py-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
            <aside className="lg:sticky lg:top-6 lg:self-start lg:col-span-4">
              <SubscriberProfileCard
                data={data}
                onAddNote={() => setIsAddNoteOpen(true)}
              />
            </aside>

            <section className="lg:col-span-8">
              <SubscriberHistory
                id={data.id}
                
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
