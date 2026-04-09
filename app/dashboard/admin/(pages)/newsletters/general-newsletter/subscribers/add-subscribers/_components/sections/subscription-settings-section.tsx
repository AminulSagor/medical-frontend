"use client";

import { SlidersHorizontal } from "lucide-react";
import SectionCard from "../ui/section-card";
import SelectField from "../ui/select-field";
import TagsInput from "../ui/tags-input";
import InitialStatusCard from "../ui/initial-status-card";
import type {
  AddSubscriberInput,
  AddSubscriberSelectData,
} from "../../types/add-subscribers-type";

type Errors = Partial<Record<keyof AddSubscriberInput, string>> & {
  audienceTags?: string;
};

export default function SubscriptionSettingsSection({
  values,
  errors,
  setField,
  selectData,
  tagDraft,
  setTagDraft,
  onAddTag,
  onRemoveTag,
  recommendedLine,
}: {
  values: AddSubscriberInput;
  errors: Errors;
  setField: <K extends keyof AddSubscriberInput>(
    k: K,
    v: AddSubscriberInput[K],
  ) => void;
  selectData: AddSubscriberSelectData;

  tagDraft: string;
  setTagDraft: (v: string) => void;
  onAddTag: (raw: string) => void;
  onRemoveTag: (t: string) => void;

  recommendedLine: string;
}) {
  return (
    <SectionCard
      iconTone="amber"
      title="Subscription & Segment Settings"
      icon={<SlidersHorizontal size={18} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="SOURCE"
          value={values.source}
          onChange={(v) => setField("source", v)}
          options={selectData.sources}
          placeholder="Select source..."
          error={errors.source}
        />

        <TagsInput
          label="AUDIENCE TAGS"
          value={values.audienceTags}
          draft={tagDraft}
          onDraftChange={setTagDraft}
          onAdd={onAddTag}
          onRemove={onRemoveTag}
          error={errors.audienceTags}
          recommendedLine={recommendedLine}
        />
      </div>

      <div className="mt-5">
        <InitialStatusCard
          value={values.initialStatus}
          onChange={(v) => setField("initialStatus", v)}
        />
      </div>
    </SectionCard>
  );
}
