"use client";

import { Mail, Phone, User } from "lucide-react";
import SectionCard from "../ui/section-card";
import TextField from "../ui/text-field";
import type { AddSubscriberInput } from "../../types/add-subscribers-type";

type Errors = Partial<Record<keyof AddSubscriberInput, string>>;

export default function PersonalContactSection({
  values,
  errors,
  setField,
}: {
  values: AddSubscriberInput;
  errors: Errors;
  setField: <K extends keyof AddSubscriberInput>(
    k: K,
    v: AddSubscriberInput[K],
  ) => void;
}) {
  return (
    <SectionCard
      iconTone="teal"
      title="Personal & Contact Information"
      icon={<User size={18} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="FIRST NAME"
          placeholder="e.g., Sarah"
          value={values.firstName}
          onChange={(v) => setField("firstName", v)}
          error={errors.firstName}
        />
        <TextField
          label="LAST NAME"
          placeholder="e.g., Jenkins"
          value={values.lastName}
          onChange={(v) => setField("lastName", v)}
          error={errors.lastName}
        />

        <TextField
          label="EMAIL ADDRESS"
          placeholder="sarah.jenkins@hospital.org"
          value={values.email}
          onChange={(v) => setField("email", v)}
          leftIcon={<Mail size={16} className="text-slate-400" />}
          error={errors.email}
        />
        <TextField
          label="PHONE NUMBER"
          placeholder="+1 (555) 000-0000"
          value={values.phone ?? ""}
          onChange={(v) => setField("phone", v)}
          leftIcon={<Phone size={16} className="text-slate-400" />}
          error={errors.phone}
        />
      </div>
    </SectionCard>
  );
}
