"use client";

import ContactHeroHeader from "./_components/contact-hero-header";
import ContactSupportPanel from "./_components/contact-support-panel";
import ContactHelpCategories from "./_components/contact-help-categories";
import { sendContactUsMessage } from "@/service/public/contact-us/contact-us.service";

const TEXAS_STATIC_MAP_IMAGE_URL =
  "https://staticmap.openstreetmap.de/staticmap.php?center=32.793462,-97.046664&zoom=6&size=1200x600&maptype=mapnik&markers=32.793462,-97.046664,red-pushpin";

const TEXAS_MAP_OPEN_URL = "https://www.google.com/maps?q=32.793462,-97.046664";

export default function ContactPage() {
  return (
    <div className="mt-20 min-h-screen bg-slate-50">
      <ContactHeroHeader />

      <ContactSupportPanel
        onSubmit={sendContactUsMessage}
        mapImageUrl={TEXAS_STATIC_MAP_IMAGE_URL}
        mapOpenHref={TEXAS_MAP_OPEN_URL}
      />

      <ContactHelpCategories />
    </div>
  );
}
