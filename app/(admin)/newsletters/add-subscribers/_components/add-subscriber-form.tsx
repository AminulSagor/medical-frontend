"use client";

import { useMemo, useState } from "react";
import type {
  AddSubscriberInput,
  AddSubscriberSelectData,
} from "../types/add-subscribers-type"

import PersonalContactSection from "./sections/personal-contact-section";
import ClinicalProfileSection from "./sections/clinical-profile-section";
import SubscriptionSettingsSection from "./sections/subscription-settings-section";
import { addSubscriberSchema } from "../schema/add-subscribers-schema";

type Props = { selectData: AddSubscriberSelectData };

type Errors = Partial<Record<keyof AddSubscriberInput, string>> & {
  audienceTags?: string;
};

const DEFAULT: AddSubscriberInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  clinicalRole: "",
  medicalDesignation: "",
  primaryInstitution: "",

  source: "Manual Entry",
  audienceTags: [],
  initialStatus: "subscribed",
};

export default function AddSubscriberForm({ selectData }: Props) {
  const [values, setValues] = useState<AddSubscriberInput>(DEFAULT);
  const [errors, setErrors] = useState<Errors>({});
  const [tagDraft, setTagDraft] = useState("");

  const recommendedLine = useMemo(
    () => selectData.recommendedTags.join(", "),
    [selectData.recommendedTags]
  );

  const setField = <K extends keyof AddSubscriberInput>(
    key: K,
    v: AddSubscriberInput[K]
  ) => {
    setValues((p) => ({ ...p, [key]: v }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (values.audienceTags.some((x) => x.toLowerCase() === t.toLowerCase()))
      return;

    if (values.audienceTags.length >= 10) {
      setErrors((e) => ({ ...e, audienceTags: "Max 10 tags" }));
      return;
    }

    setField("audienceTags", [...values.audienceTags, t]);
    setTagDraft("");
  };

  const removeTag = (t: string) => {
    setField(
      "audienceTags",
      values.audienceTags.filter((x) => x !== t)
    );
  };

  const validate = () => {
    const parsed = addSubscriberSchema.safeParse({
      ...values,
      phone: values.phone?.trim() ? values.phone.trim() : undefined,
    });

    if (parsed.success) return { ok: true as const, data: parsed.data };

    const next: Errors = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof AddSubscriberInput | "audienceTags";
      next[k] = issue.message;
    }
    setErrors(next);
    return { ok: false as const };
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (!v.ok) return;

    // ✅ dummy submit
    console.log("ADD SUBSCRIBER", v.data);
  };

  return (
    <form id="add-subscriber-form" onSubmit={onSubmit} className="space-y-5">
      <PersonalContactSection values={values} errors={errors} setField={setField} />

      <ClinicalProfileSection
        values={values}
        errors={errors}
        setField={setField}
        selectData={selectData}
      />

      <SubscriptionSettingsSection
        values={values}
        errors={errors}
        setField={setField}
        selectData={selectData}
        tagDraft={tagDraft}
        setTagDraft={setTagDraft}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        recommendedLine={recommendedLine}
      />

      <div className="pt-6 text-center text-[10px] font-bold tracking-[0.22em] text-slate-300">
        TEXAS AIRWAY INSTITUTE ADMINISTRATIVE PORTAL © 2026
      </div>
    </form>
  );
}