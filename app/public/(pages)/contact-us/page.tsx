"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ContactHeroHeader from "./_components/contact-hero-header";
import ContactSupportPanel from "./_components/contact-support-panel";
import ContactHelpCategories from "./_components/contact-help-categories";
import { sendContactUsMessage } from "@/service/public/contact-us/contact-us.service";
import type { ContactUsInquiryType } from "@/types/public/contact-us/contact-us.type";

const TEXAS_STATIC_MAP_IMAGE_URL =
  "https://staticmap.openstreetmap.de/staticmap.php?center=32.793462,-97.046664&zoom=6&size=1200x600&maptype=mapnik&markers=32.793462,-97.046664,red-pushpin";

const TEXAS_MAP_OPEN_URL = "https://www.google.com/maps?q=32.793462,-97.046664";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const supportPanelRef = React.useRef<HTMLDivElement | null>(null);

  const source = searchParams.get("source");
  const rawOrderNo = searchParams.get("orderNo")?.trim() ?? "";

  const normalizedOrderNo = useMemo(() => {
    if (!rawOrderNo) return "";
    return rawOrderNo.startsWith("#") ? rawOrderNo : `#${rawOrderNo}`;
  }, [rawOrderNo]);

  const initialInquiryType = useMemo<ContactUsInquiryType | undefined>(() => {
    if (source === "order_details" && normalizedOrderNo) {
      return "order_inquiry";
    }

    return undefined;
  }, [source, normalizedOrderNo]);

  const initialMessage = useMemo(() => {
    if (source === "order_details" && normalizedOrderNo) {
      return `My Order ID is ${normalizedOrderNo}`;
    }

    return "";
  }, [source, normalizedOrderNo]);

  const [selectedInquiryType, setSelectedInquiryType] =
    React.useState<ContactUsInquiryType | undefined>(initialInquiryType);

  React.useEffect(() => {
    setSelectedInquiryType(initialInquiryType);
  }, [initialInquiryType]);

  return (
    <div className="mt-20 min-h-screen bg-slate-50">
      <ContactHeroHeader />

      <ContactSupportPanel
        ref={supportPanelRef}
        onSubmit={sendContactUsMessage}
        mapImageUrl={TEXAS_STATIC_MAP_IMAGE_URL}
        mapOpenHref={TEXAS_MAP_OPEN_URL}
        initialInquiryType={selectedInquiryType}
        initialMessage={initialMessage}
      />

      <ContactHelpCategories
        onSelect={(type) => {
          setSelectedInquiryType(type);

          window.requestAnimationFrame(() => {
            supportPanelRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }}
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}