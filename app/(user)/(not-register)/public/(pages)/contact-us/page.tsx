"use client";

import React from "react";
import ContactHeroHeader from "./_components/contact-hero-header";
import ContactSupportPanel from "./_components/contact-support-panel";
import ContactHelpCategories from "./_components/contact-help-categories";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 mt-20">
      <ContactHeroHeader />

      <ContactSupportPanel
        // ✅ optional
        // mapEmbedUrl="YOUR_IFRAME_SRC_HERE"
        onSubmit={(v) => {
          // connect API here later
          console.log(v);
        }}
      />

      <ContactHelpCategories />
    </div>
  );
}
