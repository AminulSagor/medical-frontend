"use client";

import CadenceEditorContentSection, {
  ContentTypeMode,
} from "@/app/dashboard/admin/(pages)/newsletters/cadence-broadcast/_components/cadence-editor-content-section";
import CadenceEditorDeliverySection, {
  AudienceOption,
  BroadcastFrequencyMode,
} from "@/app/dashboard/admin/(pages)/newsletters/cadence-broadcast/_components/cadence-editor-delivery-section";
import CadenceEditorHeader from "@/app/dashboard/admin/(pages)/newsletters/cadence-broadcast/_components/cadence-editor-header";
import { application } from "@/app/dashboard/admin/(pages)/newsletters/cadence-broadcast/data";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AUDIENCE_OPTIONS: AudienceOption[] = [
  { id: "subscribers", label: "Subscribers" },
  { id: "anesthesiologists", label: "Anesthesiologists" },
  { id: "clinical_fellows", label: "Clinical Fellows" },
  { id: "research_partners", label: "Research Partners" },
];

export default function CadenceBasedBroadcastEditorPage() {
  const [contentType, setContentType] =
    useState<ContentTypeMode>("link_article");
  const [frequency, setFrequency] = useState<BroadcastFrequencyMode>("weekly");

  const [subjectLine, setSubjectLine] = useState(
    "New Clinical Insights: Pediatric Airway Management Advances",
  );
  const [preheader, setPreheader] = useState(
    "Review the latest findings from Dr. Smith on pediatric anesthetic protocols.",
  );

  const [messageBody, setMessageBody] = useState(application);

  const [selectedAudience, setSelectedAudience] = useState<string[]>([
    "subscribers",
    "anesthesiologists",
    "clinical_fellows",
    "research_partners",
  ]);

  const toggleAudience = (id: string) => {
    setSelectedAudience((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const router = useRouter();

  return (
    <div>
      <CadenceEditorHeader
        onBack={() => window.history.back()}
        onDiscard={() => {}}
        onUpdateSchedule={() => {
          router.push("/newsletters/view-scheduled-broadcast");
        }}
      />

      <main>
        <div className="space-y-6">
          <CadenceEditorContentSection
            contentType={contentType}
            onChangeContentType={setContentType}
            selectedArticleLabel="Pediatric Airway Management Research - Dr. Sarah Smith (Published: Oct 12)"
            subjectLine={subjectLine}
            onChangeSubjectLine={setSubjectLine}
            preheader={preheader}
            onChangePreheader={setPreheader}
            messageBody={messageBody}
            onChangeMessageBody={setMessageBody}
          />

          <CadenceEditorDeliverySection
            frequency={frequency}
            onChangeFrequency={setFrequency}
            audienceOptions={AUDIENCE_OPTIONS}
            selectedAudience={selectedAudience}
            onToggleAudience={toggleAudience}
          />
        </div>
      </main>
    </div>
  );
}
