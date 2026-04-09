"use client";

import { useMemo, useState } from "react";
import type {
  AddSubscriberInput,
  AddSubscriberSelectData,
} from "../types/add-subscribers-type";

import PersonalContactSection from "./sections/personal-contact-section";
import ClinicalProfileSection from "./sections/clinical-profile-section";
import SubscriptionSettingsSection from "./sections/subscription-settings-section";
import { addSubscriberSchema } from "@/app/dashboard/admin/(pages)/newsletters/general-newsletter/subscribers/add-subscribers/schema/add-subscribers-schema";

type Errors = Partial<Record<keyof AddSubscriberInput, string>> & {
  audienceTags?: string;
};

export type AddSubscriberSuccessPayload = {
  id?: string;
  name: string;
  role: string;
  statusLabel?: string;
  initialSource?: string;
  data: AddSubscriberInput;
};

type Props = {
  selectData: AddSubscriberSelectData;
  onSuccess?: (payload: AddSubscriberSuccessPayload) => void;
  onError?: (message: string) => void;
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

export default function AddSubscriberForm({
  selectData,
  onSuccess,
  onError,
}: Props) {
  const [values, setValues] = useState<AddSubscriberInput>(DEFAULT);
  const [errors, setErrors] = useState<Errors>({});
  const [tagDraft, setTagDraft] = useState("");

  const recommendedLine = useMemo(
    () => selectData.recommendedTags.join(", "),
    [selectData.recommendedTags],
  );

  const setField = <K extends keyof AddSubscriberInput>(
    key: K,
    v: AddSubscriberInput[K],
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
      values.audienceTags.filter((x) => x !== t),
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (!v.ok) return;

    try {
      // ✅ dummy submit (replace with real API later)
      console.log("ADD SUBSCRIBER", v.data);

      // ✅ open dialog via controller
      const fullName = `${v.data.firstName} ${v.data.lastName}`.trim();

      onSuccess?.({
        name: fullName || "—",
        role: v.data.clinicalRole || "—",
        statusLabel:
          v.data.initialStatus === "subscribed"
            ? "Active Subscriber"
            : "Unsubscribed",
        initialSource: v.data.source || "Manual Entry",
        data: v.data,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to add subscriber";
      onError?.(msg);
    }
  };

  return (
    <form id="add-subscriber-form" onSubmit={onSubmit} className="space-y-5">
      <PersonalContactSection
        values={values}
        errors={errors}
        setField={setField}
      />

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
