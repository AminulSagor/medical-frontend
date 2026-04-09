"use client";

import { Building2 } from "lucide-react";
import SectionCard from "../ui/section-card";
import SelectField from "../ui/select-field";
import TextField from "../ui/text-field";
import type {
  AddSubscriberInput,
  AddSubscriberSelectData,
} from "../../types/add-subscribers-type";

type Errors = Partial<Record<keyof AddSubscriberInput, string>>;

export default function ClinicalProfileSection({
  values,
  errors,
  setField,
  selectData,
}: {
  values: AddSubscriberInput;
  errors: Errors;
  setField: <K extends keyof AddSubscriberInput>(
    k: K,
    v: AddSubscriberInput[K],
  ) => void;
  selectData: AddSubscriberSelectData;
}) {
  return (
    <SectionCard
      iconTone="indigo"
      title="Professional Clinical Profile"
      icon={<Building2 size={18} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="CLINICAL ROLE"
          value={values.clinicalRole}
          onChange={(v) => setField("clinicalRole", v)}
          options={selectData.clinicalRoles}
          placeholder="Select a role..."
          error={errors.clinicalRole}
        />
        <SelectField
          label="MEDICAL DESIGNATION"
          value={values.medicalDesignation}
          onChange={(v) => setField("medicalDesignation", v)}
          options={selectData.designations}
          placeholder="Select designation..."
          error={errors.medicalDesignation}
        />

        <div className="md:col-span-2">
          <TextField
            label="PRIMARY INSTITUTION/HOSPITAL"
            placeholder="e.g., Houston Methodist, Mayo Clinic..."
            value={values.primaryInstitution}
            onChange={(v) => setField("primaryInstitution", v)}
            leftIcon={<Building2 size={16} className="text-slate-400" />}
            error={errors.primaryInstitution}
          />
        </div>
      </div>
    </SectionCard>
  );
}
