"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AccountProfile } from "@/types/user/account-settings/account-settings-type";
import { updateUserProfile } from "@/service/user/profile.service";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
} from "@/service/upload/upload.service";
import PublicProfileAvatarSection from "./public-profile-avatar-section";
import PublicProfileBasicFields from "./public-profile-basic-fields";
import PublicProfileProfessionalFields from "./public-profile-professional-fields";
import PublicProfileFeedback from "./public-profile-feedback";
import {
  buildUpdatePayload,
  initialsFrom,
  mapProfileToForm,
  PUBLIC_PROFILE_UPDATED_EVENT,
  USA_DOCTOR_TITLE_ROLE_OPTIONS,
  validateDraft,
} from "./_utils/public-profile-form.utils";

export default function PublicProfileFormClient({
  initial,
}: {
  initial: AccountProfile;
}) {
  const router = useRouter();

  const [savedForm, setSavedForm] = useState<AccountProfile>({ ...initial });
  const [form, setForm] = useState<AccountProfile>({ ...initial });
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initial.avatarUrl || "",
  );
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const avatarLabel = useMemo(
    () =>
      form.avatarInitials?.trim()
        ? form.avatarInitials
        : initialsFrom(form.firstName, form.lastName, form.email),
    [form.avatarInitials, form.firstName, form.lastName, form.email],
  );

  const titleRoleOptions = useMemo(() => {
    const current = form.title.trim();

    if (
      current &&
      !USA_DOCTOR_TITLE_ROLE_OPTIONS.some((option) => option === current)
    ) {
      return [current, ...USA_DOCTOR_TITLE_ROLE_OPTIONS];
    }

    return [...USA_DOCTOR_TITLE_ROLE_OPTIONS];
  }, [form.title]);

  function setField<K extends keyof AccountProfile>(
    key: K,
    value: AccountProfile[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setApiError("");
    setApiSuccess("");
  }

  function setTitleRole(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      role: value,
    }));
    setApiError("");
    setApiSuccess("");
  }

  function onCancel() {
    setForm({ ...savedForm });
    setAvatarPreview(savedForm.avatarUrl || "");
    setPendingAvatarFile(null);
    setAvatarLoadFailed(false);
    setErrors({});
    setApiError("");
    setApiSuccess("");
  }

  async function uploadAvatarIfNeeded() {
    if (!pendingAvatarFile) {
      return form.avatarUrl.trim();
    }

    const uploadUrlResponse = await getUploadUrl({
      fileName: pendingAvatarFile.name,
      contentType: pendingAvatarFile.type || "application/octet-stream",
      folder: "profile-pictures",
    });

    await uploadFileToSignedUrl(uploadUrlResponse.signedUrl, pendingAvatarFile);

    return uploadUrlResponse.readUrl;
  }

  async function onRemovePhoto() {
    setApiError("");
    setApiSuccess("");

    try {
      setIsRemovingPhoto(true);

      const response = await updateUserProfile(buildUpdatePayload(savedForm, ""));
      const nextSavedForm = mapProfileToForm(response.data);

      setSavedForm(nextSavedForm);
      setForm((prev) => ({
        ...prev,
        avatarUrl: "",
        avatarInitials: nextSavedForm.avatarInitials,
      }));
      setAvatarPreview("");
      setPendingAvatarFile(null);
      setAvatarLoadFailed(false);
      setApiSuccess(response.message || "Profile photo removed successfully");

      window.dispatchEvent(new Event(PUBLIC_PROFILE_UPDATED_EVENT));
      router.refresh();
    } catch (error) {
      console.error("Failed to remove profile photo:", error);
      setApiError("Failed to remove profile photo");
    } finally {
      setIsRemovingPhoto(false);
    }
  }

  async function onSave() {
    setApiError("");
    setApiSuccess("");

    const nextErrors = validateDraft(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    try {
      setIsSaving(true);

      const uploadedAvatarUrl = await uploadAvatarIfNeeded();

      const response = await updateUserProfile(
        buildUpdatePayload(form, uploadedAvatarUrl),
      );

      const nextForm = mapProfileToForm(response.data);

      setForm(nextForm);
      setSavedForm(nextForm);
      setAvatarPreview(nextForm.avatarUrl || "");
      setPendingAvatarFile(null);
      setAvatarLoadFailed(false);
      setErrors({});
      setApiSuccess(response.message || "Profile updated successfully");

      window.dispatchEvent(new Event(PUBLIC_PROFILE_UPDATED_EVENT));
      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setApiError("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <PublicProfileAvatarSection
        avatarPreview={avatarPreview}
        avatarLabel={avatarLabel}
        avatarLoadFailed={avatarLoadFailed}
        isRemovingPhoto={isRemovingPhoto}
        onAvatarLoadError={() => setAvatarLoadFailed(true)}
        onRemovePhoto={onRemovePhoto}
        onSelectFile={(file) => {
          const url = URL.createObjectURL(file);
          setPendingAvatarFile(file);
          setAvatarPreview(url);
          setAvatarLoadFailed(false);
          setField("avatarUrl", url);
        }}
      />

      <PublicProfileBasicFields
        form={form}
        errors={errors}
        onFieldChange={setField}
      />

      <div className="my-6 h-px bg-slate-100" />

      <PublicProfileProfessionalFields
        titleRole={form.title}
        institution={form.institution}
        npiNumber={form.npiNumber}
        errors={errors}
        titleRoleOptions={titleRoleOptions}
        onTitleRoleChange={setTitleRole}
        onInstitutionChange={(value) => setField("institution", value)}
        onNpiNumberChange={(value) => setField("npiNumber", value)}
      />

      <PublicProfileFeedback apiError={apiError} apiSuccess={apiSuccess} />

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-xl px-4 text-[12px] font-semibold text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || isRemovingPhoto}
          className="h-10 rounded-xl bg-sky-500 px-5 text-[12px] font-extrabold text-white shadow-[0_10px_18px_rgba(14,165,233,0.25)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}