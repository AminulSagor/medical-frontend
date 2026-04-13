"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import SentContentHeader from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/sent-content-header";
import SentContentPreview from "@/app/dashboard/admin/(pages)/newsletters/transmission-history/[id]/_components/sent-content-preview";
import { getTransmissionSentContent } from "@/service/admin/newsletter/dashboard/transmission-sent-content.service";
import type { TransmissionSentContentResponse } from "@/types/admin/newsletter/dashboard/transmission-sent-content.types";

export default function TransmissionSentContentPage() {
  const params = useParams<{ id: string }>();
  const broadcastId = useMemo(() => String(params?.id ?? ""), [params?.id]);

  const [data, setData] = useState<TransmissionSentContentResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadSentContent = useCallback(async () => {
    if (!broadcastId) return;

    try {
      setIsLoading(true);
      const response = await getTransmissionSentContent(broadcastId);
      setData(response);
    } catch (error) {
      console.error("Failed to load sent content", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [broadcastId]);

  useEffect(() => {
    loadSentContent();
  }, [loadSentContent]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0a403f_0%,#082c2d_32%,#071d1f_60%,#051417_100%)] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <SentContentHeader
          subjectLine={data?.subjectLine ?? "Sent Content"}
          sentAt={data?.sentAt ?? null}
          isLoading={isLoading}
        />

        <SentContentPreview data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}
