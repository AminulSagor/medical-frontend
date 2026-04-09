import { Suspense } from "react";
import GeneralNewsletterPageClient from "./_components/general-newsletter-page-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneralNewsletterPageClient />
    </Suspense>
  );
}