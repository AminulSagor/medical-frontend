"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import ReportHeader from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/report-header";
import ReportMetrics from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/report-metrics";
import EngagementOverTimeCard from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/engagement-over-time-card";
import TopPerformingLinksCard from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/top-performing-links-card";
import RecipientLogSection from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/recipient-log-section";
import {
  getTransmissionRecipients,
  getTransmissionReport,
} from "@/service/admin/newsletter/dashboard/transmission-report.service";
import type {
  RecipientLogTab,
  TransmissionRecipientsResponse,
  TransmissionReportResponse,
} from "@/types/admin/newsletter/dashboard/transmission-report.types";

const RECIPIENTS_PAGE_SIZE = 10;

export default function TransmissionReportPage() {
  const params = useParams<{ id: string }>();
  const broadcastId = useMemo(() => String(params?.id ?? ""), [params?.id]);

  const [reportData, setReportData] =
    useState<TransmissionReportResponse | null>(null);
  const [recipientsData, setRecipientsData] =
    useState<TransmissionRecipientsResponse | null>(null);

  const [isReportLoading, setIsReportLoading] = useState(true);
  const [isRecipientsLoading, setIsRecipientsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<RecipientLogTab>("all");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const recipientTabCounts = {
    [activeTab]: recipientsData?.meta.total ?? 0,
  };

  const loadReport = useCallback(async () => {
    if (!broadcastId) return;

    try {
      setIsReportLoading(true);
      const response = await getTransmissionReport(broadcastId);
      setReportData(response);
    } catch (error) {
      console.error("Failed to load transmission report", error);
      setReportData(null);
    } finally {
      setIsReportLoading(false);
    }
  }, [broadcastId]);

  const loadRecipients = useCallback(async () => {
    if (!broadcastId) return;

    try {
      setIsRecipientsLoading(true);
      const response = await getTransmissionRecipients(broadcastId, {
        tab: activeTab,
        page,
        limit: RECIPIENTS_PAGE_SIZE,
        search: search || undefined,
      });
      setRecipientsData(response);
    } catch (error) {
      console.error("Failed to load transmission recipients", error);
      setRecipientsData(null);
    } finally {
      setIsRecipientsLoading(false);
    }
  }, [activeTab, broadcastId, page, search]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    loadRecipients();
  }, [loadRecipients]);

  const handleTabChange = (tab: RecipientLogTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="space-y-5 px-4 pb-8 pt-5 md:px-6">
      <ReportHeader
        title="Transmission Report"
        subtitle="Performance summary, engagement insights, and recipient activity logs"
      />

      <ReportMetrics
        cards={reportData?.cards ?? null}
        isLoading={isReportLoading}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px] items-start">
        <EngagementOverTimeCard
          engagement={reportData?.engagementOverTime ?? null}
          isLoading={isReportLoading}
        />

        <TopPerformingLinksCard
          broadcastId={broadcastId}
          links={reportData?.topPerformingLinks ?? []}
          isLoading={isReportLoading}
        />
      </div>

      <RecipientLogSection
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        items={recipientsData?.items ?? reportData?.recipientLog.items ?? []}
        meta={recipientsData?.meta ?? reportData?.recipientLog.meta ?? null}
        isLoading={isRecipientsLoading}
        page={page}
        onPageChange={setPage}
        tabCounts={recipientTabCounts}
      />
    </div>
  );
}
