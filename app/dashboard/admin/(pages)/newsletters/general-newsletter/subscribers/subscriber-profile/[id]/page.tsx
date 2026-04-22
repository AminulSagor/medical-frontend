"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SubscriberProfileHeader from "../_components/subscriber-profile-header";
import SubscriberStatsOverview from "../_components/subscriber-stats-overview";
import SubscriberProfileCard from "../_components/subscriber-profile-card";
import SubscriberHistory from "../_components/subscriber-history";
import EditSubscriberProfileDialog from "../_components/edit-subscriber-profile-dialog";
import AddSubscriberNoteDialog from "../_components/add-subscriber-note-dialog";
import { mapSubscriberProfileResponseToUi } from "../data/subscriber-profile.mock";
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

function SubscriberProfilePageSkeleton() {
  return (
    <div>
      <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />

      <div className="py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>

        <main className="py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white">
                <div className="h-44 animate-pulse bg-slate-100" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-56 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-44 animate-pulse rounded bg-slate-100" />
                  <div className="h-px bg-slate-100" />
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-100 bg-white p-6">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
                <div className="mt-5 h-12 animate-pulse rounded-2xl bg-slate-100" />
                <div className="mt-4 h-4 w-36 animate-pulse rounded bg-slate-100" />
              </div>
            </aside>

            <section className="lg:col-span-8">
              <div className="rounded-[28px] border border-slate-100 bg-white p-6">
                <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
                <div className="mt-5 flex gap-6">
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-4 animate-pulse rounded bg-slate-100"
                      />
                    ))}
                  </div>

                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0"
                    >
                      {Array.from({ length: 4 }).map((__, cellIndex) => (
                        <div
                          key={cellIndex}
                          className="h-4 animate-pulse rounded bg-slate-100"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

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

  const handleLoadMoreNewsletters = async () => {
    if (!subscriberId) return;

    const nextPage = newsletterPage + 1;
    await loadNewsletterHistory(subscriberId, nextPage, true);
  };

  if (isProfileLoading || !data) {
    return <SubscriberProfilePageSkeleton />;
  }

  const canLoadMoreNewsletters = data.newsletters.length < newsletterTotal;

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
