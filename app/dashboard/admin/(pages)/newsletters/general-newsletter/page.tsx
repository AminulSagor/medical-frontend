"use client";

import GeneralNewsLetterDataSection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-newsletter-data-section";
import NewsletterHeader from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-newsletter-header";
import GeneralNewsLetterSubscribeSection from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/general-newsletter-subcribe-section";
import NewsletterTabs from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/_components/newsletter-section-tabs";
import { NewsletterTabKey } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/types/tab.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DEFAULT_TAB: NewsletterTabKey = "newsletters";

function isValidTab(v: string | null): v is NewsletterTabKey {
  return v === "newsletters" || v === "subscribers";
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const tab: NewsletterTabKey = isValidTab(tabParam) ? tabParam : DEFAULT_TAB;

  const setTab = (next: NewsletterTabKey) => {
    if (next === tab) return;

    const params = new URLSearchParams(searchParams.toString());

    // Keep URL clean for default tab
    if (next === DEFAULT_TAB) {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  const activePanelId = `newsletter-panel-${tab}`;
  const activeTabId = `newsletter-tab-${tab}`;

  return (
    <div className="space-y-6">
      <NewsletterHeader />

      {/* CENTER TABS */}
      <div className="flex justify-center">
        <NewsletterTabs value={tab} onChange={setTab} />
      </div>

      {/* CONTENT AREA */}
      <div
        id={activePanelId}
        role="tabpanel"
        aria-labelledby={activeTabId}
        className="w-full"
      >
        {tab === "newsletters" ? (
          <GeneralNewsLetterDataSection />
        ) : (
          <GeneralNewsLetterSubscribeSection />
        )}
      </div>
    </div>
  );
}
